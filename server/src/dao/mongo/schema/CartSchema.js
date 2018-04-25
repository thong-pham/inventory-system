import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
    id: { type: Number, required: true },

    sku: { type: String, required: true },

    productName: {
        en: { type: String, required: true },
    },

    quantity: { type: Number, required: true },

    username: { type: String, required: true },

    status: { type: String, required: true, enum: ["added", "pending"] },

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Cart", CartSchema);