<template>
<UedTopMenu
    v-model:active-id="activeId"
    :props="dataProps"
    :data="menuData"
    :pop-active="popActive"
    :dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
    :pop-dark="config.mode === 'dark' || (config.mode === 'light' && config.topStyle === 'dark')"
    :mix="config.mode === 'mix'"
    popover-class="top-menu-popover"
    @menu-click="handleMenuClick"
>
</UedTopMenu>
</template>
<script setup lang="ts">
    import { ref, watchEffect } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useMenusStore, useThemeStore } from '@/store';
    import { UedTopMenu} from '@ued-material/menu';

    const props = defineProps({
        menuData: {
            type: Array,
            required: true,
            default: () => [],
        },
        dataProps: {
            type: Object,
            default: {
                id: 'id',
                label: 'name',
                children: 'children',
                icon: 'icon',
                hide: 'hide',
                html: 'html',
                hideChildren: 'hideChildren',
                disabled: 'disabled',
            },
        },
        // 展示 popover 菜单激活状态
        popActive: {
            type: Boolean,
            default: true,
        },
        // tooltip暗色主题
        tooltipDark: {
            type: Boolean,
            default: true,
        },
        popoverClass: {
            type: String,
            default: 'side-menu-popover'
        },
    });

    const themeStore = useThemeStore();
    const { themeConfig } = storeToRefs(themeStore);

    console.log('themeConfig', themeConfig.value.header, themeStore);
    const config = ref({
        ...themeConfig.value
    });
    // 监听主题配置
    watchEffect(() => {
        config.value = { ...themeConfig.value };
    });

    // 点击菜单
    const router = useRouter();
    const handleMenuClick = (item: any) => {
        router.push(item.url);
    };

    // 选中菜单
    const menusStore = useMenusStore();
    const { activeId } = storeToRefs(menusStore);
</script>