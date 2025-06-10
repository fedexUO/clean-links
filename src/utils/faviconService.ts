
export const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    // Usa Google's favicon service come fallback
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    // Se l'URL non è valido, ritorna un'icona di default
    return `https://www.google.com/s2/favicons?domain=example.com&sz=32`;
  }
};

export const getHighQualityFavicon = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    // Prova prima con il favicon diretto del sito
    return `https://${domain}/favicon.ico`;
  } catch (error) {
    return getFaviconUrl(url);
  }
};
