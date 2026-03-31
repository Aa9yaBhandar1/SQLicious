import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

const fetchCart = async () => {
    try {
        const res = await fetch('http://localhost:5000/api/cart', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data && Array.isArray(data.user)) {
            setCartItems(data.user); 
        }        
         else {
            setCartItems([]);
        }
    } catch (err) {
        console.error("Error fetching cart:", err);
        setCartItems([]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => { fetchCart(); }, []);

    const handleRemoveItem = async (cartItemId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/cart/delete/${cartItemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (res.ok) {
            setCartItems(prev => prev.filter(item => item.cart_item_id !== cartItemId));
        }
    } catch (err) {
        console.error("Failed to remove item:", err);
    }
};


    const totalOrder = Array.isArray(cartItems) 
        ? cartItems.reduce((acc, item) => {
            const itemTotal = parseFloat(item.subtotal) || 0;
            return acc + itemTotal;
        }, 0) 
        : 0;
    if (loading) return <div className="p-10 text-center text-gray-500">Loading your delicious choices...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <ShoppingBag className="text-orange-500" /> Your Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500 text-lg">Your cart is empty. Time to eat!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.cart_item_id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
                            <div>
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-gray-500 text-sm">{item.category} • ${item.price} each</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="font-semibold text-gray-700">Qty: {item.quantity}</span>
                                <span className="font-bold text-orange-600 w-20 text-right">${item.subtotal}</span>
                                <button onClick={() => handleRemoveItem(item.cart_item_id)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Order Summary */}
                    <div className="mt-10 border-t pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-medium text-gray-600">Total Amount</span>
                            <span className="text-3xl font-black text-gray-900">${totalOrder.toFixed(2)}</span>
                        </div>
                        <button 
                            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                            onClick={() => {/* Trigger Checkout Logic */}}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;