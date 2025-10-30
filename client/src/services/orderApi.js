/**
 * Order Service
 * 
 * Handles all order-related API operations based on backend API documentation
 * 
 * API Documentation:
 * - POST /api/orders - Create new order (Public)
 * - GET /api/orders/myorders - Get farmer's orders (Protected)
 * - PUT /api/orders/:id/status - Update order status (Protected)
 * 
 * Performance Considerations:
 * - getIncomingOrdersCount() fetches all orders and filters client-side
 * - For production with large order volumes, implement backend counting endpoint
 * - Use getIncomingOrdersCountFromArray() when orders are already fetched
 * - Consider implementing pagination for order lists
 */

import apiClient, { API_ENDPOINTS } from '../config/api';

/**
 * Create a new order (Public endpoint for checkout)
 * 
 * This endpoint is used on the CheckoutPage to submit a customer's cart.
 * When an order is successfully placed, product stock is automatically decremented.
 * 
 * @param {object} orderData - Order data
 * @param {string} orderData.farmerId - ID of the farmer
 * @param {string} orderData.customerName - Customer's full name
 * @param {string} orderData.customerPhone - Customer's phone number
 * @param {Array} orderData.orderItems - Array of order items
 * @param {string} orderData.orderItems[].productId - Product ID
 * @param {string} orderData.orderItems[].name - Product name
 * @param {number} orderData.orderItems[].quantity - Quantity ordered
 * @param {number} orderData.orderItems[].unitPrice - Price per unit
 * 
 * @returns {Promise<object>} Created order object with status 201
 * @throws {Error} 400 Bad Request if product is out of stock
 * 
 * @example
 * const orderData = {
 *   farmerId: "671a...",
 *   customerName: "John Doe",
 *   customerPhone: "+15551234567",
 *   orderItems: [
 *     {
 *       productId: "prod_abc...",
 *       name: "Organic Tomatoes",
 *       quantity: 2,
 *       unitPrice: 4.99
 *     }
 *   ]
 * };
 * const order = await createOrder(orderData);
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.orders.create, orderData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Product out of stock';
      console.error('Stock error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get all orders for the logged-in farmer (Protected endpoint)
 * 
 * This endpoint populates the farmer dashboard with all their orders.
 * Orders are sorted with most recent first.
 * 
 * @returns {Promise<Array>} Array of order objects
 * 
 * Response format:
 * [
 *   {
 *     _id: "order_123...",
 *     farmer: "671a...",
 *     customerName: "John Doe",
 *     customerPhone: "+15551234567",
 *     orderItems: [{ productId, name, quantity, unitPrice }],
 *     totalAmount: 16.98,
 *     status: "Incoming" | "Completed" | "Cancelled",
 *     createdAt: "2025-10-30T01:30:00.000Z",
 *     updatedAt: "2025-10-30T01:30:00.000Z"
 *   }
 * ]
 * 
 * @example
 * const orders = await getMyOrders();
 * const incomingOrders = filterIncomingOrders(orders);
 * const pastOrders = filterPastOrders(orders);
 */
export const getMyOrders = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.orders.myOrders);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get count of incoming orders (status: "Incoming")
 * Used for notification badges in navbar
 * 
 * Performance Note:
 * Currently fetches all orders and filters client-side. For better performance
 * with large datasets, consider implementing a dedicated backend endpoint:
 * GET /api/orders/count?status=Incoming
 * 
 * @param {boolean} useCache - Whether to use cached data if available (default: false)
 * @returns {Promise<number>} Count of incoming orders
 */
export const getIncomingOrdersCount = async (useCache = false) => {
  try {
    // TODO: Replace with dedicated backend endpoint when available
    // const response = await apiClient.get('/api/orders/count', { params: { status: 'Incoming' } });
    // return response.data.count;
    
    const orders = await getMyOrders();
    const incomingCount = orders.filter(order => order.status === 'Incoming').length;
    return incomingCount;
  } catch (error) {
    console.error('Error fetching incoming orders count:', error);
    return 0;
  }
};

/**
 * Get count of incoming orders from already-fetched orders array
 * More efficient alternative when orders are already available
 * 
 * @param {Array} orders - Array of order objects
 * @returns {number} Count of incoming orders
 * 
 * @example
 * const orders = await getMyOrders();
 * const count = getIncomingOrdersCountFromArray(orders);
 */
export const getIncomingOrdersCountFromArray = (orders) => {
  if (!Array.isArray(orders)) {
    console.warn('Invalid orders array provided to getIncomingOrdersCountFromArray');
    return 0;
  }
  return orders.filter(order => order.status === 'Incoming').length;
};

/**
 * Filter incoming orders from orders array
 * 
 * @param {Array} orders - Array of order objects
 * @returns {Array} Array of incoming order objects
 */
export const filterIncomingOrders = (orders) => {
  return orders.filter(order => order.status === 'Incoming');
};

/**
 * Filter past orders (Completed or Cancelled) from orders array
 * 
 * @param {Array} orders - Array of order objects
 * @returns {Array} Array of completed/cancelled order objects
 */
export const filterPastOrders = (orders) => {
  return orders.filter(order => ['Completed', 'Cancelled'].includes(order.status));
};

/**
 * Update order status (Protected endpoint)
 * 
 * Allows farmer to update order status from dashboard.
 * Typically used to mark orders as "Completed" after preparation.
 * 
 * @param {string} orderId - Order ID
 * @param {string} status - New status ("Incoming" | "Completed" | "Cancelled")
 * @returns {Promise<object>} Updated order object
 * @throws {Error} If orderId or status is invalid
 * 
 * @example
 * const updatedOrder = await updateOrderStatus("order_123...", "Completed");
 */
export const updateOrderStatus = async (orderId, status) => {
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Valid order ID is required');
  }

  const validStatuses = ['Incoming', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  try {
    const response = await apiClient.put(
      API_ENDPOINTS.orders.updateStatus(orderId),
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Calculate total amount from order items
 * Utility function for order calculations
 * 
 * @param {Array} orderItems - Array of order items
 * @returns {number} Total amount
 */
export const calculateOrderTotal = (orderItems) => {
  return orderItems.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
};

/**
 * Validate order data before submission
 * 
 * @param {object} orderData - Order data to validate
 * @returns {object} { isValid: boolean, errors: Array<string> }
 */
export const validateOrderData = (orderData) => {
  const errors = [];

  if (!orderData.farmerId) {
    errors.push('Farmer ID is required');
  }

  if (!orderData.customerName || orderData.customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters');
  }

  if (!orderData.customerPhone || !/^\+?[\d\s-()]+$/.test(orderData.customerPhone)) {
    errors.push('Valid customer phone number is required');
  }

  if (!orderData.orderItems || orderData.orderItems.length === 0) {
    errors.push('At least one order item is required');
  } else {
    orderData.orderItems.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Order item ${index + 1}: Product ID is required`);
      }
      if (!item.name || item.name.trim().length === 0) {
        errors.push(`Order item ${index + 1}: Product name is required`);
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Order item ${index + 1}: Quantity must be greater than 0`);
      }
      if (item.unitPrice === undefined || item.unitPrice < 0) {
        errors.push(`Order item ${index + 1}: Valid unit price is required`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format order for display
 * 
 * @param {object} order - Order object from API
 * @returns {object} Formatted order with additional computed fields
 */
export const formatOrderForDisplay = (order) => {
  return {
    ...order,
    formattedDate: new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    formattedTotal: `$${order.totalAmount.toFixed(2)}`,
    itemCount: order.orderItems.length,
    statusBadgeColor: getStatusColor(order.status)
  };
};

/**
 * Get color class for order status badge
 * 
 * @param {string} status - Order status
 * @returns {string} Tailwind color classes
 */
const getStatusColor = (status) => {
  const colors = {
    'Incoming': 'bg-amber-100 text-amber-800 border-amber-200',
    'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export default {
  createOrder,
  getMyOrders,
  getIncomingOrdersCount,
  getIncomingOrdersCountFromArray,
  filterIncomingOrders,
  filterPastOrders,
  updateOrderStatus,
  calculateOrderTotal,
  validateOrderData,
  formatOrderForDisplay,
};

