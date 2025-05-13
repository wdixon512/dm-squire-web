import { createContext, ReactNode, useState } from 'react';

export const BackgroundImageContext = createContext({
  backgroundImageUrl: '',
  setBackgroundImageUrl: (url: string) => {},
});

// create a backgroundimagecontext
export const BackgroundImageContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');

  return (
    <BackgroundImageContext.Provider value={{ backgroundImageUrl, setBackgroundImageUrl }}>
      {children}
    </BackgroundImageContext.Provider>
  );
};
