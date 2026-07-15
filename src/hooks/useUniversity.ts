// ============================================
// University Provider Hook
// ============================================
// Single hook to access all university data.
// Swapping the provider changes the university.

import { useQuery } from '@tanstack/react-query';
import { texasTechProvider } from '../providers/texasTechProvider';
import type {
  CampusBuilding,
  FacultyMember,
  DiningVenue,
  ParkingLot,
  ShuttleRoute,
  CampusEvent,
  CampusJob,
  StudentOrg,
  CampusAlert,
  WeatherData,
  SearchResult,
  BuildingCategory,
} from '../providers/types';

// Active provider - change this to swap universities
const provider = texasTechProvider;

// ---- Queries ----

export function useUniversityInfo() {
  return provider.info;
}

export function useBuildings() {
  return useQuery<CampusBuilding[]>({
    queryKey: ['buildings'],
    queryFn: () => provider.getBuildings(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useBuilding(id: string) {
  return useQuery<CampusBuilding | undefined>({
    queryKey: ['building', id],
    queryFn: () => provider.getBuildingById(id),
    enabled: !!id,
  });
}

export function useBuildingsByCategory(category: BuildingCategory) {
  return useQuery<CampusBuilding[]>({
    queryKey: ['buildings', 'category', category],
    queryFn: () => provider.getBuildingsByCategory(category),
    enabled: !!category,
  });
}

export function useFaculty() {
  return useQuery<FacultyMember[]>({
    queryKey: ['faculty'],
    queryFn: () => provider.getFaculty(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useFacultyMember(id: string) {
  return useQuery<FacultyMember | undefined>({
    queryKey: ['faculty', id],
    queryFn: () => provider.getFacultyById(id),
    enabled: !!id,
  });
}

export function useFacultyByDepartment(department: string) {
  return useQuery<FacultyMember[]>({
    queryKey: ['faculty', 'department', department],
    queryFn: () => provider.getFacultyByDepartment(department),
    enabled: !!department,
  });
}

export function useDiningVenues() {
  return useQuery<DiningVenue[]>({
    queryKey: ['dining'],
    queryFn: () => provider.getDiningVenues(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function useDiningVenue(id: string) {
  return useQuery<DiningVenue | undefined>({
    queryKey: ['dining', id],
    queryFn: () => provider.getDiningVenueById(id),
    enabled: !!id,
  });
}

export function useOpenDining() {
  return useQuery<DiningVenue[]>({
    queryKey: ['dining', 'open'],
    queryFn: () => provider.getOpenDiningVenues(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useParkingLots() {
  return useQuery<ParkingLot[]>({
    queryKey: ['parking'],
    queryFn: () => provider.getParkingLots(),
    staleTime: 1000 * 60 * 15,
  });
}

export function useParkingLot(id: string) {
  return useQuery<ParkingLot | undefined>({
    queryKey: ['parking', id],
    queryFn: () => provider.getParkingLotById(id),
    enabled: !!id,
  });
}

export function useShuttleRoutes() {
  return useQuery<ShuttleRoute[]>({
    queryKey: ['shuttle'],
    queryFn: () => provider.getShuttleRoutes(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useEvents() {
  return useQuery<CampusEvent[]>({
    queryKey: ['events'],
    queryFn: () => provider.getEvents(),
    staleTime: 1000 * 60 * 15,
  });
}

export function useEvent(id: string) {
  return useQuery<CampusEvent | undefined>({
    queryKey: ['event', id],
    queryFn: () => provider.getEventById(id),
    enabled: !!id,
  });
}

export function useJobs() {
  return useQuery<CampusJob[]>({
    queryKey: ['jobs'],
    queryFn: () => provider.getJobs(),
    staleTime: 1000 * 60 * 30,
  });
}

export function useJob(id: string) {
  return useQuery<CampusJob | undefined>({
    queryKey: ['job', id],
    queryFn: () => provider.getJobById(id),
    enabled: !!id,
  });
}

export function useOrganizations() {
  return useQuery<StudentOrg[]>({
    queryKey: ['organizations'],
    queryFn: () => provider.getOrganizations(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useOrganization(id: string) {
  return useQuery<StudentOrg | undefined>({
    queryKey: ['organization', id],
    queryFn: () => provider.getOrganizationById(id),
    enabled: !!id,
  });
}

export function useAlerts() {
  return useQuery<CampusAlert[]>({
    queryKey: ['alerts'],
    queryFn: () => provider.getAlerts(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useWeather() {
  return useQuery<WeatherData>({
    queryKey: ['weather'],
    queryFn: () => provider.getWeather(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 15, // Auto-refetch every 15 minutes
  });
}

export function useGlobalSearch(query: string) {
  return useQuery<SearchResult[]>({
    queryKey: ['search', query],
    queryFn: () => provider.globalSearch(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}

export function useMapCategories() {
  return provider.getMapCategories();
}

// Export the provider for direct access if needed
export { provider };
