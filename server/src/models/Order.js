import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    farmer: {
      // Links the order to the specific farmer
      type: Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    // This array implements the OrderItem weak entity
    orderItems: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true }, // Price at the time of order
      },
    ],
    totalAmount: {
      // This is a Derived Attribute
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Incoming", "Ready for Delivery", "Completed", "Cancelled"],
      default: "Incoming",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
