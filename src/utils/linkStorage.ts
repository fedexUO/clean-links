
export interface LinkItem {
  id: string;
  name: string;
  url: string;
  description?: string;
  style: {
    borderColor: string;
    borderWidth: number;
    borderStyle: 'solid' | 'dashed' | 'dotted' | 'double';
  };
}

const STORAGE_KEY = 'personal-links';

export const saveLinks = (links: LinkItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (error) {
    console.error('Error saving links:', error);
  }
};

export const loadLinks = (): LinkItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading links:', error);
  }
  
  // Return default example links if nothing is stored
  return [
    {
      id: '1',
      name: 'Google',
      url: 'https://google.com',
      description: 'Motore di ricerca',
      style: {
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderStyle: 'solid',
      },
    },
    {
      id: '2',
      name: 'GitHub',
      url: 'https://github.com',
      description: 'Repository codice',
      style: {
        borderColor: '#10b981',
        borderWidth: 1,
        borderStyle: 'dashed',
      },
    },
  ];
};
