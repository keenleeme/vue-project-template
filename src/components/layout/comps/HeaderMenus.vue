<template>
  <div class="header">
    <div class="logo-wrap">
      <span class="logo">LOGO</span>
      <span class="title">XXXX安全管理系统</span>
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
        <a-button type="primary">新增菜单</a-button>
      </template>
      <template #saveBtn>
        <a-button type="primary">保存</a-button>
      </template>
      <template #cancelBtn>
        <a-button>取消</a-button>
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
      <i v-if="config.helpCenter" class="icon-button menuicon menu-icon-help" @click="showDrawer" />
      <i class="icon-button menuicon menu-icon-bell" />
      <i class="icon-button menuicon menu-icon-cog" @click="themePanelVisible = true" />
      <i
        v-if="config.lightDarkSwitch"
        class="icon-button menuicon"
        :class="config.mode === 'light' ? 'menu-icon-light' : 'menu-icon-black'"
        @click="config.mode = config.mode === 'light' ? 'dark' : 'light'"
      />
      <i
        v-if="config.languageSwitch"
        class="icon-button menuicon"
        :class="config.lang === 'ZH' ? 'menu-icon-chinese' : 'menu-icon-english'"
        @click="config.lang = config.lang === 'ZH' ? 'EN' : 'ZH'"
      />
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
      <!-- <a-button style="margin-right: 8px" @click="onClose">帮助文档</a-button> -->
      <img src="../images/export-outlined.png" class="icon-export" alt="" @click="onClose" />
    </template>
    <header>
      <h1>未来科技探索</h1>
    </header>
    <main>
      <section>
        <p>
          在不远的将来，人类社会将经历一场前所未有的科技革命。随着量子计算技术的进步，我们已经能够解决许多过去无法处理的复杂问题。
        </p>
        <p>
          在智能家居领域，智能助手已经成为每个家庭的必备成员，它们不仅能够管理日常事务，还能通过情感识别技术与家庭成员进行更加人性化的互动。
        </p>
        <p>
          医疗健康方面，基因编辑技术取得了重大突破，使得许多遗传性疾病得以根治。同时，纳米机器人被用于人体内部进行精准治疗，大大提高了治疗效果。
        </p>
      </section>
      <section>
        <p>
          教育领域也迎来了翻天覆地的变化。虚拟现实技术让远程学习变得更加生动有趣，学生们可以身临其境地参与到各种历史事件之中，或者在模拟环境中进行科学实验。
        </p>
        <p>
          交通出行方面，自动驾驶汽车已经普及，而超高速磁悬浮列车则让人们能够在几小时内跨越大陆。此外，私人飞行器成为了城市间的快速交通工具，极大地缩短了人们的出行时间。
        </p>
      </section>
      <section>
        <p>
          随着人工智能的发展，人们的工作方式也在发生变化。许多重复性劳动已经被机器人取代，人们有更多的时间专注于创造性工作和个人发展。
        </p>
        <p>
          尽管未来充满了无限可能，但我们也面临着新的挑战，比如如何确保这些技术的安全性和道德性，以及如何让所有人都能平等地享受到科技进步带来的好处。
        </p>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 未来科技探索</p>
    </footer>
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
  import { ref, watchEffect, watch, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  // import { generate } from '@ant-design/colors';
  import { UedTopMenu, UedMapMenu, UedUserMenu, ThemePanel, findNodeInTree } from '@ued-material/menu';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore, useThemeStore } from '@/store';

  const menusStore = useMenusStore();
  const appStore = useAppStore();
  const themeStore = useThemeStore();

  // 菜单
  const { activeMenus } = storeToRefs(menusStore);
  const selectMenuId = ref<string[]>([]);
  watchEffect(() => {
    if (activeMenus.value.length > 0) {
      const active = activeMenus.value[activeMenus.value.length - 1];
      selectMenuId.value = [active?.id];
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
          id: 11,
          name: 'dashboard',
          hideChildren: true,
          url: '/workBench',
          submenu: []
        },
        {
          id: 12,
          name: '列表页',
          hideChildren: true,
          url: '/base-list',
          submenu: []
        },
        {
          id: 13,
          name: '表单页',
          hideChildren: true,
          url: '/base-form',
          submenu: []
        },
        {
          id: 14,
          name: '详情页',
          hideChildren: true,
          url: '/base-detail',
          submenu: []
        },
        {
          id: 15,
          name: '配置页',
          hideChildren: true,
          url: '/home',
          submenu: []
        }
      ]
    },
    {
      id: 2,
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
      id: 8,
      name: '系统设置',
      submenu: [
        {
          id: 81,
          name: '主题配置页',
          url: '/themeConfig'
        },
        {
          id: 82,
          name: '登录配置页',
          url: '/loginConfig'
        },
        {
          id: 83,
          name: '在线升级',
          url: '/dasUpgrade'
        },
        {
          id: 84,
          name: '用户引导',
          url: '/vueTour'
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
  const mode = ref('mix');
  const config = ref({
    ...themeConfig.value,
    mode: mode.value
  });

  const popActive = ref(true);
  const activeId = ref(2132);
  const recentlyKeys = ref([21, 11, 231, 31]);
  const starKeys = ref([11, 21, 231, 31]);

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
    // config.value = { ...newConfig };
    // console.log(config.value);
  };

  // 重置主题色
  const resetPrimaryColor = () => {
    config.value.primaryColor = '#134BEA';
  };
  const resetTheme = (newConfig?: any) => {
    config.value = { ...themeConfig.value, ...newConfig };
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
</script>

<style lang="less" scoped>
  .demo-wrapper {
    height: 100vh;

    .demo-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .demo-content > div:last-child {
      display: flex;
      height: 0;
      flex-grow: 1;
      background-color: #f7f8fc;
      z-index: 1;
    }
    &.header-dark {
      .header {
        background-color: #172034;
        color: #fff;

        .title {
          color: #f6f7fb;
        }

        .icon-button {
          color: #adb1bc;

          &:hover {
            background: #353c51;
          }
        }
      }
    }

    &.dark {
      .content {
        background-color: #020c1e;
        color: #fff;
      }
    }
  }
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

    .logo {
      font-size: 32px;
      margin-left: 16px;
      font-weight: 500;
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
  .content {
    flex-grow: 1;
    width: 0;
    color: #505968;

    .menu-setting {
      font-size: 14px;
      margin-bottom: 32px;
      .title {
        font-size: 18px;
        margin-bottom: 16px;
        color: #1e2128;
      }
      .setting-item {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
      }
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
  .header {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 48px;
    padding-right: 320px;
    background-color: #172034;
    color: #fff;
    .logo-wrap {
      min-width: 200px;
    }
    h1 {
      text-align: center;
    }
    p {
      text-indent: 2em;
    }
  }
  .custom-class {
    .icon-export {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
</style>
