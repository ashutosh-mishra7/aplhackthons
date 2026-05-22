// JanMitra AI Global Design System Color & Style Tokens

export const theme = {
  colors: {
    dark: {
      bg: '#090d16',
      card: 'rgba(15, 23, 42, 0.65)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
    },
    light: {
      bg: '#f8fafc',
      card: 'rgba(255, 255, 255, 0.75)',
      cardBorder: 'rgba(15, 23, 42, 0.08)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
    },
    accents: {
      indigo: '#6366f1',
      cyan: '#06b6d4',
      violet: '#8b5cf6',
      emerald: '#10b981',
      rose: '#f43f5e',
      amber: '#f59e0b',
    }
  },
  gradients: {
    hero: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
    cyanViolet: 'linear-gradient(to right, #06b6d4, #8b5cf6)',
    indigoCyan: 'linear-gradient(to right, #6366f1, #06b6d4)',
    roseAmber: 'linear-gradient(to right, #f43f5e, #f59e0b)',
    darkBg: 'radial-gradient(circle at top, #1e1b4b 0%, #090d16 100%)',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glowCyan: '0 0 15px rgba(6, 182, 212, 0.35)',
    glowIndigo: '0 0 15px rgba(99, 102, 241, 0.35)',
    glowRose: '0 0 15px rgba(244, 63, 94, 0.35)',
  },
  typography: {
    fontSans: '"Inter", sans-serif',
    fontDisplay: '"Space Grotesk", "Satoshi", sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    }
  }
};
