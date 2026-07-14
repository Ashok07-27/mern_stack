import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        title: { type: String, required: true },
        qty: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true },
        book: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Book',
        },
      },
    ],
    type: {
      type: String,
      required: true,
      enum: ['purchase', 'reservation'],
      default: 'purchase',
    },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Credit Card',
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    reservationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
