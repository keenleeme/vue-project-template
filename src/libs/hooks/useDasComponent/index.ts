import { App } from 'vue';
import DasComponent, { CountTo } from 'das-component';

export default function (app: { use: (arg0: { install: (app: App<any>) => App<any> }) => void }, isAll?: boolean) {
  if (isAll) {
    app.use(DasComponent);
  } else {
    app.use(CountTo);
  }
}
