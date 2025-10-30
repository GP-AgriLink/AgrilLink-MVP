
import { Plus, Minus, Trash2 } from 'lucide-react'; 

function CartItem({ item, onIncrease, onDecrease }) {
  return (
    <li className="flex justify-between items-center py-4">
      {/* Product Info */}
      <div className="flex items-center gap-3">
        <div>
          <h4 className="font-semibold text-gray-800">{item.name}</h4>
          <span className="text-gray-400 text-sm">
            ${item.price.toFixed(2)} / {item.unit}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Quantity Buttons */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1">
          <button 
            onClick={() => onDecrease(item.id)}
            className="text-gray-600 hover:text-red-500 transition"
          >
            {/* If qty is 1, show trash icon, else show minus */}
            {item.qty === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
          </button>
          <span className="font-semibold text-gray-800 w-4 text-center">{item.qty}</span>
          <button 
            onClick={() => onIncrease(item.id)}
            className="text-gray-600 hover:text-emerald-500 transition"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Item subtotal */}
        <span className="font-semibold text-gray-900 w-16 text-right">
          ${(item.qty * item.price).toFixed(2)}
        </span>
      </div>
    </li>
  );
}

// Main component for the cart summary
export default function CartSummary({ items, total, itemCount, onIncrease, onDecrease, onClearAll }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
        <span className="text-emerald-600 bg-emerald-100 font-medium text-sm px-3 py-1 rounded-full">
          {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
        </span>
      </div>
      
      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {items.map(item => (
              <CartItem 
                key={item.id} 
                item={item} 
                onIncrease={onIncrease}
                onDecrease={onDecrease}
              />
            ))}
          </ul>
      
          {/* Total and Clear Cart button */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-300">
            <button
              onClick={onClearAll}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
            >
              <Trash2 size={16} />
              Clear All Items
            </button>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-gray-900 uppercase">
                Total
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}