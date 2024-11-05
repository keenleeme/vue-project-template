import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

// 基座的共享组件  MF
// import antD from 'home/ant-design-vue'

// console.log(antD)

// createApp(App).use(antD).mount('#app')
createApp(App).use(router).mount('#app');
