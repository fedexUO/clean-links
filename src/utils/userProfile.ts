
export interface UserProfile {
  id: string;
  username: string;
  avatar: number; // 1-5 per le 5 immagini predefinite
  customAvatar?: string; // URL dell'immagine personalizzata
  level: 'bronzo' | 'argento' | 'oro' | 'diamante';
  xp: number;
  createdAt: string;
  lastLoginDate: string;
  consecutiveLogins: number;
  stats: {
    linksCreated: number;
    stylesModified: number;
    linksWithDescription: number;
    uniqueBorderColors: string[];
  };
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: 'links' | 'login' | 'style' | 'description' | 'colors';
  target: number;
  reward: number; // XP reward
  completed: boolean;
  progress: number;
}

const STORAGE_KEY_PROFILE = 'user-profile';
const STORAGE_KEY_MISSIONS = 'user-missions';

// XP richiesti per ogni livello
export const LEVEL_REQUIREMENTS = {
  bronzo: 0,
  argento: 100,
  oro: 300,
  diamante: 600,
};

// Missioni predefinite
export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: 'first-collector',
    name: 'Primo Collezionista',
    description: 'Aggiungi 5 siti diversi',
    type: 'links',
    target: 5,
    reward: 50,
    completed: false,
    progress: 0,
  },
  {
    id: 'loyal-visitor',
    name: 'Fedele Visitatore',
    description: 'Accedi per 5 giorni consecutivi',
    type: 'login',
    target: 5,
    reward: 75,
    completed: false,
    progress: 0,
  },
  {
    id: 'style-master',
    name: 'Personalizzatore',
    description: 'Modifica lo stile di 3 link diversi',
    type: 'style',
    target: 3,
    reward: 40,
    completed: false,
    progress: 0,
  },
  {
    id: 'organizer',
    name: 'Organizzatore',
    description: 'Crea 10 link con descrizioni',
    type: 'description',
    target: 10,
    reward: 60,
    completed: false,
    progress: 0,
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Usa 5 colori di bordo diversi',
    type: 'colors',
    target: 5,
    reward: 45,
    completed: false,
    progress: 0,
  },
];

export const createDefaultProfile = (): UserProfile => ({
  id: Date.now().toString(),
  username: 'Utente',
  avatar: 1,
  level: 'bronzo',
  xp: 0,
  createdAt: new Date().toISOString(),
  lastLoginDate: new Date().toISOString(),
  consecutiveLogins: 1,
  stats: {
    linksCreated: 0,
    stylesModified: 0,
    linksWithDescription: 0,
    uniqueBorderColors: [],
  },
});

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

export const loadUserProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (stored) {
      const profile = JSON.parse(stored);
      // Aggiorna login consecutivi
      const today = new Date().toDateString();
      const lastLogin = new Date(profile.lastLoginDate).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin === today) {
        // Stesso giorno, non fare nulla
      } else if (lastLogin === yesterday.toDateString()) {
        // Giorno consecutivo
        profile.consecutiveLogins += 1;
        profile.lastLoginDate = new Date().toISOString();
      } else {
        // Reset streak
        profile.consecutiveLogins = 1;
        profile.lastLoginDate = new Date().toISOString();
      }
      
      saveUserProfile(profile);
      return profile;
    }
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
  
  const defaultProfile = createDefaultProfile();
  saveUserProfile(defaultProfile);
  return defaultProfile;
};

export const saveMissions = (missions: Mission[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_MISSIONS, JSON.stringify(missions));
  } catch (error) {
    console.error('Error saving missions:', error);
  }
};

export const loadMissions = (): Mission[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_MISSIONS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading missions:', error);
  }
  
  saveMissions(DEFAULT_MISSIONS);
  return [...DEFAULT_MISSIONS];
};

export const calculateLevel = (xp: number): UserProfile['level'] => {
  if (xp >= LEVEL_REQUIREMENTS.diamante) return 'diamante';
  if (xp >= LEVEL_REQUIREMENTS.oro) return 'oro';
  if (xp >= LEVEL_REQUIREMENTS.argento) return 'argento';
  return 'bronzo';
};

export const getNextLevelXP = (currentLevel: UserProfile['level']): number => {
  switch (currentLevel) {
    case 'bronzo': return LEVEL_REQUIREMENTS.argento;
    case 'argento': return LEVEL_REQUIREMENTS.oro;
    case 'oro': return LEVEL_REQUIREMENTS.diamante;
    case 'diamante': return LEVEL_REQUIREMENTS.diamante;
    default: return LEVEL_REQUIREMENTS.argento;
  }
};
