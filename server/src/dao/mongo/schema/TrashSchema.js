import mongoose from "mongoose";

const TrashSchema = mongoose.Schema({
    id: { type: Number, required: true },

    sku: { type: String, required: true },
    productName: {
        en: { type: String, required: true },
    },
    price: { type: Number, required: true },

    stock: { type: Number, required: true },
    status: { type: String, required: true, enum: ["approved", "pending"] },
    history: [{
        _id: false,
        action: { type: String, required: true, enum: ["created", "updated", "approved", "removed"] },
        userId: { type: Number, required: true },
        timestamp: { type: Date, required: true },
        payload: { type: mongoose.Schema.Types.Mixed }
    }],
    isRemoved: { type: Boolean, required: true, default: false },

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Trash", TrashSchema);
