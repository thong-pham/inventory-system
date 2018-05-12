import mongoose from "mongoose";

const CompanySchema = mongoose.Schema({
    id: { type: Number, required: true },

    name: { en: { type: String, required: true } },

    code: { type: String, required: false },

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Company", CompanySchema);
