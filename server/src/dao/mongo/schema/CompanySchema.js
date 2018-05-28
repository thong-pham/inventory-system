import mongoose from "mongoose";

const CompanySchema = mongoose.Schema({
    id: { type: Number, required: true },

    name: { en: { type: String, required: true } },

    code: { type: String, required: false },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("Company", CompanySchema);
