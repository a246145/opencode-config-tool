import { useCallback, useEffect, useMemo, useState } from 'react';

export interface OpencodeModelInfo {
  providerId: string;
  modelId: string;
  modelName: string;
  fullId: string;
}

const parseOpencodeModelsOutput = (output: string): OpencodeModelInfo[] => {
  const models: OpencodeModelInfo[] = [];
  const seen = new Set<string>();

  output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .forEach((line) => {
      const match = line.match(/([A-Za-z0-9_.-]+\/[^\s]+)/);
      const token = match?.[1];
      if (!token) return;

      const [providerId, modelId] = token.split('/', 2);
      if (!providerId || !modelId) return;

      const fullId = `${providerId}/${modelId}`;
      if (seen.has(fullId)) return;
      seen.add(fullId);

      models.push({
        providerId,
        modelId,
        modelName: modelId,
        fullId,
      });
    });

  return models;
};

export const useOpencodeModels = () => {
  const [models, setModels] = useState<OpencodeModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let output = '';

      if (typeof window !== 'undefined' && window.electronAPI?.getOpencodeModels) {
        output = await window.electronAPI.getOpencodeModels();
      } else {
        const response = await fetch('/api/models');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        output = typeof data.output === 'string' ? data.output : '';
      }

      setModels(parseOpencodeModelsOutput(output));
    } catch (err) {
      setModels([]);
      setError(err instanceof Error ? err.message : '无法获取模型列表');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchModels();
  }, [fetchModels]);

  const modelsByProvider = useMemo(() => {
    const grouped: Record<string, OpencodeModelInfo[]> = {};
    models.forEach((model) => {
      if (!grouped[model.providerId]) {
        grouped[model.providerId] = [];
      }
      grouped[model.providerId].push(model);
    });
    return grouped;
  }, [models]);

  return {
    models,
    modelsByProvider,
    isLoading,
    error,
    refresh: fetchModels,
  };
};
