// src/components/JsonPreview.tsx
import { useConfigStore } from '@/hooks/useConfig';
import { Button } from '@/components/ui/button';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface JsonPreviewProps {
  onClose: () => void;
}

export function JsonPreview({ onClose }: JsonPreviewProps) {
  const { exportConfig } = useConfigStore();
  const [copied, setCopied] = useState(false);

  const json = exportConfig();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-medium">JSON 预览</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-secondary-foreground">
        {json}
      </pre>
    </div>
  );
}
