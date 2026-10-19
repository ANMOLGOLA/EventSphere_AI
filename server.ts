import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Copilot / Event Whisperer Chat Endpoint
app.post('/api/gemini/copilot', async (req: Request, res: Response) => {
  try {
    const { prompt, eventContext, activeTab, chatHistory } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

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

      return res.json({ text: response.text });
    } else {
      // Fallback high-fidelity responses when running in sandbox without key
      let fallbackText = `Here is an actionable strategy for your request regarding **${prompt}**:\n\n` +
        `• **Immediate Action**: Align on exact deliverables with your lead coordinator.\n` +
        `• **Budget Impact**: Estimated variance is within ±3% of current contingency allocation.\n` +
        `• **Suggested Timeline Check**: Ensure this milestone is locked 3 weeks prior to load-in.`;

      if (prompt.toLowerCase().includes('mocktail')) {
        fallbackText = `### 🍸 Bespoke Signature Mocktails for ${eventContext?.title || 'Your Celebration'}\n\n` +
          `1. **Wild Coast Rosemary Spritz**\n   - *Infusion*: Smoked rosemary syrup, fresh grapefruit juice, sparkling tonic, dehydrated blood orange wheel.\n   - *Aesthetic*: Warm amber hue, crystal collins glass, sprig of charred rosemary.\n\n` +
          `2. **Linen & Elderflower Elixir**\n   - *Infusion*: White peach puree, elderflower cordial, pressed lemon, non-alcoholic botanical aperitif, edible viola blossoms.\n   - *Aesthetic*: Soft champagne tone, coupe glass with gold rim.\n\n` +
          `3. **Terracotta Sunset Bramble**\n   - *Infusion*: Muddled blackberries, pomegranate molasses, ginger beer, cracked black pepper.\n   - *Aesthetic*: Deep crimson to terracotta gradient over crushed ice.`;
      } else if (prompt.toLowerCase().includes('floral')) {
        fallbackText = `### 🌿 6-Month Floral & Botanical Roadmap\n\n` +
          `- [ ] **Month 1**: Establish floral moodboard (terracotta dahlias, dried eucalyptus, toffee garden roses).\n` +
          `- [ ] **Month 2**: Finalize stem count formulas based on 18 table centerpieces and ceremony arch.\n` +
          `- [ ] **Month 3**: Lock wholesale distributor orders; verify seasonal availability for late-autumn blooms.\n` +
          `- [ ] **Month 4**: Sample centerpiece mockup review with catering dinnerware setting.\n` +
          `- [ ] **Month 5**: Reconfirm load-in access window with venue (06:00 AM rigging permitted).\n` +
          `- [ ] **Month 6 (Week of Event)**: Hydration chamber setup and day-of installation checklist.`;
      } else if (prompt.toLowerCase().includes('photographer') || prompt.toLowerCase().includes('negotiat')) {
        fallbackText = `### 📸 Courteous Photographer Negotiation Note\n\n` +
          `**Subject:** Inquiry regarding custom coverage package for ${eventContext?.title || "Our Event"}\n\n` +
          `Dear [Photographer Name],\n\n` +
          `We are deeply drawn to your editorial style and your eye for warm, candid light. We are currently finalizing our timeline for our event in ${eventContext?.location || "Big Sur"} on ${eventContext?.date || "October 24"}.\n\n` +
          `Our dedicated photography budget is set at $4,500. While we noted your 8-hour collection is $5,200, we wondered if you would be open to a tailored 6.5-hour continuous coverage option, focusing on our First Look through the First Dances.\n\n` +
          `We want to ensure your craft is honored while remaining respectful of our overall production budget. We would love to hop on a brief 10-minute call this week if that sounds workable!\n\n` +
          `Warm regards,\n` +
          `The EventSphere Production Team`;
      }

      return res.json({ text: fallbackText });
    }
  } catch (error: any) {
    console.error('Copilot API error:', error);
    return res.status(500).json({
      error: 'Failed to generate copilot response',
      details: error?.message || 'Unknown error',
    });
  }
});

// 2. Vendor Inquiry Generation Endpoint
app.post('/api/gemini/vendor-inquiry', async (req: Request, res: Response) => {
  try {
    const { vendorName, category, eventTitle, eventDate, guestCount, location, notes } = req.body;

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

      return res.json({ email: response.text });
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
      return res.json({ email: fallbackEmail });
    }
  } catch (error: any) {
    console.error('Vendor inquiry error:', error);
    return res.status(500).json({ error: 'Failed to generate inquiry' });
  }
});

// 2b. AI Vendor Comparison Analysis
app.post('/api/gemini/compare-vendors', async (req: Request, res: Response) => {
  try {
    const { vendorA, vendorB, eventTitle, guestCount, budget } = req.body;

    if (ai) {
      const prompt = `Compare these two vendors for the event "${eventTitle}" with ${guestCount} guests:
Vendor 1: ${vendorA?.name} (${vendorA?.category}), Cost: $${vendorA?.cost}, Rating: ${vendorA?.rating}★ (${vendorA?.reviewCount} reviews), Status: ${vendorA?.status}. Notes: ${vendorA?.notes}
Vendor 2: ${vendorB?.name} (${vendorB?.category}), Cost: $${vendorB?.cost}, Rating: ${vendorB?.rating}★ (${vendorB?.reviewCount} reviews), Status: ${vendorB?.status}. Notes: ${vendorB?.notes}

Provide a concise, expert planning evaluation:
1. Pricing & Value Analysis (cost difference and budget impact)
2. Scope & Reliability Comparison
3. Strategic AI Recommendation (which one fits better and why)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ analysis: response.text });
    } else {
      const diff = Math.abs((vendorA?.cost || 0) - (vendorB?.cost || 0));
      const higher = (vendorA?.cost || 0) >= (vendorB?.cost || 0) ? vendorA?.name : vendorB?.name;
      const lower = (vendorA?.cost || 0) < (vendorB?.cost || 0) ? vendorA?.name : vendorB?.name;
      
      const fallbackAnalysis = `### Executive Vendor Comparison: ${vendorA?.name} vs. ${vendorB?.name}\n\n` +
        `• **Financial Variance**: There is a $${diff.toLocaleString()} difference between the two quotes. ${lower} offers a more budget-protective rate, whereas ${higher} commands a premium aligned with bespoke production specs.\n` +
        `• **Reputation & Delivery**: ${vendorA?.name} holds a ${vendorA?.rating}★ rating across ${vendorA?.reviewCount} reviews, compared to ${vendorB?.name} at ${vendorB?.rating}★ across ${vendorB?.reviewCount} reviews. Both maintain strong standing.\n` +
        `• **Strategic Recommendation**: If prioritizing budget contingency protection, choose **${lower}**; if prioritizing specialized aesthetic execution and comprehensive coverage for ${guestCount} guests, proceed with **${higher}**.`;

      return res.json({ analysis: fallbackAnalysis });
    }
  } catch (error: any) {
    console.error('Vendor comparison error:', error);
    return res.status(500).json({ error: 'Failed to generate comparison' });
  }
});

// 3. AI Concept Generator
app.post('/api/gemini/generate-concept', async (req: Request, res: Response) => {
  try {
    const { theme, eventType, count } = req.body;

    if (ai) {
      const prompt = `Generate 3 innovative, refined styling concepts for a ${eventType} with theme "${theme}".
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

      return res.json({ concepts: JSON.parse(response.text || '[]') });
    } else {
      return res.json({
        concepts: [
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
        ],
      });
    }
  } catch (error: any) {
    console.error('Concept generation error:', error);
    return res.status(500).json({ error: 'Failed to generate concept' });
  }
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

startServer();
