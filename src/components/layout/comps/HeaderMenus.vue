<template>
  <div v-if="!(themeConfig.layout === 'side' && !themeConfig.header)" class="header">
    <div class="logo-wrap">
      
      <span class="logo"><img src="@/assets/images/logo.svg" /></span>
      <span class="title">智启vue3孵化器系统</span>
    </div>
    <!-- <UedMapMenu
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
        <a-button type="primary">新增菜单</a-button>
      </template>
      <template #saveBtn>
        <a-button type="primary">保存</a-button>
      </template>
      <template #cancelBtn>
        <a-button>取消</a-button>
      </template>
    </UedMapMenu> -->
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
              <span @click="showDrawer">帮助文档</span>
            </a-menu-item>
            <a-menu-item>
              <span @click="$router.push('/vueTour')">入门引导</span>
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
        @click="config.lang = config.lang === 'ZH' ? 'EN' : 'ZH'"
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
    :title="`${dialogType === 'add' ? '新增' : '编辑'}菜单`"
    :append-to-body="true"
    width="480px"
  >
    <a-form ref="ruleForm" :model="form" label-position="right" :inline="true" label-width="110px">
      <a-form-item label="菜单名称" prop="name" :rules="rules.name">
        <a-input v-model="form.name" placeholder="请输入菜单名称" auto-complete="off" />
      </a-form-item>
      <a-form-item v-if="dialogType === 'add'" label="菜单体系" prop="level" :rules="rules.level">
        <a-select v-model="form.level" placeholder="请选择菜单体系">
          <a-select-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="dialogType === 'add' && form.level === 2"
        label="所属一级菜单"
        prop="parentId"
        :rules="rules.parentId"
      >
        <a-select v-model="form.parentId" placeholder="请选择所属一级菜单">
          <a-select-option v-for="item in level2Menus" :key="item.id" :label="item.name" :value="item.id" />
        </a-select>
      </a-form-item>
      <template v-if="dialogType === 'add' || editingItem.accessType">
        <a-form-item label="访问方式" prop="accessType">
          <a-radio-group v-model="form.accessType">
            <a-radio label="new">新开页面</a-radio>
            <a-radio label="iframe">内嵌页面</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item class="form-item origin-menu" label="保留原菜单" prop="originMenu">
          <a-switch v-model="form.originMenu" />
        </a-form-item>
        <a-form-item label="关联URL" prop="url" :rules="rules.url">
          <a-input v-model="form.url" placeholder="请输入页面地址" auto-complete="off" />
        </a-form-item>
        <a-form-item class="form-item page-params" label="页面参数">
          <a-input v-model="form.params" placeholder="请输入对应产品的菜单显隐参数" auto-complete="off" />
        </a-form-item>
      </template>
    </a-form>
    <template #footer>
      <a-button @click="dialogVisible = false">取 消</a-button>
      <a-button type="primary" @click="dialogConfirm">确 定</a-button>
    </template>
  </a-modal>
  <a-drawer
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    title="帮助文档"
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
      name: '通用典型页面',
      submenu: [
        {
          id: 'workBench',
          name: '工作台',
          hideChildren: true,
          url: '/workBench',
          submenu: []
        },
        {
          id: 'baseList',
          name: '列表页',
          hideChildren: true,
          url: '/base-list',
          submenu: []
        },
        {
          id: 'baseForm',
          name: '基础表单',
          hideChildren: true,
          url: '/base-form',
          submenu: []
        },
        {
          id: 'baseDetail',
          name: '基础详情',
          hideChildren: true,
          url: '/base-detail',
          submenu: []
        },
        {
          id: 'baseConfig',
          name: '基础配置',
          hideChildren: true,
          url: '/base-config',
          submenu: []
        }
      ]
    },
    {
      id: 'dasvScreen',
      name: '大屏自定义',
      url: '/dasvScreen',
      hideChildren: true,
      submenu: []
    },
    {
      id: 3,
      name: '工作台自定义',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 4,
      name: '报表自定义',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 5,
      name: '图可视化呈现',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 6,
      name: '图编辑器',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 7,
      name: '流程编排',
      url: '/home',
      hideChildren: true,
      submenu: []
    },
    {
      id: 'themeConfig1',
      name: '系统设置',
      submenu: [
        {
          id: 'themeConfig',
          name: '主题配置页',
          url: '/themeConfig'
        },
        {
          id: 'loginConfig',
          name: '登录配置页',
          url: '/loginConfig'
        },
        {
          id: 'dasUpgrade',
          name: '在线升级',
          url: '/dasUpgrade'
        },
        {
          id: 'vueTour',
          name: '用户引导',
          url: '/vueTour'
        }
      ]
    },
    {
      id: 'sum-more',
      name: '多层菜单',
      url: '/sum-more',
      // hideChildren: true,
      submenu: [
        {
          id: 'sum-more-0',
          name: '二级菜单',
          url: '/sum-more-0'
        },
        {
          id: 'sum-more-1',
          name: '二级菜单分类1',
          url: 'sum-more-1',
          submenu: [
            {
              id: 'sum-more-1-0',
              name: '三级菜单',
              url: '/sum-more-1-0'
            },
            {
              id: 'sum-more-1-1',
              name: '自动添加前缀三级菜单',
              url: '/sum-more/sum-more-1-1'
            }
          ]
        },
        {
          id: 'sum-more-2',
          name: '二级菜单分类2',
          url: '/sum-more-2',
          submenu: [
            {
              id: 'sum-more-2-1',
              name: '自动添加多个前缀三级菜单',
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
  const recentlyKeys = ref([]);
  // const starKeys = ref(['baseForm', 'baseDetail', 'baseConfig', 'themeConfig']);
  const starKeys = ref([]);

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
      name: '退出登录'
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
    name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    level: [{ required: true, message: '请选择菜单体系', trigger: 'blur' }],
    parentId: [{ required: true, message: '请选择所属一级菜单', trigger: 'change' }],
    url: [{ required: true, message: '请输入菜单关联的URL', trigger: 'blur' }]
  });
  const dialogType = ref<'add' | 'edit'>('add');
  const editingItem = ref();

  const levelOptions = ref([
    {
      label: '一级菜单',
      value: 1
    },
    {
      label: '二级菜单',
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
