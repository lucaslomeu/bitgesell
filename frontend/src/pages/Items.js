import React, { useCallback, useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import '../styles/Items.css';

const ROW_HEIGHT = 35;

function Items() {
  const { items, fetchItems, total, isLoading } = useData();

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


  // Row renderer for react-window
  const Row = useCallback(({ index, style, data }) => {
    const item = data[index];
    return (
      <div style={style} key={item.id} className="list-item">
        <Link to={`/items/${item.id}`} className="item-link-detail">
          <span className="item-name">{item.name}</span>{' '}
          <span className="item-category">({item.category})</span>{' '}
          <span className="item-price">{item.price}$</span>
        </Link>
      </div>
    );
  }, []);

  return (
    <div className="items-container">
      <label htmlFor="search" className="sr-only">Search items</label>
      <input
        id="search"
        type="text"
        placeholder="Search items..."
        className="search-input"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        aria-label="Search items"
      />

      {/* Skeleton Loader */}
      {isLoading ? (
        <div className="skeleton-list">
          {[...Array(limit)].map((_, i) => (
            <div className="skeleton-item" key={i}></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p>No items found for “{search}”.</p>
      ) : (
        <div role="list" aria-label="Items list">
          <List
            height={ROW_HEIGHT * limit}
            itemCount={items.length}
            itemSize={ROW_HEIGHT}
            width="100%"
            itemData={items}
          >
            {Row}
          </List>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} aria-label="Previous page">
          Previous
        </button>
        <span>Page {page}</span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(p => p + 1)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Items;