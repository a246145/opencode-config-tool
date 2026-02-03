import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Minimize2, Scissors } from 'lucide-react';
import type { CompactionConfig } from '@/types/config';
import { useConfigStore } from '@/hooks/useConfig';

export function CompactionConfigPanel() {
  const { config, updateConfig } = useConfigStore();
  const compaction = config.compaction || {};

  const updateCompaction = (updates: Partial<CompactionConfig>) => {
    updateConfig({
      compaction: { ...compaction, ...updates }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Minimize2 className="h-5 w-5" />
          上下文压缩
        </CardTitle>
        <CardDescription>
          控制对话上下文的自动压缩和修剪行为
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 自动压缩 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Minimize2 className="h-4 w-4" />
              自动压缩
            </Label>
            <p className="text-xs text-muted-foreground">
              当上下文接近限制时自动压缩对话历史
            </p>
          </div>
          <Switch
            checked={compaction.auto ?? true}
            onCheckedChange={(checked) => updateCompaction({ auto: checked })}
          />
        </div>

        {/* 修剪旧输出 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              修剪旧输出
            </Label>
            <p className="text-xs text-muted-foreground">
              自动移除旧的工具输出以节省上下文空间
            </p>
          </div>
          <Switch
            checked={compaction.prune ?? true}
            onCheckedChange={(checked) => updateCompaction({ prune: checked })}
          />
        </div>

        <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          <p>💡 提示：禁用这些选项可能导致上下文溢出错误，建议保持默认启用状态。</p>
        </div>
      </CardContent>
    </Card>
  );
}
