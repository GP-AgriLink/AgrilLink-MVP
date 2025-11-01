const AddToCart = ({onClick}) => {
  // <-- Added { onClick } here
  return (
    <button
      onClick={onClick}
      className="
        inline-flex items-center justify-center
        w-full
        px-4 py-3
        border border-transparent rounded-full
        shadow-lg shadow-teal-400/40
        text-white
        bg-[#2a9d8f]
        hover:bg-[#268a7e]
        focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-opacity-75
        transition-all duration-300 ease-in-out
        text-sm sm:text-base
        font-semibold
        cursor-pointer
      "
    >
      <span
        className="text-2xl /* Slightly larger icon */
                   font-normal
                   mr-2"
      >
        +
      </span>
      Add to Cart
    </button>
  );
};

export default AddToCart;
