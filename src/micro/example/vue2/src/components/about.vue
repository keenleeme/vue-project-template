<template>
  <div>
    <h2>about页面</h2>
    <button @click="goBack">返回home</button>
  </div>
</template>
<script>
export default { 
  methods: {
    goBack() {
      // this.$router.go(-1)
      this.$router.push('/home')
    }
  },
}
</script>
