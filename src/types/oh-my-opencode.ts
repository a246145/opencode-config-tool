// src/types/oh-my-opencode.ts
// oh-my-opencode 配置类型定义

export interface OmocThinkingConfig {
  type: 'enabled' | 'disabled';
  budgetTokens?: number;
}

export type OmocPermissionValue = 'allow' | 'deny' | 'ask';

export type OmocPermissionRule = OmocPermissionValue | Record<string, OmocPermissionValue>;

export interface OmocAgentPermission {
  edit?: OmocPermissionValue;
  bash?: OmocPermissionRule;
  webfetch?: OmocPermissionValue;
  doom_loop?: OmocPermissionValue;
  external_directory?: OmocPermissionValue;
}

export interface OmocAgentModelOverride {
  model?: string;
  temperature?: number;
  variant?: string;
  category?: string;
  skills?: string[];
  top_p?: number;
  prompt?: string;
  prompt_append?: string;
  tools?: Record<string, boolean>;
  disable?: boolean;
  description?: string;
  mode?: 'subagent' | 'primary' | 'all';
  color?: string;
  permission?: OmocAgentPermission;
}

export interface OmocCategoryConfig {
  model?: string;
  variant?: string;
  temperature?: number;
  top_p?: number;
  maxTokens?: number;
  reasoningEffort?: 'low' | 'medium' | 'high' | 'xhigh';
  textVerbosity?: 'low' | 'medium' | 'high';
  prompt_append?: string;  // 追加到系统提示的内容
  description?: string;    // 分类描述
  thinking?: OmocThinkingConfig;
  tools?: Record<string, boolean>;  // 工具启用/禁用配置
  is_unstable_agent?: boolean;
}

export interface OmocBackgroundTaskConfig {
  defaultConcurrency?: number;
  staleTimeoutMs?: number;
  providerConcurrency?: Record<string, number>;
  modelConcurrency?: Record<string, number>;  // 按模型设置并发数
}

export interface OmocTmuxConfig {
  enabled?: boolean;
  layout?: 'main-vertical' | 'main-horizontal' | 'tiled' | 'even-horizontal' | 'even-vertical';
  main_pane_size?: number;
}

export interface OmocSisyphusConfig {
  disabled?: boolean;
  default_builder_enabled?: boolean;
  planner_enabled?: boolean;
  replace_plan?: boolean;
}

export interface OmocClaudeCodeConfig {
  mcp?: boolean;
  commands?: boolean;
  skills?: boolean;
  agents?: boolean;
  hooks?: boolean;
  plugins?: boolean;
  plugins_override?: Record<string, boolean>;
}

export interface OmocExperimentalConfig {
  aggressive_truncation?: boolean;
  auto_resume?: boolean;
  truncate_all_tool_outputs?: boolean;
  dynamic_context_pruning?: {
    enabled?: boolean;
    notification?: 'off' | 'minimal' | 'detailed';
    turn_protection?: {
      enabled?: boolean;
      turns?: number;
    };
    protected_tools?: string[];
    strategies?: {
      deduplication?: {
        enabled?: boolean;
      };
      supersede_writes?: {
        enabled?: boolean;
        aggressive?: boolean;
      };
      purge_errors?: {
        enabled?: boolean;
        turns?: number;
      };
    };
  };
}

export interface OmocCommentCheckerConfig {
  custom_prompt?: string;
}

export interface OmocGitMasterConfig {
  commit_footer?: boolean;
  include_co_authored_by?: boolean;
}

export interface OmocNotificationConfig {
  force_enable?: boolean;
}

export interface OmocRalphLoopConfig {
  enabled?: boolean;
  default_max_iterations?: number;
  state_dir?: string;
}

export interface OmocSkillSourceConfig {
  path: string;
  recursive?: boolean;
  glob?: string;
}

export interface OmocSkillEntryConfig {
  description?: string;
  template?: string;
  from?: string;
  model?: string;
  agent?: string;
  subtask?: boolean;
  'argument-hint'?: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, unknown>;
  'allowed-tools'?: string[];
  disable?: boolean;
}

export interface OmocSkillsConfig {
  sources?: Array<string | OmocSkillSourceConfig>;
  enable?: string[];
  disable?: string[];
  [key: string]:
    | boolean
    | OmocSkillEntryConfig
    | Array<string | OmocSkillSourceConfig>
    | string[]
    | undefined;
}

export interface OhMyOpenCodeConfig {
  $schema?: string;
  agents?: Record<string, OmocAgentModelOverride>;
  categories?: Record<string, OmocCategoryConfig>;
  background_task?: OmocBackgroundTaskConfig;
  tmux?: OmocTmuxConfig;
  sisyphus_agent?: OmocSisyphusConfig;
  disabled_hooks?: string[];
  disabled_agents?: string[];
  disabled_mcps?: string[];
  disabled_skills?: string[];
  disabled_commands?: string[];
  claude_code?: OmocClaudeCodeConfig;
  experimental?: OmocExperimentalConfig;
  auto_update?: boolean;
  comment_checker?: OmocCommentCheckerConfig;
  git_master?: OmocGitMasterConfig;
  notification?: OmocNotificationConfig;
  ralph_loop?: OmocRalphLoopConfig;
  skills?: string[] | OmocSkillsConfig;
}

// 预设模板类型
export interface OmocPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  config: Partial<OhMyOpenCodeConfig>;
}

// 安装选项类型
export interface OmocInstallOptions {
  claude?: boolean;
  openai?: boolean;
  gemini?: boolean;
  copilot?: boolean;
  noTui?: boolean;
}

// 已知的 Agent 列表（带中文名称和描述）
export const KNOWN_AGENTS = [
  // oh-my-opencode schema 定义的代理
  { id: 'build', name: '构建代理', description: '默认代理，基于权限执行工具' },
  { id: 'plan', name: '规划代理', description: '规划模式，禁用所有编辑工具' },
  { id: 'sisyphus', name: '西西弗斯', description: '持久化任务执行' },
  { id: 'sisyphus-junior', name: '小西西弗斯', description: '专注任务执行者，无委派能力' },
  { id: 'OpenCode-Builder', name: 'OpenCode 构建器', description: '专用构建代理' },
  { id: 'prometheus', name: '普罗米修斯', description: '规划代理，任务分解和策略制定' },
  { id: 'metis', name: '墨提斯', description: '智慧代理，策略分析和决策支持' },
  { id: 'momus', name: '摩墨斯', description: '审查代理，代码审查和质量检测' },
  { id: 'oracle', name: '神谕者', description: '高智商推理专家，架构设计和复杂调试' },
  { id: 'librarian', name: '图书管理员', description: '文档查询和知识检索' },
  { id: 'explore', name: '探索者', description: '代码库探索和上下文搜索' },
  { id: 'multimodal-looker', name: '多模态观察者', description: '图像分析和视觉处理' },
  { id: 'atlas', name: '阿特拉斯', description: '任务编排和多代理协调' },
  // opencode schema 额外定义的代理
  { id: 'general', name: '通用代理', description: '通用任务执行和多步骤操作' },
  { id: 'title', name: '标题代理', description: '会话标题生成' },
  { id: 'summary', name: '摘要代理', description: '会话摘要生成' },
  { id: 'compaction', name: '压缩代理', description: '会话上下文压缩' },
] as const;

// 已知的 Category 列表（带中文名称和描述）
export const KNOWN_CATEGORIES = [
  { id: 'quick', name: '快速任务', description: '简单快速的小任务' },
  { id: 'visual-engineering', name: '视觉工程', description: '图像处理和视觉相关任务' },
  { id: 'ultrabrain', name: '超级大脑', description: '复杂推理和高难度任务' },
  { id: 'artistry', name: '艺术创作', description: '创意设计和艺术相关任务' },
  { id: 'unspecified-low', name: '通用低级', description: '未分类的简单任务' },
  { id: 'unspecified-high', name: '通用高级', description: '未分类的复杂任务' },
  { id: 'writing', name: '写作任务', description: '文档编写和内容创作' },
] as const;

// Tmux 布局选项
export const TMUX_LAYOUTS = [
  'main-vertical', 'main-horizontal', 'tiled',
  'even-horizontal', 'even-vertical'
] as const;

// Category 变体选项
export const CATEGORY_VARIANTS = [
  'low', 'medium', 'high', 'xhigh', 'max'
] as const;
