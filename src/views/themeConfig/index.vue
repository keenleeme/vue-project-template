<template>
  <div class="setting-wrapper">
    <div class="page-content">
      <!-- <h1>主题配置页themeConfig</h1> -->
      <BlockArea title="主题风格" class="block-area">
        <ThemePanelItem
          type="mode"
          title="默认主题"
          :mode="config.mode"
          :dark="config.mode === 'dark'"
          @update:mode="(value: string) => changeConfig('mode', value)"
        />
        <!-- @update:mode="changeMode"  -->

        <ThemePanelItem
          type="primaryColor"
          title="默认主题色"
          :mode="config.mode"
          :primary-color="config.primaryColor"
          :dark="config.mode === 'dark'"
          @update:primary-color="(value: string) => changeConfig('primaryColor', value)"
          @reset-primary-color="resetPrimaryColor"
        />
        <!-- @update:primary-color="changePrimaryColor" -->
      </BlockArea>

      <BlockArea title="导航设置" class="block-area">
        <ThemePanelItem
          type="layout"
          title="导航布局"
          :dark="config.mode === 'dark'"
          :mode="config.mode"
          :layout="config.layout"
          :breadcrumb="config.breadcrumb"
          :map-menu="config.mapMenu"
          :accordion="config.accordion"
          :top-style="config.topStyle"
          :side-style="config.sideStyle"
          :header="config.header"
          @update:top-style="(value: string) => changeConfig('topStyle', value)"
          @update:side-style="(value: string) => changeConfig('sideStyle', value)"
          @update:header="(value: string) => changeConfig('header', value)"
          @update:layout="(value: string) => changeConfig('layout', value)"
          @update:breadcrumb="(value: boolean) => changeConfig('breadcrumb', value)"
          @update:map-menu="(value: boolean) => changeConfig('mapMenu', value)"
          @update:accordion="(value: boolean) => changeConfig('accordion', value)"
        />
        <!-- @update:layout="changeLayout" -->

        <ThemePanelItem
          type="others"
          title="其他设置"
          :dark="config.mode === 'dark'"
          :light-dark-switch="config.lightDarkSwitch"
          :language-switch="config.languageSwitch"
          :help-center="config.helpCenter"
          @update:light-dark-switch="(value: boolean) => changeConfig('lightDarkSwitch', value)"
          @update:language-switch="(value: boolean) => changeConfig('languageSwitch', value)"
          @update:help-center="(value: boolean) => changeConfig('helpCenter', value)"
        />
      </BlockArea>
    </div>
    <div class="page-footer">
      <a-button @click="resetTheme">恢复出厂设置</a-button>
      <a-button @click="dialogVisiable = true">生成页面嵌套参数</a-button>
      <a-button type="primary" @click="useTheme">应用当前主题</a-button>
    </div>

    <a-modal v-model:open="dialogVisiable" title="生成页面嵌套参数" centered="true" :closable="false">
      <div>
        <p>复制页面新风格，并将页面的菜单区和内容区分离的参数。如内嵌时需隐藏页面菜单，请带上此参数。</p>
        <div class="params-content">
          <span class="params-label">菜单显隐参数：</span>
          <span class="params-value">
            iFrameWeb=ewogICJ0aGVtZSI6ImRhcmsiLAogICJpc0VuYWJsZWQiOnRydWUsCiAgInNpZGUiOiB0cnVlLAogICJ0b3AiOiB0cnVlCn0=
          </span>
        </div>
      </div>
      <template #footer>
        <a-button key="back" @click="dialogVisiable = false">取消</a-button>
        <a-button key="submit" type="primary" @click="copyParams">复制参数</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { ThemePanelItem } from '@ued-material/menu';
  import { Modal, message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store';
  import BlockArea from '../../components/blockArea/index.vue';

  const themeStore = useThemeStore();

  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });

  watchEffect(() => {
    console.log('themeConfig changed', themeConfig.value);
    config.value = { ...themeConfig.value };
  });

  const changeConfig = (key: string, newConfig: any) => {
    // config.value = { ...newConfig };
    console.log('changeConfig', key, newConfig);
    // 配置页修改，不影响全局，应用后同步到全局
    // Todo config.mode 值变成 dark后，配置页的样式也发生了变化
    // config.value = { ...config.value, [key]: newConfig };
    themeConfig.value = { ...themeConfig.value, [key]: newConfig };
  };

  // const changeMode = (modeValue: string) => {
  //   console.log(1, modeValue);
  //   // themeStore.themeConfig.mode = modeValue;
  //   // themeConfig.value.mode = modeValue;
  //   changeConfig('mode', modeValue);
  // };

  // const changeLayout = (layout: string) => {
  //   console.log(layout);
  //   themeConfig.value.layout = layout;
  // };

  // const changePrimaryColor = (primaryColor: string) => {
  //   // themeStore.themeConfig.primaryColor = primaryColor;
  //   themeConfig.value.primaryColor = primaryColor;
  // };

  // 重置主题色
  const resetPrimaryColor = () => {
    // config.value.primaryColor = '#134BEA';
    themeStore.resetThemePrimaryColor();
  };

  const resetTheme = () => {
    themeStore.reset();
  };

  const dialogVisiable = ref<boolean>(false);

  const useTheme = () => {
    Modal.confirm({
      title: '应用当前主题',
      // icon: createVNode(ExclamationCircleOutlined),
      icon: h(''),
      centered: true,
      content: '新主题风格将覆盖所有账号自定义风格，确定保存新主题风格并应用到所有账号系统吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onCancel(...args) {
        console.log('onCancel', ...args);
      },
      onOk() {
        themeConfig.value = { ...themeConfig.value, ...config.value };
      }
    });
  };

  const copyParams = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        'iFrameWeb=ewogICJ0aGVtZSI6ImRhcmsiLAogICJpc0VuYWJsZWQiOnRydWUsCiAgInNpZGUiOiB0cnVlLAogICJ0b3AiOiB0cnVlCn0='
      );
    }
    message.success('复制成功，请将参数粘贴到新增菜单对应表单处');
    dialogVisiable.value = false;
  };
</script>

<style lang="less" scoped>
  .setting-wrapper {
    // background-color: #fff;
    background-color: var(--primary-bg);
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-content {
      flex-grow: 1;
      // background-color: #f7f8fc;
      background-color: var(--color-page-bg);
      padding: 16px;
      height: 0;
      overflow-x: hidden;
      // color: #1e2435;
      color: var(--color-text-content);
      :deep(.page-item-title) {
        font-size: 16px;
      }

      .block-area {
        .theme-panel-item {
          width: 50%;
          &-title {
            color: #1e2435;
            font-weight: 600;
            line-height: 22px;
          }

          .theme-panel-common-item > span {
            width: 98px;
            text-align: right;
          }
        }
      }
    }

    .page-footer {
      padding: 16px;
      text-align: right;
      // border-top: 1px solid #e9eaf0;
      border-top: 1px solid var(--primary-divider);
      button {
        margin-left: 8px;
        // color: var(--color-text-content);
      }
    }
  }
</style>

<style lang="less" scoped>
  .dark {
    .setting-wrapper {
      .page-footer {
        button {
          // border-color: #4d576e;
          // background-color: #0d172a;
          // outline: none;
        }
        // .ant-btn-primary {
        //   background-color: #3461dd;
        // }
      }
    }
  }
</style>
