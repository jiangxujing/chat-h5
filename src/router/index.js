import Vue from 'vue'
import Router from 'vue-router'
import chat from '@/pages/chat'
import chatList from '@/pages/chatList'
Vue.use(Router)

export default new Router({
	mode: 'history',
	base:'/chat-h5/', //为了配置产线找不到静态文件添加
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
