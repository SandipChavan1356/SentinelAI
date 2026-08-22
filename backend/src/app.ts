import express from "express";
import logRouter from "./routes/log.route";
import serviceRouter from "./routes/service.route";
import incidentRouter from "./routes/incident.route";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/logs", logRouter);
app.use("/api/v1/services", serviceRouter);

app.use("/api/v1/incidents", incidentRouter);

export { app };