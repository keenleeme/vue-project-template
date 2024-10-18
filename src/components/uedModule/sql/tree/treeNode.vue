<template>
  <a-row v-show="props_treeData.defaultTreeExpand" class="tree-node-root" type="flex" align="middle">
    <!-- where条件 -->
    <div v-show="props_treeData.treeType === 'whereTree'" class="where-condition">
      <div v-show="Array.isArray(props_treeData.rules) && props_treeData.rules.length"></div>
      <UpOutlined
        v-if="props_treeData.defaultExpand"
        class="expand-icon"
        @click="whereExpandNode(props_treeData)"
      ></UpOutlined>
      <DownOutlined v-else class="expand-icon" @click="whereExpandNode(props_treeData)"></DownOutlined>
      <a-button style="background: rgb(241, 100, 7); color: rgb(255, 255, 255)" size="small">where</a-button>
    </div>
    <div v-if="props_treeData.treeType === 'whereTree'" class="group-h-line"></div>
    <!-- 逻辑关系选择 -->
    <div
      ref=""
      class="logical-select-wrapper"
      @mouseenter="treeData.data_showDeleteGroupBtn = true"
      @mouseleave="treeData.data_showDeleteGroupBtn = false"
    >
      <div ref="selectLogicalRootDom">
        <a-select
          class="select-logical-root-com"
          size="small"
          :get-popup-container="getPopupContainer"
          :value="props_treeData.condition"
          @change="onLogicalConditionChange"
        >
          <a-select-option
            v-for="item in treeData.data_logicalOpOptions"
            :key="item.value"
            class="logical-option"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
          <a-select-option v-if="props_treeData.rules.length === 1" value="NOT">NOT</a-select-option>
        </a-select>
      </div>
      <CloseCircleFilled
        v-if="treeData.data_showDeleteGroupBtn && props_treeData.id !== 'rootNodeId'"
        class="delete-group-btn"
        @click="deleteGroup"
      />
    </div>
    <!-- 连接线 -->
    <div v-if="props_treeData.rules" class="group-h-line"></div>
    <!-- 组员 -->
    <div
      :class="['single-node-wrapper', props_treeData.treeType === 'whereTree' ? 'where-node-wrapper' : '']"
      :data-type="props_treeData.wherePid"
      :style="{ background: treeData.data_whereTreeHover ? '#E2EAFF' : '' }"
      @mouseover.stop="whereSqlMouseover"
      @mouseleave.stop="whereSqlMouseleave"
    >
      <!-- 竖线 -->
      <div class="vLine"></div>
      <!-- where清除图标 -->
      <div class="single-node-content" style="position: relative">
        <div class="close-rule">
          <CloseCircleFilled
            v-show="treeData.data_whereTreeHover && (props_treeData.where || props_treeData.wherePid)"
            class="close-icon"
            @click="deleteKeysOrWhere(props_treeData, true)"
          />
        </div>
        <div
          v-for="(item, index) in props_treeData.rules"
          :key="`${item.id}`"
          :class="{ 'single-node-keys': !!item.keys }"
          :style="{ background: treeData.data_hoverId === item.id && !!item.keys ? '#F4F7FF' : '' }"
          @mouseover="keysSqlMouseover(item)"
          @mouseleave="keysSqlMouseleave"
        >
          <!-- 对象活动列表清除图标 -->
          <div class="close-keys">
            <CloseCircleFilled
              v-show="!!item.keys && treeData.data_hoverId === item.id"
              class="close-icon"
              @click="deleteKeysOrWhere(item)"
            />
          </div>
          <!-- 组 调用自身 -->
          <a-row v-if="item.rules" type="flex" align="middle">
            <div class="group-h-line"></div>
            <ComTreeNode :props_treeData="item"></ComTreeNode>
          </a-row>
          <!-- 单个节点 -->
          <a-row v-else type="flex" class="single-node" align="middle" :style="{ background: !!item.keys ? '' : '' }">
            <div v-if="Array.isArray(item.keys) && item.keys.length">
              <div class="node-keys-item">
                <ComKeysRule
                  :props_rules="item.keys"
                  :props_verticalLine="item.verticalLine"
                  :props_showFilterBtn="!item.where"
                  @add-filter-conditon="addFilterConditon(item)"
                  @delete-single-rule="(val) => deleteSingleRule(index, val, true)"
                >
                </ComKeysRule>
                <div
                  v-if="item.keys.length > 1 || !!item.where"
                  style="padding: 8px 16px 0 0"
                  @click="keysExpandClick(item)"
                >
                  <a-button size="small">
                    <template #icon><UpOutlined v-if="item.keysExpand" /><DownOutlined v-else /></template>
                    {{ item.keysExpand ? '收起' : '展开' }}</a-button
                  >
                </div>
              </div>
              <div>
                <a-row v-if="item.where" type="flex" align="middle">
                  <ComTreeNode :props_treeData="item.where"></ComTreeNode>
                </a-row>
              </div>
            </div>
            <template v-else>
              <template v-if="item.defaultExpand">
                <ComCondition :props_singleCondition="item" />
                <DeleteOutlined
                  class="delete-item-btn"
                  :class="{ 'delete-item-btn-disabled': cmp_delIconDisabled }"
                  @click="deleteSingleRule(index, '', false, true)"
                />
                <!-- <svg
                  aria-hidden="true"
                  :class="['iconfont', 'delete-item-btn', { 'delete-item-btn-disabled': cmp_delIconDisabled }]"
                  @click="deleteSingleRule(index, '', false, true)"
                >
                  <use xlink:href="#icon-com-delete-line"></use>
                </svg> -->
              </template>
            </template>
          </a-row>
        </div>
        <!-- 添加条件按钮 -->
      </div>
      <a-row
        v-show="(props_treeData.wherePid && props_treeData.defaultExpand) || !props_treeData.wherePid"
        class="single-node-btn"
        type="flex"
        align="middle"
      >
        <div class="group-h-line"></div>
        <div>
          <a-button
            :style="
              cmp_disableAddRule
                ? {}
                : {
                    background: '#f16407',
                    color: '#fff'
                  }
            "
            size="small"
            :disabled="cmp_disableAddRule"
            @click="addSingleRule"
            >添加条件</a-button
          >
          <a-button class="add-group" type="primary" size="small" :disabled="cmp_disableAddGroup" @click="addGroup"
            >添加组</a-button
          >
        </div>
      </a-row>
    </div>
  </a-row>
</template>

<script setup>
  import { computed, inject, reactive, ref } from 'vue';
  import {
    UpOutlined,
    DownOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
    DeleteOutlined,
    CloseCircleFilled
  } from '@ant-design/icons-vue';
  import { Button as AButton, Row as ARow, Select as ASelect, SelectOption as ASelectOption } from 'ant-design-vue';
  import { ALL_LOGIC_OPERATOR_OPTIONS_WITHOUT_NOT } from '../keytype-op-comtype.js';
  import ComCondition from './condition.vue';
  import ComKeysRule from './keys-rule/index.vue';

  defineOptions({
    name: 'ComTreeNode'
  });
  const props = defineProps({
    props_treeData: {
      type: Object,
      default: () => {}
    }
  });
  const selectLogicalRootDom = ref(null);
  const contextData = inject('contextData');

  const treeData = reactive({
    data_showDeleteGroupBtn: false, // 是否显示删除组按钮 默认false 不显示
    data_logicalOpOptions: ALL_LOGIC_OPERATOR_OPTIONS_WITHOUT_NOT,
    data_whereTreeHover: false,
    data_expandGroupId: '',
    data_hoverId: ''
  });

  const cmp_GroupId = computed(() => {
    return props.props_treeData.id;
  });
  const cmp_wherePid = computed(() => {
    return props.props_treeData.wherePid || '';
  });
  const cmp_isOverMaxRuleCount = computed(() => {
    return props.props_treeData.rules.length >= contextData.provideMaxRulesCount.value;
  });
  const cmp_isOverMaxDepth = computed(() => {
    return props.props_treeData.depth >= contextData.provideMaxGroupDepth.value - 1;
  });
  const cmp_isNOTCondition = computed(() => {
    return props.props_treeData.condition === 'NOT';
  });
  const cmp_disableAddRule = computed(() => {
    return cmp_isNOTCondition.value || cmp_isOverMaxRuleCount.value;
  });
  const cmp_disableAddGroup = computed(() => {
    return cmp_isNOTCondition.value || cmp_isOverMaxRuleCount.value || cmp_isOverMaxDepth.value;
  });
  const cmp_delIconDisabled = computed(() => {
    return !props.props_treeData.defaultExpand;
  });

  function getPopupContainer(triggerNode) {
    // 返回你想要渲染下拉菜单的 DOM 节点
    return selectLogicalRootDom.value;
  }

  // 当第一个节点为group时 需要特别处理 不然CSS就可以
  // 逻辑连接符改变
  function onLogicalConditionChange(v) {
    contextData.provideChanngeLogical(cmp_GroupId.value, v);
  }
  // 添加条件
  function addSingleRule() {
    console.log(contextData, 'contextData');
    contextData.provideAddRule(cmp_GroupId.value);
  }
  // 添加组
  function addGroup() {
    contextData.provideAddGroup(cmp_GroupId.value, cmp_wherePid.value);
  }
  // 删除条件
  function deleteSingleRule(idx, dynListId = '', delObjDynList = false, expandDel = false) {
    // 折叠时不能删除
    if (expandDel && cmp_delIconDisabled.value) return false;
    // 当根节点的条件为 NOT 时 不能删除组
    if (cmp_isNOTCondition.value && props.props_treeData.id !== 'rootNodeId') {
      deleteGroup();
    } else {
      contextData.provideDeleteRule(cmp_GroupId.value, idx, dynListId, delObjDynList);
    }
  }
  // 删除组
  function deleteGroup() {
    contextData.provideDeleteGroup(cmp_GroupId.value, props.props_treeData);
  }
  // 删除对象活动列表
  function deleteKeysOrWhere(data, isDelWhere = false) {
    const id = isDelWhere ? data.wherePid : data.id;
    contextData.provideDeleteRuleKeysOrWhere(cmp_GroupId.value, id, isDelWhere);
  }
  function addField(row) {
    contextData.provideAddRule(row.id, 'isObjectDynList');
  }
  function addFilterConditon(row) {
    contextData.provideAddGroup(row.id, cmp_wherePid.value, true);
  }
  function keysSqlMouseover(item) {
    treeData.data_hoverId = item.id;
  }
  function keysSqlMouseleave() {
    treeData.data_hoverId = '';
  }
  function whereSqlMouseover(e) {
    const path = e.path || e.composedPath();
    const isClickOnTree = path
      .reduce((prev, curr) => {
        if (curr.className) {
          prev.push(curr.className);
        }
        return prev;
      }, [])
      .includes('single-node-wrapper where-node-wrapper');
    treeData.data_whereTreeHover = isClickOnTree;
  }
  function whereSqlMouseleave() {
    treeData.data_whereTreeHover = false;
  }
  function whereExpandNode(node) {
    contextData.provideChanngeExpand(node.wherePid, 'where');
  }
  function keysExpandClick(node) {
    contextData.provideChanngeExpand(node.id, 'keys');
  }
</script>
