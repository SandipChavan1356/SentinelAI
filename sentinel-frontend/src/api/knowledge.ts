import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, normalizeError } from "./client";
import type { ApiEnvelope, KnowledgeEntry } from "../types";

export interface CreateKnowledgePayload {
  title: string;
  content: string;
  solution: string;
}

async function fetchKnowledge(): Promise<KnowledgeEntry[]> {
  const { data } = await client.get<ApiEnvelope<KnowledgeEntry[]>>("/knowledge");
  return data.data;
}

async function postKnowledge(payload: CreateKnowledgePayload): Promise<KnowledgeEntry> {
  const { data } = await client.post<ApiEnvelope<KnowledgeEntry>>("/knowledge", {
    ...payload,
    source: "manual",
  });
  return data.data;
}

export function useKnowledge() {
  return useQuery({
    queryKey: ["knowledge"],
    queryFn: fetchKnowledge,
  });
}

export function useCreateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
    },
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}
