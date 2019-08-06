import Vue from 'vue'
import Router from 'vue-router'
import chat from '@/pages/chat'
import chatList from '@/pages/chatList'
import record from '@/pages/record'
Vue.use(Router)

export default new Router({
	mode: 'history',
	base:'/commerce-h5/', //为了配置产线找不到静态文件添加
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: chat
    },{
      path: '/chatList',
      name: 'chatList',
      component: chatList
    },{
    	 path: '/record',
      name: 'record',
      component: record
    }
  ]
})
