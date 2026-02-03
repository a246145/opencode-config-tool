// src/types/config.ts

/**
 * OpenCode Configuration Types
 * Based on https://opencode.ai/config.json schema
 */

// ============ Permission Types ============
export type PermissionValue = 'allow' | 'deny' | 'ask';

export type PermissionRule = PermissionValue | Record<string, PermissionValue>;

export type ToolPermissions = {
  read?: PermissionRule;
  edit?: PermissionRule;
  glob?: PermissionRule;
  grep?: PermissionRule;
  list?: PermissionRule;
  bash?: PermissionRule;
  task?: PermissionRule;
  skill?: PermissionRule;
  lsp?: PermissionRule;
  todoread?: PermissionRule;
  todowrite?: PermissionRule;
  webfetch?: PermissionRule;
  websearch?: PermissionRule;
  codesearch?: PermissionRule;
  external_directory?: PermissionRule;
  doom_loop?: PermissionRule;
};

// ============ Model Types ============
export interface ModelThinkingOptions {
  type: 'enabled' | 'disabled';
  budgetTokens?: number;
}

export interface ModelOptions {
  // Common
  temperature?: number;

  // OpenAI/Azure reasoning models
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
  reasoningSummary?: 'auto' | 'detailed';
  include?: string[];  // e.g., ["reasoning.encrypted_content"]
  store?: boolean;

  // OpenAI Compatible
  textVerbosity?: 'low' | 'medium' | 'high';

  // Anthropic
  thinking?: ModelThinkingOptions;

  // Google
  thinkingLevel?: 'low' | 'high';
}

// Model variant for different parameter presets (ctrl+t to cycle)
export interface ModelVariant {
  reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
  reasoningSummary?: 'auto' | 'detailed';
  textVerbosity?: 'low' | 'medium' | 'high';
  thinking?: ModelThinkingOptions;
  thinkingLevel?: 'low' | 'high';
  include?: string[];
  store?: boolean;
}

export interface ModelLimit {
  context?: number;
  output?: number;
}

export interface ModelConfig {
  name?: string;
  limit?: ModelLimit;
  options?: ModelOptions;
  variants?: Record<string, ModelVariant>;
}

// ============ Provider Types ============
export interface ProviderOptions {
  baseURL?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  timeout?: number | false;
  setCacheKey?: boolean;
  enterpriseUrl?: string;
}

export interface ProviderConfig {
  npm?: string;  // e.g., "@ai-sdk/openai-compatible"
  name?: string;  // Display name
  env?: string[];
  options?: ProviderOptions;
  models?: Record<string, ModelConfig>;
  whitelist?: string[];
  blacklist?: string[];
}

export type BuiltInProvider =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'azure'
  | 'azure-cognitive'
  | 'bedrock'
  | 'openrouter'
  | 'groq'
  | 'xai';

export type ProviderMap = Partial<Record<BuiltInProvider | string, ProviderConfig>>;

// ============ Agent Types ============
export type AgentMode = 'primary' | 'subagent' | 'all';

export interface AgentTools {
  write?: boolean;
  edit?: boolean;
  bash?: boolean;
}

export interface AgentConfig {
  name?: string;
  description?: string;
  mode?: AgentMode;
  model?: string;  // "provider/model-id"
  variant?: string;
  prompt?: string;  // Supports "{file:./path}" syntax
  temperature?: number;
  top_p?: number;
  steps?: number;
  color?: string;  // hex color #RRGGBB
  hidden?: boolean;
  disable?: boolean;
  tools?: AgentTools;
  options?: Record<string, any>;
  permission?: ToolPermissions;
}

export type AgentMap = Record<string, AgentConfig>;

// ============ MCP Server Types ============
export interface McpOAuthConfig {
  clientId?: string;
  clientSecret?: string;
  scope?: string;
}

export interface McpLocalConfig {
  type: 'local';
  command: string[];
  environment?: Record<string, string>;
  enabled?: boolean;
  timeout?: number;
}

export interface McpRemoteConfig {
  type: 'remote';
  url: string;
  enabled?: boolean;
  headers?: Record<string, string>;
  oauth?: McpOAuthConfig | false;
  timeout?: number;
}

export type McpConfig = McpLocalConfig | McpRemoteConfig;
export type McpMap = Record<string, McpConfig>;

// ============ Keybind Types ============
export interface KeybindConfig {
  // Leader key
  leader?: string;

  // Application
  app_exit?: string;
  editor_open?: string;
  theme_list?: string;
  sidebar_toggle?: string;
  scrollbar_toggle?: string;
  username_toggle?: string;
  status_view?: string;
  tool_details?: string;

  // Session
  session_export?: string;
  session_new?: string;
  session_list?: string;
  session_timeline?: string;
  session_fork?: string;
  session_rename?: string;
  session_share?: string;
  session_unshare?: string;
  session_interrupt?: string;
  session_compact?: string;
  session_child_cycle?: string;
  session_child_cycle_reverse?: string;
  session_parent?: string;

  // Messages
  messages_page_up?: string;
  messages_page_down?: string;
  messages_line_up?: string;
  messages_line_down?: string;
  messages_half_page_up?: string;
  messages_half_page_down?: string;
  messages_first?: string;
  messages_last?: string;
  messages_next?: string;
  messages_previous?: string;
  messages_copy?: string;
  messages_undo?: string;
  messages_redo?: string;
  messages_last_user?: string;
  messages_toggle_conceal?: string;

  // Model
  model_list?: string;
  model_cycle_recent?: string;
  model_cycle_recent_reverse?: string;
  model_cycle_favorite?: string;
  model_cycle_favorite_reverse?: string;
  variant_cycle?: string;

  // Command/Agent
  command_list?: string;
  agent_list?: string;
  agent_cycle?: string;
  agent_cycle_reverse?: string;

  // Input
  input_clear?: string;
  input_paste?: string;
  input_submit?: string;
  input_newline?: string;
  input_move_left?: string;
  input_move_right?: string;
  input_move_up?: string;
  input_move_down?: string;
  input_select_left?: string;
  input_select_right?: string;
  input_select_up?: string;
  input_select_down?: string;
  input_line_home?: string;
  input_line_end?: string;
  input_select_line_home?: string;
  input_select_line_end?: string;
  input_visual_line_home?: string;
  input_visual_line_end?: string;
  input_select_visual_line_home?: string;
  input_select_visual_line_end?: string;
  input_buffer_home?: string;
  input_buffer_end?: string;
  input_select_buffer_home?: string;
  input_select_buffer_end?: string;
  input_delete_line?: string;
  input_delete_to_line_end?: string;
  input_delete_to_line_start?: string;
  input_backspace?: string;
  input_delete?: string;
  input_undo?: string;
  input_redo?: string;
  input_word_forward?: string;
  input_word_backward?: string;
  input_select_word_forward?: string;
  input_select_word_backward?: string;
  input_delete_word_forward?: string;
  input_delete_word_backward?: string;

  // History
  history_previous?: string;
  history_next?: string;

  // Terminal
  terminal_suspend?: string;
  terminal_title_toggle?: string;
  tips_toggle?: string;
}

// ============ Share Types ============
export type ShareSetting = 'manual' | 'auto' | 'disabled';

// ============ TUI Types ============
export interface TuiConfig {
  scroll_speed?: number;
  scroll_acceleration?: {
    enabled: boolean;
  };
  diff_style?: 'auto' | 'stacked';
}

// ============ Server Types ============
export interface ServerConfig {
  port?: number;
  hostname?: string;
  mdns?: boolean;
  mdnsDomain?: string;
  cors?: string[];
}

// ============ LSP Types ============
export interface LspServerConfig {
  command: string[];
  extensions?: string[];
  disabled?: boolean;
  env?: Record<string, string>;
  initialization?: Record<string, any>;
}

export type LspConfig = false | Record<string, LspServerConfig | { disabled: true }>;

// ============ Formatter Types ============
export interface FormatterLanguageConfig {
  disabled?: boolean;
  command?: string[];
  environment?: Record<string, string>;
  extensions?: string[];
}

export type FormatterConfig = false | Record<string, FormatterLanguageConfig>;

// ============ Compaction Types ============
export interface CompactionConfig {
  auto?: boolean;
  prune?: boolean;
}

// ============ Experimental Types ============
export interface ExperimentalConfig {
  batch_tool?: boolean;
  openTelemetry?: boolean;
  primary_tools?: string[];
  continue_loop_on_deny?: boolean;
  mcp_timeout?: number;
  disable_paste_summary?: boolean;
}

// ============ Watcher Types ============
export interface WatcherConfig {
  ignore?: string[];
}

// ============ Skills Types ============
export interface SkillsConfig {
  paths?: string[];
}

// ============ Enterprise Types ============
export interface EnterpriseConfig {
  url?: string;
}

// ============ Main Config Type ============
export interface OpenCodeConfig {
  $schema?: string;

  // Model settings
  model?: string;  // "provider/model-id"
  small_model?: string;
  default_agent?: string;
  username?: string;

  // Provider configurations
  provider?: ProviderMap;

  // Agent definitions
  agent?: AgentMap;

  // Global permissions
  permission?: ToolPermissions;

  // MCP servers
  mcp?: McpMap;

  // Keybindings
  keybinds?: KeybindConfig;

  // TUI settings
  tui?: TuiConfig;

  // Server settings
  server?: ServerConfig;

  // LSP settings
  lsp?: LspConfig;

  // Formatter settings
  formatter?: FormatterConfig;

  // Compaction settings
  compaction?: CompactionConfig;

  // Experimental features
  experimental?: ExperimentalConfig;

  // Watcher settings
  watcher?: WatcherConfig;

  // Skills settings
  skills?: SkillsConfig;

  // Enterprise settings
  enterprise?: EnterpriseConfig;

  // Theme
  theme?: string;

  // Plugins
  plugin?: string[];

  // Custom instructions
  instructions?: string[];

  // Share setting
  share?: ShareSetting;

  // Auto update
  autoupdate?: boolean | 'notify';

  // Snapshot
  snapshot?: boolean;

  // Provider filters
  disabled_providers?: string[];
  enabled_providers?: string[];
}

// ============ Default Config ============
export const DEFAULT_CONFIG: OpenCodeConfig = {
  $schema: 'https://opencode.ai/config.json',
  model: 'anthropic/claude-sonnet-4-20250514',
  permission: {
    bash: { '*': 'ask' },
    edit: { '*': 'ask' },
    read: { '*': 'allow' },
  },
  keybinds: {
    leader: 'ctrl+x',
  },
  share: 'auto',
  autoupdate: true,
  tui: {
    scroll_speed: 3,
    scroll_acceleration: {
      enabled: true,
    },
    diff_style: 'auto',
  },
  compaction: {
    auto: true,
    prune: false,
  },
  snapshot: true,
};

// ============ Keybind Categories ============
export const KEYBIND_CATEGORIES = {
  application: ['app_exit', 'editor_open', 'theme_list', 'sidebar_toggle', 'scrollbar_toggle', 'username_toggle', 'status_view', 'tool_details'],
  session: ['session_export', 'session_new', 'session_list', 'session_timeline', 'session_fork', 'session_rename', 'session_share', 'session_unshare', 'session_interrupt', 'session_compact', 'session_child_cycle', 'session_child_cycle_reverse', 'session_parent'],
  messages: ['messages_page_up', 'messages_page_down', 'messages_line_up', 'messages_line_down', 'messages_half_page_up', 'messages_half_page_down', 'messages_first', 'messages_last', 'messages_next', 'messages_previous', 'messages_copy', 'messages_undo', 'messages_redo', 'messages_last_user', 'messages_toggle_conceal'],
  model: ['model_list', 'model_cycle_recent', 'model_cycle_recent_reverse', 'model_cycle_favorite', 'model_cycle_favorite_reverse', 'variant_cycle'],
  command: ['command_list', 'agent_list', 'agent_cycle', 'agent_cycle_reverse'],
  input: ['input_clear', 'input_paste', 'input_submit', 'input_newline', 'input_move_left', 'input_move_right', 'input_move_up', 'input_move_down', 'input_select_left', 'input_select_right', 'input_select_up', 'input_select_down', 'input_line_home', 'input_line_end', 'input_select_line_home', 'input_select_line_end', 'input_visual_line_home', 'input_visual_line_end', 'input_select_visual_line_home', 'input_select_visual_line_end', 'input_buffer_home', 'input_buffer_end', 'input_select_buffer_home', 'input_select_buffer_end', 'input_delete_line', 'input_delete_to_line_end', 'input_delete_to_line_start', 'input_backspace', 'input_delete', 'input_undo', 'input_redo', 'input_word_forward', 'input_word_backward', 'input_select_word_forward', 'input_select_word_backward', 'input_delete_word_forward', 'input_delete_word_backward'],
  history: ['history_previous', 'history_next'],
  terminal: ['terminal_suspend', 'terminal_title_toggle', 'tips_toggle'],
} as const;

// ============ Tool Permission List ============
export const TOOL_PERMISSIONS = [
  'read', 'edit', 'glob', 'grep', 'list', 'bash', 'task', 'skill', 'lsp',
  'todoread', 'todowrite', 'webfetch', 'websearch', 'codesearch',
  'external_directory', 'doom_loop'
] as const;

// ============ Built-in Providers ============
export const BUILTIN_PROVIDERS: BuiltInProvider[] = [
  'anthropic', 'openai', 'google', 'azure', 'azure-cognitive',
  'bedrock', 'openrouter', 'groq', 'xai'
];

// ============ Constants ============
export const BUILTIN_LSP_SERVERS = [
  'typescript', 'python', 'go', 'rust', 'java', 'csharp'
] as const;

export const DIFF_STYLES = ['auto', 'stacked'] as const;
export const SHARE_OPTIONS = ['manual', 'auto', 'disabled'] as const;
export const AGENT_MODES = ['primary', 'subagent', 'all'] as const;

