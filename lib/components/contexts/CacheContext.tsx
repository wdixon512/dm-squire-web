'use client';
import React, { createContext, useContext, useRef } from 'react';

interface CacheContextType {
  cacheLoad: <T>(key: string, loadFunction: () => T) => T;
  cacheLoadAsync: <T>(key: string, loadFunction: () => Promise<T>) => Promise<T>;
  getCacheValue: <T>(key: string) => T | undefined;
  setCacheValue: <T>(key: string, value: T) => void;
  clearCache: (key: string) => void;
  clearAllCaches: () => void;
}

// Create the context
const CacheContext = createContext<CacheContextType | null>(null);

// Provider component
export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cacheRef = useRef<Map<string, any>>(new Map());

  const cacheLoad = <T,>(key: string, loadFunction: () => T): T => {
    if (cacheRef.current.has(key)) {
      return cacheRef.current.get(key);
    }

    const value = loadFunction();
    cacheRef.current.set(key, value);
    return value;
  };

  const cacheLoadAsync = async <T,>(key: string, loadFunction: () => Promise<T>): Promise<T> => {
    // Check if the value is already cached
    const cachedValue = getCacheValue<T | Promise<T>>(key);

    if (cachedValue) {
      // This prevents the cache from being called/updated multiple times when the same key is requested concurrently
      if (cachedValue instanceof Promise) {
        return cachedValue; // Return in-flight promise
      }

      return cachedValue; // Return resolved value
    }

    // No cache hit; call the loadFunction and store the Promise in the cache
    const promise = loadFunction();
    cacheRef.current.set(key, promise);

    try {
      const value = await promise;
      setCacheValue(key, value); // Store resolved value in cache
      return value;
    } catch (error) {
      clearCache(key); // Clear cache on error
      throw error;
    }
  };

  const getCacheValue = <T,>(key: string): T | undefined => {
    return cacheRef.current.get(key);
  };

  const setCacheValue = <T,>(key: string, value: T): void => {
    cacheRef.current.set(key, value);
  };

  const clearCache = (key: string): void => {
    cacheRef.current.delete(key);
  };

  const clearAllCaches = (): void => {
    cacheRef.current.clear();
  };

  return (
    <CacheContext.Provider
      value={{ cacheLoad, cacheLoadAsync, getCacheValue, setCacheValue, clearCache, clearAllCaches }}
    >
      {children}
    </CacheContext.Provider>
  );
};

// Hook for using the cache context
export const useClientCache = (): CacheContextType => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useClientCache must be used within a CacheProvider');
  }
  return context;
};
