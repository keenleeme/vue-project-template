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
- [ ] uno-css 样式不生效 color-#0D3184 这种样式不生效
- [ ] uno-css pr-1 font-size-4 这种样式需要手动刷新才生效，非热更新

## 使用文档

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

```ts
import service from '@/service';

/**请求使用演示 */
interface DemoType {
  name: string;
  desc: string;
}
export async function getDemoData() {
  return service.get<DemoType>('/demo');
}

getDemoData().then((res) => {
  res.data.name;
});
```

## 具体使用文档

### 准备工作

1.需要安装 vscode 插件 [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)、[UnoCSS](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)、[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

2.配置 vscode 保存时自动格式化代码
在vscode 的工作区设置加入如下配置

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 安装依赖和配置说明

- 依赖管理
- env 环境配置
- proxy 配置
- eslint 规则说明和配置
- commitlint 提交规范配置
- 启动命令说明
- 其它配置说明

### 项目开发说明

- 项目目录结构说明
- 需要实现的基础 api
- store 说明
- 路由和菜单关联方式
- 权限管理
