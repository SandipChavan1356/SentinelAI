import mongoose , { Schema } from "mongoose";

const ServiceSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },

        description: {
            type: String,
        },

        status: {
            type: String,
            enum: ["healthy", "degraded", "down"],
            default: "healthy",
        },
    },
    {
        timestamps: true,
    }
);

export const Service = mongoose.model("Service" , ServiceSchema);