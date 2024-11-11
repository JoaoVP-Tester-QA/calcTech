// src/context/CategoryContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface CategoryContextType {
  selectedCategory: string | null;
  selectedMethod: string | null;
  setCategoryAndMethod: (category: string, name: string) => void;
  clearCategory: () => void;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('selectedMethod');
    if (storedData) {
      const { category, name } = JSON.parse(storedData);
      setSelectedCategory(category);
      setSelectedMethod(name);
    }
  }, []);

  const setCategoryAndMethod = (category: string, name: string) => {
    setSelectedCategory(category);
    setSelectedMethod(name);
    localStorage.setItem('selectedMethod', JSON.stringify({ category, name }));
  };

  const clearCategory = () => {
    setSelectedCategory(null);
    setSelectedMethod(null);
    localStorage.removeItem('selectedMethod');
  };

  return (
    <CategoryContext.Provider value={{ selectedCategory, selectedMethod, setCategoryAndMethod, clearCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
