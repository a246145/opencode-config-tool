import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Paintbrush, Plus, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { FormatterLanguageConfig } from '@/types/config';
import { useConfigStore } from '@/hooks/useConfig';

const COMMON_FORMATTERS = [
  { language: 'typescript', name: 'TypeScript/JavaScript', command: 'prettier --write' },
  { language: 'python', name: 'Python', command: 'black' },
  { language: 'go', name: 'Go', command: 'gofmt -w' },
  { language: 'rust', name: 'Rust', command: 'rustfmt' },
];

export function FormatterConfigPanel() {
  const { config, updateConfig } = useConfigStore();
  const [newLanguage, setNewLanguage] = useState('');
  const [expandedFormatters, setExpandedFormatters] = useState<Set<string>>(new Set());

  const formatterDisabled = config.formatter === false;
  const formatterConfig = typeof config.formatter === 'object' ? config.formatter : {};

  const toggleFormatter = (enabled: boolean) => {
    if (enabled) {
      updateConfig({ formatter: {} });
    } else {
      updateConfig({ formatter: false });
    }
  };

  const updateFormatterLanguage = (language: string, langConfig: FormatterLanguageConfig | undefined) => {
    if (formatterDisabled) return;

    const newFormatter = { ...formatterConfig };
    if (langConfig === undefined) {
      delete newFormatter[language];
    } else {
      newFormatter[language] = langConfig;
    }
    updateConfig({ formatter: Object.keys(newFormatter).length > 0 ? newFormatter : undefined });
  };

  const toggleExpand = (language: string) => {
    const newExpanded = new Set(expandedFormatters);
    if (newExpanded.has(language)) {
      newExpanded.delete(language);
    } else {
      newExpanded.add(language);
    }
    setExpandedFormatters(newExpanded);
  };

  const addCustomFormatter = () => {
    if (newLanguage.trim() && !formatterConfig[newLanguage]) {
      updateFormatterLanguage(newLanguage.trim(), {
        command: [],
        extensions: [],
      });
      setNewLanguage('');
      setExpandedFormatters(new Set([...expandedFormatters, newLanguage.trim()]));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paintbrush className="h-5 w-5" />
          代码格式化器
        </CardTitle>
        <CardDescription>
          配置各编程语言的代码格式化工具
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 全局开关 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>启用代码格式化</Label>
            <p className="text-xs text-muted-foreground">
              禁用将关闭所有自动格式化功能
            </p>
          </div>
          <Switch
            checked={!formatterDisabled}
            onCheckedChange={toggleFormatter}
          />
        </div>

        {!formatterDisabled && (
          <>
            {/* 常用格式化器 */}
            <div className="space-y-3">
              <Label>常用格式化器</Label>
              <div className="grid gap-2">
                {COMMON_FORMATTERS.map((fmt) => {
                  const langConfig = formatterConfig[fmt.language];
                  const isDisabled = langConfig?.disabled === true;
                  const isExpanded = expandedFormatters.has(fmt.language);

                  return (
                    <Collapsible key={fmt.language} open={isExpanded} onOpenChange={() => toggleExpand(fmt.language)}>
                      <div className="border rounded-lg">
                        <div className="flex items-center justify-between p-3">
                          <CollapsibleTrigger className="flex items-center gap-2 flex-1">
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            <div className="text-left">
                              <p className="font-medium">{fmt.name}</p>
                              <p className="text-xs text-muted-foreground">
                                默认: {fmt.command}
                              </p>
                            </div>
                          </CollapsibleTrigger>
                          <Switch
                            checked={!isDisabled}
                            onCheckedChange={(enabled) => {
                              if (enabled) {
                                updateFormatterLanguage(fmt.language, undefined);
                              } else {
                                updateFormatterLanguage(fmt.language, { disabled: true });
                              }
                            }}
                          />
                        </div>
                        <CollapsibleContent className="p-3 pt-0 space-y-3 border-t">
                          <div className="space-y-2">
                            <Label>自定义命令</Label>
                            <Input
                              value={langConfig?.command?.join(' ') || ''}
                              onChange={(e) => updateFormatterLanguage(fmt.language, {
                                ...langConfig,
                                command: e.target.value ? e.target.value.split(' ').filter(Boolean) : undefined,
                              })}
                              placeholder={fmt.command}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>文件扩展名</Label>
                            <Input
                              value={langConfig?.extensions?.join(', ') || ''}
                              onChange={(e) => updateFormatterLanguage(fmt.language, {
                                ...langConfig,
                                extensions: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : undefined,
                              })}
                              placeholder="自动检测"
                            />
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            </div>

            {/* 自定义格式化器 */}
            <div className="space-y-3">
              <Label>添加自定义格式化器</Label>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="语言名称 (如 kotlin)"
                  onKeyDown={(e) => e.key === 'Enter' && addCustomFormatter()}
                />
                <Button onClick={addCustomFormatter} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {Object.entries(formatterConfig)
                .filter(([lang]) => !COMMON_FORMATTERS.some(f => f.language === lang))
                .map(([language, langConfig]) => (
                  <div key={language} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{language}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateFormatterLanguage(language, undefined)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>命令</Label>
                      <Input
                        value={langConfig.command?.join(' ') || ''}
                        onChange={(e) => updateFormatterLanguage(language, {
                          ...langConfig,
                          command: e.target.value.split(' ').filter(Boolean),
                        })}
                        placeholder="格式化命令"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>文件扩展名</Label>
                      <Input
                        value={langConfig.extensions?.join(', ') || ''}
                        onChange={(e) => updateFormatterLanguage(language, {
                          ...langConfig,
                          extensions: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                        })}
                        placeholder=".kt, .kts"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
