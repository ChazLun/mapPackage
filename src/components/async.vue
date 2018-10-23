<template>
  <div>
    123 async
    <div v-if="show">
      <late></late>
    </div>
    <button @click="click">off</button>
  </div>
</template>

<script>
import Vue from 'vue'
const late = Vue.component('testAsync', function(resolve) {
  require(['./testAsync.vue'], resolve)
})
export default {
  components: {
    late
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    click() {
      this.show = !this.show
    }
  }
}
</script>

<style scoped>

</style>
