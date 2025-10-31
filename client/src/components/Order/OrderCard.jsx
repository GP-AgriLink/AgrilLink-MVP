// client/pages/OrderCard.jsx

import { useState, useEffect } from "react";

const OrderCard = ({ order, onOrderUpdate }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const orderData = order.order || order.data || order;

    const initialStatus = orderData.status === "Ready for Delivery" ? "Delivery" : orderData.status;
    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        // لو حصل refresh أو تغير في props، نخلي الكارد يعكس الحالة الحقيقية من الباك
        if (orderData.status === "Ready for Delivery") setStatus("Delivery");
        else setStatus(orderData.status);
    }, [orderData.status]);

    const formatNumber = (num) => {
        return typeof num === "number" && !isNaN(num) ? num.toFixed(2) : "0.00";
    };

    const handleClick = async (newStatus) => {
        if (newStatus === "Delivery") {
            setStatus("Delivery");
            try {
                await onOrderUpdate(orderData._id || orderData.id, "Ready for Delivery");
            } catch (err) {
                console.error("Failed to update order:", err);
                alert("Failed to update order status. Please try again.");
            }
        } else {
            setFadeOut(true);
            setTimeout(async () => {
                try {
                    await onOrderUpdate(orderData._id || orderData.id, newStatus);
                } catch (err) {
                    console.error("Failed to update order:", err);
                    alert("Failed to update order status. Please try again.");
                }
            }, 300);
        }
    };

    const cardStyle =
        status === "Delivery"
            ? "bg-gray-50 border-gray-200"
            : "bg-white border-green-100";

    const items = orderData.items || orderData.orderItems || [];
    const customer = orderData.customer || orderData.customerName || "Unknown Customer";
    const phone = orderData.phone || orderData.customerPhone || "No Phone";
    const total = orderData.total || orderData.totalAmount || 0;
    const date = orderData.createdAt || orderData.date;

    return (
        <div
            className={`${cardStyle} shadow-lg rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between border
            ${fadeOut ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
        >
            {/* Header */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500 font-medium">
                        {date
                            ? new Date(date).toLocaleDateString("en-GB", {
                                dateStyle: "medium",
                            })
                            : "Unknown Date"}
                    </p>

                    <span className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-md font-semibold">
                        Total ${formatNumber(total)}
                    </span>
                </div>

                <h3
                    className={`font-semibold text-left text-lg mb-1 ${status === "Delivery" ? "text-green-700" : "text-gray-800"
                        }`}
                >
                    {status === "Incoming"
                        ? "Incoming Order"
                        : status === "Delivery"
                            ? "Delivery Order"
                            : status}
                </h3>

                <p className="text-gray-700 font-medium pb-2">{customer}</p>
                <p className="text-sm text-gray-500 mb-4">{phone}</p>

                {/* Items */}
                <div
                    className={`${status === "Delivery"
                        ? "bg-gray-100 border-green-200"
                        : "bg-green-50 border-green-100"
                        } rounded-xl p-4 mb-4 border`}
                >
                    <p className="text-sm font-semibold text-left text-gray-700 mb-2 tracking-wide">
                        Items ({items.length})
                    </p>

                    {items.map((item, index) => {
                        const formattedItem = {
                            name: item.name || "Unknown Item",
                            qty: item.qty,
                            price: item.price,
                        };

                        return (
                            <div
                                key={index}
                                className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-100 last:border-none"
                            >
                                <div className="flex flex-col text-left">
                                    <span className="font-medium">{formattedItem.name}</span>
                                    <span className="text-xs text-gray-500">
                                        {formattedItem.qty} pcs × ${formatNumber(formattedItem.price)}
                                    </span>
                                </div>
                                <span className="font-semibold text-gray-700">
                                    ${formatNumber(formattedItem.qty * formattedItem.price)}
                                </span>
                            </div>
                        );
                    })}
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