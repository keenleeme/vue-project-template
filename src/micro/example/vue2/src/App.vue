<template>
  <div id="app">
    <div v-if="info">
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
  },
  methods: {
    getDynamicData(data) {
      this.dynamicData = data;
    }
  },
  beforeDestroy () {
    window.microApp.removeDataListener(this.getDynamicData);
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 30px;
  /* margin-top: 60px; */
}
</style>
