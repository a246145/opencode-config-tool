import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Bot, Ban, CheckCircle, FolderSearch, Building2, Eye, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useConfigStore } from '@/hooks/useConfig';

export function MiscConfigPanel() {
  const { config, updateConfig } = useConfigStore();
  const [newDisabledProvider, setNewDisabledProvider] = useState('');
  const [newEnabledProvider, setNewEnabledProvider] = useState('');
  const [newIgnorePattern, setNewIgnorePattern] = useState('');
  const [newSkillPath, setNewSkillPath] = useState('');

  // Provider 管理
  const addDisabledProvider = () => {
    if (newDisabledProvider.trim()) {
      const providers = [...(config.disabled_providers || []), newDisabledProvider.trim()];
      updateConfig({ disabled_providers: providers });
      setNewDisabledProvider('');
    }
  };

  const removeDisabledProvider = (index: number) => {
    const providers = (config.disabled_providers || []).filter((_, i) => i !== index);
    updateConfig({ disabled_providers: providers.length > 0 ? providers : undefined });
  };

  const addEnabledProvider = () => {
    if (newEnabledProvider.trim()) {
      const providers = [...(config.enabled_providers || []), newEnabledProvider.trim()];
      updateConfig({ enabled_providers: providers });
      setNewEnabledProvider('');
    }
  };

  const removeEnabledProvider = (index: number) => {
    const providers = (config.enabled_providers || []).filter((_, i) => i !== index);
    updateConfig({ enabled_providers: providers.length > 0 ? providers : undefined });
  };

  // Watcher 管理
  const addIgnorePattern = () => {
    if (newIgnorePattern.trim()) {
      const ignore = [...(config.watcher?.ignore || []), newIgnorePattern.trim()];
      updateConfig({ watcher: { ...config.watcher, ignore } });
      setNewIgnorePattern('');
    }
  };

  const removeIgnorePattern = (index: number) => {
    const ignore = (config.watcher?.ignore || []).filter((_, i) => i !== index);
    updateConfig({ 
      watcher: ignore.length > 0 ? { ...config.watcher, ignore } : undefined 
    });
  };

  // Skills 管理
  const addSkillPath = () => {
    if (newSkillPath.trim()) {
      const paths = [...(config.skills?.paths || []), newSkillPath.trim()];
      updateConfig({ skills: { ...config.skills, paths } });
      setNewSkillPath('');
    }
  };

  const removeSkillPath = (index: number) => {
    const paths = (config.skills?.paths || []).filter((_, i) => i !== index);
    updateConfig({ 
      skills: paths.length > 0 ? { ...config.skills, paths } : undefined 
    });
  };

  return (
    <div className="space-y-6">
      {/* 用户设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            用户设置
          </CardTitle>
          <CardDescription>
            个人偏好和显示设置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={config.username || ''}
              onChange={(e) => updateConfig({ username: e.target.value || undefined })}
              placeholder="使用系统用户名"
            />
            <p className="text-xs text-muted-foreground">
              在对话中显示的自定义用户名
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-agent">默认 Agent</Label>
            <Select
              value={config.default_agent || 'build'}
              onValueChange={(value) => updateConfig({ default_agent: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择默认 Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="build">Build (构建)</SelectItem>
                <SelectItem value="plan">Plan (规划)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              启动时使用的默认主 Agent
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>快照</Label>
              <p className="text-xs text-muted-foreground">
                启用文件快照功能
              </p>
            </div>
            <Switch
              checked={config.snapshot ?? false}
              onCheckedChange={(checked) => updateConfig({ snapshot: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Provider 过滤 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Provider 过滤
          </CardTitle>
          <CardDescription>
            控制哪些 Provider 被加载
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 禁用的 Providers */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              禁用的 Providers
            </Label>
            <p className="text-xs text-muted-foreground">
              这些 Provider 将不会被加载
            </p>
            
            <div className="flex gap-2">
              <Input
                value={newDisabledProvider}
                onChange={(e) => setNewDisabledProvider(e.target.value)}
                placeholder="provider 名称"
                onKeyDown={(e) => e.key === 'Enter' && addDisabledProvider()}
              />
              <Button onClick={addDisabledProvider} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {config.disabled_providers && config.disabled_providers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.disabled_providers.map((provider, index) => (
                  <Badge key={index} variant="destructive" className="gap-1">
                    {provider}
                    <button onClick={() => removeDisabledProvider(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 启用的 Providers (白名单模式) */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              仅启用的 Providers (白名单)
            </Label>
            <p className="text-xs text-muted-foreground">
              设置后，只有这些 Provider 会被启用，其他全部忽略
            </p>
            
            <div className="flex gap-2">
              <Input
                value={newEnabledProvider}
                onChange={(e) => setNewEnabledProvider(e.target.value)}
                placeholder="provider 名称"
                onKeyDown={(e) => e.key === 'Enter' && addEnabledProvider()}
              />
              <Button onClick={addEnabledProvider} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {config.enabled_providers && config.enabled_providers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.enabled_providers.map((provider, index) => (
                  <Badge key={index} variant="default" className="gap-1">
                    {provider}
                    <button onClick={() => removeEnabledProvider(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 文件监视 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            文件监视
          </CardTitle>
          <CardDescription>
            配置文件监视器的忽略模式
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>忽略模式</Label>
          <p className="text-xs text-muted-foreground">
            匹配这些模式的文件/目录不会被监视
          </p>
          
          <div className="flex gap-2">
            <Input
              value={newIgnorePattern}
              onChange={(e) => setNewIgnorePattern(e.target.value)}
              placeholder="例如: node_modules/**"
              onKeyDown={(e) => e.key === 'Enter' && addIgnorePattern()}
            />
            <Button onClick={addIgnorePattern} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {config.watcher?.ignore && config.watcher.ignore.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.watcher.ignore.map((pattern, index) => (
                <Badge key={index} variant="secondary" className="gap-1 font-mono text-xs">
                  {pattern}
                  <button onClick={() => removeIgnorePattern(index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 技能路径 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderSearch className="h-5 w-5" />
            技能路径
          </CardTitle>
          <CardDescription>
            添加额外的技能文件夹路径
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newSkillPath}
              onChange={(e) => setNewSkillPath(e.target.value)}
              placeholder="/path/to/skills"
              onKeyDown={(e) => e.key === 'Enter' && addSkillPath()}
            />
            <Button onClick={addSkillPath} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {config.skills?.paths && config.skills.paths.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {config.skills.paths.map((path, index) => (
                <Badge key={index} variant="secondary" className="gap-1 font-mono text-xs">
                  {path}
                  <button onClick={() => removeSkillPath(index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 企业版 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            企业版配置
          </CardTitle>
          <CardDescription>
            企业版部署相关设置
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="enterprise-url">企业版 URL</Label>
          <Input
            id="enterprise-url"
            value={config.enterprise?.url || ''}
            onChange={(e) => updateConfig({ 
              enterprise: e.target.value ? { url: e.target.value } : undefined 
            })}
            placeholder="https://opencode.your-company.com"
          />
        </CardContent>
      </Card>
    </div>
  );
}
