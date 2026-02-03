// src/components/config/ModelConfig.tsx
import { useConfigStore } from '@/hooks/useConfig';
import { ConfigCard } from '@/components/layout/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu } from 'lucide-react';

export function ModelConfig() {
  const { config, updateConfig } = useConfigStore();

  return (
    <ConfigCard
      title="模型配置"
      description="配置默认使用的 AI 模型"
      icon={Cpu}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="model">默认模型</Label>
            <Input
              id="model"
              value={config.model || ''}
              onChange={(e) => updateConfig({ model: e.target.value })}
              placeholder="anthropic/claude-sonnet-4-20250514"
            />
            <p className="text-xs text-muted-foreground">
              格式: provider/model-id
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="small_model">小模型 (轻量任务)</Label>
            <Input
              id="small_model"
              value={config.small_model || ''}
              onChange={(e) => updateConfig({ small_model: e.target.value })}
              placeholder="anthropic/claude-haiku-4-20250514"
            />
            <p className="text-xs text-muted-foreground">
              用于轻量级任务，节省成本
            </p>
          </div>
        </div>

        {/* 常用模型快速选择 */}
        <div>
          <Label className="mb-3 block">快速选择</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: 'anthropic/claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
              { id: 'anthropic/claude-opus-4-20250514', name: 'Claude Opus 4' },
              { id: 'anthropic/claude-haiku-4-20250514', name: 'Claude Haiku 4' },
              { id: 'openai/gpt-4o', name: 'GPT-4o' },
              { id: 'openai/o1-preview', name: 'o1-preview' },
              { id: 'google/gemini-pro', name: 'Gemini Pro' },
            ].map((model) => (
              <button
                key={model.id}
                onClick={() => updateConfig({ model: model.id })}
                className={`p-2 text-sm rounded border transition-colors ${
                  config.model === model.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-border hover:border-muted-foreground text-foreground'
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ConfigCard>
  );
}
