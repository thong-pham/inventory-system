import mongoose from "mongoose";

const RequestSchema = mongoose.Schema({
    id: { type: Number, required: true },

    sku: {type: String, required: true},

    quantity: { type: String, required: true },

    company: { type: String, required: true },

    username: { type: String, required: true },

    status: { type: String, required: true},

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Request", RequestSchema);
