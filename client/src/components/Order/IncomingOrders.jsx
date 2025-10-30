import OrderCard from "./OrderCard";

const IncomingOrders = ({ orders, onOrderUpdate }) => {
    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-semibold text-gray-800">Incoming Orders</h2>
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                    {orders.length} Active
                </span>
            </div>

            {/* Orders grid */}
            {orders.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} onOrderUpdate={onOrderUpdate} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-5 text-center">
                    <div className="bg-emerald-50 pb-8 rounded-xl shadow-sm w-full max-w-md">
                        <img
                            src="../../../public/noOrder_4.svg"
                            alt="No orders"
                            className="w-[400px] mx-auto opacity-90 object-contain"
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
