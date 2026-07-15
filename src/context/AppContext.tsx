import { createContext, useContext, useReducer } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Tab = 'home' | 'explore' | 'map' | 'lumi' | 'profile';

interface AppState {
  activeTab: Tab;
  theme: ThemeMode;
  isDark: boolean;
  user: {
    name: string;
    email: string;
    isGuest: boolean;
    avatar?: string;
  } | null;
  savedJobs: string[];
  savedEvents: string[];
  favoriteDining: string[];
  favoriteOrgs: string[];
  dismissedAlerts: string[];
  notifications: boolean;
  textSize: 'normal' | 'large' | 'extra-large';
  selectedBuildingId: string | null;
  selectedDiningId: string | null;
  selectedEventId: string | null;
  selectedJobId: string | null;
  selectedOrgId: string | null;
  mapCategoryFilter: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
}

type Action =
  | { type: 'SET_TAB'; tab: Tab }
  | { type: 'SET_THEME'; theme: ThemeMode }
  | { type: 'SET_DARK'; isDark: boolean }
  | { type: 'SET_USER'; user: AppState['user'] }
  | { type: 'SIGN_OUT' }
  | { type: 'TOGGLE_SAVE_JOB'; jobId: string }
  | { type: 'TOGGLE_SAVE_EVENT'; eventId: string }
  | { type: 'TOGGLE_FAVORITE_DINING'; venueId: string }
  | { type: 'TOGGLE_FAVORITE_ORG'; orgId: string }
  | { type: 'DISMISS_ALERT'; alertId: string }
  | { type: 'SET_NOTIFICATIONS'; enabled: boolean }
  | { type: 'SET_TEXT_SIZE'; size: AppState['textSize'] }
  | { type: 'SELECT_BUILDING'; id: string | null }
  | { type: 'SELECT_DINING'; id: string | null }
  | { type: 'SELECT_EVENT'; id: string | null }
  | { type: 'SELECT_JOB'; id: string | null }
  | { type: 'SELECT_ORG'; id: string | null }
  | { type: 'SET_MAP_FILTER'; category: string | null }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'OPEN_SEARCH' }
  | { type: 'CLOSE_SEARCH' };

const initialState: AppState = {
  activeTab: 'home',
  theme: 'system',
  isDark: false,
  user: null,
  savedJobs: [],
  savedEvents: [],
  favoriteDining: [],
  favoriteOrgs: [],
  dismissedAlerts: [],
  notifications: true,
  textSize: 'normal',
  selectedBuildingId: null,
  selectedDiningId: null,
  selectedEventId: null,
  selectedJobId: null,
  selectedOrgId: null,
  mapCategoryFilter: null,
  searchQuery: '',
  isSearchOpen: false,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_DARK':
      return { ...state, isDark: action.isDark };
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SIGN_OUT':
      return { ...state, user: null, savedJobs: [], savedEvents: [], favoriteDining: [], favoriteOrgs: [] };
    case 'TOGGLE_SAVE_JOB':
      return {
        ...state,
        savedJobs: state.savedJobs.includes(action.jobId)
          ? state.savedJobs.filter(id => id !== action.jobId)
          : [...state.savedJobs, action.jobId],
      };
    case 'TOGGLE_SAVE_EVENT':
      return {
        ...state,
        savedEvents: state.savedEvents.includes(action.eventId)
          ? state.savedEvents.filter(id => id !== action.eventId)
          : [...state.savedEvents, action.eventId],
      };
    case 'TOGGLE_FAVORITE_DINING':
      return {
        ...state,
        favoriteDining: state.favoriteDining.includes(action.venueId)
          ? state.favoriteDining.filter(id => id !== action.venueId)
          : [...state.favoriteDining, action.venueId],
      };
    case 'TOGGLE_FAVORITE_ORG':
      return {
        ...state,
        favoriteOrgs: state.favoriteOrgs.includes(action.orgId)
          ? state.favoriteOrgs.filter(id => id !== action.orgId)
          : [...state.favoriteOrgs, action.orgId],
      };
    case 'DISMISS_ALERT':
      return { ...state, dismissedAlerts: [...state.dismissedAlerts, action.alertId] };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.enabled };
    case 'SET_TEXT_SIZE':
      return { ...state, textSize: action.size };
    case 'SELECT_BUILDING':
      return { ...state, selectedBuildingId: action.id };
    case 'SELECT_DINING':
      return { ...state, selectedDiningId: action.id };
    case 'SELECT_EVENT':
      return { ...state, selectedEventId: action.id };
    case 'SELECT_JOB':
      return { ...state, selectedJobId: action.id };
    case 'SELECT_ORG':
      return { ...state, selectedOrgId: action.id };
    case 'SET_MAP_FILTER':
      return { ...state, mapCategoryFilter: action.category };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'OPEN_SEARCH':
      return { ...state, isSearchOpen: true };
    case 'CLOSE_SEARCH':
      return { ...state, isSearchOpen: false, searchQuery: '' };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// Convenience hooks
export function useSavedState() {
  const { state } = useApp();
  return {
    isJobSaved: (id: string) => state.savedJobs.includes(id),
    isEventSaved: (id: string) => state.savedEvents.includes(id),
    isDiningFav: (id: string) => state.favoriteDining.includes(id),
    isOrgFav: (id: string) => state.favoriteOrgs.includes(id),
  };
}
