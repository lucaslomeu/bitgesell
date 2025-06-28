import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchItems = useCallback(async ({ q = '', page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ q, page, limit });
    const res = await fetch(`http://localhost:3001/api/items?${params.toString()}`);
    const json = await res.json();

    setItems(json.items || []);
    setTotal(json.total || 0);

    return json;
  }, []);

  return (
    <DataContext.Provider value={{ items, total, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);