'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  isAuthenticated: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  logout: () => void;
  login: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is authenticated from sessionStorage (expires when browser closes)
    // This ensures users must always enter the access code when they visit the site
    const auth = sessionStorage.getItem('militaryAuth') === 'true';
    setIsAuthenticated(auth);
    
    // Get saved language preference
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('militaryAuth');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('militaryAuth', 'true');
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        language,
        setLanguage: handleLanguageChange,
        logout: handleLogout,
        login: handleLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    // Return default values for SSR/prerendering
    return {
      isAuthenticated: false,
      language: 'en',
      setLanguage: () => {},
      logout: () => {},
      login: () => {},
    };
  }
  return context;
}
