export interface MenuType {
  title: string;
  id: string; // 该 id 和权限无关，只是用于区分该菜单的唯一性
  path?: string; // 路由路径
  icon?: string;
  children?: MenuType[];
}

export interface RouteItemType {
  path: string;
  title: string;
  component: boolean;
}
