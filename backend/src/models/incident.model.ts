import mongoose , {Schema} from "mongoose";

const IncidentSchema = new Schema(
    {
        title: String,
        description: String,

        severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "low",
        },

        status: {
            type: String,
            enum: ["open", "investigating", "resolved"],
            default: "open",
        },

        services: [
            {
                type: Schema.Types.ObjectId,
                ref: "Service",
            },
        ],

        rootCause: String,

        confidence: {
            type: Number,
            min: 0,
            max: 100,
        },

        aiAnalysis: {
            summary: String,
            rootCause: String,
            suggestedFix: String,
            reasoning: String,
        },

        startedAt: Date,
        resolvedAt: Date,
    },
    { timestamps: true }
);

export const Incident = mongoose.model("Incident" , IncidentSchema);