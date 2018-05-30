import mongoose from "mongoose";

const database = "Inventory";

const InventorySchema = mongoose.Schema({
    id: { type: Number, required: true },

    sku: { type: String, required: true },

    unit: { type: String, required: true },

    capacity: { type: Number, required: true },

    pending: { type: Number, required: false },

    productName: {
        en: { type: String, required: true },
    },
    price: { type: Number, required: true },

    stock: { type: Number, required: true },
    status: { type: String, required: true, enum: ["approved", "pending"] },
    history: [{
        _id: false,
        action: { type: String, required: true, enum: ["created", "updated", "approvedIn", "removed", "approvedOut", "recovered"] },
        userId: { type: Number, required: true },
        timestamp: { type: Date, required: true },
        payload: { type: mongoose.Schema.Types.Mixed }
    }],
    isRemoved: { type: Boolean, required: true, default: false },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("Inventory", InventorySchema);
