// src/lib/templates.ts
import type { OpenCodeConfig } from '@/types/config';
import { DEFAULT_KEYBINDS } from './defaults';

export interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'general' | 'security' | 'local' | 'enterprise' | 'custom';
  config: OpenCodeConfig;
}

export const BUILTIN_TEMPLATES: ConfigTemplate[] = [
  {
    id: 'developer-default',
    name: '开发者常用',
    description: '适合日常开发的平衡配置，Claude Sonnet 作为主模型',
    icon: '💻',
    category: 'general',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'anthropic/claude-sonnet-4-20250514',
      small_model: 'anthropic/claude-haiku-4-20250514',
      permission: {
        bash: { '*': 'ask', 'git *': 'allow', 'npm *': 'allow', 'pnpm *': 'allow' },
        edit: { '*': 'ask' },
        read: { '*': 'allow' },
        glob: 'allow',
        grep: 'allow',
        list: 'allow',
      },
      keybinds: DEFAULT_KEYBINDS,
      tui: {
        scroll_speed: 1.0,
        scroll_acceleration: { enabled: true },
        diff_style: 'auto',
      },
      compaction: {
        auto: true,
        prune: true,
      },
      share: 'auto',
      autoupdate: true,
    },
  },
  {
    id: 'security-strict',
    name: '安全模式',
    description: '严格的权限控制，所有危险操作都需要确认',
    icon: '🔒',
    category: 'security',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'anthropic/claude-sonnet-4-20250514',
      permission: {
        bash: { '*': 'ask', 'rm *': 'deny', 'sudo *': 'deny' },
        edit: { '*': 'ask' },
        read: { '*': 'ask', '*.env': 'deny', '*secret*': 'deny' },
        glob: 'ask',
        grep: 'ask',
        list: 'ask',
        webfetch: 'deny',
        external_directory: 'deny',
      },
      compaction: {
        auto: true,
        prune: false,
      },
      share: 'disabled',
      autoupdate: false,
    },
  },
  {
    id: 'local-ollama',
    name: '本地模型 (Ollama)',
    description: '使用 Ollama 运行本地模型，完全离线',
    icon: '🏠',
    category: 'local',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'ollama/llama2',
      provider: {
        ollama: {
          npm: '@ai-sdk/openai-compatible',
          name: 'Ollama (local)',
          options: {
            baseURL: 'http://localhost:11434/v1',
          },
          models: {
            llama2: { name: 'Llama 2' },
            'codellama': { name: 'Code Llama' },
            'deepseek-coder': { name: 'DeepSeek Coder' },
          },
        },
      },
      permission: {
        bash: { '*': 'allow' },
        edit: { '*': 'allow' },
        read: { '*': 'allow' },
      },
      compaction: {
        auto: false,
        prune: false,
      },
      share: 'disabled',
    },
  },
  {
    id: 'local-lmstudio',
    name: '本地模型 (LM Studio)',
    description: '使用 LM Studio 运行本地模型',
    icon: '🖥️',
    category: 'local',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'lmstudio/local-model',
      provider: {
        lmstudio: {
          npm: '@ai-sdk/openai-compatible',
          name: 'LM Studio (local)',
          options: {
            baseURL: 'http://127.0.0.1:1234/v1',
          },
          models: {
            'local-model': { name: 'Local Model' },
          },
        },
      },
      permission: {
        bash: { '*': 'allow' },
        edit: { '*': 'allow' },
        read: { '*': 'allow' },
      },
      compaction: {
        auto: false,
        prune: false,
      },
      share: 'disabled',
    },
  },
  {
    id: 'enterprise',
    name: '企业级',
    description: '适合企业环境，禁用分享，严格权限',
    icon: '🏢',
    category: 'enterprise',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'anthropic/claude-sonnet-4-20250514',
      permission: {
        bash: { '*': 'ask' },
        edit: { '*': 'ask' },
        read: { '*': 'allow', '*.env': 'deny' },
        webfetch: 'ask',
        external_directory: 'deny',
      },
      compaction: {
        auto: true,
        prune: true,
      },
      share: 'disabled',
      autoupdate: false,
      instructions: [
        'Follow company coding standards',
        'Do not expose sensitive information',
      ],
    },
  },
  {
    id: 'openrouter-multi',
    name: 'OpenRouter 多模型',
    description: '通过 OpenRouter 访问多种模型',
    icon: '🌐',
    category: 'general',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'openrouter/anthropic/claude-sonnet-4',
      provider: {
        openrouter: {
          models: {
            'anthropic/claude-sonnet-4': {},
            'openai/gpt-4o': {},
            'google/gemini-pro': {},
          },
        },
      },
      permission: {
        bash: { '*': 'ask' },
        edit: { '*': 'ask' },
        read: { '*': 'allow' },
      },
      compaction: {
        auto: true,
        prune: true,
      },
    },
  },
  {
    id: 'custom-provider',
    name: '自定义 Provider',
    description: '配置自定义 AI 提供商 (OpenAI 兼容)',
    icon: '⚙️',
    category: 'custom',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'custom/model-name',
      provider: {
        custom: {
          npm: '@ai-sdk/openai-compatible',
          name: 'Custom Provider',
          options: {
            baseURL: 'https://api.example.com/v1',
            apiKey: '${CUSTOM_API_KEY}',
          },
          models: {
            'model-name': {
              name: 'Model Name',
              limit: {
                context: 128000,
                output: 4096,
              },
            },
          },
        },
      },
      compaction: {
        auto: true,
        prune: true,
      },
    },
  },
  {
    id: 'advanced-developer',
    name: '高级开发者配置',
    description: '包含完整 TUI、LSP、Formatter 配置的高级模板',
    icon: '🚀',
    category: 'general',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'anthropic/claude-sonnet-4-20250514',
      small_model: 'anthropic/claude-haiku-4-20250514',
      permission: {
        bash: { '*': 'ask', 'git *': 'allow', 'npm *': 'allow' },
        edit: { '*': 'ask' },
        read: { '*': 'allow' },
      },
      tui: {
        scroll_speed: 1.0,
        scroll_acceleration: { enabled: true },
        diff_style: 'auto',
      },
      compaction: {
        auto: true,
        prune: true,
      },
      share: 'manual',
      autoupdate: 'notify',
    },
  },
  {
    id: 'enterprise-security',
    name: '企业安全配置',
    description: '禁用实验性功能，严格权限控制的企业级配置',
    icon: '🛡️',
    category: 'enterprise',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'anthropic/claude-sonnet-4-20250514',
      permission: {
        bash: { '*': 'deny', 'git status': 'allow', 'git diff': 'allow' },
        edit: { '*': 'ask' },
        read: { '*': 'ask' },
        websearch: 'deny',
        webfetch: 'deny',
      },
      share: 'disabled',
      autoupdate: false,
      compaction: {
        auto: true,
        prune: true,
      },
      experimental: {
        batch_tool: false,
        openTelemetry: false,
      },
    },
  },
  {
    id: 'mcp-integration',
    name: 'MCP 服务集成',
    description: '预配置常用 MCP 服务器的模板',
    icon: '🔌',
    category: 'general',
    config: {
      $schema: 'https://opencode.ai/config.json',
      model: 'anthropic/claude-sonnet-4-20250514',
      permission: {
        bash: { '*': 'ask' },
        edit: { '*': 'ask' },
        read: { '*': 'allow' },
      },
      mcp: {
        filesystem: {
          type: 'local',
          command: ['npx', '-y', '@anthropic-ai/mcp-server-filesystem'],
          enabled: true,
        },
        github: {
          type: 'local',
          command: ['npx', '-y', '@anthropic-ai/mcp-server-github'],
          environment: { 'GITHUB_TOKEN': '{env:GITHUB_TOKEN}' },
          enabled: true,
        },
      },
    },
  },
];

export function getTemplateById(id: string): ConfigTemplate | undefined {
  return BUILTIN_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: ConfigTemplate['category']): ConfigTemplate[] {
  return BUILTIN_TEMPLATES.filter(t => t.category === category);
}
