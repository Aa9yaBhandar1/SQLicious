import React, { useEffect, useState } from 'react';
import { getUserFromToken } from '../../utils/tokenUtils';
import { useParams } from 'react-router-dom';

const RestaurantMenu = () => {
    const [menu, setMenu] = useState([]); 
    const [loading, setLoading] = useState(true);

    const user = getUserFromToken();
    const { id } = useParams(); 

    const fetchMenu = async () => {
        if (!id) return;
        
        try {
            const res = await fetch(
                `http://localhost:5000/api/restaurant/${id}/menu`
            );
            const data = await res.json();
            setMenu(data);
        } catch (err) {
            console.error("Failed to fetch menu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMenu();
        }
    }, [id]); 

    if (!user) return <div>Please log in to view the menu.</div>;
    if (loading && !menu.length) return <div>Loading menu...</div>;

    return (
        <>
            <div className="text-xl font-bold p-4">Restaurant Menu</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {menu.length > 0 ? (
                    menu.map((item) => (
                        <div key={item.item_id} className="bg-white shadow p-4 rounded">
                            <h2 className="font-semibold">{item.name}</h2>
                            <p className="text-gray-500">{item.category}</p>
                            <p className="text-green-600 font-semibold">${item.price}</p>
                            <button
                                onClick={() => deleteItem(item.item_id)}
                                className="text-red-500 mt-2"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No items found in your menu.</p>
                )}
            </div>
        </>
    );
};

export default RestaurantMenu;