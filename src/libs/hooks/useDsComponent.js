import DsComponent, { CountTo } from 'ds-component';

export default function (app, isAll) {
  if (isAll) {
    app.use(DsComponent);
  } else {
    app.use(CountTo);
  }
}
