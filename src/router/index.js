import Vue from 'vue'
import Router from 'vue-router'
import chat from '@/pages/chat'

Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/',
      name: 'chat',
      component: chat
    }
  ]
})
