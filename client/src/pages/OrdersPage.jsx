import { useState } from "react";
import IncomingOrders from "../components/Order/IncomingOrders";
import PastOrders from "../components/Order/PastOrders";

const OrdersPage = () => {
    const [incomingOrders, setIncomingOrders] = useState([
        {
            id: "2024-001",
            customer: "John Appleseed",
            phone: "+1 (555) 123-4567",
            total: 19.26,
            items: [
                { name: "Heirloom Tomatoes", qty: 3, price: 14.97 },
                { name: "Forest Kale", qty: 2, price: 6.58 },
            ],
            status: "Incoming",
        },
        {
            id: "2024-002",
            customer: "Priya Patel",
            phone: "+1 (555) 444-2211",
            total: 32.75,
            items: [
                { name: "Pastured Eggs", qty: 2, price: 11.0 },
                { name: "Sun Sweet Corn", qty: 10, price: 7.5 },
            ],
            status: "Incoming",
        },
    ]);

    const [pastOrders, setPastOrders] = useState([
        { id: "2024-103", customer: "Miguel Rodriguez", total: 24.5, date: "Nov 27, 2024", status: "Completed" },
        { id: "2024-104", customer: "Chelsea Nguyen", total: 17.85, date: "Nov 22, 2024", status: "Canceled" },
        { id: "2024-105", customer: "Omar Hassan", total: 42.0, date: "Nov 29, 2024", status: "Completed" },
    ]);

    const handleOrderUpdate = (id, newStatus) => {
        const updatedOrders = incomingOrders.filter((o) => o.id !== id);
        const movedOrder = incomingOrders.find((o) => o.id === id);
        if (movedOrder) {
            setIncomingOrders(updatedOrders);
            setPastOrders((prev) => [
                ...prev,
                {
                    ...movedOrder,
                    status: newStatus,
                    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                },
            ]);
        }
    };

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
