# VUE3-TS-TEMPLATE

## todo

- [x] webpack/vite
- [x] vue3
- [x] typescript
- [x] vue-router
- [x] pinia
- [x] uno-css
- [x] axios 封装
- [x] layout
- [x] login页面
- [x] 权限管理
- [x] 菜单管理
- [x] git hook
- [x] 主题色支持
- [x] 国际化支持
- [x] 使用文档编写
- [ ] 微前端
- [x] 水印功能
- [ ] css规范

## 已知 bug

- [x] vscode校验规则和 commit 提交时的校验规则不一致

## 使用文档

[项目开发文档](https://wiki.das-security.cn/pages/viewpage.action?pageId=72484136)
### 主题使用方式
- 引入组件样式
```jsx
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/reset.css';
import '@/assets/styles/theme.css'

const app = createApp(App);

app.use(Antd).mount('#app');

```
- 引入组件变量
```html
<template>
  <a-config-provider :theme="theme">
  </a-config-provider>
</template>

<script setup lang="ts">
  import theme from '@/theme/theme';
</script>
```
### 请求使用方式

[国际化使用文档](https://wiki.das-security.cn/pages/viewpage.action?pageId=74554043)
