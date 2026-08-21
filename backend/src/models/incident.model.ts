import mongoose , {Schema} from "mongoose";

const IncidentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

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

        rootCause: {
            type: String,
        },

        confidence: {
            type: Number,
            min: 0,
            max: 100,
        },

        startedAt: {
            type: Date,
        },

        resolvedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const Incident = mongoose.model("Incident" , IncidentSchema);