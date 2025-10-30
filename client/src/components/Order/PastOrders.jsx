// client/components/PastOrders.jsx

const PastOrders = () => {
    const pastOrders = [
        { id: "2024-103", customer: "Miguel Rodriguez", total: 24.5, date: "Nov 27, 2024", status: "Completed" },
        { id: "2024-104", customer: "Chelsea Nguyen", total: 17.85, date: "Nov 22, 2024", status: "Canceled" },
        { id: "2024-105", customer: "Omar Hassan", total: 42.0, date: "Nov 29, 2024", status: "Completed" },
    ];

    const completedCount = pastOrders.filter((o) => o.status === "Completed").length;
    const canceledCount = pastOrders.filter((o) => o.status === "Canceled").length;

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-semibold text-gray-800">Past Orders</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                        {completedCount} Completed
                    </span>
                    <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-medium">
                        {canceledCount} Canceled
                    </span>
                </div>
            </div>

            <p className="text-gray-500 text-left text-sm">
                Review completed deliveries and canceled orders for quick reference.
            </p>

            <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-green-100">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-green-100 text-gray-600 uppercase text-xs tracking-wide">
                        <tr>
                            <th className="py-4 px-6 text-center">Order ID</th>
                            <th className="py-4 px-6 text-center">Customer</th>
                            <th className="py-4 px-6 text-center">Total</th>
                            <th className="py-4 px-6 text-center">Date</th>
                            <th className="py-4 px-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastOrders.map((order, i) => (
                            <tr
                                key={order.id}
                                className={`border-t hover:bg-green-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                            >
                                <td className="py-4 px-6 font-medium">#{order.id}</td>
                                <td className="py-4 px-6">{order.customer}</td>
                                <td className="py-4 px-6">${order.total.toFixed(2)}</td>
                                <td className="py-4 px-6">{order.date}</td>
                                <td
                                    className={`py-4 px-6 font-semibold ${order.status === "Completed"
                                        ? "text-green-600"
                                        : "text-red-900"
                                        }`}
                                >
                                    {order.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PastOrders;
