import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = useCallback(async ({ q = '', page = 1, limit = 20 } = {}) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ q, page, limit });
      const res = await fetch(`http://localhost:3001/api/items?${params.toString()}`);
      const json = await res.json();

      setItems(json.items);
      setTotal(json.total);
    } catch (error) {
      console.error('Fetch error:', err);
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }

  }, []);

  return (
    <DataContext.Provider value={{ items, total, fetchItems, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);