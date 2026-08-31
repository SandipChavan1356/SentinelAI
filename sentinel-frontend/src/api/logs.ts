import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, normalizeError } from "./client";
import type { ApiEnvelope, LogEntry } from "../types";

export interface CreateLogPayload {
  service: string;
  level: string;
  message: string;
}

async function fetchLogs(): Promise<LogEntry[]> {
  const { data } = await client.get<ApiEnvelope<LogEntry[]>>("/logs");
  return data.data;
}

async function fetchLogsByService(serviceId: string): Promise<LogEntry[]> {
  const { data } = await client.get<ApiEnvelope<LogEntry[]>>(`/logs/service/${serviceId}`);
  return data.data;
}

async function postLog(payload: CreateLogPayload): Promise<LogEntry> {
  const { data } = await client.post<ApiEnvelope<LogEntry>>("/logs", payload);
  return data.data;
}

export function useLogs(refetchMs = 15000) {
  return useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
    refetchInterval: refetchMs,
  });
}

export function useLogsByService(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["logs", "service", serviceId],
    queryFn: () => fetchLogsByService(serviceId as string),
    enabled: Boolean(serviceId),
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}
