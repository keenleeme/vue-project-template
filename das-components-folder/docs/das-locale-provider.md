# 国际化配置

为组件提供国际化配置

## 如何使用

LocaleProvider 使用 Vue 的 [provide / inject](https://vuejs.org/api/composition-api-dependency-injection.html#inject) 特性，只需在应用外围包裹一次即可全局生效。

你需要引入组件里面的语言包,默认语言包是中文，你可以在组件的目录下找到语言包，比如：

```
import en from 'das-component-vue/es/locale/en'

```

```vue
<template>
  <LocaleProvider :locale="localeEn">
    <app />
  </LocaleProvider>
</template>

<script lang="ts" setup>
  import en from 'das-component-vue/es/locale/en';

  const localeEn = en;
</script>
```

目前支持以下语言：

| 语言     | 文件名 |
| -------- | ------ |
| 简体中文 | zh-CN  |
| 英语     | en     |
