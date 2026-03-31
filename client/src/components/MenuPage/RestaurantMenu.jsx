import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Loader2, Filter } from 'lucide-react'; 

const RestaurantMenu = () => {
    const { id } = useParams();
    const [menu, setMenu] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/restaurant/${id}/menu`);
                const data = await res.json();
                setMenu(data);
                setFilteredMenu(data);
                // Initialize quantities at 0
                const initialQtys = {};
                data.forEach(item => initialQtys[item.item_id] = 0);
                setQuantities(initialQtys);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchMenu();
    }, [id]);

    const handleFilter = (category) => {
        setActiveCategory(category);
        if (category === "All") setFilteredMenu(menu);
        else setFilteredMenu(menu.filter(item => item.category === category));
    };

    const updateQty = (id, delta) => {
        setQuantities(prev => ({ ...prev, [id]: Math.max(0, prev[id] + delta) }));
    };

    const addToCart = async (item) => {
    const quantity = quantities[item.item_id];
    
    try {
        const response = await fetch(`http://localhost:5000/api/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify({
                restaurant_id: id, 
                item_id: item.item_id,
                quantity: quantity
            })
        });

        if (response.ok) {
            alert("Item added to cart!");
        }
    } catch (err) {
        console.error("Cart error:", err);
    }
};
    const totalBill = Object.keys(quantities).reduce((sum, itemId) => {
        const item = menu.find(i => i.item_id === parseInt(itemId));
        return sum + (item ? item.price * quantities[itemId] : 0);
    }, 0);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="max-w-6xl mx-auto p-6 pb-32">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Order from Restaurant</h1>
                {/* Category Pills */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {["All", "Starter", "Main Course", "Dessert", "Beverage"].map(cat => (
                        <button key={cat} onClick={() => handleFilter(cat)}
                            className={`px-4 py-1 rounded-full text-sm font-medium border transition-colors ${activeCategory === cat ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenu.map((item) => (
                    <div key={item.item_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <img src={item.image_url} alt={item.name} className="h-48 w-full object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-1">
                                <h2 className="text-lg font-bold">{item.name}</h2>
                                <span className="text-orange-600 font-bold">${item.price}</span>
                            </div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">{item.category}</p>
                            
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl">
                                <button onClick={() => updateQty(item.item_id, -1)} className="p-2 hover:bg-white rounded-lg"><Minus size={18}/></button>
                                <span className="font-bold text-xl">{quantities[item.item_id]}</span>
                                <button onClick={() => updateQty(item.item_id, 1)} className="p-2 hover:bg-white rounded-lg text-orange-500"><Plus size={18}/></button>
                            </div>
                            <button
                                    onClick={() => addToCart(item)}
                                    className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors active:scale-95"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky Order Summary Bar */}
            {totalBill > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-black text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center animate-bounce-in">
                    <div>
                        <p className="text-gray-400 text-xs">Total Price</p>
                        <p className="text-2xl font-bold">${totalBill.toFixed(2)}</p>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95">
                        <ShoppingCart size={20} /> Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default RestaurantMenu;