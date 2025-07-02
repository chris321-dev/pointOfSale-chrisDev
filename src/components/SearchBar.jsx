// src/components/SearchBar.jsx
import React, { useState, useRef } from 'react';
import Fuse from 'fuse.js';
import styles from '../styles/SearchBar.module.css';
import { products } from '../data/products';

export default function SearchBar({ onAdd }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const fuse = new Fuse(products, {
    keys: ['name', 'category', 'size', 'barcode'],
    threshold: 0.3,
  });

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 0) {
      const results = fuse.search(val).slice(0, 5);
      setSuggestions(results.map(r => r.item));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (product) => {
    onAdd(product);
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search by name, size, category, or scan barcode..."
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestionList}>
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => handleSelect(item)}>
              {item.name} - {item.size} - #{item.price.toLocaleString('en-NG')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
