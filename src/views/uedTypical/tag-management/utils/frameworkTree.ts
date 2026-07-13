import type { FrameworkTreeNode } from '../types';

export function formatLevelShort(level?: string) {
  if (!level) return '';
  const matched = level.match(/(\d+级)/);
  return matched ? matched[1] : level;
}

export function formatTreeNodeLabel(node: Pick<FrameworkTreeNode, 'title' | 'level' | 'description'>) {
  const levelText = formatLevelShort(node.level);
  const description = node.description?.trim();

  if (levelText && description) {
    return `${node.title}(${levelText}-${description})`;
  }
  if (levelText) {
    return `${node.title}(${levelText})`;
  }
  if (description) {
    return `${node.title}(${description})`;
  }
  return node.title;
}

export function nodeMatchesKeyword(
  node: FrameworkTreeNode,
  keyword: string
) {
  const text = keyword.trim().toLowerCase();
  if (!text) return true;
  const label = formatTreeNodeLabel(node).toLowerCase();
  return (
    node.title.toLowerCase().includes(text) ||
    (node.level || '').toLowerCase().includes(text) ||
    (node.description || '').toLowerCase().includes(text) ||
    label.includes(text)
  );
}
