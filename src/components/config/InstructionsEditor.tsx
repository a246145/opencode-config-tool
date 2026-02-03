// src/components/config/InstructionsEditor.tsx
import { useState } from 'react';
import { useConfigStore } from '@/hooks/useConfig';
import { ConfigCard } from '@/components/layout/Card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Trash2, GripVertical } from 'lucide-react';

export function InstructionsEditor() {
  const { config, updateConfig } = useConfigStore();
  const [newInstruction, setNewInstruction] = useState('');

  const instructions = config.instructions || [];

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) return;
    updateConfig({ instructions: [...instructions, newInstruction.trim()] });
    setNewInstruction('');
  };

  const handleRemoveInstruction = (index: number) => {
    updateConfig({ instructions: instructions.filter((_, i) => i !== index) });
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    updateConfig({ instructions: updated });
  };

  return (
    <ConfigCard
      title="自定义指令"
      description="添加到系统提示词的自定义指令"
      icon={FileText}
    >
      <div className="space-y-4">
        {/* 添加指令 */}
        <div className="space-y-2">
          <Textarea
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            placeholder="输入自定义指令，例如: 始终使用 TypeScript 严格模式"
            rows={2}
          />
          <Button onClick={handleAddInstruction} disabled={!newInstruction.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            添加指令
          </Button>
        </div>

        {/* 指令列表 */}
        {instructions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            暂无自定义指令
          </div>
        ) : (
          <div className="space-y-2">
            {instructions.map((instruction, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg group"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 cursor-grab" />
                <Textarea
                  value={instruction}
                  onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  rows={2}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveInstruction(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConfigCard>
  );
}
