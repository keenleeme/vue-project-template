import type { ApiDataTagInput } from '../types';

export function getTagName(tag: ApiDataTagInput): string {
  return typeof tag === 'string' ? tag : tag.name;
}

export function isAiDataTag(tag: ApiDataTagInput): boolean {
  if (typeof tag === 'string') return true;
  return tag.ai !== false;
}

export function normalizeDataTag(tag: ApiDataTagInput) {
  return {
    name: getTagName(tag),
    ai: isAiDataTag(tag)
  };
}
