import mongoose from "mongoose";

const database = "Inventory";

const SubInventorySchema = mongoose.Schema({
    id: { type: Number, required: true },

    sku: { type: String, required: true },

    mainSku: { type: String, required: true },

    mainStock: { type: Number, required: false },

    capacity: { type: Number, required: false },

    unit: { type: String, required: false },

    productName: {
        en: { type: String, required: true },
    },
    price: { type: Number, required: true },

    company: { type: String, required: true},

    stock: { type: Number, required: true },
    status: { type: String, required: true, enum: ["approved", "pending"] },
    history: [{
        _id: false,
        action: { type: String, required: true, enum: ["created", "updated"] },
        userId: { type: Number, required: true },
        timestamp: { type: Date, required: true },
        payload: { type: mongoose.Schema.Types.Mixed }
    }],
    isRemoved: { type: Boolean, required: true, default: false },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("SubInventory", SubInventorySchema);
