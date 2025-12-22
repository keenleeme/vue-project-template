<template>
  <div v-if="!(themeConfig.layout === 'side' && !themeConfig.header)" class="header">
    <div class="logo-wrap" @click="handleLogoClick('/custom-workbench')">
      <span class="logo"><img :src="loginConfig.logoUrl" /></span>
      <span class="title">{{ loginConfig.logoName }}</span>
    </div>
    <UedMapMenu
      v-if="config.layout !== 'side' && config.mapMenu"
      v-model:star-keys="starKeys"
      :props="dataProps"
      :data="topMenuData"
      :dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
      :pop-dark="config.mode === 'dark'"
      :star="true"
      :recently-keys="recentlyKeys"
      popover-class="map-menu-popover"
      trigger="click"
      :close-delay="300"
      :edit="true"
      :edit-actions="['add', 'reset', 'edit', 'move']"
      @menu-open="log('menu-open')"
      @menu-close="log('menu-close')"
      @menu-click="handleMenuClick"
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

    <TopMenu v-if="config.layout !== 'side'" :menu-data="menuData" :data-props="dataProps"></TopMenu>

    <div class="header-operates">
      <a-dropdown>
        <i class="icon-button menuicon menu-icon-help" />
        <template #overlay>
          <a-menu>
            <a-menu-item v-if="config.helpCenter">
              <span @click="showHelpDocument">{{ $t('I18N.layout.bangZhuWenDang') }}</span>
            </a-menu-item>
            <a-menu-item>
              <span @click="toComponentsGuide">{{ $t('I18N.layout.yinDaoTiShiZuJian') }}</span>
            </a-menu-item>
            <a-menu-item>
              <span @click="handleMenuClick({ url: '/vueTour' })">{{ $t('I18N.layout.ruMenYinDao') }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <LanguageSwitcher />
      <a-dropdown class="side-menu-footer-item" placement="bottom">
        <i class="icon-button zq-icon zq-icon-wenben"></i>
        <template #overlay>
          <a-menu @click="handleFontSizeChange" :selected-keys="[themeConfig.fontSize]">
            <a-menu-item key="12px">12px</a-menu-item>
            <a-menu-item key="14px">14px</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <i
        v-if="config.lightDarkSwitch"
        class="icon-button menuicon"
        :class="config.mode === 'light' ? 'menu-icon-light' : 'menu-icon-black'"
        @click="handleChangeMode"
      />
      <i class="icon-button menuicon menu-icon-theme" @click="handleThemePanelChange" />
      <UserMenu :menu-data="userMenu"></UserMenu>
    </div>
  </div>
  <a-modal
    v-model:open="dialogVisible"
    :title="`${dialogType === 'add' ? $t('I18N.common.add') : $t('I18N.common.edit')}`"
    :append-to-body="true"
    width="480px"
  >
    <a-form ref="ruleForm" :model="form" label-position="right" :inline="true" label-width="110px">
      <a-form-item :label="$t('I18N.layout.caiDanMingCheng')" name="name" :rules="rules.name">
        <a-input
          v-model:value="form.name"
          :placeholder="$t('I18N.layout.qingShuRuCaiDanMingCheng')"
          auto-complete="off"
        />
      </a-form-item>
      <a-form-item v-if="dialogType === 'add'" :label="$t('I18N.layout.caiDanTiXi')" name="level" :rules="rules.level">
        <a-select v-model:value="form.level" :placeholder="$t('I18N.layout.qingShuRuCaiDanTiXi')">
          <template #suffixIcon><i class="zq-icon zq-icon-chevron-down ant-select-suffix-new"></i></template>
          <a-select-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="dialogType === 'add' && form.level === 2"
        :label="$t('I18N.layout.suoShuYiJiCaiDan')"
        name="parentId"
        :rules="rules.parentId"
      >
        <a-select v-model:value="form.parentId" :placeholder="$t('I18N.layout.qingXuanZeSuoShuYiJiCaiDan')">
          <template #suffixIcon><i class="zq-icon zq-icon-chevron-down"></i></template>
          <a-select-option v-for="item in level2Menus" :key="item.id" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <template v-if="dialogType === 'add' || editingItem.accessType">
        <a-form-item :label="$t('I18N.layout.fangWenFangShi')" name="accessType">
          <a-radio-group v-model:value="form.accessType">
            <a-radio value="new">{{ $t('I18N.layout.xinKaiYeMian') }}</a-radio>
            <a-radio value="iframe">{{ $t('I18N.layout.neiQianYeMian') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="form-item origin-menu" :label="$t('I18N.layout.baoLiuYuanCaiDan')" name="originMenu">
          <a-switch v-model:checked="form.originMenu" />
        </a-form-item>
        <a-form-item :label="$t('I18N.layout.guanLianURL')" name="url" :rules="rules.url">
          <a-input v-model:value="form.url" :placeholder="$t('I18N.layout.qingShuRuYeMianDiZhi')" auto-complete="off" />
        </a-form-item>
        <a-form-item class="form-item page-params" :label="$t('I18N.layout.yeMianCanShu')">
          <a-input
            v-model:value="form.params"
            :placeholder="$t('I18N.layout.caiDanXianYinCanShu')"
            auto-complete="off"
          />
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
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import { UedMapMenu, findNodeInTree } from '@ued-material/menu';
  import docsViewer from 'docs-viewer';
  import 'docs-viewer/dist/lib.css';
  import { storeToRefs } from 'pinia';
  import LanguageSwitcher from '@/components/uedModule/common/LanguageSwitcher.vue';
  import TopMenu from '@/components/uedModule/menu/topMenu.vue';
  import UserMenu from '@/components/uedModule/menu/userMenu.vue';
  import { microMenuNavigation } from '@/micro/microApi/helper';
  import { useLoginStore, useAppStore, useThemeStore } from '@/store';
  import { LoginConfigDTO } from '@/views/uedModule/login/types';

  interface MenuItem {
    children?: MenuItem[];
    [key: string]: any;
  }

  const props = defineProps({
    menuData: {
      type: Array as PropType<MenuItem[]>,
      default: () => []
    },
    userMenu: {
      type: Array,
      // required: true,
      default: () => []
    },
    dataProps: {
      type: Object,
      default() {
        return {
          id: 'id',
          label: 'name',
          children: 'children',
          icon: 'icon',
          hide: 'hide',
          html: 'html',
          hideChildren: 'hideChildren',
          disabled: 'disabled'
        };
      }
    }
  });

  const appStore = useAppStore();
  const themeStore = useThemeStore();
  const loginStore = useLoginStore();

  const { themePanelVisible, appConfig } = storeToRefs(appStore);
  const { loginConfig } = storeToRefs(loginStore);

  // 菜单数据
  const topMenuData = ref<MenuItem[]>(props.menuData);

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
      label: I18N.api.common.yiJiCaiDan,
      value: 1
    },
    {
      label: I18N.api.common.erJiCaiDan,
      value: 2
    }
  ]);

  const level2Menus = ref<any[]>([]);
  const updateLevel2Menus = () => {
    level2Menus.value = topMenuData.value.filter((item: any) => item.children && item.children.length > 0);
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
    ruleForm.value
      .validate()
      .then(() => {
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
        ruleForm.value.clearValidate();
        ruleForm.value.resetFields();
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const log = (val: any) => {
    console.log(val);
  };

  const router = useRouter();
  const handleMenuClick = (val: any) => {
    // router.push(val.url);
    microMenuNavigation(val);
  };

  // 帮助手册
  const helpDocument = ref(null);

  const showHelpDocument = () => {
    docsViewer.open({
      container: helpDocument.value,
      src: 'http://10.20.114.19:8089/docs/' // 即你上个步骤部署的文档的静态资源地址
    });
  };

  // 组件使用引导
  const toComponentsGuide = () => {
    window.open(`${window.location.origin}/componentsGuide`, '_blank');
  };

  const handleChangeMode = () => {
    const mode = config.value.mode === 'light' ? 'dark' : 'light';
    themeStore.setThemeConfig({
      ...themeConfig.value,
      mode
    });
    if (window.microApp) {
      window.microApp.setGlobalData({ themeMode: mode });
    }
  };

  // 字号切换
  const handleFontSizeChange = ({ key }) => {
    themeStore.setThemeConfig({
      ...themeConfig.value,
      fontSize: key
    });
  };

  // 打开主题设置面板
  const handleThemePanelChange = () => {
    if (router.currentRoute.value.path !== '/themeConfig') {
      router.push('/themeConfig');
    }
    appStore.setThemePanelVisible(!themePanelVisible.value);
  };

  // 点击logo跳转-》工作台自定义
  const handleLogoClick = (url) => {
    router.push(url);
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
    :deep(.user-menu-wrapper) .uesr-menu-content > span {
      max-width: 80px;
    }
    .logo-wrap {
      display: flex;
      align-items: center;
    }
    .logo {
      margin-left: 16px;
      margin-right: 8px;
      img {
        width: 30px;
        cursor: pointer;
      }
    }

    .title {
      font-size: var(--font-size-large);
      margin: 0 32px 0 8px;
      font-weight: 500;
    }

    .top-menu-wrapper {
      width: 50%;
    }
  }
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
      background-color: var(--um-dark-color-bg-0);
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
      fill: var(--color-text-secondary);
    }
  }
</style>
