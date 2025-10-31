
import { Link } from 'react-router-dom'; 

export default function CartCheckoutBox({ total }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-fit">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Ready to Checkout?
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-lg">
          <span className="font-medium text-gray-700">Subtotal</span>
          <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-500 text-sm">
          Shipping, taxes, and service fees will be calculated at checkout.
        </p>
        
        <Link
          to="/checkout" 
          className="block w-full text-center bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}