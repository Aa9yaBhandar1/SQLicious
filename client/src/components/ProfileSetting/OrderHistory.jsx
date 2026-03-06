const OrderHistory = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
    <div className="grid gap-4">
      {/* API DATA: orders.map(...) */}
      {[1, 2].map((i) => (
        <div key={i} className="p-5 border border-gray-100 rounded-2xl flex justify-between items-center hover:bg-gray-50 transition">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🍕</div>
            <div>
              <p className="font-bold text-gray-800">SQLicious Pizza Combo</p>
              <p className="text-sm text-gray-400">March 3, 2026 • $24.00</p>
            </div>
          </div>
          <button className="text-sm font-bold text-[#FF7F11] bg-orange-50 px-4 py-2 rounded-lg hover:bg-[#FF7F11] hover:text-white transition">Reorder</button>
        </div>
      ))}
    </div>
  </div>
);
export default OrderHistory;