import { Browser } from '@capacitor/browser';

// Common app and website patterns
const APP_PATTERNS: Record<string, string[]> = {
  youtube: ['youtube', 'yt'],
  spotify: ['spotify'],
  instagram: ['instagram', 'insta'],
  whatsapp: ['whatsapp', 'wa'],
  twitter: ['twitter', 'x.com'],
  facebook: ['facebook', 'fb'],
  linkedin: ['linkedin'],
  google: ['google'],
  gmail: ['gmail', 'email', 'mail'],
  maps: ['maps', 'directions', 'navigate'],
  chrome: ['chrome', 'browser'],
  camera: ['camera'],
  photos: ['photos', 'gallery'],
  settings: ['settings'],
  calculator: ['calculator'],
  calendar: ['calendar'],
  notes: ['notes'],
  music: ['music'],
  netflix: ['netflix'],
  amazon: ['amazon'],
  flipkart: ['flipkart'],
  github: ['github'],
};

// Website patterns with their URLs
const WEBSITE_URLS: Record<string, string> = {
  youtube: 'https://www.youtube.com',
  spotify: 'https://open.spotify.com',
  instagram: 'https://www.instagram.com',
  whatsapp: 'https://web.whatsapp.com',
  twitter: 'https://twitter.com',
  facebook: 'https://www.facebook.com',
  linkedin: 'https://www.linkedin.com',
  google: 'https://www.google.com',
  gmail: 'https://mail.google.com',
  maps: 'https://maps.google.com',
  github: 'https://github.com',
  netflix: 'https://www.netflix.com',
  amazon: 'https://www.amazon.in',
  flipkart: 'https://www.flipkart.com',
};

export interface DetectedAction {
  type: 'open_url' | 'open_app' | 'search' | 'none';
  target?: string;
  url?: string;
  searchQuery?: string;
}

export const detectAction = (text: string): DetectedAction => {
  const lowerText = text.toLowerCase();
  
  // Check for URL pattern in the text
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = lowerText.match(urlRegex);
  if (urlMatch) {
    return {
      type: 'open_url',
      url: urlMatch[0],
    };
  }

  // Check for "open" commands
  const openPatterns = [
    /open\s+(.+)/i,
    /(.+)\s+open\s+karo/i,
    /(.+)\s+kholo/i,
    /launch\s+(.+)/i,
    /start\s+(.+)/i,
    /go\s+to\s+(.+)/i,
  ];

  for (const pattern of openPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const target = match[1].trim();
      
      // Check if it matches any known app/website
      for (const [app, patterns] of Object.entries(APP_PATTERNS)) {
        if (patterns.some(p => target.includes(p))) {
          const url = WEBSITE_URLS[app];
          if (url) {
            return {
              type: 'open_url',
              target: app,
              url,
            };
          }
          return {
            type: 'open_app',
            target: app,
          };
        }
      }

      // Check if target looks like a website
      if (target.includes('.com') || target.includes('.in') || target.includes('.org') || target.includes('.net')) {
        const url = target.startsWith('http') ? target : `https://${target}`;
        return {
          type: 'open_url',
          url,
        };
      }

      // Default to Google search
      return {
        type: 'search',
        searchQuery: target,
        url: `https://www.google.com/search?q=${encodeURIComponent(target)}`,
      };
    }
  }

  // Check for search commands
  const searchPatterns = [
    /search\s+(?:for\s+)?(.+)/i,
    /(.+)\s+search\s+karo/i,
    /find\s+(.+)/i,
    /look\s+up\s+(.+)/i,
  ];

  for (const pattern of searchPatterns) {
    const match = lowerText.match(pattern);
    if (match) {
      const query = match[1].trim();
      return {
        type: 'search',
        searchQuery: query,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      };
    }
  }

  return { type: 'none' };
};

export const executeAction = async (action: DetectedAction): Promise<string> => {
  if (action.type === 'none') {
    return '';
  }

  try {
    if (action.type === 'open_url' || action.type === 'search') {
      const url = action.url!;
      
      // Try Capacitor Browser first (for mobile)
      try {
        await Browser.open({ url });
        if (action.type === 'search') {
          return `Sir, I've opened a Google search for "${action.searchQuery}".`;
        }
        return `Sir, I've opened ${action.target || url} for you.`;
      } catch {
        // Fallback to window.open for web
        window.open(url, '_blank');
        if (action.type === 'search') {
          return `Sir, I've opened a Google search for "${action.searchQuery}".`;
        }
        return `Sir, I've opened ${action.target || url} for you.`;
      }
    }

    if (action.type === 'open_app') {
      return `Sir, I'd love to open ${action.target} for you, but that requires the native mobile app. On the web, I can open websites. Would you like me to open ${action.target}'s website instead?`;
    }
  } catch (error) {
    console.error('Error executing action:', error);
    return `I apologize, Sir. I encountered an issue trying to open that. Please try again.`;
  }

  return '';
};
