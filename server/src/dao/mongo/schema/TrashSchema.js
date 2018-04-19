import mongoose from "mongoose";

const TrashSchema = mongoose.Schema({
    id: { type: Number, required: true },

    sku: { type: String, required: true },
    productName: {
        en: { type: String, required: true },
    },
    price: { type: Number, required: true },

    stock: { type: Number, required: true },
    status: { type: String, required: true, enum: ["removed"] },

    createdAt: { type: Date, default: new Date },

});

export default mongoose.model("Trash", TrashSchema);
