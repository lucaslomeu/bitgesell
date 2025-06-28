import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems, total } = useData();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    let isMounted = true;

    // Wrap fetchItems in a function to handle async safely if the component unmounts
    const safeFetchItems = async () => {
      try {
        const fetchedItems = await fetchItems({ q: search, page, limit });
        if (!isMounted) return

      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch items:', error);
        }
      }
    };

    safeFetchItems();


    return () => {
      isMounted = false;
    };
  }, [fetchItems, search, page]);

  if (!items.length) return <p>Loading...</p>;

  return (
    <div>
      <input
        placeholder="Search item..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <ul>
        {items.map(item => (
          <li key={item.id}>
            <Link to={`/items/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>

      <div>
        Página {page} de {total}
        <br />
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Anterior
        </button>
        <button disabled={page === total} onClick={() => setPage(p => p + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Items;