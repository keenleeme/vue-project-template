<template>
  <div id="app" class="vue-app-child" :class="[dynamicData && dynamicData.themeMode || 'light']">
    <div v-if="info" class="base-params">
      基座的传递初始化的参数 
      <pre style="margin-top:10px">
        {{ JSON.stringify(info) }}
      </pre>

      基座传递的动态数据
      <pre style="margin-top:10px">
        {{ JSON.stringify(dynamicData) }}
      </pre>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      info: null,
      dynamicData:null
    }
  },
  created () {
    
    // 初始化获取父级给的参数
    this.info = window.microApp.getData()

    // 监听基座的动态数据
    window.microApp.addDataListener(this.getDynamicData,true) // true 监听数据变化，初始化时如果有数据则主动触发一次
    window.microApp.addGlobalDataListener(this.getGlobalData, true) // 全局数据监听 每一个子应用都可以接收到
  },
  methods: {
    getDynamicData(data) {
      this.dynamicData = data;
    },
    getGlobalData(data) {
      Object.assign(this.dynamicData,data)
    }
  },
  beforeDestroy () {
    window.microApp.removeDataListener(this.getDynamicData);
    window.microApp.removeGlobalDataListener(this.getGlobalData);
  },
}
</script>

<style>
#app.vue-app-child {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 30px;
  /* margin-top: 60px; */
}
.dark.vue-app-child .base-params {
  color: #fff;
}
.vue-app-child button {
  margin: 0 8px;
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 3px;
  background-color: #ffffff;
  border:1px solid  #CBD0DB;
  cursor: pointer;
}



.dark.vue-app-child h2 {
  color: #fff;
}
.dark.vue-app-child button {
  background-color: #020C1E;
  border-color: #4D576E;
  color: #fff;
}
.vue-app-child button:hover {
  color:#3b74f7;
  border-color: #3b74f7;
}
</style>
