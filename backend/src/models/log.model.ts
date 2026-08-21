import mongoose, { Schema } from "mongoose";

const LogSchema = new Schema(
    {
        service: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        level: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Log = mongoose.model("Log", LogSchema);