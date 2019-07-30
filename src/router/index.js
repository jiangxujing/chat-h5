import Vue from 'vue'
import Router from 'vue-router'
import chat from '@/pages/chat'
import chatList from '@/pages/chatList'
Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: chat
    },{
      path: '/chatList',
      name: 'chatList',
      component: chatList
    }
  ]
})
