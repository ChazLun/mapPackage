<template lang="pug">
  #mount-point
    | 12312
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      url: 'http://192.168.20.185:8081/roadadmindevicemanager/putin/item.vue'
    }
  },
  created() {
  },
  mounted() {
    // 创建构造器
    var Profile = Vue.extend({
      template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
      data: function() {
        return {
          firstName: 'Wal12312te123r',
          lastName: 'Whit1e',
          alias: 'Heisenberg'
        }
      },
      created() {
        console.log('重构')
      }
    })
    // 创建 Profile 实例，并挂载到一个元素上。
    new Profile().$mount('#mount-point')
    console.log('22222')
  }
}
</script>

<style scoped>

</style>
