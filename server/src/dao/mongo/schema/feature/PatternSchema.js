import mongoose from "mongoose";

const PatternSchema = mongoose.Schema({
    id: { type: Number, required: true },

    description: { type: String, required: true},

    key: { type: String, required: true},

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
});

export default mongoose.model("Pattern", PatternSchema);
