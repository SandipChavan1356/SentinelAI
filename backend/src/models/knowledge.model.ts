import mongoose, { Schema } from "mongoose";

const KnowledgeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        solution: {
            type: String,
            required: true,
        },

        source: {
            type: String,
            enum: ["manual", "incident"],
            default: "manual",
        },

        embedding: {
            type: [Number],
        },
    },
    {
        timestamps: true,
    }
);

export const Knowledge = mongoose.model(
    "Knowledge",
    KnowledgeSchema
);