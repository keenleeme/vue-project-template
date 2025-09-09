<ComponentInfo developer="王银" date="2024-03-24" />

# das-empty 空状态

## 组件说明
空状态组件，用于数据为空时的占位展示。

## 何时使用
- 当没有数据内容时作为占位提示
- 初次使用某产品或某功能模块
- 操作结果为空时反馈
- 各种错误或限制页面

## 交互演示  {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-empty 
      :size="config.size"
      :type="config.type"
      :text="config.text"
      :title="config.title"
      :showTitle="config.showTitle"
    />
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/empty/mock/config';
</script>
```
:::

## 基础用法
:::demo
```vue
<template>
  <das-empty />
</template>
```
:::

## 组件尺寸
有三种尺寸：大、默认（中）、小
通过设置size为large和small将按钮设置为大和小尺寸，不设置为默认（中）尺寸。
示例size为large
:::demo
```vue
<template>
  <das-empty size="large" type="search" />
</template>
```
:::

## 错误类型
:::demo
```vue
<template>
  <das-empty type="404" />
</template>
```
:::

## 插槽用法
:::demo
```vue
<template>
  <das-empty>
   <a-button size="small" type="primary">批量导入</a-button>
   <a-button size="small" style="margin-left: 10px">手动添加</a-button>
  </das-empty>
</template>
```
:::

## API

### Props
| 参数 | 说明 | 类型 | 默认值 |
|------|------|-----|-------|
| text | 描述文字 | string | - |
| size | 尺寸大小，可选值为 large、small、medium 或者不设置 | string | medium |
| type | 展示类型选择，可选值为 default、search、charts、400、403、404、500、503 或者不设置 | string | default |
| title | 标题，尺寸为small时，标题不会显示 | string | 提示 |
| showTitle | 是否显示标题 | boolean | true |
| imageUrl | 自定义图片地址 | string | - |

### Slots
| 名称 | 说明 |
|------|------|
| default | 自定义底部内容 |

## 常见问题

## 设计说明

🎬 **不同尺寸适用场景**
| 类型       | 何时使用                                 |
|------------|------------------------------------------|
| 大空状态   | 页面级，如4XX、5XX等报错                 |
| 中空状态   | 表格、抽屉或模态框中                     |
| 小空状态   | 卡片等空间受限时，例如卡片、仪表盘       |

⭐️ **落地实践**
1. **放置位置**  
横向和纵向居中展示在容器内。根据空状态的显示区域大小，使用不同的插图、按钮尺寸。

2. **页面内有多个空状态**  
当页面有多个空状态时，避免出现多个主按钮和多种风格插图。建议使用次要操作，以减少视觉噪音。

🎏 **常见场景描述示例**

| 类型    | 场景举例              | 插图 | 常见标题示例          | 常见描述示例                          | 常见操作建议                  |
|---------|-----------------------|------|-----------------------|---------------------------------------|-----------------------------|
| 无数据  | 列表、卡片无数据      |      | 暂无数据              | 点击XX立即创建                        | 新增/添加/创建、导入、查看教程等 |
| 无数据  | 仪表盘无数据          |      | 暂无数据              | 请配置数据源/请开启XX检测等           | 配置数据源                   |
| 无数据  | 查询结果为空          |      | 未找到匹配项          | 尝试放宽筛选条件并重试                | 清除筛选条件                 |
| 无数据  | 清空待办              |      | 全部任务已完成！      | 今日事项已清空                        | --                         |
| 无数据  | 暂无消息              |      | 已同步所有消息        | 当前没有未读通知                      | --                         |
| 错误    | 400：请求错误         |      | 请求出错了            | 可能是输入的信息有误，请检查后重试    | 重新编辑、返回              |
| 错误    | 404：页面不存在       |      | 页面迷路了            | 您寻找的内容可能已被移动或删除        | 返回、其他推荐内容          |
| 错误    | 500：服务器异常       |      | 服务器开小差了        | 我们的工程师正在紧急修复中            | 刷新重试、返回              |
| 限制    | 网络错误              |      | 网络请求失败          | 无法连接至服务器，请检查网络稳定性后重试 | 刷新重试、返回              |
| 限制    | 加载超时              |      | 响应等待超时          | 服务器响应时间过长，建议优化网络环境后重试 | 重新加载、返回              |
| 限制    | 503：服务维护中       |      | 服务维护中            | 我们正在努力升级体验，请稍后访问      | 返回、其他推荐内容          |
| 限制    | 403：无访问权限       |      | 访问受限              | 您没有权限查看此内容                  | 切换账号、返回              |
| 成功    | 认证成功              |      | 认证成功              | 认证成功，立即体验完整功能            | 开始探索、新手指南、账号配置 |
