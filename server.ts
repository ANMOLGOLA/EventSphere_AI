import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// ============================================================================
// 1. SECURITY HEADERS & CORS HARDENING
// ============================================================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https://generativelanguage.googleapis.com', 'ws:', 'wss:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

// ============================================================================
// 2. RATE LIMITING (DOS & PROMPT FLOODING MITIGATION)
// ============================================================================
// Global limiter: 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', globalLimiter);

// Strict GenAI limiter: 15 requests per minute per IP to prevent quota exhaustion
const geminiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI rate limit exceeded. Please wait a moment before sending more prompts.' },
});
app.use('/api/gemini/', geminiLimiter);

// ============================================================================
// 3. IN-MEMORY QUERY CACHE (EFFICIENCY & RESOURCE UTILIZATION)
// ============================================================================
interface CacheEntry<T = unknown> {
  data: T;
  expiresAt: number;
}
const aiCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

function getCacheKey(endpoint: string, payload: unknown): string {
  return `${endpoint}:${JSON.stringify(payload)}`;
}

function getFromCache<T = unknown>(key: string): T | null {
  const entry = aiCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    aiCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setToCache<T = unknown>(key: string, data: T) {
  // Simple LRU-style pruning if cache exceeds 100 items
  if (aiCache.size > 100) {
    const oldestKey = aiCache.keys().next().value;
    if (oldestKey) aiCache.delete(oldestKey);
  }
  aiCache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ============================================================================
// 4. SANITIZATION & GOOGLE GENAI CLIENT SETUP
// ============================================================================
function sanitizeOutput(text: string): string {
  if (!text) return '';
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '');
}

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'eventsphere-ai-production',
      },
    },
  });
}

// ============================================================================
// 5. INPUT VALIDATION SCHEMAS (ZOD)
// ============================================================================
export const PromptRequestSchema = z.object({
  prompt: z.string().trim().min(3, 'Prompt must be at least 3 characters long').max(2000, 'Prompt must be under 2000 characters'),
  eventContext: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      type: z.string().optional(),
      date: z.string().optional(),
      location: z.string().optional(),
      guestCount: z.number().nonnegative().optional(),
      totalBudget: z.number().nonnegative().optional(),
    })
    .optional(),
  activeTab: z.string().optional(),
  chatHistory: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const VendorInquirySchema = z.object({
  vendorName: z.string().trim().min(1, 'Vendor name is required').max(150),
  category: z.string().trim().min(1, 'Category is required'),
  eventTitle: z.string().trim().min(1, 'Event title is required'),
  eventDate: z.string().trim().min(1, 'Event date is required'),
  guestCount: z.number().int().positive().optional().default(100),
  location: z.string().trim().min(1, 'Location is required'),
  notes: z.string().max(1000).optional(),
});

export const CompareVendorsSchema = z.object({
  vendorA: z.object({
    name: z.string().min(1),
    category: z.string(),
    cost: z.number().nonnegative(),
    rating: z.number().min(0).max(5),
    reviewCount: z.number().nonnegative(),
    status: z.string(),
    notes: z.string().optional(),
  }),
  vendorB: z.object({
    name: z.string().min(1),
    category: z.string(),
    cost: z.number().nonnegative(),
    rating: z.number().min(0).max(5),
    reviewCount: z.number().nonnegative(),
    status: z.string(),
    notes: z.string().optional(),
  }),
  eventTitle: z.string().min(1),
  guestCount: z.number().nonnegative(),
  budget: z.number().nonnegative().optional(),
});

export const ConceptGenerateSchema = z.object({
  theme: z.string().trim().min(2, 'Theme must be at least 2 characters').max(200),
  eventType: z.string().trim().min(2),
  count: z.number().int().min(1).max(5).optional().default(3),
});

export const BudgetUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.enum([
    'Venue',
    'Catering',
    'Photo/Video',
    'Florals & Decor',
    'Music & Sound',
    'Attire & Beauty',
    'Production',
    'Contingency',
    'Other',
  ]),
  budgeted: z.number().positive('Budgeted amount must be positive').max(1000000),
  actual: z.number().nonnegative().max(1000000),
  vendor: z.string().trim().min(1).max(100),
  status: z.enum(['Paid', 'Pending', 'Overdue']),
});

// ============================================================================
// 6. API ROUTES WITH VALIDATION, CACHING & ERROR HANDLING
// ============================================================================

// Copilot / Event Whisperer Chat Endpoint
app.post('/api/gemini/copilot', async (req: Request, res: Response) => {
  const parseResult = PromptRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
  }

  const { prompt, eventContext, activeTab } = parseResult.data;
  const cacheKey = getCacheKey('copilot', { prompt, eventContext: eventContext?.id, activeTab });
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.json({ text: cached, cached: true });
  }

  try {
    if (ai) {
      const systemInstruction = `You are "Event Whisperer", an autonomous, high-productivity GenAI event planning copilot inside EventSphere AI.
You assist with weddings, birthdays, and community gatherings.
Event context:
- Event: "${eventContext?.title || 'Active Event'}"
- Type: "${eventContext?.type || 'Wedding'}"
- Venue/Location: "${eventContext?.location || 'Big Sur, CA'}"
- Guest Count: ${eventContext?.guestCount || 180}
- Current Active Workspace Tab: "${activeTab || 'Overview'}"

Tone: Warm editorial elegance, discerning, practical, and highly actionable.
Provide responses formatted with clean headings, markdown bullet points, action items with [ ] check affordance syntax, or mini-tables when comparing numbers. Keep responses concise and directly applicable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const sanitizedText = sanitizeOutput(response.text || '');
      setToCache(cacheKey, sanitizedText);
      return res.json({ text: sanitizedText, cached: false });
    } else {
      let fallbackText = `Here is an actionable strategy for your request regarding **${prompt}**:\n\n` +
        `• **Immediate Action**: Align on exact deliverables with your lead coordinator.\n` +
        `• **Budget Impact**: Estimated variance is within ±3% of current contingency allocation.\n` +
        `• **Suggested Timeline Check**: Ensure this milestone is locked 3 weeks prior to load-in.`;

      const pLower = prompt.toLowerCase();
      if (pLower.includes('mocktail')) {
        fallbackText = `### 🍸 Bespoke Signature Mocktails for ${eventContext?.title || 'Your Celebration'}\n\n` +
          `1. **Wild Coast Rosemary Spritz**\n   - *Infusion*: Smoked rosemary syrup, fresh grapefruit juice, sparkling tonic, dehydrated blood orange wheel.\n   - *Aesthetic*: Warm amber hue, crystal collins glass, sprig of charred rosemary.\n\n` +
          `2. **Linen & Elderflower Elixir**\n   - *Infusion*: White peach puree, elderflower cordial, pressed lemon, non-alcoholic botanical aperitif, edible viola blossoms.\n   - *Aesthetic*: Soft champagne tone, coupe glass with gold rim.\n\n` +
          `3. **Terracotta Sunset Bramble**\n   - *Infusion*: Muddled blackberries, pomegranate molasses, ginger beer, cracked black pepper.\n   - *Aesthetic*: Deep crimson to terracotta gradient over crushed ice.`;
      } else if (pLower.includes('floral')) {
        fallbackText = `### 🌿 6-Month Floral & Botanical Roadmap\n\n` +
          `- [ ] **Month 1**: Establish floral moodboard (terracotta dahlias, dried eucalyptus, toffee garden roses).\n` +
          `- [ ] **Month 2**: Finalize stem count formulas based on 18 table centerpieces and ceremony arch.\n` +
          `- [ ] **Month 3**: Lock wholesale distributor orders; verify seasonal availability for late-autumn blooms.\n` +
          `- [ ] **Month 4**: Sample centerpiece mockup review with catering dinnerware setting.\n` +
          `- [ ] **Month 5**: Reconfirm load-in access window with venue (06:00 AM rigging permitted).\n` +
          `- [ ] **Month 6 (Week of Event)**: Hydration chamber setup and day-of installation checklist.`;
      } else if (pLower.includes('photographer') || pLower.includes('negotiat')) {
        fallbackText = `### 📸 Courteous Photographer Negotiation Note\n\n` +
          `**Subject:** Inquiry regarding custom coverage package for ${eventContext?.title || "Our Event"}\n\n` +
          `Dear [Photographer Name],\n\n` +
          `We are deeply drawn to your editorial style and your eye for warm, candid light. We are currently finalizing our timeline for our event in ${eventContext?.location || "Big Sur"} on ${eventContext?.date || "October 24"}.\n\n` +
          `Our dedicated photography budget is set at $4,500. While we noted your 8-hour collection is $5,200, we wondered if you would be open to a tailored 6.5-hour continuous coverage option, focusing on our First Look through the First Dances.\n\n` +
          `We want to ensure your craft is honored while remaining respectful of our overall production budget. We would love to hop on a brief 10-minute call this week if that sounds workable!\n\n` +
          `Warm regards,\n` +
          `The EventSphere Production Team`;
      }

      setToCache(cacheKey, fallbackText);
      return res.json({ text: fallbackText, cached: false });
    }
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Copilot API error:', error);
    return res.status(500).json({
      error: 'Failed to generate copilot response',
      details: err.message || 'Unknown error',
    });
  }
});

// Vendor Inquiry Generation Endpoint
app.post('/api/gemini/vendor-inquiry', async (req: Request, res: Response) => {
  const parseResult = VendorInquirySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
  }

  const { vendorName, category, eventTitle, eventDate, guestCount, location, notes } = parseResult.data;
  const cacheKey = getCacheKey('vendor-inquiry', { vendorName, category, eventTitle, eventDate });
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.json({ email: cached, cached: true });
  }

  try {
    if (ai) {
      const prompt = `Write a professional, warm, and highly structured vendor inquiry email.
Vendor: ${vendorName} (${category})
Event: ${eventTitle}
Date: ${eventDate}
Guest Count: ${guestCount}
Location: ${location}
Additional requirements: ${notes || 'Standard high-end production package'}

Include:
1. Warm personalized opening complimenting their aesthetic.
2. Clear event logistics (date, venue, count).
3. Specific questions on packages, crew size, setup requirements, and payment schedule.
4. Call to action with requested response window.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const cleanEmail = sanitizeOutput(response.text || '');
      setToCache(cacheKey, cleanEmail);
      return res.json({ email: cleanEmail, cached: false });
    } else {
      const fallbackEmail = `Subject: Inquiry: Availability & Services for ${eventTitle} (${eventDate})\n\n` +
        `Dear ${vendorName} Team,\n\n` +
        `We are preparing the celebration for "${eventTitle}" taking place at ${location} on ${eventDate}, welcoming approximately ${guestCount} guests.\n\n` +
        `Your portfolio stood out to us immediately for its artisanal quality and seamless execution. We are currently shortlisting trusted partners for ${category} and would love to review your availability and bespoke packages for this date.\n\n` +
        `Could you kindly share:\n` +
        `1. Your current availability for ${eventDate}\n` +
        `2. Standard package breakdown and load-in/load-out requirements\n` +
        `3. Deposit requirements and sample contract terms\n\n` +
        `We are aiming to confirm our vendor partnerships by end of next week. Looking forward to connecting!\n\n` +
        `Warm regards,\nEventSphere Planning Team`;
      setToCache(cacheKey, fallbackEmail);
      return res.json({ email: fallbackEmail, cached: false });
    }
  } catch (error: unknown) {
    console.error('Vendor inquiry error:', error);
    return res.status(500).json({ error: 'Failed to generate inquiry' });
  }
});

// Vendor Comparison Analysis
app.post('/api/gemini/compare-vendors', async (req: Request, res: Response) => {
  const parseResult = CompareVendorsSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
  }

  const { vendorA, vendorB, eventTitle, guestCount } = parseResult.data;
  const cacheKey = getCacheKey('compare-vendors', { a: vendorA.name, b: vendorB.name, eventTitle });
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.json({ analysis: cached, cached: true });
  }

  try {
    if (ai) {
      const prompt = `Compare these two vendors for the event "${eventTitle}" with ${guestCount} guests:
Vendor 1: ${vendorA.name} (${vendorA.category}), Cost: $${vendorA.cost}, Rating: ${vendorA.rating}★ (${vendorA.reviewCount} reviews), Status: ${vendorA.status}. Notes: ${vendorA.notes || 'N/A'}
Vendor 2: ${vendorB.name} (${vendorB.category}), Cost: $${vendorB.cost}, Rating: ${vendorB.rating}★ (${vendorB.reviewCount} reviews), Status: ${vendorB.status}. Notes: ${vendorB.notes || 'N/A'}

Provide a concise, expert planning evaluation:
1. Pricing & Value Analysis (cost difference and budget impact)
2. Scope & Reliability Comparison
3. Strategic AI Recommendation (which one fits better and why)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const cleanAnalysis = sanitizeOutput(response.text || '');
      setToCache(cacheKey, cleanAnalysis);
      return res.json({ analysis: cleanAnalysis, cached: false });
    } else {
      const diff = Math.abs(vendorA.cost - vendorB.cost);
      const higher = vendorA.cost >= vendorB.cost ? vendorA.name : vendorB.name;
      const lower = vendorA.cost < vendorB.cost ? vendorA.name : vendorB.name;

      const fallbackAnalysis = `### Executive Vendor Comparison: ${vendorA.name} vs. ${vendorB.name}\n\n` +
        `• **Financial Variance**: There is a $${diff.toLocaleString()} difference between the two quotes. ${lower} offers a more budget-protective rate, whereas ${higher} commands a premium aligned with bespoke production specs.\n` +
        `• **Reputation & Delivery**: ${vendorA.name} holds a ${vendorA.rating}★ rating across ${vendorA.reviewCount} reviews, compared to ${vendorB.name} at ${vendorB.rating}★ across ${vendorB.reviewCount} reviews. Both maintain strong standing.\n` +
        `• **Strategic Recommendation**: If prioritizing budget contingency protection, choose **${lower}**; if prioritizing specialized aesthetic execution and comprehensive coverage for ${guestCount} guests, proceed with **${higher}**.`;

      setToCache(cacheKey, fallbackAnalysis);
      return res.json({ analysis: fallbackAnalysis, cached: false });
    }
  } catch (error: unknown) {
    console.error('Vendor comparison error:', error);
    return res.status(500).json({ error: 'Failed to generate comparison' });
  }
});

// AI Concept Generator
app.post('/api/gemini/generate-concept', async (req: Request, res: Response) => {
  const parseResult = ConceptGenerateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
  }

  const { theme, eventType, count } = parseResult.data;
  const cacheKey = getCacheKey('generate-concept', { theme, eventType, count });
  const cached = getFromCache(cacheKey);
  if (cached) {
    return res.json({ concepts: cached, cached: true });
  }

  try {
    if (ai) {
      const prompt = `Generate ${count} innovative, refined styling concepts for a ${eventType} with theme "${theme}".
Return a JSON array with objects containing:
- title: string (poetic concept title)
- description: string (2-3 sentences of evocative sensory details)
- accentColors: array of 3 hex colors (e.g. ["#C57B57", "#F4ECE1", "#E0A96D"])
- keyFeatures: array of 3 bullet highlights`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      setToCache(cacheKey, parsed);
      return res.json({ concepts: parsed, cached: false });
    } else {
      const concepts = [
        {
          title: 'Terracotta & Sunlit Linen',
          description: 'Organic heavy linen runners draped over weathered white oak farm tables, accented with glazed terracotta bud vases and hand-poured beeswax pillar candles.',
          accentColors: ['#C57B57', '#F4ECE1', '#E0A96D'],
          keyFeatures: ['Raw edge flax linen napkins', 'Amber ribbed glassware', 'Scattered toffee garden roses'],
        },
        {
          title: 'Botanical Canopy & Brushed Brass',
          description: 'Suspended cloud of dried eucalyptus, lunaria, and pampas grass illuminated by warm filament bulbs, creating soft dimensional shadows across the dance floor.',
          accentColors: ['#3A5A40', '#DDA15E', '#FEFAE0'],
          keyFeatures: ['Floating floral cloud rigging', 'Brushed brass hurricane lamps', 'Velvet sage cocktail lounges'],
        },
        {
          title: 'Golden Hour Champagne Courtyard',
          description: 'Tiered champagne coupe towers illuminated by warm amber floodlights, paired with curated acoustic bossa nova and olive branch place settings.',
          accentColors: ['#E0A96D', '#776B5D', '#F3EEEA'],
          keyFeatures: ['Crystal coupe pyramid', 'Calligraphy place cards with wax seals', 'Twilight patio string canopy'],
        },
      ];
      setToCache(cacheKey, concepts);
      return res.json({ concepts, cached: false });
    }
  } catch (error: unknown) {
    console.error('Concept generation error:', error);
    return res.status(500).json({ error: 'Failed to generate concept' });
  }
});

// Validate Budget Item endpoint
app.post('/api/budget/validate', (req: Request, res: Response) => {
  const parseResult = BudgetUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid budget payload',
      details: parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
  }
  return res.json({ valid: true, item: parseResult.data });
});

// Central Error Handler
app.use((err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Serve Vite dev middleware or static production build
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventSphere AI Server running on http://0.0.0.0:${PORT}`);
  });
}

// Start only if run directly and not in Vercel serverless function
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

export { app };
export default app;
