// src/components/config/PermissionEditor.tsx
import { useState } from 'react';
import { useConfigStore } from '@/hooks/useConfig';
import { ConfigCard } from '@/components/layout/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield, Plus, Trash2, Edit, FileText, Terminal, Globe, Search } from 'lucide-react';
import type { PermissionValue, PermissionRule, ToolPermissions } from '@/types/config';
import { TOOL_PERMISSIONS } from '@/types/config';

// 工具分类
const TOOL_CATEGORIES = {
  file: {
    name: '文件操作',
    icon: FileText,
    tools: ['read', 'edit', 'glob', 'grep', 'list'],
  },
  execution: {
    name: '执行',
    icon: Terminal,
    tools: ['bash', 'task', 'skill', 'lsp', 'question'],
  },
  todo: {
    name: 'Todo',
    icon: FileText,
    tools: ['todoread', 'todowrite'],
  },
  network: {
    name: '网络',
    icon: Globe,
    tools: ['webfetch', 'websearch', 'codesearch'],
  },
  safety: {
    name: '安全',
    icon: Shield,
    tools: ['external_directory', 'doom_loop'],
  },
};

// 工具描述
const TOOL_DESCRIPTIONS: Record<string, string> = {
  read: '读取文件内容',
  edit: '编辑/修改文件',
  glob: '文件模式匹配',
  grep: '内容搜索',
  list: '列出目录内容',
  bash: '执行 Shell 命令',
  task: '启动子代理',
  skill: '加载技能',
  lsp: 'LSP 查询',
  todoread: '读取 Todo 列表',
  todowrite: '写入 Todo 列表',
  question: '询问用户',
  webfetch: '获取 URL 内容',
  websearch: '网页搜索',
  codesearch: '代码搜索',
  external_directory: '访问项目外目录',
  doom_loop: '重复调用检测',
};

interface GlobRule {
  pattern: string;
  value: PermissionValue;
}

interface RuleEditorProps {
  tool: string;
  rule: PermissionRule;
  onSave: (rule: PermissionRule) => void;
  onClose: () => void;
}

function RuleEditor({ tool, rule, onSave, onClose }: RuleEditorProps) {
  const [mode, setMode] = useState<'simple' | 'glob'>(
    typeof rule === 'string' ? 'simple' : 'glob'
  );
  const [simpleValue, setSimpleValue] = useState<PermissionValue>(
    typeof rule === 'string' ? rule : 'ask'
  );
  const [globRules, setGlobRules] = useState<GlobRule[]>(
    typeof rule === 'object'
      ? Object.entries(rule).map(([pattern, value]) => ({ pattern, value }))
      : [{ pattern: '*', value: 'ask' }]
  );
  const [newPattern, setNewPattern] = useState('');

  const handleAddGlobRule = () => {
    if (!newPattern) return;
    setGlobRules([...globRules, { pattern: newPattern, value: 'ask' }]);
    setNewPattern('');
  };

  const handleRemoveGlobRule = (index: number) => {
    setGlobRules(globRules.filter((_, i) => i !== index));
  };

  const handleUpdateGlobRule = (index: number, field: 'pattern' | 'value', value: string) => {
    const updated = [...globRules];
    updated[index] = { ...updated[index], [field]: value };
    setGlobRules(updated);
  };

  const handleSave = () => {
    if (mode === 'simple') {
      onSave(simpleValue);
    } else {
      const ruleObj: Record<string, PermissionValue> = {};
      globRules.forEach(({ pattern, value }) => {
        ruleObj[pattern] = value;
      });
      onSave(ruleObj);
    }
  };

  return (
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>编辑 {tool} 权限</DialogTitle>
        <DialogDescription>{TOOL_DESCRIPTIONS[tool]}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* 模式选择 */}
        <div className="space-y-2">
          <Label>权限模式</Label>
          <Select value={mode} onValueChange={(v: 'simple' | 'glob') => setMode(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">简单模式 (统一权限)</SelectItem>
              <SelectItem value="glob">Glob 模式 (模式匹配)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === 'simple' ? (
          <div className="space-y-2">
            <Label>权限值</Label>
            <Select value={simpleValue} onValueChange={(v: PermissionValue) => setSimpleValue(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allow">✅ 允许 (Allow)</SelectItem>
                <SelectItem value="ask">❓ 询问 (Ask)</SelectItem>
                <SelectItem value="deny">❌ 拒绝 (Deny)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                placeholder={tool === 'bash' ? 'git *' : '*.md'}
                className="flex-1"
              />
              <Button onClick={handleAddGlobRule} disabled={!newPattern}>
                <Plus className="h-4 w-4 mr-2" />
                添加规则
              </Button>
            </div>

            <div className="space-y-2">
              {globRules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <Input
                    value={rule.pattern}
                    onChange={(e) => handleUpdateGlobRule(index, 'pattern', e.target.value)}
                    className="flex-1 font-mono text-sm"
                  />
                  <Select
                    value={rule.value}
                    onValueChange={(v: PermissionValue) => handleUpdateGlobRule(index, 'value', v)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allow">允许</SelectItem>
                      <SelectItem value="ask">询问</SelectItem>
                      <SelectItem value="deny">拒绝</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleRemoveGlobRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              提示: 规则按顺序匹配，最后匹配的规则生效。建议将 "*" 放在最前面作为默认值。
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>取消</Button>
        <Button onClick={handleSave}>保存</Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function PermissionEditor() {
  const { config, updatePermission } = useConfigStore();
  const [editingTool, setEditingTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const permissions = config.permission || {};

  const getPermissionDisplay = (rule: PermissionRule | undefined): string => {
    if (!rule) return '默认';
    if (typeof rule === 'string') {
      return rule === 'allow' ? '✅ 允许' : rule === 'deny' ? '❌ 拒绝' : '❓ 询问';
    }
    const entries = Object.entries(rule);
    if (entries.length === 1 && entries[0][0] === '*') {
      const value = entries[0][1];
      return value === 'allow' ? '✅ 允许' : value === 'deny' ? '❌ 拒绝' : '❓ 询问';
    }
    return `📋 ${entries.length} 条规则`;
  };

  const getPermissionColor = (rule: PermissionRule | undefined): string => {
    if (!rule) return 'text-muted-foreground';
    const value = typeof rule === 'string' ? rule : Object.values(rule)[0];
    if (value === 'allow') return 'text-green-500';
    if (value === 'deny') return 'text-red-500';
    return 'text-amber-500';
  };

  const filteredTools = TOOL_PERMISSIONS.filter(tool =>
    tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
    TOOL_DESCRIPTIONS[tool]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ConfigCard
        title="权限配置"
        description="配置工具的访问权限，支持简单模式和 Glob 模式匹配"
        icon={Shield}
        actions={
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工具..."
              className="w-48"
            />
          </div>
        }
      >
        {/* 权限矩阵表格 */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">工具</TableHead>
              <TableHead>描述</TableHead>
              <TableHead className="w-40">权限</TableHead>
              <TableHead className="w-20">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTools.map((tool) => (
              <TableRow key={tool}>
                <TableCell className="font-mono font-medium">{tool}</TableCell>
                <TableCell className="text-muted-foreground">
                  {TOOL_DESCRIPTIONS[tool]}
                </TableCell>
                <TableCell className={getPermissionColor(permissions[tool as keyof ToolPermissions])}>
                  {getPermissionDisplay(permissions[tool as keyof ToolPermissions])}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTool(tool)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ConfigCard>

      {/* 分类视图 */}
      {Object.entries(TOOL_CATEGORIES).map(([categoryId, category]) => {
        const Icon = category.icon;
        const categoryTools = category.tools.filter(t => filteredTools.includes(t as any));
        if (categoryTools.length === 0) return null;

        return (
          <ConfigCard key={categoryId} title={category.name} icon={Icon}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryTools.map((tool) => {
                const permission = permissions[tool as keyof ToolPermissions];
                return (
                  <div
                    key={tool}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                    onClick={() => setEditingTool(tool)}
                  >
                    <div>
                      <div className="font-mono text-sm font-medium">{tool}</div>
                      <div className="text-xs text-muted-foreground">{TOOL_DESCRIPTIONS[tool]}</div>
                    </div>
                    <span className={`text-sm ${getPermissionColor(permission)}`}>
                      {getPermissionDisplay(permission)}
                    </span>
                  </div>
                );
              })}
            </div>
          </ConfigCard>
        );
      })}

      {/* 编辑对话框 */}
      <Dialog open={!!editingTool} onOpenChange={() => setEditingTool(null)}>
        {editingTool && (
          <RuleEditor
            tool={editingTool}
            rule={permissions[editingTool as keyof ToolPermissions] || 'ask'}
            onSave={(rule) => {
              updatePermission(editingTool, rule);
              setEditingTool(null);
            }}
            onClose={() => setEditingTool(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
