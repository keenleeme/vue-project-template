import { ref, Ref, onMounted, reactive } from 'vue';
import { defineStore } from 'pinia';

interface UserStore {
  token: Ref<string | undefined>;
  permissionIds: Ref<string[]>;
  setToken: (tokenStr: string) => void;
  setPermissionIds: (ids: string[]) => void;
  reset: () => void;
  userInfo: Record<string, any>;
  setUserInfo: (info: any) => void;
}

export default defineStore<'user', UserStore>(
  'user',
  () => {
    const token = ref<string | undefined>(undefined);
    const userInfo = reactive({});
    const setToken = (tokenStr: string) => {
      token.value = tokenStr;
    };
    const permissionIds = ref<string[]>([]);
    const setPermissionIds = (ids: string[]) => {
      permissionIds.value = ids;
    };

    const setUserInfo = (info: any) => {
      Object.assign(userInfo, info);
    };
    const reset = () => {
      token.value = undefined;
      permissionIds.value = [];
      Object.assign(userInfo, {});
    };

    const restore = () => {
      if (localStorage.getItem('user-store')) {
        const userStore = JSON.parse(localStorage.getItem('user-store') || '{}');
        Object.assign(userInfo, userStore.userInfo);
        token.value = userStore.token;
        permissionIds.value = userStore.permissionIds;
      }
    };
    restore();
    return {
      token,
      permissionIds,
      setToken,
      setPermissionIds,
      reset,
      userInfo,
      setUserInfo
    };
  },
  // 不知道为什么这里设置了就是没用
  {
    persist: {
      key: 'user-store',
      storage: localStorage
    }
  }
);
