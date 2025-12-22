import router from '@/router';
import type { MenuType } from '@/store/uedModule/menus/types';

export function microMenuNavigation(menu: MenuType) {
  menu.url = menu.url || menu.path;
  if (!menu.url) {
    return;
  }
  router.push(menu.url);
}
