// client/pages/OrdersPage.jsx
import IncomingOrders from "../components/Order/IncomingOrders";
import PastOrders from "../components/Order/PastOrders";

const OrdersPage = () => {
    return (
        <div className="min-h-screen md:px-12 lg:px-20">
            <div className="max-w-[1400px] mx-auto flex flex-col gap-14">
                {/* Section 1: Incoming Orders */}
                <IncomingOrders />

                {/* Section 2: Past Orders */}
                <PastOrders />
            </div>
        </div>
    );
};

export default OrdersPage;
