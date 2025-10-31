// client/pages/OrdersPage.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import IncomingOrders from "../components/Order/IncomingOrders";
import PastOrders from "../components/Order/PastOrders";

const OrdersPage = () => {
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [pastOrders, setPastOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get("/api/orders/myorders", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("API IS :", data);

                const ordersArray = Array.isArray(data)
                    ? data
                    : Array.isArray(data.orders)
                        ? data.orders
                        : [];

                const incoming = ordersArray.filter(
                    o => o.status === "Incoming" || o.status === "Ready for Delivery"
                );
                const past = ordersArray.filter(
                    o => o.status === "Completed" || o.status === "Cancelled"
                );

                setIncomingOrders(
                    incoming.map(o => ({
                        id: o._id,
                        customer: o.customerName,
                        phone: o.customerPhone || "N/A",
                        total: o.totalAmount,
                        items: o.orderItems.map(i => ({
                            name: i.name,
                            qty: i.quantity,
                            price: i.unitPrice,
                        })),
                        status: o.status === "Ready for Delivery" ? "Delivery" : "Incoming",
                        date: new Date(o.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }),
                    }))
                );

                setPastOrders(
                    past.map(o => ({
                        id: o._id,
                        customer: o.customerName,
                        total: o.totalAmount,
                        status: o.status,
                        date: o.updatedAt || o.createdAt,
                    }))
                );
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleOrderUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const { data: updatedOrder } = await axios.put(
                `/api/orders/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (newStatus === "Completed" || newStatus === "Cancelled") {
                setIncomingOrders(prev => prev.filter(o => o.id !== id));

                setPastOrders(prev => {
                    const exists = prev.find(o => o.id === updatedOrder._id);
                    if (exists) return prev;
                    return [
                        ...prev,
                        {
                            id: updatedOrder._id,
                            customer: updatedOrder.customerName,
                            total: updatedOrder.totalAmount,
                            status: updatedOrder.status,
                            date: updatedOrder.updatedAt || updatedOrder.createdAt,
                        },
                    ];
                });
            } else {
                setIncomingOrders(prev =>
                    prev.map(o =>
                        o.id === id
                            ? { ...o, status: newStatus === "Ready for Delivery" ? "Delivery" : newStatus }
                            : o
                    )
                );
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Failed to update order status. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg font-medium">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen md:px-12 lg:px-20">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-14">
                <IncomingOrders orders={incomingOrders} onOrderUpdate={handleOrderUpdate} />
                <PastOrders orders={pastOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;