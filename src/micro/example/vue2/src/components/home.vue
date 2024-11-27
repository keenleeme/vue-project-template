<template>
  <div class="hello">
    <h2>Home页面</h2>

    <button @click="goTo">跳转about页面</button>
    <button @click="goToVue3">跳转子应用vue3的home页面</button>
    <button @click="goToBase">跳转基座的列表页面</button>
    <button @click="goToAdd">新增</button>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    goTo() {
      this.$router.push('/about')
    },
    goToVue3() {
      // 也可以考虑使用数据通信
      // https://micro-zoe.github.io/micro-app/0.x/docs.html#/zh-cn/data
      window.microApp.getData().pushState('/vue3/about')
    },
    goToBase() {
      window.microApp.getData().pushState('/base-list')
      // base-list
    },
    goToAdd(){
      this.$router.push('/home/add')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
