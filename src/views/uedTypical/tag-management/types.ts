export type TagTabKey = 'data' | 'framework';

export type TagSource = '用户添加' | '系统内置';

export type TagSensitive = '是' | '否' | '未知';

export interface TagRow {
  id: string;
  name: string;
  enabled: boolean;
  category: string;
  level: string;
  sensitive: TagSensitive;
  description: string;
  source: TagSource;
  frameworkId: string;
}

export interface FrameworkTagOptions {
  categoryOptions: { label: string; value: string }[];
  levelOptions: { label: string; value: string }[];
}

export interface TagFilter {
  name?: string;
  category?: string;
  level?: string;
  sensitive?: TagSensitive;
}

export type FrameworkSource = '自定义' | '系统内置';

export interface FrameworkRow {
  id: string;
  name: string;
  source: FrameworkSource;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FrameworkFilter {
  name?: string;
  source?: FrameworkSource;
}

export type FrameworkImportType = 'framework' | 'dataTag';

export interface FrameworkTreeNode {
  key: string;
  title: string;
  level?: string;
  description?: string;
  children?: FrameworkTreeNode[];
}
