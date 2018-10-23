import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import async from '@/components/async'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/async',
      name: 'async',
      component: async
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
