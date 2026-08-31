import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, normalizeError } from "./client";
import type { ApiEnvelope, Service, ServiceStatus } from "../types";

export interface CreateServicePayload {
  name: string;
  description?: string;
  status?: ServiceStatus;
}

async function fetchServices(): Promise<Service[]> {
  const { data } = await client.get<ApiEnvelope<Service[]>>("/services");
  return data.data;
}

async function fetchService(id: string): Promise<Service> {
  const { data } = await client.get<ApiEnvelope<Service>>(`/services/${id}`);
  return data.data;
}

async function postService(payload: CreateServicePayload): Promise<Service> {
  const { data } = await client.post<ApiEnvelope<Service>>("/services", payload);
  return data.data;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    refetchInterval: 20000,
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => fetchService(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}
