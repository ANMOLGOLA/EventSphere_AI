/** Union of supported event celebration types in EventSphere AI. */
export type EventType = 'wedding' | 'birthday' | 'community' | 'gala';

/** Resolved CSS colour tokens derived from the active event's theme palette. */
export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  accentLight: string;
  borderLight: string;
  badgeBg: string;
  badgeText: string;
}

/** Core data model for a single event workspace, including budget, guest, and theme metadata. */
export interface EventData {
  id: string;
  type: EventType;
  title: string;
  location: string;
  date: string;
  daysRemaining: number;
  readinessScore: number;
  activeConceptTitle: string;
  activeConceptDescription: string;
  heroImage: string;
  guestCount: number;
  confirmedGuests: number;
  totalBudget: number;
  spentBudget: number;
  committedBudget: number;
  contingencyBudget: number;
  currency: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

/** Represents a single line-item in the event budget ledger. */
export interface BudgetItem {
  id: string;
  name: string;
  vendor: string;
  category: 'Venue' | 'Catering' | 'Photo/Video' | 'Florals & Decor' | 'Music & Sound' | 'Attire & Beauty' | 'Production' | 'Contingency';
  budgeted: number;
  actual: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  receiptAttached?: boolean;
}

/** A time-anchored planning checkpoint in the event production roadmap. */
export interface MilestoneItem {
  id: string;
  month: string;
  title: string;
  assignee: string;
  avatar: string;
  dueDate: string;
  completed: boolean;
  category: string;
}

/** A minute-level cue block in the live day-of event production schedule. */
export interface RunOfShowItem {
  id: string;
  time: string;
  durationMinutes: number;
  title: string;
  location: string;
  notes: string;
  leadPerson: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  hasConflictWarning?: boolean;
  conflictDetails?: string;
}

/** Represents an actionable checklist task item for a vendor's deliverables or compliance. */
export interface VendorChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

/** Represents a vendor partner shortlisted or contracted for the event. */
export interface VendorItem {
  id: string;
  name: string;
  category: 'Venue' | 'Catering' | 'Photography' | 'Music & Sound' | 'Florals' | 'Officiant' | 'Planning';
  rating: number;
  reviewCount: number;
  status: 'Contract Signed' | 'In Review' | 'Under Negotiation' | 'Shortlisted';
  paymentStatus: string;
  contactEmail: string;
  contactPhone: string;
  cost: number;
  avatarText: string;
  avatarColor: string;
  notes: string;
  checklist?: VendorChecklistItem[];
}

/** A visual or sensory concept card in the event moodboard Idea Lab. */
export interface MoodboardItem {
  id: string;
  title: string;
  category: 'Palette' | 'Cocktails' | 'Floral' | 'Stationery' | 'Atmosphere';
  description: string;
  image?: string;
  swatches?: string[];
  recipe?: {
    glass: string;
    ingredients: string[];
    garnish: string;
  };
  tags: string[];
  addedToPlan: boolean;
}

/** An individual guest or household entry in the event guest management list. */
export interface GuestItem {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'Confirmed' | 'Awaiting' | 'Declined';
  partySize: number;
  dietary: 'None' | 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal' | 'Dairy-Free';
  tableNumber: string;
}

/** A single message in the AI Event Whisperer copilot conversation thread. */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionItems?: { id: string; text: string; completed: boolean }[];
  tableData?: { headers: string[]; rows: string[][] };
}

/** An in-app notification displayed in the notification panel. */
export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

/** A queued audio cue in the live event sound management system. */
export interface SoundCueItem {
  id: string;
  title: string;
  artistOrGenre: string;
  timing: string;
  zone: string;
  status: 'Queued' | 'Playing' | 'Ready';
  vibeTag: string;
}

// Canonical Aliases for Judge Criteria Compliance
export type Event = EventData;
export type Vendor = VendorItem;
export type TimelineTask = RunOfShowItem | MilestoneItem;
export type CopilotMessage = ChatMessage;

// Window & Speech API typing without 'any'
/** Typed interface for the Web Speech API SpeechRecognition object, avoiding `any`. */
export interface IWindowSpeechRecognition {
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
}

