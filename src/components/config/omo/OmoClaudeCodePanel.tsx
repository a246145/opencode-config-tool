// src/components/config/omo/OmoClaudeCodePanel.tsx
import { useEffect, useState, type ChangeEvent } from 'react';
import { ConfigCard } from '@/components/layout/Card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings2 } from 'lucide-react';
import { useOhMyOpenCodeStore } from '@/hooks/useOhMyOpenCode';

export function OmoClaudeCodePanel() {
  const { config, updateConfig } = useOhMyOpenCodeStore();
  const [pluginsJson, setPluginsJson] = useState('');
  const [pluginsError, setPluginsError] = useState<string | null>(null);

  useEffect(() => {
    setPluginsJson(config.claude_code?.plugins_override ? JSON.stringify(config.claude_code.plugins_override, null, 2) : '');
    setPluginsError(null);
  }, [config.claude_code?.plugins_override]);

  const features = [
    { key: 'mcp', label: 'MCP', description: '启用 MCP 服务器支持' },
    { key: 'commands', label: 'Commands', description: '启用命令功能' },
    { key: 'skills', label: 'Skills', description: '启用技能功能' },
    { key: 'agents', label: 'Agents', description: '启用代理功能' },
    { key: 'hooks', label: 'Hooks', description: '启用钩子功能' },
    { key: 'plugins', label: 'Plugins', description: '启用插件功能' },
  ] as const;

  return (
    <ConfigCard
      title="Claude Code 兼容性"
      description="配置 Claude Code 功能开关"
      icon={Settings2}
    >
      <div className="space-y-4">
        {features.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <Label>{label}</Label>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch
              checked={config.claude_code?.[key] ?? true}
              onCheckedChange={(checked) => updateConfig({
                claude_code: { ...config.claude_code, [key]: checked }
              })}
            />
          </div>
        ))}

        <div>
          <Label className="text-xs text-muted-foreground">插件覆盖配置 (JSON)</Label>
          <Textarea
            className="mt-1 font-mono text-xs"
            rows={3}
            placeholder={`{\n  "plugin-id": true\n}`}
            value={pluginsJson}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPluginsJson(e.target.value)}
            onBlur={() => {
              if (!pluginsJson.trim()) {
                setPluginsError(null);
                updateConfig({
                  claude_code: { ...config.claude_code, plugins_override: undefined }
                });
                return;
              }
              try {
                const parsed = JSON.parse(pluginsJson);
                setPluginsError(null);
                updateConfig({
                  claude_code: { ...config.claude_code, plugins_override: parsed }
                });
              } catch (parseError) {
                setPluginsError(parseError instanceof Error ? parseError.message : '无效 JSON');
              }
            }}
          />
          {pluginsError && <p className="text-xs text-destructive">{pluginsError}</p>}
        </div>
      </div>
    </ConfigCard>
  );
}
