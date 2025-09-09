<ComponentInfo developer="邵天瑞" date="2024-03-24" />

# das-helper-text 帮助文本

## 组件说明
一个帮助文本组件用于展示不同强调程度的提示信息，支持多行文本展示，提供三种不同的视觉层级。

## 何时使用
- 需要展示帮助说明、提示信息时
- 需要对文本信息进行不同程度的强调时
- 需要展示格式化的多行文本时

## 交互演示 {style="color:#ff47a3"}
通过编辑JSON配置，实时预览组件效果

:::demo
```vue
<template>
  <JsonEditor :initConfig="initConfig" #config="{ config }">
    <das-helper-text :variant="config.variant">
      {{ config.content }}
    </das-helper-text>
  </JsonEditor>
</template>
<script lang="ts" setup>
import { basicConfig as initConfig } from 'Comp/helper-text/mock/config';
</script>
```
:::

## 代码演示

### 基础用法
最基本的帮助文本展示。

:::demo
```vue
<template>
 <!-- 强提示 -->
    <das-helper-text variant="strong">
      多个进程换行分隔，不允许配置*号。例如：
      /var/www/logs/
      /var/www/cache/
    </das-helper-text>

    <!-- 中等提示 -->
    <das-helper-text variant="medium">
      多个进程换行分隔，不允许配置*号。例如：
      /var/www/logs/
      /var/www/cache/
    </das-helper-text>

    <!-- 弱提示 -->
    <das-helper-text variant="weak">
      多个进程换行分隔，不允许配置*号。例如：
      /var/www/logs/
      /var/www/cache/
    </das-helper-text>
</template>
:::

## API

### Props

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| variant | 变体类型 | string | `strong` / `medium` / `weak` | `medium` |

### Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| default | 帮助文本的内容 | - |

### 变体说明

| 变体类型 | 说明 | 使用场景 |
| --- | --- | --- |
| strong | 强提示 | 用于重要的帮助信息，需要用户重点关注的内容 |
| medium | 中等提示 | 用于普通的帮助信息，默认样式 |
| weak | 弱提示 | 用于辅助性的帮助信息，次要的提示内容 |



## FAQ

### 如何保持文本换行？
组件会自动保持文本的换行格式，您可以直接在内容中使用换行符。

### 是否支持富文本内容？
支持，您可以在内容中使用 HTML 标签来实现更丰富的展示效果。
## 设计说明

### 组件概述
帮助文本用于为用户提供前置性的指引、提示或说明。它通常以简洁的文本形式呈现，位于表单字段旁边、按钮下方或其他需要说明的地方。

### 适用场景

#### 1. 解释输入规则
Helper Text 最常用于表单输入字段旁边，说明输入格式要求。特别是在需要填写复杂数据时（如电话号码、电子邮件、密码等），通过适当的提示可以减少用户的错误，提高表单的完成率。

#### 2. 描述操作影响
描述当前操作的潜在后果。

### 落地实践

#### 使用简洁、指导性的文本
Helper Text 应该简洁、短小、直白，避免过于复杂的语言或技术术语。

#### 布局建议
- **纵向布局时**：组件需要保持对齐
- **横向布局时**：文字间距建议保持16px，可根据字号选择合适间距，建议采用8px的倍数