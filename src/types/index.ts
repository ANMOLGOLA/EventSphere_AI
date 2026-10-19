export type EventType = 'wedding' | 'birthday' | 'gala';

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
}

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

export interface GuestItem {
  id: string;
  name: string;
  email: string;
  rsvpStatus: 'Confirmed' | 'Awaiting' | 'Declined';
  partySize: number;
  dietary: 'None' | 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal' | 'Dairy-Free';
  tableNumber: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionItems?: { id: string; text: string; completed: boolean }[];
  tableData?: { headers: string[]; rows: string[][] };
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

export interface SoundCueItem {
  id: string;
  title: string;
  artistOrGenre: string;
  timing: string;
  zone: string;
  status: 'Queued' | 'Playing' | 'Ready';
  vibeTag: string;
}
