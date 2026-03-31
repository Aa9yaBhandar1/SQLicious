import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../../utils/tokenUtils';
import { useParams , Link} from 'react-router-dom';
import { Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react'; // Optional: install lucide-react for icons

const RestaurantMenu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({}); // Track quantity per item ID

    const user = getUserFromToken();
    const { id } = useParams();

    const fetchMenu = async () => {
        if (!id) return;
        try {
            const res = await fetch(`http://localhost:5000/api/restaurant/${id}/menu`);
            const data = await res.json();
            setMenu(data);
            // Initialize quantities for each item
            const initialQtys = {};
            data.forEach(item => initialQtys[item.item_id] = 1);
            setQuantities(initialQtys);
        } catch (err) {
            console.error("Failed to fetch menu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchMenu();
    }, [id]);

    const handleQuantityChange = (itemId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
        }));
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

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <p className="text-gray-600 italic">Please log in to view the menu.</p>
            <Link to="/sign-in" className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold">Login</Link>
        </div>
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-orange-500">
            <Loader2 className="animate-spin w-10 h-10" />
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-800">Restaurant Menu</h1>
                <p className="text-gray-500">Fresh ingredients, delivered fast.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menu.length > 0 ? (
                    menu.map((item) => (
                        <div key={item.item_id} className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                            {/* Placeholder for Food Image */}
                            <div className="h-40 bg-gray-200 w-full overflow-hidden">
                                <img 
                                    src={`https://source.unsplash.com/400x300/?${item.name.replace(/\s/g, '')},food`} 
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>
                            
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Our signature {item.name.toLowerCase()} prepared with premium ingredients.</p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-black text-gray-900">${item.price}</span>
                                    
                                    {/* Quantity Selector */}
                                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                        <button 
                                            onClick={() => handleQuantityChange(item.item_id, -1)}
                                            className="p-1 hover:bg-white rounded-md transition-colors"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="mx-3 font-semibold w-4 text-center">{quantities[item.item_id]}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(item.item_id, 1)}
                                            className="p-1 hover:bg-white rounded-md transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full mt-6 bg-orange-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors active:scale-95"
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-gray-400 font-medium">
                        No items found in this menu.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantMenu;