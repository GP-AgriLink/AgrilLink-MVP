// client/components/IncomingOrders.jsx
import OrderCard from "./OrderCard";

const IncomingOrders = () => {
    const incomingOrders = [
        {
            id: "2024-001",
            customer: "John Appleseed",
            phone: "+1 (555) 123-4567",
            total: 19.26,
            items: [
                { name: "Heirloom Tomatoes", qty: 3, price: 14.97 },
                { name: "Forest Kale", qty: 2, price: 6.58 },
            ],
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
        },
    ];

    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-semibold text-gray-800">
                    Incoming Orders
                </h2>
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                    {incomingOrders.length} Active
                </span>
            </div>

            {/* Orders grid */}
            {incomingOrders.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {incomingOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-emerald-50 p-8 rounded-xl shadow-sm w-full max-w-md">
                        <img
                            src="/no-orders.svg"
                            alt="No orders"
                            className="w-36 h-36 mb-4 mx-auto opacity-90"
                        />
                        <p className="text-lg font-semibold text-emerald-700">
                            No Orders Right Now.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Everything looks calm for now.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default IncomingOrders;
