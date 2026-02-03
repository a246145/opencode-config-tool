import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Globe, Radio, Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { ServerConfig } from '@/types/config';
import { useConfigStore } from '@/hooks/useConfig';

export function ServerConfigPanel() {
  const { config, updateConfig } = useConfigStore();
  const server = config.server || {};
  const [newCorsOrigin, setNewCorsOrigin] = useState('');

  const updateServer = (updates: Partial<ServerConfig>) => {
    updateConfig({
      server: { ...server, ...updates }
    });
  };

  const addCorsOrigin = () => {
    if (newCorsOrigin.trim()) {
      const cors = [...(server.cors || []), newCorsOrigin.trim()];
      updateServer({ cors });
      setNewCorsOrigin('');
    }
  };

  const removeCorsOrigin = (index: number) => {
    const cors = (server.cors || []).filter((_, i) => i !== index);
    updateServer({ cors: cors.length > 0 ? cors : undefined });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          服务器配置
        </CardTitle>
        <CardDescription>
          配置 opencode serve 和 web 命令的服务器设置
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 端口 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="server-port">端口</Label>
            <Input
              id="server-port"
              type="number"
              min="1"
              max="65535"
              value={server.port || ''}
              onChange={(e) => updateServer({ port: parseInt(e.target.value) || undefined })}
              placeholder="默认端口"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="server-hostname">主机名</Label>
            <Input
              id="server-hostname"
              value={server.hostname || ''}
              onChange={(e) => updateServer({ hostname: e.target.value || undefined })}
              placeholder="localhost"
            />
          </div>
        </div>

        {/* mDNS 设置 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Radio className="h-4 w-4" />
                mDNS 服务发现
              </Label>
              <p className="text-xs text-muted-foreground">
                启用局域网内的服务自动发现
              </p>
            </div>
            <Switch
              checked={server.mdns ?? false}
              onCheckedChange={(checked) => updateServer({ mdns: checked })}
            />
          </div>

          {server.mdns && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="mdns-domain">mDNS 域名</Label>
              <Input
                id="mdns-domain"
                value={server.mdnsDomain || ''}
                onChange={(e) => updateServer({ mdnsDomain: e.target.value || undefined })}
                placeholder="opencode.local"
              />
            </div>
          )}
        </div>

        {/* CORS 设置 */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            CORS 允许的域名
          </Label>
          
          <div className="flex gap-2">
            <Input
              value={newCorsOrigin}
              onChange={(e) => setNewCorsOrigin(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === 'Enter' && addCorsOrigin()}
            />
            <Button onClick={addCorsOrigin} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {server.cors && server.cors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {server.cors.map((origin, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {origin}
                  <button onClick={() => removeCorsOrigin(index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            添加允许跨域访问的域名
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
