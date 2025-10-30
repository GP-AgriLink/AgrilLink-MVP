// client/components/OrderCard.jsx

const OrderCard = ({ order }) => {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-green-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 font-medium">
                        Order #{order.id}
                    </p>
                    <span className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-md font-semibold">
                        Total ${order.total.toFixed(2)}
                    </span>
                </div>

                <h3 className="font-semibold text-left text-lg text-gray-800 mb-1">
                    Incoming order
                </h3>
                <p className="text-gray-700 font-medium pb-2">{order.customer}</p>
                <p className="text-sm text-gray-500 mb-4">{order.phone}</p>

                {/* Items */}
                <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-100">
                    <p className="text-sm font-semibold text-left text-gray-700 mb-2 tracking-wide">
                        Items
                    </p>
                    {order.items.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between text-sm text-gray-600 py-1"
                        >
                            <span>
                                {item.qty} × {item.name}
                            </span>
                            <span>${item.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <button className="w-full bg-white text-[#0EB17C] py-2.5 rounded-lg font-semibold border border-[#0EB17C] shadow-md hover:bg-[#0cc78a] hover:text-white transition">
                    Complete
                </button>
                <button className="w-full bg-[#13C191] text-white py-2.5 rounded-lg font-semibold border border-[#15d79f] shadow-md hover:bg-white hover:text-[#15d79f] transition">
                    Delivery
                </button>
                <button className="w-full bg-white text-red-900 py-2.5 rounded-lg font-semibold border border-red-100 shadow-md hover:bg-red-100 transition">
                    Cancel
                </button>
            </div>

        </div>
    );
};


export default OrderCard;
