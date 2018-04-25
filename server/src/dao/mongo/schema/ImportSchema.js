import mongoose from "mongoose";

const ImportSchema = mongoose.Schema({
    id: { type: Number, required: true },

    code: { type: String, required: true },

    sku: { type: String, required: true },

    quantity: { type: Number, required: true },

    status: { type: String, required: true, enum: ["approved", "pending"] },

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Import", ImportSchema);
