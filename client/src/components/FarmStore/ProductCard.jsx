import AddToCart from "./AddToCart.jsx";
import {toast} from "react-toastify";

const ProductCard = ({product}) => {
  const {
    _id,
    name = "Unnamed Product",
    price = 0,
    description = "No description available.",
    imageUrl = "https://via.placeholder.com/400x300?text=No+Image",
    unit = "",
    tag,
  } = product;

  const handleAddToCart = () => {
    try {
      // Get existing cart items from localStorage or initialize empty array
      const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

      // Find if this product already exists in cart
      const existingItemIndex = existingCart.findIndex(
        (item) => item._id === _id
      );

      let updatedCart;

      if (existingItemIndex !== -1) {
        //  Product already in cart → increase quantity
        updatedCart = existingCart.map((item, index) =>
          index === existingItemIndex
            ? {...item, quantity: (item.quantity || 1) + 1}
            : item
        );
        console.log(` Increased quantity for "${name}".`);
      } else {
        //  Add new product with quantity = 1
        updatedCart = [...existingCart, {...product, quantity: 1}];
        console.log(` Added "${name}" to cart.`);
      }

      // Save updated cart back to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));

      //Toast success message
      toast.success(`${name} added successfully to the cart`, {
        position: "top-right",
        autoClose: 2000, // No need for quotes around the number
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // 'theme: "colored"' has been REMOVED to match your image
        // The default "light" theme will be used
      });
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      //Toast error message
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div
      className="
      bg-white 
      rounded-2xl 
      shadow-xl 
      overflow-hidden 
      flex flex-col
      border border-[#84dcc6]
      transition-all duration-300 ease-in-out
      hover:shadow-2xl
    "
    >
      {/* --- IMAGE --- */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
          src={imageUrl}
          alt={name}
        />
        {tag && (
          <span
            className="
            absolute top-4 left-4
            bg-[#2a9d8f] text-white
            text-xs font-semibold uppercase
            px-3 py-1.5
            rounded-full
            shadow-md
            z-10
            whitespace-nowrap
          "
          >
            {tag}
          </span>
        )}
      </div>

      {/* --- CONTENT --- */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#0a3832] mb-1">{name}</h3>
        <div className="flex flex-row gap-1 mb-3">
          <p className="text-base font-medium text-[#008c7a]">${price}</p>

          <p className="text-base font-medium text-[#5cb39f]">/ {unit}</p>
        </div>

        <p className="text-sm text-gray-500 mb-6 flex-grow">{description}</p>

        {/* --- ADD TO CART BUTTON --- */}
        <AddToCart onClick={handleAddToCart} />
      </div>
    </div>
  );
};

export default ProductCard;
