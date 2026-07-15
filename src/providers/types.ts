// ============================================
// University Provider Architecture
// ============================================
// Abstract interfaces that any university can implement.
// Changing the university only requires swapping the provider.

export interface UniversityColors {
  primary: string;
  secondary: string;
  accent: string;
  primaryLight: string;
  primaryDark: string;
}

export interface UniversityLocation {
  city: string;
  state: string;
  zip: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface UniversityInfo {
  id: string;
  name: string;
  shortName: string;
  mascot: string;
  colors: UniversityColors;
  location: UniversityLocation;
  tagline: string;
  urls: {
    main: string;
    map: string;
    dining: string;
    parking: string;
    jobs: string;
    events: string;
    orgs: string;
    shuttle: string;
    library: string;
    faculty: string;
  };
}

// ---- Building Types ----
export type BuildingCategory =
  | 'academic'
  | 'administrative'
  | 'residence'
  | 'dining'
  | 'library'
  | 'recreation'
  | 'parking'
  | 'landmark'
  | 'health'
  | 'museum';

export interface CampusBuilding {
  id: string;
  name: string;
  abbreviation: string;
  aliases?: string[];
  coordinates: [number, number];
  category: BuildingCategory;
  departments?: string[];
  address?: string;
  description?: string;
  floors?: number;
  yearBuilt?: number;
  hasDining?: boolean;
  hasParkingNearby?: string[];
  nearestShuttleStop?: string;
  photo?: string;
  website?: string;
  hours?: { [key: string]: { open: string; close: string } };
  accessibility?: string[];
  wheelchairAccessible?: boolean;
  needsReview?: boolean;
  markerIcon?: string;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Navigation Types (Future Support) ----
export type RouteType = 'walking' | 'wheelchair' | 'cycling' | 'indoor';

export interface NavigationRoute {
  id: string;
  type: RouteType;
  path: [number, number][];
  distance: number;
  estimatedTime: number;
  instructions: string[];
}

// ---- Faculty Types ----
export interface FacultyMember {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  department: string;
  position: string; // e.g., 'Professor', 'Associate Professor', 'Lecturer'
  officeBuildingId?: string;
  officeRoom?: string;
  officePhone?: string;
  email?: string;
  biography?: string;
  researchInterests?: string[];
  coursesTaught?: string[];
  photo?: string;
  website?: string;
  coordinates?: [number, number]; // Office location on map
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Dining Types ----
export type DiningCategory = 'all-you-care' | 'food-court' | 'grab-go' | 'coffee' | 'fast-food' | 'retail';

export interface DiningVenue {
  id: string;
  name: string;
  location: string;
  buildingId?: string;
  coordinates: [number, number];
  category: DiningCategory;
  description: string;
  hours: { [key: string]: { open: string; close: string } };
  acceptsDiningBucks: boolean;
  hasCommuterDiscount: boolean;
  stations?: string[];
  menuHighlights?: string[];
  menuCategories?: MenuCategory[];
  photo?: string;
  status: 'open' | 'limited' | 'closed';
  phone?: string;
  website?: string;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  dietaryLabels?: ('vegetarian' | 'vegan' | 'gluten-free' | 'halal' | 'kosher')[];
  calories?: number;
  photo?: string;
}

// ---- Parking Types ----
export type ParkingCategory = 'resident' | 'commuter' | 'garage' | 'visitor' | 'faculty' | 'disabled';

export interface ParkingLot {
  id: string;
  name: string;
  coordinates: [number, number];
  category: ParkingCategory;
  permitRequired: string[];
  totalSpaces: number;
  occupiedSpaces: number;
  status: 'available' | 'limited' | 'full';
  hours: string;
  eveningWeekendNote: string;
  walkingDistances: { buildingId: string; minutes: number }[];
  features?: string[];
  rate?: string;
  photo?: string;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Shuttle Types ----
export interface ShuttleStop {
  id: string;
  name: string;
  coordinates: [number, number];
  nextArrival?: number;
}

export interface ShuttleRoute {
  id: string;
  name: string;
  color: string;
  description: string;
  stops: ShuttleStop[];
  schedule: { [key: string]: { start: string; end: string; frequency: string } };
  isActive: boolean;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Event Types ----
export interface CampusEvent {
  id: string;
  title: string;
  organization: string;
  category: string;
  startTime: string;
  endTime: string;
  location: string;
  buildingId?: string;
  coordinates?: [number, number];
  description: string;
  hasFreeFood: boolean;
  isRecurring?: boolean;
  rsvpLink?: string;
  photo?: string;
  date: string;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Job Types ----
export type JobType = 'On-Campus' | 'Federal Work-Study' | 'Off-Campus';

export interface CampusJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  payRange: string;
  payType: 'hourly' | 'salary';
  description: string;
  requirements: string[];
  applicationDeadline: string;
  hoursPerWeek: string;
  source: string;
  sourceUrl: string;
  isNew: boolean;
  postedDate: string;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Organization Types ----
export interface StudentOrg {
  id: string;
  name: string;
  category: string;
  description: string;
  meetingTime?: string;
  meetingLocation?: string;
  memberCount?: number;
  email?: string;
  socialLink?: string;
  photo?: string;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Alert Types ----
export interface CampusAlert {
  id: string;
  type: 'weather' | 'safety' | 'emergency';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  isDismissible: boolean;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ---- Map Category ----
export interface MapCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

// ---- Weather Types ----
export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    uvIndex: number;
    visibility: number;
    pressure: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: string;
  dataSource: 'live' | 'cached' | 'demo';
  lastUpdated: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

// ---- Search Types ----
export type SearchResultType =
  | 'building'
  | 'faculty'
  | 'dining'
  | 'parking'
  | 'event'
  | 'organization'
  | 'job'
  | 'department';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  icon: string;
  coordinates?: [number, number];
  category?: string;
  dataSource: 'live-public' | 'official-directory' | 'licensed-static' | 'demo';
}

// ============================================
// University Provider Interface
// ============================================

export interface UniversityProvider {
  // University Info
  readonly info: UniversityInfo;

  // Buildings
  getBuildings(): Promise<CampusBuilding[]>;
  getBuildingById(id: string): Promise<CampusBuilding | undefined>;
  getBuildingsByCategory(category: BuildingCategory): Promise<CampusBuilding[]>;
  searchBuildings(query: string): Promise<CampusBuilding[]>;

  // Faculty
  getFaculty(): Promise<FacultyMember[]>;
  getFacultyById(id: string): Promise<FacultyMember | undefined>;
  getFacultyByDepartment(department: string): Promise<FacultyMember[]>;
  searchFaculty(query: string): Promise<FacultyMember[]>;

  // Dining
  getDiningVenues(): Promise<DiningVenue[]>;
  getDiningVenueById(id: string): Promise<DiningVenue | undefined>;
  getOpenDiningVenues(): Promise<DiningVenue[]>;

  // Parking
  getParkingLots(): Promise<ParkingLot[]>;
  getParkingLotById(id: string): Promise<ParkingLot | undefined>;

  // Shuttle
  getShuttleRoutes(): Promise<ShuttleRoute[]>;
  getShuttleRouteById(id: string): Promise<ShuttleRoute | undefined>;

  // Events
  getEvents(): Promise<CampusEvent[]>;
  getEventById(id: string): Promise<CampusEvent | undefined>;
  getEventsByDate(date: string): Promise<CampusEvent[]>;

  // Jobs
  getJobs(): Promise<CampusJob[]>;
  getJobById(id: string): Promise<CampusJob | undefined>;

  // Organizations
  getOrganizations(): Promise<StudentOrg[]>;
  getOrganizationById(id: string): Promise<StudentOrg | undefined>;

  // Alerts
  getAlerts(): Promise<CampusAlert[]>;

  // Weather
  getWeather(): Promise<WeatherData>;

  // Search
  globalSearch(query: string): Promise<SearchResult[]>;

  // Map Categories
  getMapCategories(): MapCategory[];
}
