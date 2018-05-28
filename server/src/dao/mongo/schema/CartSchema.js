import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
    id: { type: Number, required: true },

    sku: { type: String, required: true },

    mainSku: { type: String, required: true },

    mainStock: { type: String, required: false },

    desc:  { type: String, required: true },

    quantity: { type: Number, required: true },

    username: { type: String, required: true },

    status: { type: String, required: true, enum: ["added", "pending"] },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("Cart", CartSchema);
