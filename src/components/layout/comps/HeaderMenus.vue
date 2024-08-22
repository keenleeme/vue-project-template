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
      <i v-if="config.helpCenter" class="icon-button menuicon menu-icon-help" />
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
  import { generate } from '@ant-design/colors';
  import { UedTopMenu, UedMapMenu, UedUserMenu, ThemePanel, findNodeInTree } from '@ued-material/menu';
  import { storeToRefs } from 'pinia';
  import { useAppStore, useMenusStore } from '@/store';

  const menusStore = useMenusStore();
  const appStore = useAppStore();

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
    router.push('/login');
  };

  const data = ref([
    {
      id: 2,
      name: '模版导航',
      submenu: [
        {
          id: 21,
          name: '模版导航一级选项1',
          // hideChildren: true,
          submenu: [
            {
              id: 2131,
              name: '主题配置',
              url: '/theme'
            },
            {
              id: 2132,
              name: '首页',
              url: '/home'
            },
            {
              id: 2133,
              name: '工作台',
              url: '/workBench'
            },
            {
              id: 2134,
              name: '二级选项'
            },
            {
              id: 2135,
              name: '二级选项隐藏',
              hide: true
            }
          ]
        },
        {
          id: 22,
          name: '一级选项2',
          submenu: [
            {
              id: 2231,
              name: '二级选项'
            },
            {
              id: 2232,
              name: '二级选项'
            },
            {
              id: 2233,
              name: '二级选项'
            },
            {
              id: 2234,
              name: '二级选项'
            },
            {
              id: 2235,
              name: '二级选项'
            }
          ]
        },
        {
          id: 23,
          name: '一级选项',
          submenu: [
            {
              id: 231,
              name: '二级选项'
            },
            {
              id: 232,
              name: '二级选项'
            },
            {
              id: 233,
              name: '二级选项'
            },
            {
              id: 234,
              name: '二级选项'
            },
            {
              id: 235,
              name: '二级选项'
            }
          ]
        },
        {
          id: 24,
          name: '一级选项',
          submenu: [
            {
              id: 2431,
              name: '二级选项'
            },
            {
              id: 2432,
              name: '二级选项'
            },
            {
              id: 2433,
              name: '二级选项'
            },
            {
              id: 2434,
              name: '二级选项'
            }
          ]
        },
        {
          id: 25,
          name: '一级选项',
          submenu: [
            {
              id: 2531,
              name: '二级选项'
            },
            {
              id: 2532,
              name: '二级选项'
            },
            {
              id: 2533,
              name: '二级选项'
            },
            {
              id: 2534,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 1,
      name: '一级导航2',
      // hideChildren: true,
      submenu: [
        {
          id: 11,
          name: '一级选项',
          submenu: [
            {
              id: 1121,
              name: '二级选项'
            },
            {
              id: 1122,
              name: '二级选项'
            },
            {
              id: 1123,
              name: '二级选项'
            }
          ]
        },
        {
          id: 12,
          name: '一级选项',
          submenu: [
            {
              id: 121,
              name: '二级选项'
            },
            {
              id: 122,
              name: '二级选项'
            },
            {
              id: 123,
              name: '二级选项'
            },
            {
              id: 124,
              name: '二级选项'
            },
            {
              id: 125,
              name: '二级选项'
            }
          ]
        },
        {
          id: 13,
          name: '一级选项',
          submenu: [
            {
              id: 1321,
              name: '二级选项'
            },
            {
              id: 1322,
              name: '二级选项'
            },
            {
              id: 1323,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: '一级导航',
      submenu: [
        {
          id: 31,
          name: '一级选项'
        },
        {
          id: 32,
          name: '一级选项'
        },
        {
          id: 33,
          name: '一级选项',
          submenu: [
            {
              id: 331,
              name: '二级选项'
            },
            {
              id: 332,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: '一级导航',
      submenu: [
        {
          id: 41,
          name: '一级选项'
        },
        {
          id: 42,
          name: '一级选项',
          submenu: [
            {
              id: 421,
              name: '二级选项'
            },
            {
              id: 422,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 5,
      name: '一级导航',
      submenu: [
        {
          id: 51,
          name: '一级选项'
        },
        {
          id: 52,
          name: '一级选项',
          submenu: [
            {
              id: 521,
              name: '二级选项'
            },
            {
              id: 522,
              name: '二级选项'
            }
          ]
        },
        {
          id: 53,
          name: '一级选项',
          submenu: [
            {
              id: 531,
              name: '二级选项'
            },
            {
              id: 532,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 6,
      name: '一级导航',
      submenu: [
        {
          id: 61,
          name: '一级选项'
        },
        {
          id: 63,
          name: '一级选项',
          submenu: [
            {
              id: 631,
              name: '二级选项'
            },
            {
              id: 633,
              name: '二级选项'
            },
            {
              id: 634,
              name: '二级选项'
            },
            {
              id: 635,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 9,
      name: '一级导航'
    },
    {
      id: 7,
      name: '一级导航',
      submenu: [
        {
          id: 762,
          name: '一级选项',
          submenu: [
            {
              id: 7533,
              name: '二级选项'
            },
            {
              id: 7534,
              name: '二级选项'
            },
            {
              id: 7535,
              name: '二级选项'
            }
          ]
        },
        {
          id: 763,
          name: '一级选项',
          submenu: [
            {
              id: 7633,
              name: '二级选项'
            },
            {
              id: 7634,
              name: '二级选项'
            },
            {
              id: 7635,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 8,
      name: '一级导航',
      submenu: [
        {
          id: 81,
          name: '一级选项'
        },
        {
          id: 82,
          name: '一级选项',
          submenu: [
            {
              id: 821,
              name: '二级选项'
            },
            {
              id: 8821,
              name: '二级选项'
            },
            {
              id: 8121,
              name: '二级选项'
            },
            {
              id: 8321,
              name: '二级选项'
            }
          ]
        },
        {
          id: 83,
          name: '一级选项',
          submenu: [
            {
              id: 831,
              name: '二级选项'
            },
            {
              id: 832,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 10,
      name: '一级导航',
      submenu: [
        {
          id: 101,
          name: '一级选项'
        },
        {
          id: 102,
          name: '一级选项',
          submenu: [
            {
              id: 1021,
              name: '二级选项'
            },
            {
              id: 1022,
              name: '二级选项'
            },
            {
              id: 11121,
              name: '二级选项'
            },
            {
              id: 11022,
              name: '二级选项'
            }
          ]
        },
        {
          id: 103,
          name: '一级选项',
          submenu: [
            {
              id: 1031,
              name: '二级选项'
            },
            {
              id: 1032,
              name: '二级选项'
            }
          ]
        }
      ]
    },
    {
      id: 111,
      name: '一级导航',
      submenu: [
        {
          id: 111,
          name: '一级选项'
        },
        {
          id: 112,
          name: '一级选项'
        },
        {
          id: 113,
          name: '一级选项',
          submenu: [
            {
              id: 1131,
              name: '二级选项'
            },
            {
              id: 1132,
              name: '二级选项'
            },
            {
              id: 1133,
              name: '二级选项'
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

  const defaultConfig = {
    mode: 'light',
    lang: 'ZH',
    primaryColor: '#134BEA',
    darkPrimaryColor: '#3B71EE',
    lightDarkSwitch: true,
    languageSwitch: true,
    helpCenter: true,
    layout: 'top',
    topStyle: 'dark',
    sideStyle: 'light',
    header: true,
    breadcrumb: true,
    mapMenu: true,
    accordion: true
  };

  const config = ref({
    ...defaultConfig
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
    config.value = { ...newConfig };
  };

  // 重置主题色
  const resetPrimaryColor = () => {
    config.value.primaryColor = '#134BEA';
  };
  const resetTheme = (newConfig?: any) => {
    config.value = { ...defaultConfig, ...newConfig };
  };
</script>

<style lang="less" scoped>
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
  }
</style>
