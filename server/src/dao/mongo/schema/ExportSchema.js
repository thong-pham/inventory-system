import mongoose from "mongoose";

const ExportSchema = mongoose.Schema({
    id: { type: Number, required: true },

    code: { type: String, required: true },

    sku: { type: String, required: true },

    quantity: { type: Number, required: true },

    capacity: { type: Number, required: true },

    count: { type: Number, required: true },

    username: { type: String, required: true },

    status: { type: String, required: true, enum: ["approved", "pending"] },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("Export", ExportSchema);
