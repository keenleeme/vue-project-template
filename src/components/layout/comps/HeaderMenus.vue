<template>
  <div v-if="!(themeConfig.layout === 'side' && !themeConfig.header)" class="header">
    <div class="logo-wrap">
      <span class="logo"><img src="@/assets/images/logo.svg" /></span>
      <span class="title">{{ $t('I18N.layout.zhiQiFuHuaQi') }}</span>
    </div>
    <UedMapMenu
      v-if="config.layout !== 'side' && config.mapMenu"
      v-model:star-keys="starKeys"
      :props="dataProps"
      :data="data"
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
    <UedTopMenu
      v-if="config.layout !== 'side'"
      v-model:active-id="activeId"
      :props="dataProps"
      :data="data"
      :pop-active="popActive"
      :dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
      :pop-dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
      :mix="config.mode === 'mix'"
      popover-class="top-menu-popover"
      @menu-click="handleMenuClick"
    >
    </UedTopMenu>
    <div class="header-operates">
      <a-dropdown>
        <i class="icon-button menuicon menu-icon-help" />
        <template #overlay>
          <a-menu>
            <a-menu-item v-if="config.helpCenter">
              <span @click="showDrawer">{{ $t('I18N.layout.bangZhuWenDang') }}</span>
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
        :class="config.lang === 'ZH' ? 'menu-icon-chinese' : 'menu-icon-english'"
        @click="handleLocaleChangeA(config.lang)"
      />
      <FullscreenOutlined class="icon-button menuicon" size="24" @click="toggleFullScreen" />
      <UedUserMenu
        :props="dataProps"
        :data="userMenu"
        :dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
        :pop-dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
        name="Admin"
        popover-class="user-menu-popover"
        @menu-click="userMenuClick"
      />
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
  <a-drawer
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :title="$t('I18N.layout.bangZhuWenDang')"
    width="520"
    :closable="false"
    placement="right"
    @after-open-change="afterOpenChange"
  >
    <template #extra>
      <svg
        t="1726654047990"
        class="icon icon-export"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4265"
        width="24"
        height="24"
        @click="onClose"
      >
        <path
          d="M887.488 467.072H591.616a34.112 34.112 0 1 0 0 68.224h213.44l-304.64 304.64a34.112 34.112 0 1 0 48.256 48.32l304.64-304.64v213.376a34.112 34.112 0 1 0 68.288 0V501.184a34.112 34.112 0 0 0-34.112-34.112z"
          p-id="4266"
        ></path>
        <path
          d="M876.096 347.328v-130.56c0-50.304-40.768-91.072-91.008-91.072H193.408c-50.24 0-91.008 40.768-91.008 91.072v523.392c0 50.24 40.768 91.008 91.008 91.008h204.8v-0.128a34.112 34.112 0 0 0 0-68.032v-0.128H216.192a45.504 45.504 0 0 1-45.504-45.504V330.496h637.12v18.176c0 0.704-0.192 1.408-0.192 2.176a34.432 34.432 0 1 0 68.864 0c0-1.216-0.256-2.368-0.384-3.52z m-68.288-62.336H170.688v-45.44c0-25.152 20.352-45.568 45.44-45.568h546.176c25.152 0 45.504 20.416 45.504 45.504v45.504z"
          p-id="4267"
        ></path>
      </svg>
    </template>
    <HelpDocument></HelpDocument>
  </a-drawer>
  <ThemePanel
    v-model:visible="themePanelVisible"
    v-model:config="config"
    @change="changeConfig"
    @reset-primary-color="resetPrimaryColor"
    @reset-theme="resetTheme"
  />
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import { FullscreenOutlined } from '@ant-design/icons-vue';
  // import { generate } from '@ant-design/colors';
  import { UedTopMenu, UedMapMenu, UedUserMenu, ThemePanel, findNodeInTree } from '@ued-material/menu';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';
  import HelpDocument from './HelpDocument.vue';
  import { changeLocale } from '@international/vue3-i18n';

  const menusStore = useMenusStore();
  const appStore = useAppStore();
  const themeStore = useThemeStore();

  // 菜单
  const { activeMenus, activeId } = storeToRefs(menusStore);
  const selectMenuId = ref<string[]>([]);
  watchEffect(() => {
    console.log(1111)
    if (activeMenus.value.length > 0) {
      const active = activeMenus.value[activeMenus.value.length - 1];
      selectMenuId.value = [active?.id];
    }
    if (activeId.value) {
      // selectMenuId.value = [activeId.value];
      console.log(activeId)
    }
  });

  const router = useRouter();

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
          name: 'dashboard',
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

  console.log('themeConfig', themeConfig.value.header, themeStore);
  const config = ref({
    ...themeConfig.value
  });

  // 设置ant-design 主题色
  const changeColorPrimary = (type: string) => {
    themeStore.setThemeType(type);
    themeStore.setThemeTokenType(type);
  };
  watchEffect(() => {
    config.value = { ...themeConfig.value };
    changeColorPrimary(config.value.mode);
  });

  const popActive = ref(true);
  // let activeId = ref<string|number>();
  const recentlyKeys = ref([21, 11, 231, 31]);
  const starKeys = ref([11, 21, 231, 31]);

  // watchEffect(() => {
  //   // 获取当前激活的菜单项的id，并将其赋值给activeId。activeMenus是一个数组，需要获取最后一个元素。
  //   // if (activeMenus.value.length > 0) {
  //   //   console.log(activeMenus)
  //   //   const active = activeMenus.value[activeMenus.value.length - 1];
  //   //   activeId.value = active?.id;
  //   // }
  // });

  const userMenu = ref([
    {
      id: 1,
      name: I18N.layout.tuiChuDengLu
    }
  ]);

  const handleMenuClick = (item: any) => {
    router.push(item.url);
  };

  const originMenuData = JSON.parse(JSON.stringify(data.value));
  const tempMenu = ref();

  const userMenuClick = () => {
    handleLogout();
  };

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
    level2Menus.value = data.value.filter((item) => item.submenu && item.submenu.length > 0);
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
    const itemData = findNodeInTree(data.value, id, dataProps.value) as any;
    if (type === 'reset') {
      const originItem = findNodeInTree(originMenuData, id, dataProps.value) as any;
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
    data.value = JSON.parse(JSON.stringify(originMenuData));
  };

  const startEdit = () => {
    tempMenu.value = JSON.parse(JSON.stringify(data.value));
  };

  const cancelEdit = () => {
    data.value = JSON.parse(JSON.stringify(tempMenu.value));
  };

  const saveEdit = () => {};

  const dragMenu = (val: any) => {
    data.value = val.newData;
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
          data.value.push(menuInfo);
        } else {
          const parent = data.value.find((item: any) => item.id === parentId) as any;
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

  const themePanelVisible = ref(false);

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
    // config.value.primaryColor = '#134BEA';
    themeStore.resetThemePrimaryColor();
  };
  const resetTheme = () => {
    themeStore.reset();
    // themeStore.$reset();
  };

  // 帮助手册
  const open = ref<boolean>(false);

  const afterOpenChange = (bool: boolean) => {
    console.log('open', bool);
  };
  const showDrawer = () => {
    open.value = true;
  };
  const onClose = () => {
    window.open('https://rd.das-security.cn/home');
    open.value = false;
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
    let locale = value === 'ZH'?'en':'zh';
    changeLocale(locale);
    window.location.reload();
  }
  
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
      img{
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
  .header-dark{ 
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
