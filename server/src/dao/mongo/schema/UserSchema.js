import mongoose from "mongoose";

const MemberSchema = mongoose.Schema({
    id: { type: Number, required: true },

    username: {type: String, required: true},

    name: {
        en: { type: String, required: false },
    },
    email: { type: String, required: false },
    company: { type: String, required: true },
    number: { type: String, required: false },
    passwordHash: { type: String, required: true },
    roles: [{ type: String, required: true, enum: ["admin","storeManager","worker"] }],

    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Member", MemberSchema);
