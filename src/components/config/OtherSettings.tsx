// src/components/config/OtherSettings.tsx
import { useConfigStore } from '@/hooks/useConfig';
import { ConfigCard } from '@/components/layout/Card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings, Share2, RefreshCw } from 'lucide-react';

export function OtherSettings() {
  const { config, updateConfig } = useConfigStore();

  return (
    <div className="space-y-6">
      <ConfigCard title="分享设置" icon={Share2}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>会话分享</Label>
              <p className="text-sm text-muted-foreground">
                控制是否允许分享会话
              </p>
            </div>
            <Select
              value={config.share || 'auto'}
              onValueChange={(value: 'manual' | 'auto' | 'disabled') => updateConfig({ share: value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">手动</SelectItem>
                <SelectItem value="auto">自动</SelectItem>
                <SelectItem value="disabled">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ConfigCard>

      <ConfigCard title="更新设置" icon={RefreshCw}>
        <div className="flex items-center justify-between">
          <div>
            <Label>自动更新</Label>
            <p className="text-sm text-muted-foreground">
              启用后 OpenCode 将自动检查并安装更新
            </p>
          </div>
          <Switch
            checked={config.autoupdate === true || config.autoupdate === 'notify' || config.autoupdate === undefined}
            onCheckedChange={(checked) => updateConfig({ autoupdate: checked ? true : false })}
          />
        </div>
      </ConfigCard>

      <ConfigCard title="模型配置" icon={Settings}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>默认模型</Label>
              <p className="text-sm text-muted-foreground">
                {config.model || '未设置'}
              </p>
            </div>
            <div className="space-y-2">
              <Label>小模型</Label>
              <p className="text-sm text-muted-foreground">
                {config.small_model || '未设置'}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            模型配置请在 "模型配置" 页面进行设置
          </p>
        </div>
      </ConfigCard>
    </div>
  );
}
