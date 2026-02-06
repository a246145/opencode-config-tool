// src/components/config/ModelConfig.tsx
import { useState } from 'react';
import { useConfigStore } from '@/hooks/useConfig';
import { useOpencodeModels } from '@/hooks/useOpencodeModels';
import { ConfigCard } from '@/components/layout/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, Server, Target } from 'lucide-react';

type ModelTarget = 'model' | 'small_model';

export function ModelConfig() {
  const { config, updateConfig } = useConfigStore();
  const { modelsByProvider, isLoading, error } = useOpencodeModels();
  const [activeTarget, setActiveTarget] = useState<ModelTarget>('model');


  const handleModelSelect = (modelId: string) => {
    updateConfig({ [activeTarget]: modelId });
  };

  const targetLabels: Record<ModelTarget, string> = {
    model: '默认模型',
    small_model: '小模型',
  };

  return (
    <ConfigCard
      title="模型配置"
      description="配置默认使用的 AI 模型"
      icon={Cpu}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div
            className={`space-y-2 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
              activeTarget === 'model'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                : 'border-transparent hover:border-muted'
            }`}
            onClick={() => setActiveTarget('model')}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="model" className="cursor-pointer">默认模型</Label>
              {activeTarget === 'model' && (
                <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <Target className="h-3 w-3" />
                  选择目标
                </span>
              )}
            </div>
            <Input
              id="model"
              value={config.model || ''}
              onChange={(e) => updateConfig({ model: e.target.value })}
              onFocus={() => setActiveTarget('model')}
              placeholder="anthropic/claude-sonnet-4-20250514"
            />
            <p className="text-xs text-muted-foreground">
              格式: provider/model-id
            </p>
          </div>
          <div
            className={`space-y-2 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
              activeTarget === 'small_model'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                : 'border-transparent hover:border-muted'
            }`}
            onClick={() => setActiveTarget('small_model')}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="small_model" className="cursor-pointer">小模型 (轻量任务)</Label>
              {activeTarget === 'small_model' && (
                <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                  <Target className="h-3 w-3" />
                  选择目标
                </span>
              )}
            </div>
            <Input
              id="small_model"
              value={config.small_model || ''}
              onChange={(e) => updateConfig({ small_model: e.target.value })}
              onFocus={() => setActiveTarget('small_model')}
              placeholder="anthropic/claude-haiku-4-20250514"
            />
            <p className="text-xs text-muted-foreground">
              用于轻量级任务，节省成本
            </p>
          </div>
        </div>

        {/* 从已配置提供商获取的模型快速选择 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>快速选择</Label>
            <span className="text-xs text-muted-foreground">
              点击模型将填充到「{targetLabels[activeTarget]}」
            </span>
          </div>
          {Object.keys(modelsByProvider).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(modelsByProvider).map(([providerId, models]) => (
                <div key={providerId} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Server className="h-4 w-4" />
                    <span className="font-medium">{providerId}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {models.map((model) => {
                      const isSelectedForModel = config.model === model.fullId;
                      const isSelectedForSmall = config.small_model === model.fullId;

                      return (
                        <button
                          key={model.fullId}
                          onClick={() => handleModelSelect(model.fullId)}
                          className={`p-2 text-sm rounded border transition-colors text-left relative ${
                            (activeTarget === 'model' && isSelectedForModel) ||
                            (activeTarget === 'small_model' && isSelectedForSmall)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'border-border hover:border-muted-foreground text-foreground'
                          }`}
                          title={model.fullId}
                        >
                          <span>{model.modelName}</span>
                          {/* 显示模型被哪些字段使用 */}
                          <div className="flex gap-1 mt-1">
                            {isSelectedForModel && (
                              <span className="text-[10px] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                                默认
                              </span>
                            )}
                            {isSelectedForSmall && (
                              <span className="text-[10px] px-1 py-0.5 rounded bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                                小模型
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
              <p>未能获取可用模型列表</p>
              <p className="mt-1">请确认已安装并可执行 `opencode models`</p>
              {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
              {isLoading && <p className="mt-1 text-xs">正在加载模型列表...</p>}
            </div>
          )}
        </div>
      </div>
    </ConfigCard>
  );
}
