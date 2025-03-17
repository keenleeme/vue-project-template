// 聊天相关类型定义
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  model: string;
}

export interface Message {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface MessageRequest {
  chat_id?: string;
  message: string;
  model?: string;
}

export interface NewChatRequest {
  model?: string;
}

export interface NewChatResponse {
  code: number;
  msg: string;
  chat_id: string;
  chat: Chat;
}

export interface ChatListResponse {
  code: number;
  msg: string;
  total: number;
  chats: Chat[];
}

export interface MessageListResponse {
  code: number;
  msg: string;
  total: number;
  messages: Message[];
}

export interface StreamMessageChunk {
  role: string;
  content: string;
}

// 模型配置相关类型定义
export enum ModelType {
  OpenAI = 'OpenAI'
}

export enum UsageType {
  Chat = 'chat',
  LongText = 'long_text',
  Image = 'image'
}

export interface ModelConfigCreate {
  name?: string;
  model?: string;
  api_type?: ModelType;
  apiKey: string;
  api_base?: string;
  context_window?: number;
  system_prompt?: string;
  is_active?: boolean;
  apiProvider?: string;
  qwenApiLine?: string;
  apiModelId?: string;
}

export interface ModelConfigUpdate {
  name?: string;
  model?: string;
  api_type?: ModelType;
  apiKey: string;
  api_base?: string;
  context_window?: number;
  system_prompt?: string;
  is_active?: boolean;
  apiProvider?: string;
  qwenApiLine?: string;
  apiModelId?: string;
}

export interface ModelConfigResponseData {
  id?: number;
  name?: string;
  model?: string;
  api_type?: string;
  api_base?: string;
  context_window?: number;
  system_prompt?: string;
  is_active?: boolean;
  apiProvider?: string;
  qwenApiLine?: string;
  apiKey?: string;
}

export interface ModelConfigResponse {
  code: number;
  msg: string;
  models?: ModelConfigResponseData[] | null;
}

// 模型用途相关类型定义
export interface ModelUsageResponseData {
  id: number;
  model_config_id: number;
  usage_type: UsageType;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ModelUsageResponse {
  code: number;
  msg: string;
  models: ModelUsageResponseData[];
}

export interface ModelAllUsagesResponse {
  code: number;
  msg: string;
  chat: ModelUsageResponseData | null;
  long_text: ModelUsageResponseData | null;
  image: ModelUsageResponseData | null;
}

// HTTP 错误相关类型定义
export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
