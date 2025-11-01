import ProductTable from "./ProductTable";
import EmptyState from "./EmptyState";

/**
 * ProductList
 * Displays product inventory split into active and archived sections
 * @param {Array} products - Complete list of products
 * @param {Function} onEdit - Handler for product edit action
 * @param {Function} onArchive - Handler to archive a product
 * @param {Function} onRestore - Handler to restore an archived product
 * @param {Function} onAddNew - Handler to create new product
 */
const ProductList = ({ 
  products, 
  onEdit, 
  onArchive, 
  onRestore, 
  onAddNew 
}) => {
  const activeProducts = products.filter(p => !p.isArchived);
  const archivedProducts = products.filter(p => p.isArchived);

  const activeCount = activeProducts.length;
  const archivedCount = archivedProducts.length;
  const outOfStockCount = activeProducts.filter(
    p => p.stock === 0 || p.status === "out-of-stock"
  ).length;

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            My Products
          </h2>
          <div className="flex gap-2">
            {activeCount > 0 && (
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                {activeCount} Active
              </span>
            )}
            {outOfStockCount > 0 && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {outOfStockCount} Out of Stock
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      {/* Active Products Table or Empty State */}
      {activeProducts.length > 0 ? (
        <ProductTable
          products={activeProducts}
          isArchived={false}
          onEdit={onEdit}
          onArchive={onArchive}
          onRestore={onRestore}
        />
      ) : (
        <EmptyState onAddNew={onAddNew} />
      )}

      {/* Archived Products Section */}
      {archivedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Archived Products
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-sm font-medium">
                {archivedCount} Archived
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-left text-sm">
            Products that have been archived can be restored at any time.
          </p>

          <ProductTable
            products={archivedProducts}
            isArchived={true}
            onEdit={onEdit}
            onArchive={onArchive}
            onRestore={onRestore}
          />
        </section>
      )}
    </section>
  );
};

export default ProductList;
