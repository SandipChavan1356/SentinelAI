export type ServiceStatus = "healthy" | "degraded" | "down";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "investigating" | "resolved";
export type LogLevel = "debug" | "info" | "warn" | "error";
export type KnowledgeSource = "manual" | "incident";

export interface Service {
  _id: string;
  name: string;
  description?: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LogEntry {
  _id: string;
  service: Service | string;
  level: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiAnalysis {
  summary?: string;
  rootCause?: string;
  suggestedFix?: string;
  reasoning?: string;
}

export interface Incident {
  _id: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  services: Service[] | string[];
  rootCause?: string;
  confidence?: number;
  aiAnalysis?: AiAnalysis;
  startedAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeEntry {
  _id: string;
  title: string;
  content: string;
  solution: string;
  source: KnowledgeSource;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface VectorSearchResult {
  _id: string;
  service?: string;
  level?: string;
  message?: string;
  title?: string;
  content?: string;
  solution?: string;
  source?: string;
  createdAt?: string;
  score: number;
}
