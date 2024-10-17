<template>
  <div v-if="!(themeConfig.layout === 'side' && !themeConfig.header)" class="header">
    <div class="logo-wrap">
      <!-- <span class="logo"><img src="@/assets/images/logo.svg" /></span> -->
      <span class="logo"><img :src="loginConfig.logoUrl" /></span>
      <span class="title">{{ $t('I18N.layout.zhiQiFuHuaQi') }}</span>
    </div>
    <UedMapMenu
      v-if="config.layout !== 'side' && config.mapMenu"
      v-model:star-keys="starKeys"
      :props="dataProps"
      :data="topMenuData"
      :dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
      :pop-dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
      :star="true"
      :recently-keys="recentlyKeys"
      popover-class="map-menu-popover"
      trigger="click"
      :close-delay="300"
      :edit="true"
      :edit-actions="['add', 'reset', 'edit', 'move']"
      @menu-open="log('menu-open')"
      @menu-close="log('menu-close')"
      @clear-recently="recentlyKeys = []"
      @add-menu="openAddMenuDialog"
      @edit-item="editItem"
      @reset-menu="resetMenu"
      @start-edit="startEdit"
      @cancel-edit="cancelEdit"
      @save-edit="saveEdit"
      @drag-menu="dragMenu"
    >
      <template #addBtn>
        <a-button type="primary">{{ $t('I18N.common.add') }}{{ $t('I18N.common.menu') }}</a-button>
      </template>
      <template #saveBtn>
        <a-button type="primary">{{ $t('I18N.common.save') }}</a-button>
      </template>
      <template #cancelBtn>
        <a-button>{{ $t('I18N.common.cancel') }}</a-button>
      </template>
    </UedMapMenu>

    <TopMenu
      v-if="config.layout !== 'side'"
      :menuData="topMenuData" 
    ></TopMenu>

    <div class="header-operates">
      <a-dropdown>
        <i class="icon-button menuicon menu-icon-help" />
        <template #overlay>
          <a-menu>
            <a-menu-item v-if="config.helpCenter">
              <span @click="showHelpDocument">{{ $t('I18N.layout.bangZhuWenDang') }}</span>
            </a-menu-item>
            <a-menu-item>
              <span @click="$router.push('/vueTour')">{{ $t('I18N.layout.ruMenYinDao') }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <!-- <i class="icon-button menuicon menu-icon-bell" /> -->
      <i class="icon-button menuicon menu-icon-cog" @click="themePanelVisible = true" />
      <i
        v-if="config.lightDarkSwitch"
        class="icon-button menuicon"
        :class="config.mode === 'light' ? 'menu-icon-light' : 'menu-icon-black'"
        @click="themeConfig.mode = config.mode === 'light' ? 'dark' : 'light'"
      />
      <i
        v-if="config.languageSwitch"
        class="icon-button menuicon"
        :class="config.lang === 'zh' ? 'menu-icon-chinese' : 'menu-icon-english'"
        @click="handleLocaleChangeA(config.lang)"
      />
      <FullscreenOutlined class="icon-button menuicon" size="24" @click="toggleFullScreen" />
      <UserMenu :menuData="userMenu" ></UserMenu>
    </div>
  </div>
  <a-modal
    v-model:open="dialogVisible"
    :title="`${dialogType === 'add' ? $t('I18N.common.add') : $t('I18N.common.edit')}`"
    :append-to-body="true"
    width="480px"
  >
    <a-form ref="ruleForm" :model="form" label-position="right" :inline="true" label-width="110px">
      <a-form-item :label="$t('I18N.layout.caiDanMingCheng')" prop="name" :rules="rules.name">
        <a-input v-model="form.name" :placeholder="$t('I18N.layout.qingShuRuCaiDanMingCheng')" auto-complete="off" />
      </a-form-item>
      <a-form-item v-if="dialogType === 'add'" :label="$t('I18N.layout.caiDanTiXi')" prop="level" :rules="rules.level">
        <a-select v-model="form.level" :placeholder="$t('I18N.layout.qingShuRuCaiDanTiXi')">
          <a-select-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="dialogType === 'add' && form.level === 2"
        :label="$t('I18N.layout.suoShuYiJiCaiDan')"
        prop="parentId"
        :rules="rules.parentId"
      >
        <a-select v-model="form.parentId" :placeholder="$t('I18N.layout.qingXuanZeSuoShuYiJiCaiDan')">
          <a-select-option v-for="item in level2Menus" :key="item.id" :label="item.name" :value="item.id" />
        </a-select>
      </a-form-item>
      <template v-if="dialogType === 'add' || editingItem.accessType">
        <a-form-item :label="$t('I18N.layout.fangWenFangShi')" prop="accessType">
          <a-radio-group v-model="form.accessType">
            <a-radio label="new">{{ $t('I18N.layout.xinKaiYeMian') }}</a-radio>
            <a-radio label="iframe">{{ $t('I18N.layout.neiQianYeMian') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="form-item origin-menu" :label="$t('I18N.layout.baoLiuYuanCaiDan')" prop="originMenu">
          <a-switch v-model="form.originMenu" />
        </a-form-item>
        <a-form-item :label="$t('I18N.layout.guanLianURL')" prop="url" :rules="rules.url">
          <a-input v-model="form.url" :placeholder="$t('I18N.layout.qingShuRuYeMianDiZhi')" auto-complete="off" />
        </a-form-item>
        <a-form-item class="form-item page-params" :label="$t('I18N.layout.yeMianCanShu')">
          <a-input v-model="form.params" :placeholder="$t('I18N.layout.caiDanXianYinCanShu')" auto-complete="off" />
        </a-form-item>
      </template>
    </a-form>
    <template #footer>
      <a-button @click="dialogVisible = false">{{ $t('I18N.common.cancel') }}</a-button>
      <a-button type="primary" @click="dialogConfirm">{{ $t('I18N.common.confirm') }}</a-button>
    </template>
  </a-modal>

  <!-- 帮助文档 -->
  <div ref="helpDocument" class="help-document"></div>

  <ThemePanel
    v-model:visible="themePanelVisible"
    v-model:config="config"
    @change="changeConfig"
    @reset-primary-color="resetPrimaryColor"
    @reset-theme="resetTheme"
  />
</template>

<script setup lang="ts">
  import { ref, watchEffect, watch, computed } from 'vue';
  import { FullscreenOutlined } from '@ant-design/icons-vue';
  import { changeLocale } from '@international/vue3-i18n';
  import { UedMapMenu, ThemePanel, findNodeInTree } from '@ued-material/menu';
  import docsViewer from 'docs-viewer';
  import 'docs-viewer/dist/lib.css';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useThemeStore } from '@/store';
  import TopMenu from '@/components/uedModule/menu/topMenu.vue'
  import UserMenu from '@/components/uedModule/menu/userMenu.vue'
  import { LoginConfigDTO } from '@/views/uedModule/login/types';

  const props = defineProps({
    menuData: {
      type: Array,
      // required: true
      default: () => [],
    },
    userMenu: {
      type: Array,
      // required: true,
      default: () => [],
    },
    dataProps: {
      type: Object,
      default: {
        id: 'id',
        label: 'name',
        children: 'submenu',
        icon: 'icon',
        hide: 'hide',
        html: 'html',
        hideChildren: 'hideChildren',
        disabled: 'disabled',
      },
    },
  });

  const appStore = useAppStore();
  const themeStore = useThemeStore();

  const { themePanelVisible, appConfig } = storeToRefs(appStore);
  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO(appConfig.value?.loginConfig));

  // 菜单数据
  const topMenuData = ref(props.menuData)

  // 退出登录
  const handleLogout = () => {
    menusStore.reset();
    appStore.reset();
    themeStore.reset();
    router.push('/login');
  };
  const data = ref([
    {
      id: 1,
      name: I18N.layout.genericTypicalPage,
      submenu: [
        {
          id: 'workBench',
          name: I18N.layout.gongZuoTai,
          hideChildren: true,
          url: '/workBench',
          submenu: []
        },
        {
          id: 'baseList',
          name: I18N.layout.lieBiaoYe,
          hideChildren: true,
          url: '/base-list',
          submenu: []
        },
        {
          id: 'baseForm',
          name: I18N.layout.biaoDanYe,
          hideChildren: true,
          url: '/base-form',
          submenu: []
        },
        {
          id: 'baseDetail',
          name: I18N.layout.xiangQingYe,
          hideChildren: true,
          url: '/base-detail',
          submenu: []
        },
        {
          id: 'baseConfig',
          name: I18N.layout.peiZhiYe,
          hideChildren: true,
          url: '/base-config',
          submenu: []
        }
      ]
    },
    {
      id: 'dasvScreen',
      name: I18N.layout.daPingZiDingYi,
      url: '/dasvScreen',
      hideChildren: true,
      submenu: []
    },
    {
      id: 3,
      name: I18N.layout.gongZuoTaiZiDingYi,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 4,
      name: I18N.layout.baoBiaoZiDingYi,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 5,
      name: I18N.layout.tuKeShiHuaChengXian,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 6,
      name: I18N.layout.tuBianJiQi,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 7,
      name: I18N.layout.liuChengBianPai,
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 8,
      name: I18N.layout.xiTongSheZhi,
      submenu: [
        {
          id: 'themeConfig',
          name: I18N.layout.zhuTiPeiZhiYe,
          url: '/themeConfig'
        },
        {
          id: 'loginConfig',
          name: I18N.layout.dengLuPeiZhiYe,
          url: '/loginConfig'
        },
        {
          id: 'dasUpgrade',
          name: I18N.layout.zaiXianShengJi,
          url: '/dasUpgrade'
        },
        {
          id: 'vueTour',
          name: I18N.layout.yongHuYinDao,
          url: '/vueTour'
        }
      ]
    },
    {
      id: 9,
      name: I18N.api.common.duoCengCaiDan,
      url: '/sum-more',
      // hideChildren: true,
      submenu: [
        {
          id: 90,
          name: I18N.api.common.erJiCaiDan,
          url: '/sum-more-0'
        },
        {
          id: 91,
          name: I18N.api.common.erJiCaiDanFen2,
          url: 'sum-more-1',
          submenu: [
            {
              id: 910,
              name: I18N.api.common.sanJiCaiDan,
              url: '/sum-more-1-0'
            },
            {
              id: 911,
              name: I18N.api.common.ziDongTianJiaQian,
              url: '/sum-more/sum-more-1-1'
            }
          ]
        },
        {
          id: 92,
          name: I18N.api.common.erJiCaiDanFen,
          url: '/sum-more-2',
          submenu: [
            {
              id: 920,
              name: I18N.api.common.ziDongTianJiaDuo,
              url: '/sum-more/sum-more-2/sum-more-2-1'
            }
          ]
        }
      ]
    }
  ]);

  const dataProps = ref({
    label: 'name',
    children: 'submenu'
  });

  // const defaultConfig = {
  //   mode: 'light',
  //   lang: 'ZH',
  //   primaryColor: '#134BEA',
  //   darkPrimaryColor: '#3B71EE',
  //   lightDarkSwitch: true,
  //   languageSwitch: true,
  //   helpCenter: true,
  //   layout: 'top',
  //   topStyle: 'dark',
  //   sideStyle: 'light',
  //   header: true,
  //   breadcrumb: true,
  //   mapMenu: true,
  //   accordion: true
  // };
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });

  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  const recentlyKeys = ref([]);
  const starKeys = ref([]);

  const originMenuData = JSON.parse(JSON.stringify(topMenuData.value));
  const tempMenu = ref();

  const dialogVisible = ref(false);
  const ruleForm = ref();
  const form = ref({
    name: '',
    level: 1,
    parentId: '',
    accessType: 'new',
    originMenu: false,
    url: '',
    params: ''
  });
  const rules: any = ref({
    name: [{ required: true, message: I18N.layout.qingShuRuCaiDanMingCheng, trigger: 'blur' }],
    level: [{ required: true, message: I18N.layout.qingShuRuCaiDanTiXi, trigger: 'blur' }],
    parentId: [{ required: true, message: I18N.layout.suoShuYiJiCaiDan, trigger: 'change' }],
    url: [{ required: true, message: I18N.layout.caiDanGuanLianURL, trigger: 'blur' }]
  });
  const dialogType = ref<'add' | 'edit'>('add');
  const editingItem = ref();

  const levelOptions = ref([
    {
      label: I18N.common.yiJiCaiDan,
      value: 1
    },
    {
      label: I18N.common.erJiCaiDan,
      value: 2
    }
  ]);

  const level2Menus = ref<any[]>([]);
  const updateLevel2Menus = () => {
    level2Menus.value = topMenuData.value.filter((item) => item.submenu && item.submenu.length > 0);
  };

  const openAddMenuDialog = () => {
    dialogType.value = 'add';
    if (ruleForm.value) ruleForm.value.clearValidate();
    form.value = {
      name: '',
      level: 1,
      parentId: '',
      accessType: 'new',
      originMenu: false,
      url: '',
      params: ''
    };
    updateLevel2Menus();
    dialogVisible.value = true;
  };

  const editItem = (val: any) => {
    const { type, id } = val;
    const itemData = findNodeInTree(topMenuData.value, id, props.dataProps.value) as any;
    if (type === 'reset') {
      const originItem = findNodeInTree(originMenuData, id, props.dataProps.value) as any;
      itemData.name = originItem.name;
    }
    if (type === 'edit') {
      dialogType.value = 'edit';
      editingItem.value = itemData;
      form.value.name = itemData.name;
      if (itemData.accessType) Object.assign(form.value, itemData);
      updateLevel2Menus();
      if (ruleForm.value) ruleForm.value.clearValidate();
      dialogVisible.value = true;
    }
  };

  const resetMenu = () => {
    topMenuData.value = JSON.parse(JSON.stringify(originMenuData));
  };

  const startEdit = () => {
    tempMenu.value = JSON.parse(JSON.stringify(topMenuData.value));
  };

  const cancelEdit = () => {
    topMenuData.value = JSON.parse(JSON.stringify(tempMenu.value));
  };

  const saveEdit = () => {};

  const dragMenu = (val: any) => {
    topMenuData.value = val.newData;
  };

  const newId = 999;

  const dialogConfirm = () => {
    if (!ruleForm.value) return;
    ruleForm.value.validate((valid: boolean) => {
      if (!valid) return;
      if (dialogType.value === 'add') {
        const { name, level, parentId, accessType, originMenu, url, params } = form.value;
        const menuInfo = {
          id: newId + 1,
          name,
          accessType,
          originMenu,
          url,
          params
        };
        if (level === 1) {
          topMenuData.value.push(menuInfo);
        } else {
          const parent = topMenuData.value.find((item: any) => item.id === parentId) as any;
          if (!parent.submenu) parent.submenu = [];
          parent.submenu.push(menuInfo);
        }
      } else {
        const { name, accessType, originMenu, url, params } = form.value;
        editingItem.value.name = name;
        if (editingItem.value.accessType) {
          editingItem.value.accessType = accessType;
          editingItem.value.originMenu = originMenu;
          editingItem.value.url = url;
          editingItem.value.params = params;
        }
      }
      dialogVisible.value = false;
    });
  };

  const log = (val: any) => {
    console.log(val);
  };

  const changeConfig = (newConfig?: any) => {
    console.log(config.value, newConfig);
    if (newConfig.type === 'change') {
      return;
    }
    themeStore.themeConfig = { ...newConfig };
  };

  // 重置主题色
  const resetPrimaryColor = () => {
    themeStore.resetThemePrimaryColor();
  };
  const resetTheme = () => {
    themeStore.reset();
  };

  // 帮助手册
  const helpDocument = ref(null);

  const showHelpDocument = () => {
    docsViewer.open({
      container: helpDocument.value,
      src: 'http://10.20.114.19:8089/docs/' // 即你上个步骤部署的文档的静态资源地址
    });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // 国际化切换

  const handleLocaleChangeA = (value: string) => {
    let locale = value === 'zh' ? 'en' : 'zh';
    // setThemeConfig({...config})
    themeConfig.value = { ...themeConfig.value, lang: locale };
    changeLocale(locale);
    window.location.reload();
  };
</script>

<style lang="less" scoped>
  .header {
    height: 48px;
    width: 100%;
    display: flex;
    align-items: center;
    color: #1e2435;
    box-shadow:
      0px 2px 4px rgba(0, 0, 0, 0.12),
      0 0 6px rgba(0, 0, 0, 0.04);
    z-index: 99;
    position: relative;
    background: #fff;
    .logo-wrap {
      display: flex;
      align-items: center;
    }
    .logo {
      margin-left: 16px;
      margin-right: 8px;
      img {
        width: 30px;
      }
    }

    .title {
      font-size: 16px;
      margin: 0 32px 0 8px;
      font-weight: 500;
    }

    .top-menu-wrapper {
      width: 50%;
    }
  }
  // .content {
  //   flex-grow: 1;
  //   width: 0;
  //   color: #505968;
  //   .menu-setting {
  //     font-size: 14px;
  //     margin-bottom: 32px;
  //     .title {
  //       font-size: 18px;
  //       margin-bottom: 16px;
  //       color: #1e2128;
  //     }
  //     .setting-item {
  //       margin-bottom: 16px;
  //       display: flex;
  //       align-items: center;
  //     }
  //   }
  // }
  .cut-form .cut-input {
    width: 310px;
  }
  .form-item.origin-menu {
    margin-top: -12px;
  }
  .form-item.page-params {
    margin-top: -4px;
    .cut-form-item__label {
      opacity: 0;
    }
  }
  .header-dark {
    .header {
      background-color: #172034;
      color: #fff;
    }
    .header-operates {
      .icon-button:hover {
        background: #353c51;
      }
    }
  }
  .custom-class {
    .icon-export {
      width: 20px;
      height: 20px;
      cursor: pointer;
      position: relative;
      top: 4px;
      fill: var(--color-text-sub-title);
    }
  }
</style>
