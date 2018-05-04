import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    id: { type: Number, required: true },

    //orderNumber: { type: Number, required: true},

    details: [{
        id: { type: Number, required: true },
        sku: { type: String, required: true },
        mainSku: { type: String, required: true },
        quantity: { type: Number, required: true },
        status: { type: String, required: true, enum: ["added", "pending"] }
    }],

    company: { type: String, required: true },

    createdBy: { type: String, required: true },

    approvedBy: { type: String, required: true },

    status: { type: String, required: true, enum: ["approved", "pending"] },

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Order", OrderSchema);
