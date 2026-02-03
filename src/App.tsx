// src/App.tsx
import { useState, useEffect } from 'react';
import { Sidebar, Header, MainContent, type NavItem } from '@/components/layout';
import {
  ModelConfig,
  ProviderConfig,
  AgentManager,
  PermissionEditor,
  McpServerConfig,
  KeybindEditor,
  ThemeSelector,
  PluginManager,
  InstructionsEditor,
  OtherSettings,
  TuiConfigPanel,
  ServerConfigPanel,
  LspConfigPanel,
  FormatterConfigPanel,
  CompactionConfigPanel,
  ExperimentalConfigPanel,
  MiscConfigPanel,
} from '@/components/config';
import { TemplateDialog } from '@/components/TemplateDialog';
import { JsonPreview } from '@/components/JsonPreview';
import { ImportExportDialog } from '@/components/ImportExportDialog';
import { useConfigStore } from '@/hooks/useConfig';
import { useThemeStore } from '@/hooks/useTheme';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('model');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImportExport, setShowImportExport] = useState<'import' | 'export' | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  const { loadConfig, resetConfig } = useConfigStore();
  const { theme } = useThemeStore();

  // 初始化加载配置
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // 初始化主题
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const renderContent = () => {
    switch (activeNav) {
      case 'model':
        return <ModelConfig />;
      case 'provider':
        return <ProviderConfig />;
      case 'agent':
        return <AgentManager />;
      case 'permission':
        return <PermissionEditor />;
      case 'mcp':
        return <McpServerConfig />;
      case 'keybinds':
        return <KeybindEditor />;
      case 'theme':
        return <ThemeSelector />;
      case 'plugin':
        return <PluginManager />;
      case 'instructions':
        return <InstructionsEditor />;
      case 'tui':
        return <TuiConfigPanel />;
      case 'server':
        return <ServerConfigPanel />;
      case 'lsp':
        return <LspConfigPanel />;
      case 'formatter':
        return <FormatterConfigPanel />;
      case 'compaction':
        return <CompactionConfigPanel />;
      case 'experimental':
        return <ExperimentalConfigPanel />;
      case 'misc':
        return <MiscConfigPanel />;
      case 'settings':
        return <OtherSettings />;
      default:
        return <ModelConfig />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        activeItem={activeNav}
        onItemChange={setActiveNav}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onImport={() => setShowImportExport('import')}
          onExport={() => setShowImportExport('export')}
          onReset={resetConfig}
          onTemplates={() => setShowTemplates(true)}
        />

        {/* Content */}
        <MainContent>
          {renderContent()}
        </MainContent>
      </div>

      {/* JSON Preview Panel (可选) */}
      {showJsonPreview && (
        <JsonPreview onClose={() => setShowJsonPreview(false)} />
      )}

      {/* Dialogs */}
      <TemplateDialog
        open={showTemplates}
        onOpenChange={setShowTemplates}
      />

      <ImportExportDialog
        mode={showImportExport}
        onClose={() => setShowImportExport(null)}
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
