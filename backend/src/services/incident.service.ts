import { Log } from "../models/log.model";
import { Incident } from "../models/incident.model";

const detectIncident = async (
    serviceId: string,
    level: string,
    message: string
) => {

    if (level !== "error") {
        return;
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentLogs = await Log.find({
        service: serviceId,
        level: "error",
        message,
        createdAt: {
            $gte: fiveMinutesAgo,
        },
    });

    if (recentLogs.length < 5) {
        return;
    }

    const existingIncident = await Incident.findOne({
        services: serviceId,
        title: message,
        status: {
            $in: ["open", "investigating"],
        },
    });

    if (existingIncident) {
        return;
    }

    const incident = await Incident.create({
        title: message,
        description: `Repeated error detected: ${message}`,
        severity: "high",
        status: "open",
        services: [serviceId],
        rootCause: "Not analyzed yet",
        confidence: 80,
        startedAt: recentLogs[0].createdAt,
    });

    console.log("🚨 INCIDENT DETECTED:", incident._id);

    return incident;
};

export { detectIncident };