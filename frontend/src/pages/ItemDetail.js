import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/items/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setItem(data))
      .catch(() => setItem(undefined))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (item === undefined) return <p className="error">Item not found.</p>;

  return (
    <div className="item-detail-container">
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default ItemDetail;
