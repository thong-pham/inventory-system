import mongoose from "mongoose";

const CodeSchema = mongoose.Schema({
    id: { type: Number, required: true },

    key: { type: String, required: true },
    
    sku: { type: String, required: true },

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Code", CodeSchema);
