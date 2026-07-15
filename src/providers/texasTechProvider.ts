// ============================================
// Texas Tech University Provider
// ============================================
// Implements the UniversityProvider interface for Texas Tech.
// This is the only file that needs to change to support a different university.

import type {
  UniversityProvider,
  UniversityInfo,
  CampusBuilding,
  DiningVenue,
  ParkingLot,
  ShuttleRoute,
  CampusEvent,
  CampusJob,
  StudentOrg,
  CampusAlert,
  SearchResult,
  BuildingCategory,
  MapCategory,
} from './types';

import {
  ttuProfile,
  buildings as rawBuildings,
  diningVenues as rawDining,
  parkingLots as rawParking,
  shuttleRoutes as rawShuttle,
  campusEvents as rawEvents,
  campusJobs as rawJobs,
  studentOrgs as rawOrgs,
  campusAlerts as rawAlerts,
  mapCategories as rawMapCategories,
} from '../data/universityProfile';

import { facultyMembers } from '../data/facultyDirectory';
import { fetchWeather } from '../services/weatherService';

// ---- University Info ----
const info: UniversityInfo = {
  id: 'ttu',
  name: 'Texas Tech University',
  shortName: 'Texas Tech',
  mascot: 'Red Raiders',
  colors: ttuProfile.colors,
  location: ttuProfile.location,
  tagline: 'One Campus. One Intelligence.',
  urls: {
    ...ttuProfile.urls,
    faculty: 'https://www.ttu.edu/directory/',
  },
};

// ---- Data Transformation ----
// Convert existing data to new provider format with dataSource labels

function transformBuilding(b: typeof rawBuildings[0]): CampusBuilding {
  return {
    ...b,
    dataSource: 'official-directory',
  };
}

function transformDining(d: typeof rawDining[0]): DiningVenue {
  return {
    ...d,
    phone: undefined,
    website: undefined,
    dataSource: 'official-directory',
  };
}

function transformParking(p: typeof rawParking[0]): ParkingLot {
  return {
    ...p,
    photo: undefined,
    dataSource: 'official-directory',
  };
}

function transformShuttle(s: typeof rawShuttle[0]): ShuttleRoute {
  return {
    ...s,
    dataSource: 'official-directory',
  };
}

function transformEvent(e: typeof rawEvents[0]): CampusEvent {
  return {
    ...e,
    dataSource: 'official-directory',
  };
}

function transformJob(j: typeof rawJobs[0]): CampusJob {
  return {
    ...j,
    dataSource: 'official-directory',
  };
}

function transformOrg(o: typeof rawOrgs[0]): StudentOrg {
  return {
    ...o,
    dataSource: 'official-directory',
  };
}

function transformAlert(a: typeof rawAlerts[0]): CampusAlert {
  return {
    ...a,
    dataSource: 'official-directory',
  };
}

// ---- Cached Data ----
const buildings = rawBuildings.map(transformBuilding);
const diningVenues = rawDining.map(transformDining);
const parkingLots = rawParking.map(transformParking);
const shuttleRoutes = rawShuttle.map(transformShuttle);
const campusEvents = rawEvents.map(transformEvent);
const campusJobs = rawJobs.map(transformJob);
const studentOrgs = rawOrgs.map(transformOrg);
const campusAlerts = rawAlerts.map(transformAlert);
const mapCategories = [...rawMapCategories] as MapCategory[];

// ---- Provider Implementation ----
export const texasTechProvider: UniversityProvider = {
  info,

  // Buildings
  async getBuildings() {
    return buildings;
  },

  async getBuildingById(id: string) {
    return buildings.find((b) => b.id === id);
  },

  async getBuildingsByCategory(category: BuildingCategory) {
    return buildings.filter((b) => b.category === category);
  },

  async searchBuildings(query: string) {
    const q = query.toLowerCase();
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.abbreviation.toLowerCase().includes(q) ||
        b.departments?.some((d) => d.toLowerCase().includes(q)) ||
        b.description?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
    );
  },

  // Faculty
  async getFaculty() {
    return facultyMembers;
  },

  async getFacultyById(id: string) {
    return facultyMembers.find((f) => f.id === id);
  },

  async getFacultyByDepartment(department: string) {
    return facultyMembers.filter((f) => f.department === department);
  },

  async searchFaculty(query: string) {
    const q = query.toLowerCase();
    return facultyMembers.filter(
      (f) =>
        f.fullName.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.position.toLowerCase().includes(q) ||
        f.researchInterests?.some((r) => r.toLowerCase().includes(q)) ||
        f.email?.toLowerCase().includes(q)
    );
  },

  // Dining
  async getDiningVenues() {
    return diningVenues;
  },

  async getDiningVenueById(id: string) {
    return diningVenues.find((d) => d.id === id);
  },

  async getOpenDiningVenues() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[now.getDay()];
    return diningVenues.filter((v) => {
      const hours = v.hours[today];
      if (!hours || hours.open === 'Closed') return false;
      const [openH, openM] = hours.open.split(':').map(Number);
      const [closeH, closeM] = hours.close.split(':').map(Number);
      const openMin = openH * 60 + (openM || 0);
      const closeMin = closeH * 60 + (closeM || 0);
      const nowMin = now.getHours() * 60 + now.getMinutes();
      return nowMin >= openMin && nowMin < closeMin;
    });
  },

  // Parking
  async getParkingLots() {
    return parkingLots;
  },

  async getParkingLotById(id: string) {
    return parkingLots.find((p) => p.id === id);
  },

  // Shuttle
  async getShuttleRoutes() {
    return shuttleRoutes;
  },

  async getShuttleRouteById(id: string) {
    return shuttleRoutes.find((s) => s.id === id);
  },

  // Events
  async getEvents() {
    return campusEvents;
  },

  async getEventById(id: string) {
    return campusEvents.find((e) => e.id === id);
  },

  async getEventsByDate(date: string) {
    return campusEvents.filter((e) => e.date === date);
  },

  // Jobs
  async getJobs() {
    return campusJobs;
  },

  async getJobById(id: string) {
    return campusJobs.find((j) => j.id === id);
  },

  // Organizations
  async getOrganizations() {
    return studentOrgs;
  },

  async getOrganizationById(id: string) {
    return studentOrgs.find((o) => o.id === id);
  },

  // Alerts
  async getAlerts() {
    return campusAlerts;
  },

  // Weather
  async getWeather() {
    return fetchWeather(info.location.coordinates[0], info.location.coordinates[1]);
  },

  // Global Search
  async globalSearch(query: string): Promise<SearchResult[]> {
    const q = query.toLowerCase();
    if (q.length < 2) return [];

    const results: SearchResult[] = [];

    // Search buildings
    buildings
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.abbreviation.toLowerCase().includes(q) ||
          b.departments?.some((d) => d.toLowerCase().includes(q))
      )
      .forEach((b) =>
        results.push({
          id: b.id,
          type: 'building',
          title: b.name,
          subtitle: b.abbreviation + (b.departments ? ` - ${b.departments[0]}` : ''),
          icon: 'Building2',
          coordinates: b.coordinates,
          category: b.category,
          dataSource: b.dataSource,
        })
      );

    // Search faculty
    facultyMembers
      .filter(
        (f) =>
          f.fullName.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.researchInterests?.some((r) => r.toLowerCase().includes(q))
      )
      .forEach((f) =>
        results.push({
          id: f.id,
          type: 'faculty',
          title: f.fullName,
          subtitle: `${f.position}, ${f.department}`,
          icon: 'User',
          coordinates: f.coordinates,
          category: f.department,
          dataSource: f.dataSource,
        })
      );

    // Search dining
    diningVenues
      .filter((d) => d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q))
      .forEach((d) =>
        results.push({
          id: d.id,
          type: 'dining',
          title: d.name,
          subtitle: d.location,
          icon: 'UtensilsCrossed',
          coordinates: d.coordinates,
          category: d.category,
          dataSource: d.dataSource,
        })
      );

    // Search parking
    parkingLots
      .filter((p) => p.name.toLowerCase().includes(q))
      .forEach((p) =>
        results.push({
          id: p.id,
          type: 'parking',
          title: p.name,
          subtitle: `${p.permitRequired.join(', ')} | ${p.status}`,
          icon: 'Car',
          coordinates: p.coordinates,
          category: p.category,
          dataSource: p.dataSource,
        })
      );

    // Search events
    campusEvents
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.organization.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      )
      .forEach((e) =>
        results.push({
          id: e.id,
          type: 'event',
          title: e.title,
          subtitle: `${e.date} ${e.startTime} - ${e.location}`,
          icon: 'Calendar',
          coordinates: e.coordinates,
          category: e.category,
          dataSource: e.dataSource,
        })
      );

    // Search organizations
    studentOrgs
      .filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      )
      .forEach((o) =>
        results.push({
          id: o.id,
          type: 'organization',
          title: o.name,
          subtitle: o.category,
          icon: 'Users',
          category: o.category,
          dataSource: o.dataSource,
        })
      );

    // Search jobs
    campusJobs
      .filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.type.toLowerCase().includes(q)
      )
      .forEach((j) =>
        results.push({
          id: j.id,
          type: 'job',
          title: j.title,
          subtitle: `${j.department} | ${j.payRange}/hr`,
          icon: 'Briefcase',
          category: j.type,
          dataSource: j.dataSource,
        })
      );

    // Return sorted by relevance (exact matches first)
    return results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === q;
      const bExact = b.title.toLowerCase() === q;
      if (aExact && !bExact) return -1;
      if (bExact && !aExact) return 1;
      return a.title.localeCompare(b.title);
    });
  },

  // Map Categories
  getMapCategories() {
    return mapCategories;
  },
};
