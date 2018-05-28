import mongoose from "mongoose";

const TrashSchema = mongoose.Schema({

    id: { type: Number, required: true },

    data: { type: mongoose.Schema.Types.Mixed, required: true },

    type: { type: String, required: true },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-7))) },

});

export default mongoose.model("Trash", TrashSchema);
