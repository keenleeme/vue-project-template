# DAS Alert 警告提示

<cite>
**本文档引用文件**  
- [das-alert.md](file://das-components-folder/docs/das-alert.md)
</cite>

## 目录
1. [简介](#简介)
2. [设计目的与使用场景](#设计目的与使用场景)
3. [核心属性详解](#核心属性详解)
4. [事件与插槽](#事件与插槽)
5. [实际业务代码示例](#实际业务代码示例)
6. [与全局通知 notification 的区别及选型建议](#与全局通知-notification-的区别及选型建议)
7. [无障碍访问（a11y）支持说明](#无障碍访问a11y支持说明)
8. [常见问题与排查方案](#常见问题与排查方案)

## 简介
DAS Alert 是一个用于向用户展示重要信息的非中断式消息提醒组件。它通过醒目的视觉样式和多种提示类型，帮助用户快速识别信息的重要程度。该组件支持成功、信息、警告、错误和普通五种类型，适用于操作反馈、状态提示等场景。

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)

## 设计目的与使用场景
DAS Alert 组件的设计目的是在不打断用户当前操作流程的前提下，提供清晰、及时的信息反馈。其“非中断式”特性意味着用户无需立即处理提示信息即可继续其他操作。

### 适用场景
#### 1. 操作反馈
由用户操作触发，用于传达操作结果。
- **即时状态反馈**：如表单提交成功/失败、文件上传进度、网络连接中断警告。
- **安全状态警示**：如异地登录安全警告，需立即引起用户注意。

#### 2. 横幅提示
随页面加载而常驻显示，用于全局或持续性提示。
- **系统级公告**：如授权即将到期提醒、新功能推广入口。
- **操作预防性引导**：在关键操作前提供功能限制说明或操作引导。

### 落地实践建议
- **放置位置**：应置于相关模块上方，而非强制置于页面顶部。
- **文本行数控制**：描述尽量控制在2行以内，最多不超过5行，超出部分可折叠。
- **展示条数控制**：单页面建议仅展示1条提示，避免干扰用户。
- **操作按钮数量**：建议1个，最多不超过3个，防止用户决策困难。
- **问题可见性保留**：若问题未解决，用户关闭后再次进入页面应重新显示提示。

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)

## 核心属性详解
DAS Alert 提供了丰富的属性以满足不同业务需求。

### 主要属性
| **参数** | **说明** | **类型** | **默认值** |
| --- | --- | --- | --- |
| type | 提示类型（`success`、`warning`、`info`、`error`、`common`） | string | common |
| message | 提示内容 | string | '' |
| title | 提示标题（仅在 banner 模式下有效） | string | '' |
| closable | 是否显示关闭按钮 | boolean | true |
| showIcon | 是否显示对应类型的图标 | boolean | true |
| size | 提示尺寸（`small`、`default`） | string | default |
| banner | 是否使用横幅模式 | boolean | false |
| maxLineNumber | 内容最大显示行数（超出后显示展开按钮） | number | - |
| expand | 是否可展开（长文本场景） | boolean | false |
| float | 是否使用浮层形式 | boolean | false |
| dataSource | 多条消息轮播数据源 | AlertData[] | - |

### AlertData 数据结构
当使用 `dataSource` 实现多条消息轮播时，每条消息的数据结构如下：
| **参数** | **说明** | **类型** | **默认值** |
| --- | --- | --- | --- |
| title | 消息标题 | string | - |
| message | 消息内容 | string | - |
| type | 消息类型 | string | common |
| expand | 是否可展开 | boolean | false |
| maxLineNumber | 内容最大显示行数 | number | - |

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)

## 事件与插槽
### 事件
| **事件名称** | **说明** | **回调参数** |
| --- | --- | --- |
| close | 关闭通知提示时触发的事件 | () => void |

### 插槽
| **插槽名称** | **说明** |
| --- | --- |
| action | 自定义操作按钮（仅在 banner 模式下有效） |

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)

## 实际业务代码示例
### 表单验证反馈
```vue
<template>
  <a-form @finish="handleSubmit" @validate="handleValidate">
    <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
      <a-input v-model:value="form.username" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">提交</a-button>
    </a-form-item>
    <!-- 表单验证失败时显示错误提示 -->
    <das-alert v-if="showError" type="error" message="请检查表单填写是否正确" closable @close="showError = false" />
    <!-- 表单提交成功时显示成功提示 -->
    <das-alert v-if="showSuccess" type="success" message="提交成功！" closable @close="showSuccess = false" />
  </a-form>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({ username: '' });
const showError = ref(false);
const showSuccess = ref(false);

const handleValidate = (errors) => {
  showError.value = !!errors;
};

const handleSubmit = () => {
  showSuccess.value = true;
  showError.value = false;
  // 3秒后自动关闭成功提示
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
};
</script>
```

### 操作反馈（通过 v-model 控制显示状态）
```vue
<template>
  <a-button type="primary" @click="showFloat">触发操作</a-button>
  <das-alert 
    v-if="floatValue" 
    @close="floatValue = false" 
    message="操作已成功执行" 
    float 
    type="success" 
    :closable="true"
  />
</template>

<script setup>
import { ref } from 'vue';

const floatValue = ref(false);
const showFloat = () => {
  floatValue.value = true;
  // 2秒后自动关闭
  setTimeout(() => {
    floatValue.value = false;
  }, 2000);
};
</script>
```

### 横幅模式（带操作按钮）
```vue
<template>
  <das-alert type="warning" banner title="授权即将到期" message="您的账户授权将在3天后过期，请及时续费以避免服务中断。">
    <template #action>
      <a-button type="primary" size="small">立即续费</a-button>
      <a-button size="small">查看详情</a-button>
    </template>
  </das-alert>
</template>
```

### 多条消息轮播
```vue
<template>
  <das-alert banner :data-source="dataSource">
    <template #action>
      <a-button type="primary" size="small">查看详情</a-button>
    </template>
  </das-alert>
</template>

<script setup>
import { ref } from 'vue';

const dataSource = ref([
  {
    type: 'success',
    title: '更新通知',
    message: '系统已于今日完成升级，新增多项功能。'
  },
  {
    type: 'error',
    title: '安全警告',
    message: "检测到异常登录行为，<a href='https://example.com' class='das-alert-link'>点击查看</a>。"
  },
  {
    type: 'info',
    title: '功能引导',
    expand: true,
    maxLineNumber: 2,
    message: '新上线的数据分析模块可以帮助您更好地洞察业务趋势，点击操作按钮了解更多。'
  }
]);
</script>
```

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)

## 与全局通知 notification 的区别及选型建议
| **特性** | **DAS Alert** | **全局通知 notification** |
| --- | --- | --- |
| **触发方式** | 可由用户操作或系统状态触发，也可常驻显示 | 通常由系统事件异步触发 |
| **显示位置** | 嵌入在页面或模块内部 | 固定在页面右上角浮层 |
| **中断性** | 非中断式，不打断用户操作 | 半中断式，会从侧边滑出吸引注意 |
| **生命周期** | 可常驻，或由用户手动关闭 | 通常几秒后自动消失 |
| **适用场景** | 操作反馈、状态提示、横幅公告 | 系统级异步通知（如消息到达、后台任务完成） |

### 选型建议
- 使用 **DAS Alert** 当：
  - 需要对用户操作进行即时反馈（如表单提交结果）。
  - 需要在特定模块内展示上下文相关的提示。
  - 需要常驻显示重要公告（如授权过期）。
- 使用 **notification** 当：
  - 需要通知用户与当前操作无关的系统事件（如收到新消息）。
  - 通知内容为异步处理结果，且不需要用户立即响应。

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)

## 无障碍访问（a11y）支持说明
DAS Alert 组件在设计时考虑了无障碍访问需求：
- **语义化标签**：使用适当的ARIA角色（如 `alert` 或 `status`）确保屏幕阅读器能正确识别提示类型。
- **图标辅助**：`showIcon` 属性确保关键信息不仅依赖颜色传达，图标为视觉障碍用户提供额外线索。
- **键盘交互**：关闭按钮支持键盘焦点和Enter/Space键触发，确保键盘用户可操作。
- **动态内容更新**：当提示出现或消失时，会通过ARIA实时区域（live region）通知辅助技术，确保用户感知状态变化。

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)

## 常见问题与排查方案
### 问题：关闭提示后出现内存泄漏
#### 现象
频繁创建和关闭 Alert 组件后，页面内存占用持续增长。

#### 排查方案
1. **检查事件监听器**：确认 `@close` 事件绑定的函数没有创建闭包导致的引用无法释放。避免在事件处理函数中引用大型对象或DOM节点。
2. **验证 v-if 使用**：确保使用 `v-if` 而非 `v-show` 来控制 Alert 的显隐。`v-if` 会在条件为 `false` 时完全销毁组件实例，而 `v-show` 仅控制CSS `display`，组件实例始终存在。
   ```vue
   <!-- 推荐：使用 v-if -->
   <das-alert v-if="showAlert" @close="showAlert = false" message="提示信息" />
   
   <!-- 避免：使用 v-show 可能导致实例累积 -->
   <!-- <das-alert v-show="showAlert" @close="showAlert = false" message="提示信息" /> -->
   ```
3. **审查 dataSource 响应式引用**：如果使用 `dataSource` 进行轮播，确保数据源引用在组件销毁后能被正确垃圾回收。避免在全局或长生命周期对象中持有对 `dataSource` 的强引用。
4. **使用开发者工具分析**：
   - 在浏览器开发者工具的 **Memory** 面板中，进行堆快照（Heap Snapshot）对比，查找未释放的 `DasAlert` 实例。
   - 在 **Performance** 面板中录制操作流程，检查是否存在异常的内存增长模式。

**Section sources**
- [das-alert.md](file://das-components-folder/docs/das-alert.md)