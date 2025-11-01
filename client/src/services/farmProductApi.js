/**
 * Product Service
 *
 * Handles all product-related API operations for farmer dashboard
 * Implements sanitization and validation per myprod.md API contract
 *
 * API Documentation:
 * - POST /api/products - Create new product (Protected)
 * - GET /api/products/myproducts - Get farmer's products (Protected)
 * - PUT /api/products/:id - Update product (Protected)
 * - DELETE /api/products/:id - Archive product (Protected)
 *
 * Progressive Creation Flow:
 * - Initial creation requires only: name, price, unit, stock
 * - Additional details can be added later via PUT endpoint
 */

import apiClient, { API_ENDPOINTS } from "../config/api";
import { sanitizeProductData } from "../utils/sanitizers";

/**
 * Create a new product (Protected endpoint)
 *
 * Uses progressive creation flow - only essential fields required initially.
 * Additional details (description, imageUrl, etc.) can be added later.
 *
 * ⚠️ NOTE: File upload via FormData not currently supported.
 * Backend needs multer middleware configuration for multipart/form-data.
 * Use imageUrl field with external image URLs for now.
 *
 * @param {object} productData - Product data as JSON object
 * @param {string} productData.name - Product name (required)
 * @param {number} productData.price - Price per unit (required)
 * @param {string} productData.unit - Unit of measurement (required, e.g., "kg", "dozen", "piece")
 * @param {number} productData.stock - Available stock quantity (required)
 * @param {string} [productData.description] - Product description (optional)
 * @param {string} [productData.imageUrl] - Product image URL (optional)
 *
 * @returns {Promise<object>} Created product object with status 201
 * @throws {Error} 400 Bad Request if validation fails
 *
 * @example
 * const productData = {
 *   name: "Fresh Brown Eggs",
 *   price: 6.00,
 *   unit: "dozen",
 *   stock: 50,
 *   imageUrl: "https://example.com/eggs.jpg"
 * };
 * const product = await createProduct(productData);
 */
export const createProduct = async (productData) => {
    try {
        // Backend only supports JSON currently (no multer for file uploads)
        // Sanitize and send as JSON
        const dataToSend = sanitizeProductData(productData);

        const response = await apiClient.post(
            API_ENDPOINTS.products.create,
            dataToSend
        );
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 
            error.response?.data?.errors?.[0]?.msg ||
            "Failed to create product";
        throw new Error(errorMessage);
    }
};

/**
 * Get all products for the logged-in farmer (Protected endpoint)
 *
 * Returns all products including archived ones.
 * UI should filter/display archived products with visual distinction.
 *
 * @returns {Promise<Array>} Array of product objects
 *
 * Response format:
 * [
 *   {
 *     _id: "prod_123...",
 *     farmer: "671a...",
 *     name: "Fresh Brown Eggs",
 *     price: 6.00,
 *     unit: "dozen",
 *     stock: 50,
 *     description: "Free-range, organic brown eggs...",
 *     imageUrl: "https://example.com/eggs.png",
 *     status: "active" | "out-of-stock",
 *     isArchived: false,
 *     createdAt: "2025-10-30T01:30:00.000Z",
 *     updatedAt: "2025-10-30T01:30:00.000Z"
 *   }
 * ]
 *
 * @example
 * const products = await getMyProducts();
 * const activeProducts = products.filter(p => !p.isArchived);
 * const archivedProducts = products.filter(p => p.isArchived);
 */
export const getMyProducts = async () => {
    try {
        const response = await apiClient.get(API_ENDPOINTS.products.myProducts);
        return response.data || [];
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch products";
        throw new Error(errorMessage);
    }
};

/**
 * Update an existing product (Protected endpoint)
 *
 * Can be used to add optional details or update existing fields.
 * Send only the fields you want to update.
 *
 * ⚠️ NOTE: File upload via FormData not currently supported.
 * Backend needs multer middleware configuration for multipart/form-data.
 * Use imageUrl field with external image URLs for now.
 *
 * @param {string} productId - Product ID
 * @param {object} updateData - Fields to update as JSON object
 * @param {string} [updateData.name] - Product name
 * @param {number} [updateData.price] - Price per unit
 * @param {string} [updateData.unit] - Unit of measurement
 * @param {number} [updateData.stock] - Available stock
 * @param {string} [updateData.description] - Product description
 * @param {string} [updateData.imageUrl] - Product image URL
 * @param {string} [updateData.status] - Product status ("active" | "out-of-stock")
 * @param {boolean} [updateData.isArchived] - Archive status
 *
 * @returns {Promise<object>} Updated product object
 * @throws {Error} 404 if product not found
 *
 * @example
 * // Update price and stock
 * const updated = await updateProduct("prod_123", {
 *   price: 6.50,
 *   stock: 75
 * });
 *
 * @example
 * // Add description and image URL
 * const updated = await updateProduct("prod_123", {
 *   description: "Free-range, organic brown eggs from our happy hens.",
 *   imageUrl: "https://example.com/eggs.jpg"
 * });
 */
export const updateProduct = async (productId, updateData) => {
    try {
        // Backend only supports JSON currently (no multer for file uploads)
        // Sanitize and send as JSON
        const dataToSend = sanitizeProductData(updateData);

        const response = await apiClient.put(
            `${API_ENDPOINTS.products.update}/${productId}`,
            dataToSend
        );
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 
            error.response?.data?.errors?.[0]?.msg ||
            "Failed to update product";
        throw new Error(errorMessage);
    }
};

/**
 * Archive a product (Protected endpoint - Soft delete)
 *
 * Archives product instead of permanently deleting it.
 * Archived products are hidden from public view but remain in farmer's dashboard.
 *
 * @param {string} productId - Product ID to archive
 * @returns {Promise<object>} Success message
 *
 * @example
 * await archiveProduct("prod_123");
 */
export const archiveProduct = async (productId) => {
    try {
        const response = await apiClient.delete(
            `${API_ENDPOINTS.products.base}/${productId}`
        );
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Failed to archive product";
        throw new Error(errorMessage);
    }
};

/**
 * Restore an archived product (Protected endpoint)
 *
 * Un-archives a product by updating its status.
 *
 * @param {string} productId - Product ID to restore
 * @returns {Promise<object>} Updated product object
 *
 * @example
 * await restoreProduct("prod_123");
 */
export const restoreProduct = async (productId) => {
    try {
        const restoredProduct = await updateProduct(productId, {
            isArchived: false,
            status: "active",
        });
        return restoredProduct;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || 
            error.response?.data?.errors?.[0]?.msg ||
            error.message ||
            "Failed to restore product";
        throw new Error(errorMessage);
    }
};

/**
 * Helper function to filter active products
 * @param {Array} products - Array of products
 * @returns {Array} Active (non-archived) products
 */
export const filterActiveProducts = (products) => {
    return products.filter((p) => !p.isArchived);
};

/**
 * Helper function to filter archived products
 * @param {Array} products - Array of products
 * @returns {Array} Archived products
 */
export const filterArchivedProducts = (products) => {
    return products.filter((p) => p.isArchived);
};
