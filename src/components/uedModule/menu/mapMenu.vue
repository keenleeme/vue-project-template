<template>
  <UedMapMenu
    :left="fold ? '48px' : '232px'"
    :top="config.header ? '48px' : 0"
    :props="dataProps"
    :data="topMenuData"
    :dark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
    :popDark="config.mode === 'dark' || (config.mode === 'light' && config.sideStyle === 'dark')"
    :star="true"
    v-model:starKeys="starKeys"
    :recentlyKeys="recentlyKeys"
    popoverClass="map-menu-popover"
    trigger="click"
    :closeDelay="300"
    :edit="true"
    :edit-actions="['add', 'reset', 'edit', 'move']"
    :langs="langs[config.lang]"
    @menu-click="handleMenuClick"
    @menu-open="log('menu-open')"
    @menu-close="log('menu-close')"
    @clear-recently="recentlyKeys = []"
    @addMenu="openAddMenuDialog"
    @editItem="editItem"
    @resetMenu="resetMenu"
    @startEdit="startEdit"
    @cancelEdit="cancelEdit"
    @saveEdit="saveEdit"
    @dragMenu="dragMenu"
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
</template>

<script lang="ts" setup>
  import { UedMapMenu, findNodeInTree } from '@ued-material/menu';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store';

  const props = defineProps({
    menuData: {
      type: Array,
      required: true,
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
    },
    // 展示 popover 菜单激活状态
    popActive: {
      type: Boolean,
      default: true
    },
    // tooltip暗色主题
    tooltipDark: {
      type: Boolean,
      default: true
    },
    popoverClass: {
      type: String,
      default: 'side-menu-popover'
    },
    popoverClassUser: {
      type: String,
      default: 'user-menu-popover'
    },
    fold: {
      type: Boolean,
      default: false
    }
  });

  const themeStore = useThemeStore();
  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });
  // 监听主题配置
  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  // 菜单数据
  const topMenuData = ref(props.menuData);

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
    console.log(val);
    router.push(val.url);
  };

  // 国际化
  const langs = ref<any>({
    zh: {},
    en: {
      reset: 'Reset',
      edit: 'Edit',
      clear: 'Clear',
      usedRecently: 'Commonly used recently',
      addMenu: 'Add menu',
      save: 'Save',
      cancel: 'Cancel',
      myStar: 'My collection',
      searchMenuPlaceholder: 'Please enter a menu name to find the menu quickly',
      themeSetting: 'Theme setting',
      themeMode: 'Theme mode',
      themeColor: 'Theme color',
      themeStyle: 'Theme style',
      defaultTheme: 'Default theme',
      defaultThemeColor: 'Default theme color',
      navSetting: 'Navigation settings',
      navLayout: 'Navigation layout',
      otherSetting: 'Other settings',
      topNavStyle: 'Top bar setting',
      topMenuLayout: 'Top menu layout',
      sideMenuLayout: 'Side menu layout',
      mixMenuLayout: 'Mixed menu layout',
      dark: 'Dark',
      light: 'Light',
      sideNavStyle: 'Sidebar setting',
      showTopNav: 'Show top bar',
      showBreadcrumbs: 'Show breadcrumbs',
      showMapMenu: 'Show map navigation',
      sideAccordionMode: 'Sidebar accordion mode',
      showLightDarkSwitch: 'Show light and dark toggle',
      showLangsSwitch: 'Show multilingual switching',
      showHelpCenter: 'Show help',
      resetDefaultTheme: 'Restore the default theme'
    }
  });
</script>
