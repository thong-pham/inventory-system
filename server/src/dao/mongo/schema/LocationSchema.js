import mongoose from "mongoose";

const LocationSchema = mongoose.Schema({
    id: { type: Number, required: true },

    name: { type: String, required: true },

    products: [{
        sku: { type: String, required: true },
        quantity: { type: Number, required: true }
      }],

    total: { type: Number, required: true },

    createdAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-8))) },
    lastModifiedAt: { type: Date, default: new Date((new Date()).getTime() + (3600000*(-8))) },
});

export default mongoose.model("Location", LocationSchema);
