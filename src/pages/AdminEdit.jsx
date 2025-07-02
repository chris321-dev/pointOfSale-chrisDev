import React, { useState, useRef } from 'react';
import { products as initialData } from '../data/products';
// import styles from '../styles/AdminEdit.module.css';

const ADMIN_PASS = 'admin123';

export default function AdminEdit() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [data, setData] = useState(initialData);
  const fileInputRef = useRef(null);

  const handleChange = (id, key, value) => {
    setData(prev => prev.map(p => p.id === id ? { ...p, [key]: value } : p));
  };

  const handleRemove = (id) => {
    setData(prev => prev.filter(p => p.id !== id));
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setData(imported);
        } else {
          alert('Invalid file format.');
        }
      } catch (err) {
        alert('Error reading file.');
      }
    };
    reader.readAsText(file);
  };

  if (!auth) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Enter Admin Password</h2>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button onClick={() => setAuth(pass === ADMIN_PASS)}>Enter</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edit Products</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleDownload}>Download Product List</button>
        <button onClick={() => fileInputRef.current.click()}>Upload Product List</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="application/json"
          onChange={handleUpload}
        />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Category</th>
            <th>Price</th>
            <th>Barcode</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id}>
              <td><input value={p.name} onChange={(e) => handleChange(p.id, 'name', e.target.value)} /></td>
              <td><input value={p.size} onChange={(e) => handleChange(p.id, 'size', e.target.value)} /></td>
              <td><input value={p.category} onChange={(e) => handleChange(p.id, 'category', e.target.value)} /></td>
              <td><input type="number" value={p.price} onChange={(e) => handleChange(p.id, 'price', +e.target.value)} /></td>
              <td><input value={p.barcode} onChange={(e) => handleChange(p.id, 'barcode', e.target.value)} /></td>
              <td><button onClick={() => handleRemove(p.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
