import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, normalizeError } from "./client";
import type { ApiEnvelope, Incident, IncidentSeverity, IncidentStatus, VectorSearchResult } from "../types";

export interface CreateIncidentPayload {
  title: string;
  description?: string;
  severity: IncidentSeverity;
  services: string[];
  startedAt?: string;
}

async function fetchIncidents(): Promise<Incident[]> {
  const { data } = await client.get<ApiEnvelope<Incident[]>>("/incidents");
  return data.data;
}

async function fetchIncident(id: string): Promise<Incident> {
  const { data } = await client.get<ApiEnvelope<Incident>>(`/incidents/${id}`);
  return data.data;
}

async function postIncident(payload: CreateIncidentPayload): Promise<Incident> {
  const { data } = await client.post<ApiEnvelope<Incident>>("/incidents", payload);
  return data.data;
}

async function analyzeIncident(id: string): Promise<Incident> {
  const { data } = await client.post<ApiEnvelope<Incident>>(`/incidents/${id}/analyze`);
  return data.data;
}

async function patchIncidentStatus(id: string, status: IncidentStatus): Promise<Incident> {
  const { data } = await client.patch<ApiEnvelope<Incident>>(`/incidents/${id}/status`, { status });
  return data.data;
}

async function postVectorSearch(text: string): Promise<{ query: string; results: VectorSearchResult[] }> {
  const { data } = await client.post<ApiEnvelope<{ query: string; results: VectorSearchResult[] }>>(
    "/incidents/test-vector-search",
    { text }
  );
  return data.data;
}

export function useIncidents() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: fetchIncidents,
    refetchInterval: 20000,
  });
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => fetchIncident(id as string),
    enabled: Boolean(id),
    refetchInterval: 15000,
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}

export function useAnalyzeIncident(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => analyzeIncident(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["incidents", id], updated);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}

export function useUpdateIncidentStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: IncidentStatus) => patchIncidentStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData(["incidents", id], updated);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}

export function useVectorSearch() {
  return useMutation({
    mutationFn: postVectorSearch,
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}
