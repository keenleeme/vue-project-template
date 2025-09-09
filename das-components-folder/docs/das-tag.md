<ComponentInfo developer="邵天瑞" date="2025-03-28" />

# das-tag 标签

## 组件说明
DasTag 是一个功能丰富的用于标记和分类，支持多种主题样式、形状、动态编辑等功能，以及特殊标签类型（状态标签、进程标签、优先级标签和盖章标签）。

## 何时使用
- 需要标记或分类内容时，如标记文章分类、标记任务状态
- 需要快速过滤或筛选数据时，如标签式筛选器
- 需要展示层级或关联关系时，如地域选择、部门选择
- 需要展示带有特定标记的内容时，如已过期、已保护等状态标记

## 交互演示 {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor 
    :initConfig="initConfig" 
    :configOptions="configOptions" 
    #config="{ config }"
  >
    <div style="padding: 24px; border-radius: 4px; text-align: center;">
      <h4 style="margin-bottom: 16px; color: #333;">{{ getTagType(config) }}</h4>
      
      <template v-if="config.primaryText && config.secondaryText">
        <das-tag 
          :primary-text="config.primaryText"
          :secondary-text="config.secondaryText"
          :type="config.type"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
          :closable="config.closable"
          :editable="config.editable"
          :selectable="config.selectable"
          :selected="config.selected"
          @close="handleClose"
          @update:text="handleUpdate"
          @select="handleSelect"
        />
      </template>
      
      <template v-else-if="config.peerItems && config.peerItems.length">
        <das-tag 
          :peer-items="config.peerItems"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
        />
      </template>
      
      <template v-else-if="config.hierarchyItems && config.hierarchyItems.length">
        <das-tag 
          :hierarchy-items="config.hierarchyItems"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
        />
      </template>
      
      <template v-else-if="config.priorityType">
        <das-tag 
          :text="config.text"
          :priority-type="config.priorityType"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
        />
      </template>
      
      <template v-else-if="config.protectType">
        <das-tag 
          :text="config.text"
          :protect-type="config.protectType"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
        />
      </template>
      
      <template v-else-if="config.processType">
        <das-tag 
          :text="config.text"
          :process-type="config.processType"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
        />
      </template>
      
      <template v-else-if="config.stampColor">
        <das-tag 
          :text="config.text"
          :stamp-color="config.stampColor"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
        />
      </template>
      
      <template v-else>
        <das-tag 
          :text="config.text"
          :type="config.type"
          :theme="config.theme"
          :shape="config.shape"
          :size="config.size"
          :closable="config.closable"
          :editable="config.editable"
          :selectable="config.selectable"
          :selected="config.selected"
          :href="config.type === 'link' ? 'javascript:;' : undefined"
          :icon="config.showIcon ? 'tag' : undefined"
          @close="handleClose"
          @update:text="handleUpdate"
          @select="handleSelect"
        />
      </template>
      
      <div style="margin-top: 32px; text-align: left; color: #666; font-size: 13px;">
        <p v-if="lastAction" style="margin-bottom: 4px;">触发事件: {{ lastAction }}</p>
        <p v-if="lastAction === 'update:text'" style="margin-bottom: 4px;">更新内容: {{ lastActionValue }}</p>
        <p v-if="lastAction === 'select'" style="margin-bottom: 4px;">选择状态: {{ lastActionValue ? '已选中' : '未选中' }}</p>
      </div>
    </div>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { 
  basicConfig, 
  priorityConfig,
  protectConfig, 
  processConfig,
  stampConfig,
  primarySecondaryConfig,
  peerConfig,
  hierarchyConfig
} from 'Comp/tag/mock/config';

const initConfig = ref(basicConfig);
const lastAction = ref('');
const lastActionValue = ref<any>(null);

const configOptions = {
  basic: basicConfig,
  priority: priorityConfig,
  protect: protectConfig,
  process: processConfig,
  stamp: stampConfig,
  primarySecondary: primarySecondaryConfig,
  peer: peerConfig,
  hierarchy: hierarchyConfig
};

const handleClose = () => {
  lastAction.value = 'close';
  lastActionValue.value = null;
};

const handleUpdate = (text: string) => {
  lastAction.value = 'update:text';
  lastActionValue.value = text;
};

const handleSelect = (selected: boolean) => {
  lastAction.value = 'select';
  lastActionValue.value = selected;
};

const getTagType = (config) => {
  if (config.primaryText && config.secondaryText) return '主次标签';
  if (config.peerItems && config.peerItems.length) return '平级标签';
  if (config.hierarchyItems && config.hierarchyItems.length) return '层级标签';
  if (config.priorityType) return '优先级标签';
  if (config.protectType) return '强角标标签';
  if (config.processType) return '进程标签';
  if (config.stampColor) return '盖章标签';
  
  const typeName = {
    default: '默认标签',
    primary: '主要标签',
    success: '成功标签',
    warning: '警告标签',
    danger: '危险标签',
    link: '链接标签',
    lightwarning: '轻警告标签'
  };
  
  return typeName[config.type] || '基础标签';
};
</script>
```
:::

## 基础用法

:::demo
```vue
<template>
  <div>
    <h3 style="margin: 10px 0">基础标签</h3>
    <das-tag text="默认标签" />
    <das-tag type="primary" text="主要标签" />
    <das-tag type="success" text="成功标签" />
    <das-tag type="warning" text="警告标签" />
    <das-tag type="danger" text="危险标签" />
    <das-tag type="custom" text="自定义颜色" color="#ff0000" />


    <h3 style="margin: 10px 0">不同形状的标签</h3>
    <das-tag text="方形标签" shape="square" />
    <das-tag text="圆形标签" shape="round" type="primary" />
    <das-tag text="标记标签" shape="mark" type="success" />
    <das-tag text="自定义颜色" shape="mark" type="custom" color="#ff0000" />


    <h3 style="margin: 10px 0">带图标的标签</h3>
    <das-tag text="用户标签" :icon="UserOutlined" />
    <das-tag type="primary" text="收藏标签" :icon="StarOutlined" />
    <das-tag type="success" text="喜欢标签" :icon="HeartOutlined" />
    <das-tag type="success" text="自定义颜色" :icon="HeartOutlined" color="#ff0000" />
    <h3 style="margin: 10px 0">超出区域</h3>
    <das-tag size="small" text="超出区域展示小标签" />
    <das-tag size="medium" text="超出区域展示中标签" />
    <das-tag size="large" text="超出区域展示大标签" />
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons-vue';
</script>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 主题样式

:::demo
```vue
<template>
  <div class="demo-tag">
    <h3 style="margin: 10px 0">outLine主题标签</h3>
    <div class="tag-group">
      <das-tag text="默认标签" />
      <das-tag text="主要标签" type="primary" />
      <das-tag text="成功标签" type="success" />
      <das-tag text="成功标签" type="lightwarning" />
      <das-tag text="警告标签" type="warning" />
      <das-tag text="危险标签" type="danger" />
      <das-tag text="自定义颜色" type="custom" color="#ff0000" />
    </div>

    <h3 style="margin: 10px 0">Light主题标签</h3>
    <div class="tag-group">
      <das-tag text="默认标签" theme="light" />
      <das-tag text="主要标签" theme="light" type="primary" />
      <das-tag text="成功标签" theme="light" type="success" />
      <das-tag text="成功标签" theme="light" type="lightwarning" />
      <das-tag text="警告标签" theme="light" type="warning" />
      <das-tag text="危险标签" theme="light" type="danger" />
      <das-tag text="自定义颜色" theme="light" type="custom" color="#ff0000" />
    </div>

    <h3 style="margin: 10px 0">Light-outline主题标签</h3>
    <div class="tag-group">
      <das-tag text="默认标签" theme="light-outline" />
      <das-tag text="主要标签" theme="light-outline" type="primary" />
      <das-tag text="成功标签" theme="light-outline" type="success" />
      <das-tag text="成功标签" theme="light-outline" type="lightwarning" />
      <das-tag text="警告标签" theme="light-outline" type="warning" />
      <das-tag text="危险标签" theme="light-outline" type="danger" />
      <das-tag text="自定义颜色" theme="light-outline" type="custom" color="#ff0000" />
    </div>

    <h3 style="margin: 10px 0">Dark主题标签</h3>
    <div class="tag-group">
      <das-tag text="默认标签" theme="dark" />
      <das-tag text="主要标签" theme="dark" type="primary" />
      <das-tag text="成功标签" theme="dark" type="success" />
      <das-tag text="成功标签" theme="dark" type="lightwarning" />
      <das-tag text="警告标签" theme="dark" type="warning" />
      <das-tag text="危险标签" theme="dark" type="danger" />
      <das-tag text="自定义颜色" theme="dark" type="custom" color="#ff0000" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::


## 可编辑标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">动态编辑标签</h3>
    <template v-for="(tag, index) in tags" :key="index">
      <das-tag
        v-if="index < maxCount"
        :type="tag.type"
        :text="tag.text"
        closable
        @close="handleClose(index)"
      />
    </template>
    <template v-if="tags.length > maxCount">
      <Popover placement="top" trigger="hover">
        <template #content>
          <div class="tag-popover-content">
            <das-tag
              v-for="(tag, index) in tags.slice(maxCount)"
              :key="index + maxCount"
              :type="tag.type"
              :text="tag.text"
              closable
              @close="handleClose(index + maxCount)"
            />
          </div>
        </template>
        <das-tag :text="`+${tags.length - maxCount}`" type="default" />
      </Popover>
    </template>
    <das-tag
      addable
      @add="handleAddTag"
    />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Popover } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const maxCount = 2;

const tags = ref([
  { text: '可关闭标签', type: 'default' },
  { text: '主要标签', type: 'primary' },
  { text: '成功标签', type: 'success' }
]);

const handleClose = (index: number) => {
  if (index >= 0 && index < tags.value.length) {
    tags.value.splice(index, 1);
  }
};

const handleAddTag = (value: string) => {
  tags.value.push({ text: value, type: 'default' });
};
</script>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 可选择标签

:::demo
```vue
<template>
  <div>
    <h3 style="margin: 10px 0">基础可选择标签</h3>
    <das-tag
    style="margin-right: 20px"
      v-for="tag in ['标签一', '标签二', '标签三']"
      :key="tag"
      :text="tag"
      theme="light"
      checkable
      :checked="selectedTags.includes(tag)"
      @change="(checked) => handleTagSelect(tag, checked)"
    />

    <!-- <h3 style="margin: 10px 0">不同类型的可选择标签</h3>
    <das-tag
      v-for="(tag, index) in typedTags"
      :key="index"
      :text="tag.text"
      :type="tag.type"
      theme="light"
      checkable
      :checked="selectedTypedTags.includes(tag.text)"
      @change="(checked) => handleTypedTagSelect(tag.text, checked)"
    /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const selectedTags = ref<string[]>([]);
const selectedTypedTags = ref<string[]>([]);

const typedTags = [
  { text: '默认标签', type: 'default' },
  { text: '主要标签', type: 'primary' },
  { text: '成功标签', type: 'success' },
  { text: '警告标签', type: 'warning' },
  { text: '危险标签', type: 'danger' }
];

const handleTagSelect = (tag: string, selected: boolean) => {
  if (selected) {
    selectedTags.value.push(tag);
  } else {
    const index = selectedTags.value.indexOf(tag);
    if (index > -1) {
      selectedTags.value.splice(index, 1);
    }
  }
};

const handleTypedTagSelect = (tag: string, selected: boolean) => {
  if (selected) {
    selectedTypedTags.value.push(tag);
  } else {
    const index = selectedTypedTags.value.indexOf(tag);
    if (index > -1) {
      selectedTypedTags.value.splice(index, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 折叠标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">动态折叠标签</h3>
  <div class="tag-container-zd">
    <template v-for="(tag, index) in visibleTags" :key="index">
      <das-tag :text="tag" />
    </template>
    <span
      v-if="tags.length > maxVisibleTags"
      class="expand-icon"
      style="height: 24px"
      @click="toggleExpand"
    >
     <component style="width: 12px;" :is="expanded ? UpOutlined : DownOutlined" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';

const maxVisibleTags = 5;
const expanded = ref(false);
const tags = ['标签一', '标签二', '标签三', '标签四', '标签五', '标签六', '标签七', '标签八'];

const visibleTags = computed(() => {
  return expanded.value ? tags : tags.slice(0, maxVisibleTags);
});

const toggleExpand = () => {
  expanded.value = !expanded.value;
};
</script>

<style lang="less">
.tag-container-zd {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  .expand-icon {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  border-radius: 3px;
  color: #ADB1BC;
  padding: 2px 15px;
  background: #F1F2F5;
  transition: all 0.3s;
  font-size: 14px;
  &:hover {
    border-color: #1677ff;
  }
}
}
</style>
```
:::

## 超链接标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">超链接标签</h3>
  <das-tag type="link" text="点击访问GitHub" href="https://github.com" />
  <das-tag type="link" text="点击访问Google" href="https://google.com" />
</template>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 不同尺寸的标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">不同尺寸的标签</h3>
  <das-tag size="small" text="小标签" />
  <das-tag size="medium" text="中标签" />
  <das-tag size="large" text="大标签" />
</template>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 优先级标签

:::demo
```vue
<template>
  <div class="demo-tag">
    <h3 style="margin: 10px 0">优先级标签</h3>
    <div class="tag-group">
      <das-tag text="无优先级" priority-type="none" />
      <das-tag text="低优先级" priority-type="low" />
      <das-tag text="中优先级" priority-type="medium" />
      <das-tag text="高优先级" priority-type="high" />
      <das-tag text="自定义颜色" priority-type="custom" color="#ff0000" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 盖章标签

:::demo
```vue
<template>
    <h3 style="margin: 10px 0">盖章标签</h3>
    <das-tag text="已更新" stamp-color="#cbd0db" />
    <das-tag text="已更新" stamp-color="#52c41a" />
    <das-tag text="已更新" stamp-color="#faad14" />
    <das-tag text="已更新" stamp-color="#ff4d4f" />
</template>

<style lang="less" scoped>
.demo-tag {
  .das-tag {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
</style>
```
:::

## 标签失效态

:::demo
```vue
<template>
  <div class="demo-tag">
    <h3 style="margin: 10px 0">标签失效态</h3>
    <das-tag text="默认标签" disabled />
    <das-tag text="危险标签" disabled closable />
    <h3 style="margin: 10px 0">特殊场景：禁用状态但可删除</h3>
    <das-tag v-for="(item, index) in tags" :text="item.text" @close="handleClose(index)" disabledAndClosed closable />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { Popover } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';


const tags = ref([
  { text: '标签1' },
  { text: '标签2' },
  { text: '标签3' }
]);

const handleClose = (index: number) => {
  tags.value.splice(index, 1);
};

</script>
<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 弱角标

:::demo
```vue
<template>
  <div class="demo-tag">
    <h3 style="margin: 10px 0">弱角标</h3>
    <div class="tag-group-rjb">
      <das-tag text="默认标签" weak-type="default" />
      <das-tag text="主要标签" weak-type="primary" />
      <das-tag text="成功标签" weak-type="success" />
      <das-tag text="警告标签" weak-type="warning" />
      <das-tag text="危险标签" weak-type="danger" />
      <das-tag text="轻警告标签" weak-type="lightwarning" />
      <das-tag text="自定义颜色" weak-type="custom" color="#ff0000" />
    </div>
  </div>
</template>

<style lang="less">
.tag-group-rjb {
  .das-weak-tag {
    margin-right: 20px;
    margin-bottom: 8px;
  }
}
</style>
```
:::

## 强角标

:::demo
```vue
<template>
  <div class="demo-tag">
    <h3 style="margin: 10px 0">强角标</h3>
    <div class="tag-group">
      <das-tag text="保护已失效" protect-type="expired" />
      <das-tag text="持续保护中" protect-type="protecting-blue" />
      <das-tag text="持续保护中" protect-type="protecting-green" />
      <das-tag text="持续保护中" protect-type="protecting-yellow" />
      <das-tag text="持续保护中" protect-type="protecting-orange" />
      <das-tag text="持续保护中" protect-type="protecting-red" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
</style>
```
:::

## 进程标签

:::demo
```vue
<template>
  <div class="demo-tag">
    <h3 style="margin: 10px 0;">进程标签</h3>
    <das-tag processType="not-started" text="未开始" />
    <das-tag processType="in-progress" text="进行中" />
    <das-tag processType="success" text="已完成" />
    <das-tag processType="failure" text="失败" />
    <das-tag processType="cancel" text="已取消" />
  </div>
</template>

<style lang="less">
.demo-tag {
    .das-process-tag {
      margin-right: 20px;
    }
}
</style>
```
:::

## 主次标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">主次标签</h3>
  <div style="display: flex; gap: 20px">
    <das-tag primary-text="已保护" secondary-text="32天12时38秒" />
    <das-tag primary-text="自定义颜色" secondary-text="32天12时38秒" color="#ff0000" />
  </div>
</template>
```
:::

## 平级标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">平级标签</h3>
  <das-tag :peer-items="['标签1', '标签2', '标签3']" />
</template>

```
:::

## 层级标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">层级标签</h3>
  <das-tag :hierarchy-items="['中国', '浙江省', '杭州市']" />
</template>
```
:::

## 复合标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">复合标签</h3>
   <das-tag
    text="复合标签"
    type="primary"
    :peerAndItems="['标签1', '标签2', '标签3']"
  />
</template>
```
:::

## 嵌套标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">嵌套标签</h3>
  <das-tag :text="'同意'" :names="['William', 'James', 'Benjamin']" />
</template>
```
:::

## 检测状态

:::demo
```vue
<template>
 <div class="demo-tag">
   <h3 style="margin: 10px 0">检测状态</h3>
  <das-tag text="正常" statusType="normal" />
  <das-tag text="禁用" statusType="disabled" />
  <das-tag text="锁定" statusType="locked" />
  <das-tag text="过期" statusType="expired" />
  <das-tag text="自定义颜色" statusType="expired" color="#ff0000" />
 </div>
</template>
<style lang="less">
.demo-tag {
    .das-status-tag {
      margin-right: 20px;
    }
}
</style>
```
:::

## 溢出标签

:::demo
```vue
<template>
  <h3 style="margin: 10px 0">溢出1</h3>
    <template v-for="(tag, index) in tags.slice(0, maxCount)" :key="index">
      <das-tag
        style="margin-right: 20px"
        :type="tag.type"
        :text="tag.text"
      />
    </template>
    <Popover placement="top" trigger="hover" v-if="tags.length > maxCount">
      <template #content>
        <div class="tag-popover-content">
          <das-tag
            style="margin-right: 10px"
            v-for="(tag, index) in tags.slice(maxCount)"
            :key="index"
            :type="tag.type"
            :text="tag.text"
          />
        </div>
      </template>
      <das-tag :text="`+${tags.length - maxCount}`" type="default" />
    </Popover>


  <h3 style="margin: 10px 0">溢出2</h3>
    <template v-for="(tag, index) in visibleTags" :key="index">
      <das-tag
        style="margin-right: 20px"
        :type="tag.type"
        :text="tag.text"
      />
    </template>
    <Popover placement="top" trigger="hover" v-if="tags.length > maxVisibleCount">
      <template #content>
        <div class="tag-over-yc">
          <div class="tag-list-container">
            <div class="tag-list-header">
              <span>全部标签（{{ tags.slice(maxVisibleCount).length }}）</span>
              <span class="link" type="link" @click="clearAllTags">清空</span>
            </div>
            <div class="tag-list-content">
              <div v-for="(tag, index) in tags.slice(maxVisibleCount)" :key="index" class="tag-list-item">
                <span>{{ tag.text }}</span>
                <CloseOutlined class="delete-icon" @click="handleTagDelete(tag.text)" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <das-tag :text="`+${tags.length - maxVisibleCount}`" type="default" />
    </Popover>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Popover, Select as ASelect, Button as AButton } from 'ant-design-vue';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';

const maxCount = 3;
const maxVisibleCount = 2;

const tags = ref([
  { text: '可关闭标签', type: 'default' },
  { text: '主要标签', type: 'primary' },
  { text: '成功标签', type: 'success' },
  { text: '警告标签', type: 'warning' },
  { text: '危险标签', type: 'danger' },
  { text: '链接标签', type: 'link' }
]);

const visibleTags = computed(() => tags.value.slice(0, maxVisibleCount));

const remainingTags = computed(() => 
  tags.value.slice(maxVisibleCount).map(tag => ({
    value: tag.text,
    label: tag.text
  }))
);

const handleTagDelete = (text: string) => {
  const index = tags.value.findIndex(tag => tag.text === text);
  if (index !== -1) {
    tags.value.splice(index, 1);
  }
};

const clearAllTags = () => {
  tags.value = tags.value.slice(0, maxVisibleCount);
  selectedTags.value = [];
};
</script>

<style lang="less">
.das-tag {
  margin-right: 20px;
  margin-bottom: 8px;
}
.tag-over-yc{
  font-size: 12px;
  .tag-list-container {
    width: 180px;
  }
  .tag-list-content {
    max-height: 180px;
    overflow-y: auto;
  }

  .tag-list-item {
    width: 100%;
    padding: 2px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    background-color: transparent;
    height: 24px;
    line-height: 24px;
    border-radius: 3px;
  }

  .tag-list-item:hover {
    background-color: #E8F2FF;
  }

  .tag-list-item:last-child {
    border-bottom: none;
  }
  .tag-list-header {
    padding: 2px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 500;
    .link{
      font-size: 12px;
      color: #134BEA;
      cursor: pointer;
      font-weight: 400;
    }
  }
  .delete-icon {
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    color: #7E8494;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
```
:::



## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 自定义颜色 | `string（支持类型：基础标签 \| 状态标签 \| 主题标签 \| 优先级 \| 弱角标 \| 主次标签）` | `` |
| text | 标签文本 | `string` | `''` |
| type | 标签类型 | `'default'` ｜ `'primary'` ｜ `'success'` ｜ `'warning'` ｜ `'danger'` ｜ `'link'` ｜ `'lightwarning'` | `'default'` |
| theme | 主题样式 | `'light'` ｜ `'light-outline'` ｜ `'dark'` | - |
| shape | 标签形状 | `'square'` ｜ `'round'` ｜ `'mark'` | `'square'` |
| size | 标签尺寸 | `'small'` ｜ `'medium'` ｜ `'large'` | `'medium'` |
| icon | 图标组件 | `Component` | - |
| closable | 是否可关闭 | `boolean` | `false` |
| checkable | 是否可选择 | `boolean` | `false` |
| checked | 是否被选中 | `boolean` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| disabledAndClosed | 是否禁用且关闭 | `boolean` | `false` |
| addable | 是否显示新增标签按钮 | `boolean` | `false` |
| href | 链接地址（仅在type为link时有效） | `string` | `''` |
| target | 链接打开方式（仅在type为link时有效） | `'_blank'` ｜ `'_self'` ｜ `'_parent'` ｜ `'_top'` | `'_blank'` |
| priority-type | 优先级类型 | `'none'` ｜ `'low'` ｜ `'medium'` ｜ `'high'` | - |
| process-type | 进程类型 | `'not-started'` ｜ `'in-progress'` ｜ `'success'` ｜ `'failure'` ｜ `'cancel'` | - |
| status-type | 状态类型 | `'normal'` ｜ `'disabled'` ｜ `'expired'` ｜ `'locked'` | - |
| protect-type | 强角标类型 | `'expired'` ｜ `'protecting-blue'` ｜ `'protecting-green'` ｜ `'protecting-yellow'` ｜ `'protecting-orange'` ｜ `'protecting-red'` | - |
| weak-type | 弱角标类型 | `'default'` ｜ `'primary'` ｜ `'success'` ｜ `'warning'` ｜ `'danger'` ｜ `'lightwarning'` | - |
| stamp-color | 盖章颜色 | `string` | - |
| primary-text | 主标签文本 | `string` | - |
| secondary-text | 次标签文本 | `string` | - |
| peerItems | 平级标签项 | string[] | - |
| peerAndItems | 平级与标签项 | string[] | - |
| hierarchyItems | 层级标签项 | string[] | - |
| names | 嵌套标签项 | `string[]` | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| close | 关闭标签时触发 | - |
| update:checked | 选择标签状态更新时触发 | `(value: boolean)` |
| change | 选择标签状态改变时触发 | `(value: boolean)` |
| add | 添加标签时触发 | `(value: string)` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义标签内容 |