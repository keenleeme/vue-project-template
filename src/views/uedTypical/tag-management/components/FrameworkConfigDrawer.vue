<template>
  <Teleport to="body">
    <a-drawer
      :open="open"
      title="查看框架"
      placement="right"
      width="640"
      :z-index="2000"
      :get-container="false"
      destroy-on-close
      class="framework-config-drawer"
      @close="handleClose"
    >
      <div class="framework-name">框架名称：{{ frameworkName }}</div>

      <a-input
        v-model:value="keyword"
        allow-clear
        placeholder="请输入关键字"
        class="tree-search"
      >
        <template #suffix>
          <SearchOutlined />
        </template>
      </a-input>

      <div class="tree-label">树节点：</div>

      <div class="tree-wrapper">
        <a-tree
          v-if="filteredTree.length"
          :tree-data="filteredTree"
          :expanded-keys="expandedKeys"
          block-node
          @expand="onExpand"
        >
          <template #title="slotProps">
            <div
              class="tree-node-row"
              @mouseenter="hoverKey = String(slotProps.key)"
              @mouseleave="hoverKey = ''"
            >
              <span class="tree-node-title" :title="formatTreeNodeLabel(resolveTreeNode(slotProps))">
                {{ formatTreeNodeLabel(resolveTreeNode(slotProps)) }}
              </span>
              <span v-show="hoverKey === String(slotProps.key)" class="tree-node-actions">
                <a-tooltip title="新增子类">
                  <PlusOutlined class="action-icon action-icon--primary" @click.stop="openAdd(String(slotProps.key))" />
                </a-tooltip>
                <a-tooltip title="编辑">
                  <EditOutlined class="action-icon action-icon--primary" @click.stop="openEdit(String(slotProps.key))" />
                </a-tooltip>
                <a-popconfirm
                  title="是否确认删除该分类"
                  description="删除分类将一并删除该分类下所有子类"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(String(slotProps.key))"
                >
                  <DeleteOutlined class="action-icon action-icon--danger" @click.stop />
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-tree>
        <a-empty v-else description="暂无匹配节点" />
      </div>

      <template #footer>
        <div class="drawer-footer">
          <a-button type="primary" @click="handleClose">关闭</a-button>
        </div>
      </template>

      <FrameworkCategoryFormModal
        v-model:open="categoryModalOpen"
        :mode="categoryModalMode"
        :parent-title="categoryParentTitle"
        :node="editingNode"
        @success="handleCategorySave"
      />
    </a-drawer>
  </Teleport>
</template>

<script setup lang="ts">
  import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined
  } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { computed, ref, watch } from 'vue';
  import { getFrameworkTree } from '../mock';
  import type { FrameworkRow, FrameworkTreeNode } from '../types';
  import { formatTreeNodeLabel, nodeMatchesKeyword } from '../utils/frameworkTree';
  import FrameworkCategoryFormModal from './FrameworkCategoryFormModal.vue';

  const props = defineProps<{
    open: boolean;
    record?: FrameworkRow | null;
  }>();

  const emit = defineEmits<{
    'update:open': [value: boolean];
  }>();

  const keyword = ref('');
  const hoverKey = ref('');
  const treeData = ref<FrameworkTreeNode[]>([]);
  const expandedKeys = ref<string[]>([]);
  const categoryModalOpen = ref(false);
  const categoryModalMode = ref<'add' | 'edit'>('add');
  const categoryParentTitle = ref('');
  const activeParentKey = ref('');
  const editingNodeKey = ref('');
  const editingNode = ref<FrameworkTreeNode | null>(null);

  const frameworkName = computed(() => props.record?.name || '-');

  const filteredTree = computed(() => filterTree(treeData.value, keyword.value));

  watch(
    () => [props.open, props.record?.id] as const,
    ([visible, frameworkId]) => {
      if (!visible || !frameworkId || !props.record) return;
      keyword.value = '';
      hoverKey.value = '';
      treeData.value = getFrameworkTree(props.record.id, props.record.name);
      expandedKeys.value = collectKeys(treeData.value);
    },
    { immediate: true }
  );

  watch(keyword, () => {
    expandedKeys.value = collectKeys(filteredTree.value);
  });

  function collectKeys(nodes: FrameworkTreeNode[]): string[] {
    const keys: string[] = [];
    const walk = (list: FrameworkTreeNode[]) => {
      list.forEach((node) => {
        keys.push(node.key);
        if (node.children?.length) walk(node.children);
      });
    };
    walk(nodes);
    return keys;
  }

  function filterTree(nodes: FrameworkTreeNode[], kw: string): FrameworkTreeNode[] {
    const text = kw.trim().toLowerCase();
    if (!text) return nodes;

    const walk = (list: FrameworkTreeNode[]): FrameworkTreeNode[] =>
      list.reduce<FrameworkTreeNode[]>((acc, node) => {
        const children = node.children ? walk(node.children) : [];
        const matched = nodeMatchesKeyword(node, text);
        if (matched || children.length) {
          acc.push({
            ...node,
            children: children.length ? children : node.children
          });
        }
        return acc;
      }, []);

    return walk(nodes);
  }

  function findNodeContext(
    nodes: FrameworkTreeNode[],
    key: string,
    parent: FrameworkTreeNode | null = null
  ): { node: FrameworkTreeNode; parent: FrameworkTreeNode | null; siblings: FrameworkTreeNode[] } | null {
    for (const node of nodes) {
      if (node.key === key) {
        return { node, parent, siblings: nodes };
      }
      if (node.children?.length) {
        const found = findNodeContext(node.children, key, node);
        if (found) return found;
      }
    }
    return null;
  }

  function onExpand(keys: (string | number)[]) {
    expandedKeys.value = keys as string[];
  }

  function resolveTreeNode(slotProps: { dataRef?: FrameworkTreeNode; title?: string }) {
    if (slotProps.dataRef) return slotProps.dataRef;
    return {
      key: '',
      title: String(slotProps.title || '')
    };
  }

  function openAdd(key: string) {
    const context = findNodeContext(treeData.value, key);
    if (!context) return;
    categoryModalMode.value = 'add';
    activeParentKey.value = key;
    categoryParentTitle.value = context.node.title;
    editingNodeKey.value = '';
    editingNode.value = null;
    categoryModalOpen.value = true;
  }

  function openEdit(key: string) {
    const context = findNodeContext(treeData.value, key);
    if (!context) return;
    categoryModalMode.value = 'edit';
    editingNodeKey.value = key;
    categoryParentTitle.value = context.parent?.title || '-';
    editingNode.value = { ...context.node };
    categoryModalOpen.value = true;
  }

  function handleCategorySave(payload: { title: string; level?: string; description?: string }) {
    if (categoryModalMode.value === 'add') {
      const target = findNodeContext(treeData.value, activeParentKey.value)?.node;
      if (!target) return;
      if (!target.children) target.children = [];
      target.children.push({
        key: `node-${Date.now()}`,
        title: payload.title,
        level: payload.level,
        description: payload.description
      });
      if (!expandedKeys.value.includes(target.key)) {
        expandedKeys.value = [...expandedKeys.value, target.key];
      }
    } else {
      const target = findNodeContext(treeData.value, editingNodeKey.value)?.node;
      if (!target) return;
      target.title = payload.title;
      target.level = payload.level;
      target.description = payload.description;
    }
    treeData.value = [...treeData.value];
  }

  function handleDelete(key: string) {
    const context = findNodeContext(treeData.value, key);
    if (!context) return;
    if (!context.parent) {
      message.warning('根节点不可删除');
      return;
    }
    context.siblings.splice(
      context.siblings.findIndex((item) => item.key === key),
      1
    );
    treeData.value = [...treeData.value];
    message.success('删除成功');
  }

  function handleClose() {
    emit('update:open', false);
  }
</script>

<style lang="less" scoped>
  .framework-name {
    margin-bottom: 16px;
    color: rgba(0, 0, 0, 0.88);
    line-height: 22px;
  }

  .tree-search {
    margin-bottom: 16px;
  }

  .tree-label {
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.88);
    line-height: 22px;
  }

  .tree-wrapper {
    max-height: calc(100vh - 280px);
    overflow: auto;
    padding-right: 4px;
  }

  .tree-node-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 24px;
    padding-right: 4px;
  }

  .tree-node-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.88);
    font-size: 13px;
  }

  .tree-node-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .action-icon {
    font-size: 14px;
    cursor: pointer;

    &--primary {
      color: #1677ff;
    }

    &--danger {
      color: #ff4d4f;
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
  }

  :deep(.ant-tree .ant-tree-node-content-wrapper) {
    flex: 1;
    min-width: 0;
  }
</style>
