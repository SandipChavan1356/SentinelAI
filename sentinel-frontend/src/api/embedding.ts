import { useMutation } from "@tanstack/react-query";
import { client, normalizeError } from "./client";
import type { ApiEnvelope } from "../types";

interface EmbeddingTestResult {
  text: string;
  embedding: number[];
  dimensions: number;
}

async function postEmbeddingTest(text: string): Promise<EmbeddingTestResult> {
  const { data } = await client.post<ApiEnvelope<EmbeddingTestResult>>("/embedding/test", { text });
  return data.data;
}

export function useEmbeddingTest() {
  return useMutation({
    mutationFn: postEmbeddingTest,
    onError: (err) => {
      throw normalizeError(err);
    },
  });
}
