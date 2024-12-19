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
- [x] css规范

## 已知 bug

- [x] vscode校验规则和 commit 提交时的校验规则不一致

## 使用文档

[项目开发文档](https://wiki.das-security.cn/pages/viewpage.action?pageId=72484136)
[项目Q&A](https://wiki.das-security.cn/pages/viewpage.action?pageId=88318914)
[项目工程结构说明](https://wiki.das-security.cn/pages/viewpage.action?pageId=88319752)

## UI KIT图标
### iconfont地址：
 https://www.iconfont.cn/manage/index?spm=a313x.icontype_collection.i1.db775f1f3.7e4f3a81MkDzdN&manage_type=myprojects&projectId=4482924

该地址包含所有UI规范的图标，如有新图标，让ui更新后，重新下载替换文件。
然后将iconfont.css文件里的类名和font-family改成 "zq-icon"

```html
<Icon class="zq-icon zq-icon-icon-black"></Icon>
```

### select组件的下拉箭头图标需替换：
```html
<a-select>
<template #suffixIcon><i class="zq-icon zq-icon-chevron-down ant-select-suffix-new"></i></template>
</a-select>
```

### 主题使用方式
- 引入组件样式
```jsx
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/reset.css';
import '@/theme/theme.css'

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
