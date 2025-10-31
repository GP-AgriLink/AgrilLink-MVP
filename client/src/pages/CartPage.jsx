import { useState, useEffect, useMemo } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import CartBanner from '../components/cart/CartBanner';
import CartSummary from '../components/cart/CartSummary';
import ContactForm from '../components/cart/ContactForm'; 

// Mock data (if localStorage is empty)
const MOCK_CART_DATA = [
  { id: 1, name: 'Pressed Apple Cider', qty: 1, unit: '64OZ', price: 11.00, productId: 'prod_abc' },
  { id: 2, name: 'Peach Preserves', qty: 1, unit: 'JAR', price: 8.50, productId: 'prod_xyz' },
  { id: 3, name: 'Honeycrisp Apples', qty: 1, unit: 'LB', price: 3.99, productId: 'prod_123' },
];

const MOCK_FARM_DATA = {
  _id: "671a...", 
  name: "Agrilink Corp"
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [farmData, setFarmData] = useState({});
  const navigate = useNavigate(); // For redirecting after success

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const items = storedCart ? JSON.parse(storedCart) : MOCK_CART_DATA;
    setCartItems(items);
    setFarmData(MOCK_FARM_DATA);
    if (!storedCart) {
      localStorage.setItem('cart', JSON.stringify(MOCK_CART_DATA));
    }
  }, []);

  const updateCart = (newCartItems) => {
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  };

  const [totalDue, totalItems] = useMemo(() => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const count = cartItems.reduce((acc, item) => acc + item.qty, 0);
    return [total, count];
  }, [cartItems]);

  const handleIncreaseQty = (itemId) => {
    const newCartItems = cartItems.map(item => 
      item.id === itemId ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(newCartItems);
  };

  const handleDecreaseQty = (itemId) => {
    const itemToDecrease = cartItems.find(item => item.id === itemId);
    let newCartItems;
    if (itemToDecrease.qty > 1) {
      newCartItems = cartItems.map(item => 
        item.id === itemId ? { ...item, qty: item.qty - 1 } : item
      );
    } else {
      newCartItems = cartItems.filter(item => item.id !== itemId);
    }
    updateCart(newCartItems);
  };

  const handleClearCart = () => {
    updateCart([]);
  };

  // 6. New function to handle the order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format cart items to match the API requirements
    const orderItems = cartItems.map(item => ({
      productId: item.productId || item.id, // Use productId if available, fallback to id
      name: item.name,
      quantity: item.qty,
      unitPrice: item.price
    }));

    // Build the final order object
    const orderData = {
      farmerId: farmData._id,
      customerName: fullName,
      customerPhone: phoneNumber,
      orderItems: orderItems
    };

    console.log('Sending Order:', orderData);

    try {
      // The actual API call
      const response = await axios.post('/api/orders', orderData);
      
      console.log('Order confirmed:', response.data);
      alert('Order Confirmed!');
      
      // Clear cart and redirect
      updateCart([]); // Empty the cart
      // (You might want to redirect to a "Thank You" page)
      // navigate('/order-success'); 

    } catch (err) {
      console.error(err);
      // Handle out-of-stock errors
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <CartBanner 
          totalDue={totalDue} 
          farmName={farmData.name} 
        />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <CartSummary 
              items={cartItems} 
              total={totalDue}
              itemCount={totalItems}
              onIncrease={handleIncreaseQty}
              onDecrease={handleDecreaseQty}
              onClearAll={handleClearCart}
            />
          </div>
          
          <div className="lg:col-span-1 h-fit">
            <ContactForm
              fullName={fullName}
              setFullName={setFullName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onSubmit={handleSubmitOrder}
              loading={loading}
            />
          </div>

        </div>
      </div>
    </div>
  );
}