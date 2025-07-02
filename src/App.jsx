import React, { useState } from 'react';
import AuthGate from './components/AuthGate';
import SearchBar from './components/SearchBar';
import styles from './styles/App.module.css';

function App() {
  const formatCurrency = (amount) => `#${amount.toLocaleString('en-NG')}`;

  const [cart, setCart] = useState([]);
  const [pendingLists, setPendingLists] = useState([]);
  const [showPending, setShowPending] = useState(false);

  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const changeQuantity = (id, delta) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleAddToPending = () => {
    if (cart.length > 0) {
      setPendingLists(prev => [...prev, cart]);
      setCart([]);
    }
  };

  const handleMoveToList = (index) => {
    const selectedList = pendingLists[index];
    setCart(selectedList);
    setPendingLists(pendingLists.filter((_, i) => i !== index));
  };

  return (
    <AuthGate>
      <div className={styles.appContainer}>
        <h1 className={styles.title}>📋 Price List</h1>

        <div className={styles.topBar}>
          <SearchBar onAdd={addToCart} />
        </div>

        <div className={styles.cartList}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <span>{item.name}</span>
              <span>{item.size}</span>
              <span>{item.category}</span>
              <span>
                <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                {item.quantity}
                <button onClick={() => changeQuantity(item.id, 1)}>+</button>
              </span>
              <span>{formatCurrency(item.price)}</span>
              <button onClick={() => removeFromCart(item.id)}>x</button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <p>Total Items: {totalItems}</p>
          <p>Total Price: {formatCurrency(totalPrice)}</p>
          <div className={styles.summaryButtons}>
            <button onClick={() => setCart([])}>New List</button>
            <button onClick={handleAddToPending}>Add to Pending</button>
            <button onClick={() => setShowPending(!showPending)}>Pending List</button>
          </div>
        </div>

        {showPending && (
          <div className={styles.pendingSection}>
            <h3>🕓 Pending Lists</h3>
            {pendingLists.length === 0 ? (
              <p>No pending lists.</p>
            ) : (
              pendingLists.map((list, index) => {
                const totalQty = list.reduce((sum, item) => sum + item.quantity, 0);
                const totalAmt = list.reduce((sum, item) => sum + item.price * item.quantity, 0);

                return (
                  <div key={index} className={styles.pendingList}>
                    <h4>Pending List {index + 1}</h4>
                    {list.map(item => (
                      <div key={item.id} className={styles.pendingItem}>
                        <span>{item.name} |</span>
                        <span>{item.size} |</span>
                        <span>{item.quantity} |</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                    <div className={styles.pendingSummary}>
                      <p>Total Items: {totalQty}</p>
                      <p>Total Price: {formatCurrency(totalAmt)}</p>
                      <div className={styles.pendingButtons}>
                        <button onClick={() => handleMoveToList(index)}>Move to List</button>
                        <button onClick={() => {
                          setPendingLists(pendingLists.filter((_, i) => i !== index));
                        }}>X</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </AuthGate>
  );
}

export default App;
