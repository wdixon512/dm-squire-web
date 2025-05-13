'use client';
import useLocalStorage from '@lib/hooks/useLocalStorage';
import { createContext, ReactNode } from 'react';

export const BackgroundImageContext = createContext({
  backgroundImageUrl: '',
  setBackgroundImageUrl: (url: string) => {},
});

export const BackgroundImageContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useLocalStorage<string>(
    'backgroundImageUrl',
    '/static/images/backgrounds/demon-in-hell.jpg'
  );

  return (
    <BackgroundImageContext.Provider value={{ backgroundImageUrl, setBackgroundImageUrl }}>
      {children}
    </BackgroundImageContext.Provider>
  );
};
