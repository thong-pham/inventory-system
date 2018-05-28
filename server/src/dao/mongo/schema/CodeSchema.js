import mongoose from "mongoose";

const CodeSchema = mongoose.Schema({
    id: { type: Number, required: true },

    key: { type: String, required: true },

    sku: { type: String, required: true },

    mainSku: { type: String, required: true },

    company: { type: String, required: true },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("Code", CodeSchema);
