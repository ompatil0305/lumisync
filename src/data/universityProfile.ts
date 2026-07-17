// Texas Tech University Profile - All data modeled on real TTU sources
// Source references included for transparency

export interface UniversityProfile {
  id: string;
  name: string;
  shortName: string;
  mascot: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    primaryLight: string;
    primaryDark: string;
  };
  location: {
    city: string;
    state: string;
    zip: string;
    coordinates: [number, number]; // lat, lng
  };
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
  };
}

export const ttuProfile: UniversityProfile = {
  id: 'ttu',
  name: 'Texas Tech University',
  shortName: 'Texas Tech',
  mascot: 'Red Raiders',
  colors: {
    primary: '#CC0000',
    secondary: '#000000',
    accent: '#FDB927',
    primaryLight: '#E6E6E6',
    primaryDark: '#990000',
  },
  location: {
    city: 'Lubbock',
    state: 'TX',
    zip: '79409',
    coordinates: [33.5842, -101.8801],
  },
  tagline: 'One Campus. One Intelligence.',
  urls: {
    main: 'https://www.ttu.edu',
    map: 'https://map.ttu.edu',
    dining: 'https://www.depts.ttu.edu/hospitality/',
    parking: 'https://www.depts.ttu.edu/parking/',
    jobs: 'https://ttu-csm.symplicity.com',
    events: 'https://ttu.campuslabs.com/engage/eventcalendar',
    orgs: 'https://ttu.campuslabs.com/engage/organizations',
    shuttle: 'https://www.citibus.com',
    library: 'https://www.depts.ttu.edu/library/',
  },
};

// ---- BUILDINGS ----
// Modeled on real TTU campus map: map.ttu.edu
export interface Building {
  id: string;
  name: string;
  abbreviation: string;
  aliases?: string[];
  coordinates: [number, number];
  category: 'academic' | 'administrative' | 'residence' | 'dining' | 'library' | 'recreation' | 'parking' | 'landmark' | 'health' | 'museum';
  departments?: string[];
  address?: string;
  description?: string;
  floors?: number;
  hasDining?: boolean;
  hasParkingNearby?: string[];
  nearestShuttleStop?: string;
  photo?: string;
  wheelchairAccessible?: boolean;
  needsReview?: boolean;
  dataSource?: string;
  phone?: string;
  email?: string;
  website?: string;
  restrooms?: string;
  elevators?: string;
  bikeRacks?: string;
  emergencyPhones?: string;
  aedLocations?: string[];
}

export const buildings: Building[] = [
  {
    id: 'holden-hall',
    name: 'Holden Hall',
    abbreviation: 'HOLD',
    aliases: ['Holden', 'A&S Building'],
    coordinates: [33.5835, -101.8745],
    category: 'academic',
    departments: ['Computer Science', 'Mathematics & Statistics', 'Physics'],
    address: '1011 Boston Ave',
    description: 'Historic academic building housing the Departments of Computer Science, Mathematics & Statistics, and Physics. Built in 1930, Holden Hall is one of the most recognizable buildings on campus with its Spanish Renaissance architecture.',
    floors: 4,
    hasParkingNearby: ['flint-ave-garage', 'commuter-north'],
    nearestShuttleStop: 'Student Union Building',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Holden+Hall',
    wheelchairAccessible: true,
    needsReview: false,
    dataSource: 'official-directory',
    phone: '(806) 742-3833',
    email: 'artsandsciences@ttu.edu',
    website: 'https://www.depts.ttu.edu/artsandsciences/',
    restrooms: 'Restrooms available on all floors (accessible)',
    elevators: 'Elevator located in central corridor',
    bikeRacks: 'Racks available near East and West entrances',
    emergencyPhones: 'Emergency blue light phone at East courtyard',
    aedLocations: ['First floor lobby']
  },
  {
    id: 'admin-building',
    name: 'Administration Building',
    abbreviation: 'ADMN',
    aliases: ['Admin', 'Bell Tower'],
    coordinates: [33.5826, -101.8741],
    category: 'administrative',
    departments: ['President\'s Office', 'Provost', 'Student Financial Aid'],
    address: '2500 Broadway',
    description: 'The iconic Administration Building with its distinctive bell tower is the centerpiece of Texas Tech\'s campus. It houses the President\'s Office, the Provost, and various senior administrative functions.',
    floors: 3,
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'Administration Building',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Administration+Building',
    wheelchairAccessible: true,
    needsReview: false,
    dataSource: 'official-directory',
    phone: '(806) 742-2121',
    email: 'president@ttu.edu',
    website: 'https://www.ttu.edu/administration/',
    restrooms: 'Restrooms available on floors 1, 2, and 3',
    elevators: 'Elevator located near West entrance',
    bikeRacks: 'Racks available at South entrance',
    emergencyPhones: 'Emergency phone located at North entrance',
    aedLocations: ['Lobby near President Office']
  },
  {
    id: 'sub',
    name: 'Student Union Building',
    abbreviation: 'SUB',
    aliases: ['The SUB', 'Union'],
    coordinates: [33.5813810, -101.8747164],
    category: 'academic',
    departments: ['Student Involvement', 'University ID Office', 'TechConnect'],
    address: '1500 Akron Ave',
    description: 'The Student Union Building (SUB) is the hub of student life at Texas Tech, featuring meeting spaces, the University ID Office, TechConnect, and numerous student organization offices.',
    floors: 3,
    hasDining: true,
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'Student Union Building',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Student+Union+Building',
    wheelchairAccessible: true,
    needsReview: false,
    dataSource: 'official-directory',
    phone: '(806) 742-3636',
    email: 'sub@ttu.edu',
    website: 'https://www.depts.ttu.edu/sub/',
    restrooms: 'Accessible restrooms available on all floors',
    elevators: 'Passenger elevators located in East and West wings',
    bikeRacks: 'Racks available at North and South entrances',
    emergencyPhones: 'Blue light phones available outside North entrance',
    aedLocations: ['Lobby near Information Desk', 'Second Floor near Ballroom']
  },
  {
    id: 'rawls-college',
    name: 'Rawls College of Business',
    abbreviation: 'RAWL',
    aliases: ['BA Building', 'Business School'],
    coordinates: [33.5864, -101.8791],
    category: 'academic',
    departments: ['Accounting', 'Finance', 'Management', 'Marketing', 'Energy Commerce'],
    address: '703 Flint Ave',
    description: 'The Jerry S. Rawls College of Business is a state-of-the-art facility housing undergraduate and graduate business programs. Features include the Financial Trading Room, collaboration spaces, and the Career Management Center.',
    floors: 4,
    hasParkingNearby: ['flint-ave-garage', 'commuter-north'],
    nearestShuttleStop: 'Rawls College',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Rawls+College',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-3188',
    email: 'rawlsgrad@ttu.edu',
    website: 'https://rawlsbusiness.ttu.edu',
    restrooms: 'Modern accessible restrooms on all floors',
    elevators: 'Multiple elevators in central atrium',
    bikeRacks: 'Covered bike racks at South entrance',
    emergencyPhones: 'Emergency phone at parking lot circle',
    aedLocations: ['Atrium near elevators', 'Third floor lobby']
  },
  {
    id: 'english-phil',
    name: 'English/Philosophy Building',
    abbreviation: 'ENPH',
    aliases: ['English Building'],
    coordinates: [33.5856, -101.8814],
    category: 'academic',
    departments: ['English', 'Philosophy', 'Classical & Modern Languages'],
    address: '1001 Boston Ave',
    description: 'Home to the Department of English, the Philosophy department, and the Literature & Languages programs. Features the Creative Writing program offices.',
    floors: 3,
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'Student Union Building',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=English+Philosophy+Building',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-2501',
    email: 'english.gradoffice@ttu.edu',
    website: 'https://www.depts.ttu.edu/english/',
    restrooms: 'Restrooms available on floors 1, 2, and 3',
    elevators: 'Elevator in main lobby',
    bikeRacks: 'Racks near main courtyard',
    emergencyPhones: 'Blue light phone in plaza',
    aedLocations: ['First floor lobby']
  },
  {
    id: 'university-library',
    name: 'University Library',
    abbreviation: 'LIBR',
    aliases: ['Main Library'],
    coordinates: [33.5825, -101.8809],
    category: 'library',
    departments: ['University Libraries', 'Special Collections', 'Digital Scholarship'],
    address: '18th Street & Boston Ave',
    description: 'The main University Library provides study spaces, research assistance, digital scholarship services, and the Southwest Collection/Special Collections Library. Open 24/7 during finals.',
    floors: 6,
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'University Library',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=University+Library',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-2265',
    email: 'library@ttu.edu',
    website: 'https://www.depts.ttu.edu/library/',
    restrooms: 'Accessible restrooms on all floors (floors 1-5)',
    elevators: 'Central elevator bank serving floors 1-5',
    bikeRacks: 'Large bike parking zone at West entrance',
    emergencyPhones: 'Blue light phone near main entrance',
    aedLocations: ['Circulation desk', 'Third floor research area']
  },
  {
    id: 'talkington-hall',
    name: 'Talkington Hall',
    abbreviation: 'TALK',
    aliases: ['Talkington', 'Honors Residence'],
    coordinates: [33.5872, -101.8828],
    category: 'residence',
    departments: ['University Student Housing'],
    address: '301 Talkington Way',
    description: 'Talkington Hall is a modern residence hall featuring suite-style living and housing The Commons dining facility on its ground floor. It is one of the newest residence halls on campus.',
    floors: 5,
    hasDining: true,
    hasParkingNearby: ['commuter-north'],
    nearestShuttleStop: 'Talkington Hall',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Talkington+Hall',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-1420',
    email: 'housing@ttu.edu',
    website: 'https://www.depts.ttu.edu/housing/',
    restrooms: 'Restrooms in lobby area and individual suites',
    elevators: 'Elevators in East and West towers',
    bikeRacks: 'Secure racks in Talkington courtyard',
    emergencyPhones: 'Emergency phone at main entrance courtyard',
    aedLocations: ['Main front desk']
  },
  {
    id: 'boston-ave',
    name: 'Boston Avenue Parking Facility',
    abbreviation: 'BOST',
    aliases: ['Boston Parking'],
    coordinates: [33.5853, -101.8800],
    category: 'parking',
    address: 'Boston Ave & 15th Street',
    description: 'Surface parking lot along Boston Avenue, primarily serving commuter students.',
    hasParkingNearby: ['boston-ave'],
    nearestShuttleStop: 'Student Union Building',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-3811',
    email: 'parking@ttu.edu',
    website: 'https://www.depts.ttu.edu/parking/',
    restrooms: 'Restrooms available inside visitor center',
    elevators: 'No elevators',
    bikeRacks: 'Racks nearby at SUB and Holden Hall',
    emergencyPhones: 'Emergency blue light phones located at lot perimeters'
  },
  {
    id: 'broadway',
    name: 'Broadway Entertainment',
    abbreviation: 'BRDW',
    aliases: ['Broadway', 'University Ave'],
    coordinates: [33.5839, -101.8786],
    category: 'landmark',
    description: 'Broadway Avenue runs along the southern edge of campus and features numerous dining and entertainment options for students.',
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'Broadway & Akron',
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-2000',
    email: 'info@ttu.edu',
    website: 'https://www.ttu.edu',
    restrooms: 'Public restrooms in local establishments',
    elevators: 'N/A',
    bikeRacks: 'Racks located along sidewalks',
    emergencyPhones: 'City callboxes nearby'
  },
  {
    id: 'jones-stadium',
    name: 'Jones AT&T Stadium',
    abbreviation: 'JATT',
    aliases: ['The Jones', 'Football Stadium'],
    coordinates: [33.5806, -101.8836],
    category: 'recreation',
    description: 'Home of Texas Tech Red Raider football since 1947. Jones AT&T Stadium seats over 60,000 fans and is known for its electric game-day atmosphere.',
    hasParkingNearby: ['raider-park-garage'],
    nearestShuttleStop: 'Jones Stadium',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Jones+AT-T+Stadium',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-3355',
    email: 'athletics@ttu.edu',
    website: 'https://texastech.com/sports/football',
    restrooms: 'Large public restrooms throughout concourse',
    elevators: 'Elevators at West stadium club and East gates',
    bikeRacks: 'Racks available near Gates 1 and 6',
    emergencyPhones: 'Emergency phones at security gate entrances',
    aedLocations: ['First aid stations near Gates 1 and 4']
  },
  {
    id: 'student-rec',
    name: 'Robert H. Ewalt Student Recreation Center',
    abbreviation: 'SRC',
    aliases: ['The Rec', 'Rec Center'],
    coordinates: [33.5820, -101.8780],
    category: 'recreation',
    description: 'The Student Recreation Center features fitness equipment, basketball courts, a climbing wall, an indoor pool, group fitness studios, and outdoor adventure programs.',
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'Student Recreation Center',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Student+Rec+Center',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-3351',
    email: 'fitwell.rec@ttu.edu',
    website: 'https://www.depts.ttu.edu/recsports/',
    restrooms: 'Locker rooms and family restrooms available',
    elevators: 'Elevator serving second floor track and fitness space',
    bikeRacks: 'Extensive bike racks at North main entrance',
    emergencyPhones: 'Blue light phone in outdoor leisure pool area',
    aedLocations: ['Front desk', 'Cardio area second floor']
  },
  {
    id: 'student-health',
    name: 'Student Wellness Center',
    abbreviation: 'SWC',
    aliases: ['Student Health', 'Clinic'],
    coordinates: [33.5828, -101.8795],
    category: 'health',
    description: 'Student Health Services provides comprehensive medical care including primary care, mental health services, immunizations, and wellness programs for enrolled students.',
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'Student Union Building',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Student+Wellness+Center',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 743-2848',
    email: 'studenthealth@ttuhsc.edu',
    website: 'https://www.depts.ttu.edu/studenthealth/',
    restrooms: 'Clinical and public restrooms on all floors',
    elevators: 'Elevator located near main pharmacy lobby',
    bikeRacks: 'Racks near pharmacy entrance',
    emergencyPhones: 'Emergency phone in visitor parking lot',
    aedLocations: ['Triage clinic lobby', 'Pharmacy waiting area']
  },
  {
    id: 'moody-planetarium',
    name: 'Moody Planetarium',
    abbreviation: 'MOOD',
    aliases: ['Planetarium'],
    coordinates: [33.5860, -101.8785],
    category: 'museum',
    description: 'The Moody Planetarium offers public shows and educational programs about astronomy and space science. Part of the Museum of Texas Tech University complex.',
    hasParkingNearby: ['flint-ave-garage'],
    nearestShuttleStop: 'Museum',
    photo: 'https://placehold.co/600x400/eeeeee/999999?text=Moody+Planetarium',
    wheelchairAccessible: true,
    needsReview: true,
    dataSource: 'official-directory',
    phone: '(806) 742-2442',
    email: 'museum.education@ttu.edu',
    website: 'https://www.depts.ttu.edu/museumttu/',
    restrooms: 'Museum lobby restrooms (accessible)',
    elevators: 'Elevator serving lower level gallery',
    bikeRacks: 'Racks at Museum main entrance',
    emergencyPhones: 'Emergency phone in museum courtyard',
    aedLocations: ['Museum admissions desk']
  },
];

// ---- DINING VENUES ----
// Modeled on TTU Hospitality Services: www.depts.ttu.edu/hospitality/
export interface DiningVenue {
  id: string;
  name: string;
  location: string;
  buildingId?: string;
  coordinates: [number, number];
  category: 'all-you-care' | 'food-court' | 'grab-go' | 'coffee' | 'fast-food' | 'retail';
  description: string;
  hours: { [key: string]: { open: string; close: string } };
  acceptsDiningBucks: boolean;
  hasCommuterDiscount: boolean;
  stations?: string[];
  menuHighlights?: string[];
  photo?: string;
  status: 'open' | 'limited' | 'closed';
  distance?: string;
}

export const diningVenues: DiningVenue[] = [
  {
    id: 'the-commons',
    name: 'The Commons',
    location: 'Talkington Hall Ground Floor',
    buildingId: 'talkington-hall',
    coordinates: [33.5872, -101.8828],
    category: 'all-you-care',
    description: 'The Commons at Talkington Hall is Texas Tech\'s flagship all-you-care-to-eat dining hall, featuring 7 distinct culinary stations serving diverse cuisines.',
    hours: {
      Mon: { open: '7:00 AM', close: '9:00 PM' },
      Tue: { open: '7:00 AM', close: '9:00 PM' },
      Wed: { open: '7:00 AM', close: '9:00 PM' },
      Thu: { open: '7:00 AM', close: '9:00 PM' },
      Fri: { open: '7:00 AM', close: '8:00 PM' },
      Sat: { open: '9:00 AM', close: '8:00 PM' },
      Sun: { open: '9:00 AM', close: '8:00 PM' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: true,
    stations: ['Greens & Things', 'Just Say Cheez', 'Khan\'s Mongolian Grill', 'Parrillas Tex-Mex', 'Pi Pizza', 'Second to Naan', 'The Carvery'],
    menuHighlights: ['Made-to-order stir fry', 'Brick-oven pizza', 'Fresh salad bar', 'Tex-Mex burritos'],
    status: 'open',
    distance: '0.3 mi',
  },
  {
    id: 'market-stangel',
    name: 'The Market at Stangel/Murdough',
    location: 'Stangel/Murdough Residence Hall',
    coordinates: [33.5850, -101.8835],
    category: 'food-court',
    description: 'Food court style dining with multiple branded concepts under one roof. A popular spot for resident and commuter students alike.',
    hours: {
      Mon: { open: '7:00 AM', close: '10:00 PM' },
      Tue: { open: '7:00 AM', close: '10:00 PM' },
      Wed: { open: '7:00 AM', close: '10:00 PM' },
      Thu: { open: '7:00 AM', close: '10:00 PM' },
      Fri: { open: '7:00 AM', close: '9:00 PM' },
      Sat: { open: '9:00 AM', close: '9:00 PM' },
      Sun: { open: '9:00 AM', close: '9:00 PM' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: true,
    stations: ['Chick-fil-A', 'Starbucks', 'Einstein Bros. Bagels'],
    menuHighlights: ['Chick-fil-A sandwiches', 'Starbucks coffee', 'Fresh bagels'],
    status: 'open',
    distance: '0.5 mi',
  },
  {
    id: 'sams-place-murdough',
    name: "Sam's Place Mini-Market (Murdough)",
    location: 'Murdough Hall',
    coordinates: [33.5852, -101.8832],
    category: 'grab-go',
    description: 'Convenient grab-and-go market offering sandwiches, snacks, beverages, and essentials. Part of the Sam\'s Place network with 6 campus locations.',
    hours: {
      Mon: { open: '7:00 AM', close: '11:00 PM' },
      Tue: { open: '7:00 AM', close: '11:00 PM' },
      Wed: { open: '7:00 AM', close: '11:00 PM' },
      Thu: { open: '7:00 AM', close: '11:00 PM' },
      Fri: { open: '7:00 AM', close: '11:00 PM' },
      Sat: { open: '10:00 AM', close: '10:00 PM' },
      Sun: { open: '10:00 AM', close: '10:00 PM' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: false,
    menuHighlights: ['Grab-and-go sandwiches', 'Snack packs', 'Beverages'],
    status: 'open',
    distance: '0.4 mi',
  },
  {
    id: 'chickfila-sub',
    name: 'Chick-fil-A',
    location: 'Student Union Building',
    buildingId: 'sub',
    coordinates: [33.5836, -101.8806],
    category: 'fast-food',
    description: 'Popular Chick-fil-A location in the SUB serving their signature chicken sandwiches, waffle fries, and breakfast items.',
    hours: {
      Mon: { open: '7:00 AM', close: '8:00 PM' },
      Tue: { open: '7:00 AM', close: '8:00 PM' },
      Wed: { open: '7:00 AM', close: '8:00 PM' },
      Thu: { open: '7:00 AM', close: '8:00 PM' },
      Fri: { open: '7:00 AM', close: '5:00 PM' },
      Sat: { open: 'Closed', close: 'Closed' },
      Sun: { open: 'Closed', close: 'Closed' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: true,
    menuHighlights: ['Chicken Sandwich', 'Spicy Chicken', 'Waffle Fries', 'Nuggets'],
    status: 'open',
    distance: '0.2 mi',
  },
  {
    id: 'starbucks-sub',
    name: 'Starbucks',
    location: 'Student Union Building',
    buildingId: 'sub',
    coordinates: [33.5838, -101.8804],
    category: 'coffee',
    description: 'Full-service Starbucks in the SUB offering coffee, espresso drinks, teas, pastries, and light lunch options.',
    hours: {
      Mon: { open: '6:30 AM', close: '9:00 PM' },
      Tue: { open: '6:30 AM', close: '9:00 PM' },
      Wed: { open: '6:30 AM', close: '9:00 PM' },
      Thu: { open: '6:30 AM', close: '9:00 PM' },
      Fri: { open: '6:30 AM', close: '6:00 PM' },
      Sat: { open: '8:00 AM', close: '5:00 PM' },
      Sun: { open: '8:00 AM', close: '5:00 PM' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: true,
    menuHighlights: ['Pumpkin Spice Latte', 'Caramel Macchiato', 'Breakfast sandwiches'],
    status: 'open',
    distance: '0.2 mi',
  },
  {
    id: 'einstein-rawls',
    name: 'Einstein Bros. Bagels',
    location: 'Rawls College of Business',
    buildingId: 'rawls-college',
    coordinates: [33.5864, -101.8791],
    category: 'coffee',
    description: 'Einstein Bros. Bagels in Rawls College serving freshly baked bagels, coffee, and breakfast/lunch sandwiches.',
    hours: {
      Mon: { open: '7:00 AM', close: '4:00 PM' },
      Tue: { open: '7:00 AM', close: '4:00 PM' },
      Wed: { open: '7:00 AM', close: '4:00 PM' },
      Thu: { open: '7:00 AM', close: '4:00 PM' },
      Fri: { open: '7:00 AM', close: '2:00 PM' },
      Sat: { open: 'Closed', close: 'Closed' },
      Sun: { open: 'Closed', close: 'Closed' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: true,
    menuHighlights: ['Fresh bagels', 'Coffee', 'Breakfast sandwiches'],
    status: 'open',
    distance: '0.4 mi',
  },
  {
    id: 'pizza-hut',
    name: 'Pizza Hut Express',
    location: 'Weymouth Hall',
    coordinates: [33.5840, -101.8815],
    category: 'fast-food',
    description: 'Pizza Hut Express offering personal pan pizzas, breadsticks, and wings for quick campus dining.',
    hours: {
      Mon: { open: '10:30 AM', close: '9:00 PM' },
      Tue: { open: '10:30 AM', close: '9:00 PM' },
      Wed: { open: '10:30 AM', close: '9:00 PM' },
      Thu: { open: '10:30 AM', close: '9:00 PM' },
      Fri: { open: '10:30 AM', close: '8:00 PM' },
      Sat: { open: '11:00 AM', close: '7:00 PM' },
      Sun: { open: '11:00 AM', close: '7:00 PM' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: true,
    menuHighlights: ['Personal pan pizzas', 'Breadsticks', 'Wings'],
    status: 'open',
    distance: '0.3 mi',
  },
  {
    id: 'raider-pit-bbq',
    name: 'Raider Pit BBQ',
    location: 'The Market at Stangel/Murdough',
    coordinates: [33.5850, -101.8835],
    category: 'food-court',
    description: 'Texas-style BBQ serving smoked brisket, pulled pork, sausage, and classic sides. A campus favorite.',
    hours: {
      Mon: { open: '10:30 AM', close: '8:00 PM' },
      Tue: { open: '10:30 AM', close: '8:00 PM' },
      Wed: { open: '10:30 AM', close: '8:00 PM' },
      Thu: { open: '10:30 AM', close: '8:00 PM' },
      Fri: { open: '10:30 AM', close: '7:00 PM' },
      Sat: { open: '11:00 AM', close: '6:00 PM' },
      Sun: { open: 'Closed', close: 'Closed' },
    },
    acceptsDiningBucks: true,
    hasCommuterDiscount: true,
    menuHighlights: ['Smoked brisket', 'Pulled pork', 'Mac & cheese', 'BBQ beans'],
    status: 'limited',
    distance: '0.5 mi',
  },
];

// ---- PARKING LOTS ----
// Modeled on TTU Transportation & Parking Services: www.depts.ttu.edu/parking/
export interface ParkingLot {
  id: string;
  name: string;
  coordinates: [number, number];
  category: 'resident' | 'commuter' | 'garage' | 'visitor' | 'faculty';
  permitRequired: string[];
  totalSpaces: number;
  occupiedSpaces: number;
  status: 'available' | 'limited' | 'full';
  hours: string;
  eveningWeekendNote: string;
  walkingDistances: { buildingId: string; minutes: number }[];
  features?: string[];
  rate?: string;
}

export const parkingLots: ParkingLot[] = [
  {
    id: 'flint-ave-garage',
    name: 'Flint Avenue Parking Facility',
    coordinates: [33.5855, -101.8795],
    category: 'garage',
    permitRequired: ['Commuter', 'Resident', 'Faculty/Staff'],
    totalSpaces: 850,
    occupiedSpaces: 612,
    status: 'available',
    hours: 'Permit required 7:30 AM – 5:30 PM weekdays',
    eveningWeekendNote: 'Open to all permit holders evenings & weekends',
    walkingDistances: [
      { buildingId: 'rawls-college', minutes: 3 },
      { buildingId: 'sub', minutes: 4 },
      { buildingId: 'holden-hall', minutes: 5 },
    ],
    features: ['Covered parking', 'Elevator access', 'Security cameras'],
  },
  {
    id: 'raider-park-garage',
    name: 'Raider Park Garage',
    coordinates: [33.5885, -101.8830],
    category: 'garage',
    permitRequired: ['Commuter', 'Resident'],
    totalSpaces: 1200,
    occupiedSpaces: 980,
    status: 'limited',
    hours: 'Permit required 7:30 AM – 5:30 PM weekdays',
    eveningWeekendNote: 'Pedestrian bridge over Marsha Sharp Freeway to campus',
    walkingDistances: [
      { buildingId: 'holden-hall', minutes: 8 },
      { buildingId: 'talkington-hall', minutes: 6 },
    ],
    features: ['Covered parking', 'Pedestrian bridge', 'EV charging stations'],
  },
  {
    id: 'commuter-north',
    name: 'Commuter North (C1/C2/C4)',
    coordinates: [33.5880, -101.8815],
    category: 'commuter',
    permitRequired: ['Commuter'],
    totalSpaces: 1500,
    occupiedSpaces: 1420,
    status: 'limited',
    hours: 'Permit required 7:30 AM – 5:30 PM weekdays',
    eveningWeekendNote: 'Open to all after 5:30 PM and weekends',
    walkingDistances: [
      { buildingId: 'talkington-hall', minutes: 4 },
      { buildingId: 'rawls-college', minutes: 7 },
    ],
    features: ['Surface lot', 'Bus stop nearby'],
  },
  {
    id: 'commuter-west',
    name: 'Commuter West',
    coordinates: [33.5860, -101.8850],
    category: 'commuter',
    permitRequired: ['Commuter'],
    totalSpaces: 800,
    occupiedSpaces: 450,
    status: 'available',
    hours: 'Permit required 7:30 AM – 5:30 PM weekdays',
    eveningWeekendNote: 'Open to all after 5:30 PM and weekends',
    walkingDistances: [
      { buildingId: 'holden-hall', minutes: 6 },
      { buildingId: 'english-phil', minutes: 5 },
    ],
    features: ['Surface lot'],
  },
  {
    id: 'wall-gates',
    name: 'Wall/Gates Residence Hall Lot',
    coordinates: [33.5890, -101.8800],
    category: 'resident',
    permitRequired: ['Resident'],
    totalSpaces: 400,
    occupiedSpaces: 380,
    status: 'limited',
    hours: 'Permit required at all times',
    eveningWeekendNote: 'Resident permit only',
    walkingDistances: [
      { buildingId: 'talkington-hall', minutes: 5 },
    ],
    features: ['Resident only'],
  },
  {
    id: 'visitor-pay',
    name: 'Park & Pay (Visitor)',
    coordinates: [33.5840, -101.8780],
    category: 'visitor',
    permitRequired: [],
    totalSpaces: 60,
    occupiedSpaces: 35,
    status: 'available',
    hours: 'Metered parking 8:00 AM – 6:00 PM',
    eveningWeekendNote: 'Free after 6:00 PM and weekends',
    walkingDistances: [
      { buildingId: 'admin-building', minutes: 3 },
      { buildingId: 'sub', minutes: 4 },
    ],
    features: ['Metered', 'Credit card accepted', 'Visitor friendly'],
    rate: '$2/hour, max $12/day',
  },
];

// ---- SHUTTLE ROUTES ----
// Modeled on Citibus/DoubleMap system
export interface ShuttleRoute {
  id: string;
  name: string;
  color: string;
  description: string;
  stops: ShuttleStop[];
  schedule: { [key: string]: { start: string; end: string; frequency: string } };
  isActive: boolean;
}

export interface ShuttleStop {
  id: string;
  name: string;
  coordinates: [number, number];
  nextArrival?: number; // minutes
}

export const shuttleRoutes: ShuttleRoute[] = [
  {
    id: 'red-raider',
    name: 'Red Raider',
    color: '#CC0000',
    description: 'Core on-campus loop running clockwise. Stops at major academic buildings, the SUB, and residence halls. Free for TTU students with ID.',
    stops: [
      { id: 'rr-1', name: 'Student Union Building', coordinates: [33.5836, -101.8806], nextArrival: 3 },
      { id: 'rr-2', name: 'University Library', coordinates: [33.5825, -101.8809], nextArrival: 6 },
      { id: 'rr-3', name: 'Holden Hall', coordinates: [33.5847, -101.8803], nextArrival: 9 },
      { id: 'rr-4', name: 'Rawls College', coordinates: [33.5864, -101.8791], nextArrival: 12 },
      { id: 'rr-5', name: 'Talkington Hall', coordinates: [33.5872, -101.8828], nextArrival: 15 },
      { id: 'rr-6', name: 'Student Recreation Center', coordinates: [33.5820, -101.8780], nextArrival: 18 },
    ],
    schedule: {
      Mon: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Tue: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Wed: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Thu: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Fri: { start: '7:00 AM', end: '5:00 PM', frequency: 'Every 12-15 min' },
      Sat: { start: '10:00 AM', end: '5:00 PM', frequency: 'Every 20 min' },
      Sun: { start: 'Closed', end: 'Closed', frequency: 'No service' },
    },
    isActive: true,
  },
  {
    id: 'double-t',
    name: 'Double T',
    color: '#000000',
    description: 'Core on-campus loop running counter-clockwise (opposite Red Raider). Same stops, opposite direction. Free for TTU students with ID.',
    stops: [
      { id: 'dt-1', name: 'Student Union Building', coordinates: [33.5837, -101.8804], nextArrival: 5 },
      { id: 'dt-2', name: 'Student Recreation Center', coordinates: [33.5822, -101.8778], nextArrival: 8 },
      { id: 'dt-3', name: 'Talkington Hall', coordinates: [33.5873, -101.8826], nextArrival: 11 },
      { id: 'dt-4', name: 'Rawls College', coordinates: [33.5865, -101.8789], nextArrival: 14 },
      { id: 'dt-5', name: 'Holden Hall', coordinates: [33.5848, -101.8801], nextArrival: 17 },
      { id: 'dt-6', name: 'University Library', coordinates: [33.5826, -101.8807], nextArrival: 20 },
    ],
    schedule: {
      Mon: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Tue: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Wed: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Thu: { start: '7:00 AM', end: '6:00 PM', frequency: 'Every 10-12 min' },
      Fri: { start: '7:00 AM', end: '5:00 PM', frequency: 'Every 12-15 min' },
      Sat: { start: '10:00 AM', end: '5:00 PM', frequency: 'Every 20 min' },
      Sun: { start: 'Closed', end: 'Closed', frequency: 'No service' },
    },
    isActive: true,
  },
  {
    id: 'raider-ride',
    name: 'Raider Ride',
    color: '#FDB927',
    description: 'Free evening and night van service for safer campus travel. Operates 6:00 PM – 2:45 AM daily. Call or use app to request pickup.',
    stops: [
      { id: 'rride-1', name: 'Student Union Building', coordinates: [33.5838, -101.8802], nextArrival: 12 },
      { id: 'rride-2', name: 'University Library', coordinates: [33.5827, -101.8805], nextArrival: 15 },
      { id: 'rride-3', name: 'Holden Hall', coordinates: [33.5849, -101.8799], nextArrival: 18 },
      { id: 'rride-4', name: 'Talkington Hall', coordinates: [33.5874, -101.8824], nextArrival: 21 },
      { id: 'rride-5', name: 'Rawls College', coordinates: [33.5866, -101.8787], nextArrival: 24 },
    ],
    schedule: {
      Mon: { start: '6:00 PM', end: '2:45 AM', frequency: 'On-demand / 15 min' },
      Tue: { start: '6:00 PM', end: '2:45 AM', frequency: 'On-demand / 15 min' },
      Wed: { start: '6:00 PM', end: '2:45 AM', frequency: 'On-demand / 15 min' },
      Thu: { start: '6:00 PM', end: '2:45 AM', frequency: 'On-demand / 15 min' },
      Fri: { start: '6:00 PM', end: '2:45 AM', frequency: 'On-demand / 15 min' },
      Sat: { start: '6:00 PM', end: '2:45 AM', frequency: 'On-demand / 15 min' },
      Sun: { start: '6:00 PM', end: '2:45 AM', frequency: 'On-demand / 15 min' },
    },
    isActive: true,
  },
];

// ---- EVENTS ----
// Modeled on TechEvents Calendar: ttu.campuslabs.com/engage/eventcalendar
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
}

export const campusEvents: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'Engineering Career Fair',
    organization: 'Edward E. Whitacre Jr. College of Engineering',
    category: 'Career',
    startTime: '10:00 AM',
    endTime: '3:00 PM',
    location: 'Student Union Building - Ballroom',
    buildingId: 'sub',
    coordinates: [33.5836, -101.8806],
    description: 'Meet with 100+ employers hiring for engineering internships and full-time positions. Bring your resume and dress professionally. Open to all engineering majors.',
    hasFreeFood: false,
    date: '2026-07-15',
  },
  {
    id: 'evt-2',
    title: 'Free Pizza Study Break',
    organization: 'Student Government Association',
    category: 'Social',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    location: 'Student Union Building - Red Raider Lounge',
    buildingId: 'sub',
    coordinates: [33.5836, -101.8806],
    description: 'Take a break from studying with free pizza and refreshments. Open to all TTU students while supplies last.',
    hasFreeFood: true,
    date: '2026-07-15',
  },
  {
    id: 'evt-3',
    title: 'Red Raider Football Watch Party',
    organization: 'Texas Tech Athletics',
    category: 'Sports',
    startTime: '6:00 PM',
    endTime: '10:00 PM',
    location: 'Student Union Building - Allen Theatre',
    buildingId: 'sub',
    coordinates: [33.5836, -101.8806],
    description: 'Join fellow Red Raiders to watch the game on the big screen. Free snacks and prize giveaways. Wear your red!',
    hasFreeFood: true,
    date: '2026-07-16',
  },
  {
    id: 'evt-4',
    title: 'RaiderHacks Summer Hackathon',
    organization: 'Computer Science Society',
    category: 'Academic',
    startTime: '9:00 AM',
    endTime: '9:00 PM',
    location: 'Holden Hall 110 & 150',
    buildingId: 'holden-hall',
    coordinates: [33.5847, -101.8803],
    description: '12-hour hackathon open to all majors. Form teams, build projects, and compete for prizes. Beginners welcome! Mentors available throughout.',
    hasFreeFood: true,
    date: '2026-07-18',
  },
  {
    id: 'evt-5',
    title: 'International Food Festival',
    organization: 'International Student Services',
    category: 'International',
    startTime: '5:00 PM',
    endTime: '8:00 PM',
    location: 'Student Union Building - Lanier Atrium',
    buildingId: 'sub',
    coordinates: [33.5836, -101.8806],
    description: 'Celebrate cultures from around the world with food tastings, performances, and cultural displays. Free for all students.',
    hasFreeFood: true,
    date: '2026-07-19',
  },
  {
    id: 'evt-6',
    title: 'CS Department Seminar: AI in Healthcare',
    organization: 'Dept. of Computer Science',
    category: 'Academic',
    startTime: '3:00 PM',
    endTime: '4:30 PM',
    location: 'Holden Hall 110',
    buildingId: 'holden-hall',
    coordinates: [33.5847, -101.8803],
    description: 'Guest lecture by Dr. Sarah Chen on applications of machine learning in medical diagnosis and treatment planning. Refreshments provided.',
    hasFreeFood: true,
    date: '2026-07-17',
  },
  {
    id: 'evt-7',
    title: 'Sunset Yoga on the Lawn',
    organization: 'Recreational Sports',
    category: 'Recreation',
    startTime: '7:00 PM',
    endTime: '8:00 PM',
    location: 'Memorial Circle',
    description: 'Free outdoor yoga session open to all skill levels. Bring your own mat or towel.',
    hasFreeFood: false,
    date: '2026-07-15',
  },
  {
    id: 'evt-8',
    title: 'Greek Life Recruitment Info Night',
    organization: 'Office of Fraternity & Sorority Life',
    category: 'Social',
    startTime: '6:00 PM',
    endTime: '8:00 PM',
    location: 'Student Union Building - Matador Room',
    buildingId: 'sub',
    coordinates: [33.5836, -101.8806],
    description: 'Learn about joining the Greek community at Texas Tech. Representatives from IFC, Panhellenic, and NPHC councils will be present.',
    hasFreeFood: false,
    date: '2026-07-20',
  },
];

// ---- JOBS ----
// Modeled on Red Raider Student Employment Center & Hire Red Raiders
export interface CampusJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'On-Campus' | 'Federal Work-Study' | 'Off-Campus';
  payRange: string;
  payType: 'hourly' | 'salary';
  description: string;
  requirements: string[];
  applicationDeadline: string;
  hoursPerWeek: string;
  source: 'RRSEC' | 'Hire Red Raiders';
  sourceUrl: string;
  isNew: boolean;
  postedDate: string;
}

export const campusJobs: CampusJob[] = [
  {
    id: 'job-1',
    title: 'Library Front Desk Assistant',
    department: 'University Library',
    location: 'University Library',
    type: 'On-Campus',
    payRange: '$13.00 – $15.00',
    payType: 'hourly',
    description: 'Assist patrons at the front desk, check out materials, answer questions, and help with library resources. Training provided.',
    requirements: ['Currently enrolled TTU student', 'Good communication skills', 'Ability to work evenings'],
    applicationDeadline: '2026-08-05',
    hoursPerWeek: '15-20',
    source: 'RRSEC',
    sourceUrl: 'https://ttu-csm.symplicity.com/students',
    isNew: true,
    postedDate: '2026-07-10',
  },
  {
    id: 'job-2',
    title: 'Campus Tour Guide',
    department: 'Office of Admissions',
    location: 'Administration Building',
    type: 'On-Campus',
    payRange: '$12.00',
    payType: 'hourly',
    description: 'Lead campus tours for prospective students and families. Share your TTU knowledge and enthusiasm while developing public speaking skills.',
    requirements: ['Currently enrolled TTU student', 'GPA 2.5+', 'Enthusiasm for TTU'],
    applicationDeadline: '2026-07-25',
    hoursPerWeek: '10-15',
    source: 'RRSEC',
    sourceUrl: 'https://ttu-csm.symplicity.com/students',
    isNew: true,
    postedDate: '2026-07-11',
  },
  {
    id: 'job-3',
    title: 'Dining Services Team Member',
    department: 'Hospitality Services',
    location: 'The Commons',
    type: 'On-Campus',
    payRange: '$13.00',
    payType: 'hourly',
    description: 'Work in food preparation, serving, and cleanup at The Commons dining hall. Flexible scheduling around classes. Meal perks included!',
    requirements: ['Currently enrolled TTU student', 'Food handler certification (or obtain within 30 days)'],
    applicationDeadline: 'Open until filled',
    hoursPerWeek: '15-25',
    source: 'RRSEC',
    sourceUrl: 'https://ttu-csm.symplicity.com/students',
    isNew: false,
    postedDate: '2026-07-01',
  },
  {
    id: 'job-4',
    title: 'IT Help Desk Technician',
    department: 'IT Support Services',
    location: 'Holden Hall 250',
    type: 'Federal Work-Study',
    payRange: '$14.00 – $16.00',
    payType: 'hourly',
    description: 'Provide technical support to students and faculty. Troubleshoot hardware/software issues, assist with network connectivity, and maintain equipment.',
    requirements: ['Federal Work-Study eligible', 'Basic computer troubleshooting skills', 'Customer service experience preferred'],
    applicationDeadline: '2026-07-30',
    hoursPerWeek: '10-20',
    source: 'RRSEC',
    sourceUrl: 'https://ttu-csm.symplicity.com/students',
    isNew: true,
    postedDate: '2026-07-12',
  },
  {
    id: 'job-5',
    title: 'Undergraduate Research Assistant – AI Lab',
    department: 'Dept. of Computer Science',
    location: 'Holden Hall 310',
    type: 'On-Campus',
    payRange: '$15.00',
    payType: 'hourly',
    description: 'Assist graduate students and faculty with machine learning research projects. Opportunities for publication and conference presentations.',
    requirements: ['CS or related major', 'Python programming experience', 'GPA 3.0+', 'Interest in AI/ML'],
    applicationDeadline: '2026-08-01',
    hoursPerWeek: '10-15',
    source: 'RRSEC',
    sourceUrl: 'https://ttu-csm.symplicity.com/students',
    isNew: true,
    postedDate: '2026-07-13',
  },
  {
    id: 'job-6',
    title: 'Software Engineering Intern',
    department: 'University Career Center',
    location: 'Off-Campus (Local Tech Company)',
    type: 'Off-Campus',
    payRange: '$22.00 – $28.00',
    payType: 'hourly',
    description: 'Full-stack development internship with a Lubbock-based tech company. Work on real products using React, Node.js, and cloud services.',
    requirements: ['Junior or Senior CS student', 'JavaScript/React experience', 'Available Fall 2026 semester'],
    applicationDeadline: '2026-08-15',
    hoursPerWeek: '20',
    source: 'Hire Red Raiders',
    sourceUrl: 'https://ttu-csm.symplicity.com/students',
    isNew: true,
    postedDate: '2026-07-13',
  },
];

// ---- STUDENT ORGANIZATIONS ----
// Modeled on TechConnect org directory: ttu.campuslabs.com/engage/organizations
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
  isFavorite?: boolean;
  photo?: string;
}

export const studentOrgs: StudentOrg[] = [
  {
    id: 'org-1',
    name: 'Association for Computing Machinery (ACM)',
    category: 'Engineering/CS',
    description: 'The premier organization for computing professionals at TTU. Hosts coding competitions, tech talks, interview prep, and networking events.',
    meetingTime: 'Tuesdays 6:00 PM',
    meetingLocation: 'Holden Hall 150',
    memberCount: 180,
    email: 'acm@ttu.edu',
  },
  {
    id: 'org-2',
    name: 'Society of Hispanic Professional Engineers (SHPE)',
    category: 'Engineering/CS',
    description: 'Empowers the Hispanic community to realize its fullest potential through STEM awareness, access, support, and professional development.',
    meetingTime: 'Mondays 5:30 PM',
    meetingLocation: 'Engineering Center',
    memberCount: 95,
    email: 'shpe@ttu.edu',
  },
  {
    id: 'org-3',
    name: 'Red Raider Robotics',
    category: 'Engineering/CS',
    description: 'Design, build, and compete with combat robots and autonomous vehicles. No experience necessary – mentors teach machining, CAD, and programming.',
    meetingTime: 'Wednesdays 7:00 PM',
    meetingLocation: 'Engineering Workshop',
    memberCount: 60,
    email: 'robotics@ttu.edu',
  },
  {
    id: 'org-4',
    name: 'International Student Association',
    category: 'Cultural',
    description: 'Celebrates cultural diversity at TTU through events, mentorship programs, and advocacy for international students.',
    meetingTime: 'Thursdays 5:00 PM',
    meetingLocation: 'International Cultural Center',
    memberCount: 250,
    email: 'isa@ttu.edu',
  },
  {
    id: 'org-5',
    name: 'Student Government Association',
    category: 'Academic',
    description: 'The official student governance body representing all TTU students. SGA advocates for student interests and allocates activity fees.',
    meetingTime: 'Tuesdays 6:30 PM',
    meetingLocation: 'SUB Senate Chambers',
    memberCount: 45,
    email: 'sga@ttu.edu',
  },
  {
    id: 'org-6',
    name: 'Red Cross Club',
    category: 'Service',
    description: 'Volunteer organization focused on disaster relief, blood drives, and community health education in the Lubbock area.',
    meetingTime: 'Mondays 7:00 PM',
    meetingLocation: 'SUB Room 201',
    memberCount: 80,
    email: 'redcross@ttu.edu',
  },
  {
    id: 'org-7',
    name: 'Intramural Sports Council',
    category: 'Recreation',
    description: 'Organizes and promotes intramural sports leagues including flag football, basketball, soccer, volleyball, and esports.',
    meetingTime: 'As scheduled',
    meetingLocation: 'Student Recreation Center',
    memberCount: 1200,
    email: 'intramurals@ttu.edu',
  },
  {
    id: 'org-8',
    name: 'Society of Women Engineers (SWE)',
    category: 'Engineering/CS',
    description: 'Supports women in engineering through professional development, networking, K-12 outreach, and social events. Allies welcome.',
    meetingTime: 'Wednesdays 5:00 PM',
    meetingLocation: 'Rawls College 107',
    memberCount: 110,
    email: 'swe@ttu.edu',
  },
];

// ---- CLASS SCHEDULE (Demo) ----
export interface ClassSession {
  id: string;
  courseCode: string;
  courseName: string;
  buildingId: string;
  room: string;
  startTime: string;
  endTime: string;
  days: string[];
  professor: string;
}

export const demoSchedule: ClassSession[] = [
  {
    id: 'cls-1',
    courseCode: 'CS 3361',
    courseName: 'Software Engineering',
    buildingId: 'holden-hall',
    room: '110',
    startTime: '9:30 AM',
    endTime: '10:50 AM',
    days: ['Mon', 'Wed'],
    professor: 'Dr. Martinez',
  },
  {
    id: 'cls-2',
    courseCode: 'MATH 2450',
    courseName: 'Calculus III',
    buildingId: 'holden-hall',
    room: '107',
    startTime: '12:00 PM',
    endTime: '12:50 PM',
    days: ['Mon', 'Wed', 'Fri'],
    professor: 'Dr. Thompson',
  },
  {
    id: 'cls-3',
    courseCode: 'POLS 1301',
    courseName: 'American Government',
    buildingId: 'holden-hall',
    room: '016',
    startTime: '3:30 PM',
    endTime: '4:50 PM',
    days: ['Tue', 'Thu'],
    professor: 'Dr. Williams',
  },
];

// ---- CAMPUS ALERTS ----
export interface CampusAlert {
  id: string;
  type: 'weather' | 'safety' | 'emergency';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  isDismissible: boolean;
}

export const campusAlerts: CampusAlert[] = [
  {
    id: 'alert-1',
    type: 'weather',
    title: 'Heat Advisory',
    message: 'Heat index up to 105°F today. Stay hydrated and limit outdoor activity 2–6 PM.',
    severity: 'warning',
    timestamp: '2026-07-14T08:00:00Z',
    isDismissible: true,
  },
];

// ---- MAP CATEGORIES ----
export const mapCategories = [
  { id: 'academic', label: 'Academic', icon: 'GraduationCap', color: '#CC0000' },
  { id: 'administrative', label: 'Administrative', icon: 'Building2', color: '#666666' },
  { id: 'residence', label: 'Residence & Dining', icon: 'Home', color: '#0066CC' },
  { id: 'library', label: 'Museums & Libraries', icon: 'BookOpen', color: '#9933CC' },
  { id: 'recreation', label: 'Athletics & Recreation', icon: 'Trophy', color: '#FF6600' },
  { id: 'parking', label: 'Parking & Transportation', icon: 'Car', color: '#339933' },
  { id: 'health', label: 'Health & Safety', icon: 'Heart', color: '#CC0000' },
  { id: 'landmark', label: 'Landmarks', icon: 'Landmark', color: '#FDB927' },
] as const;

// Helper to get today's classes
export function getTodayClasses(): ClassSession[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  return demoSchedule.filter(c => c.days.includes(today));
}

// Helper to check if a venue is currently open
export function isVenueOpen(venue: DiningVenue): boolean {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = days[new Date().getDay()];
  const hours = venue.hours[today];
  if (!hours || hours.open === 'Closed') return false;
  const now = new Date();
  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);
  const openMin = openH * 60 + (openM || 0);
  const closeMin = closeH * 60 + (closeM || 0);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return nowMin >= openMin && nowMin < closeMin;
}
