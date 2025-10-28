import { depDefineCustomElementsNeeded } from '@ued-material/ued-wbc-vue3';
import '@ued-material/ued-wbc/css';

export function UedWBCInstall() {
  depDefineCustomElementsNeeded(['ued-login-layout', 'ued-logo', 'ued-select']);
}
