import { App } from 'vue';
import DasComponent, { SqlTipTree } from 'das-component';

// 已有的das-component
// ActionMore,
// AutoTagMore,
// ButtonOrganizer,
// ColumnSetter,
// ColumnsSetting,
// ContractGroup,
// CountTo,
// DasLocaleProvider,
// DynamicModal,
// Ellipsis,
// HigherSearch,
// ModeSetter,
// SearchBar,
// SqlTipTree,
// Table,
// Toolbar,
// TrendLine,
// VirtualScroll
// SimpleChart
// TagListView
// AllSelect
// Carousel
// SelectTags

export default function (app: { use: (arg0: { install: (app: App<any>) => App<any> }) => void }, isAll?: boolean) {
  if (isAll) {
    app.use(DasComponent);
  } else {
    app.use(SqlTipTree);
  }
}
