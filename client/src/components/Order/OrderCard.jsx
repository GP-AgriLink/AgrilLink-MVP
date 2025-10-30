import { useState } from "react";

const OrderCard = ({ order, onOrderUpdate }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const [status, setStatus] = useState(order.status);

    const handleClick = (newStatus) => {
        if (newStatus === "Delivery") {
            setStatus("Delivery");
        } else {
            setFadeOut(true);
            setTimeout(() => {
                onOrderUpdate(order.id, newStatus);
            }, 300);
        }
    };

    return (
        <div
            className={`bg-white shadow-lg rounded-2xl p-6 border border-green-100 transition-all duration-300 flex flex-col justify-between
            ${fadeOut ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
        >
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 font-medium">Order #{order.id}</p>
                    <span className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-md font-semibold">
                        Total ${order.total.toFixed(2)}
                    </span>
                </div>

                <h3 className="font-semibold text-left text-lg text-gray-800 mb-1">
                    {status === "Incoming"
                        ? "Incoming Order"
                        : status === "Delivery"
                            ? "Delivery Order"
                            : status}
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
                <button
                    onClick={() => handleClick("Completed")}
                    className="w-full bg-white text-[#0EB17C] py-2.5 rounded-lg font-semibold border border-[#0EB17C] shadow-md hover:bg-[#0EB17C] hover:text-white transition"
                >
                    Complete
                </button>
                <button
                    onClick={() => handleClick("Delivery")}
                    className="w-full bg-[#13C191] text-white py-2.5 rounded-lg font-semibold border border-[#13C191] shadow-md hover:bg-white hover:text-[#13C191] transition"
                >
                    Delivery
                </button>
                <button
                    onClick={() => handleClick("Canceled")}
                    className="w-full bg-white text-red-900 py-2.5 rounded-lg font-semibold border border-red-100 shadow-md hover:bg-red-100 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default OrderCard;
