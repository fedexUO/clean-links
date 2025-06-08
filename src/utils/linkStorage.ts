export interface LinkItem {
  id: string;
  name: string;
  url: string;
  description?: string;
  style: {
    borderColor: string;
    borderWidth: number;
    borderStyle: 'solid' | 'dashed' | 'dotted' | 'double';
    outline?: string; // Nuovo campo per gli outline
  };
}

export const loadLinks = (): LinkItem[] => {
  const saved = localStorage.getItem('userLinks');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing saved links:', error);
    }
  }
  return [];
};

export const saveLinks = (links: LinkItem[]): void => {
  localStorage.setItem('userLinks', JSON.stringify(links));
};
