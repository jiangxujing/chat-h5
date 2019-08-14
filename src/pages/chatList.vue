<template>
	<div class="chatList">
		<div  style="height:100%;overflow-y:scroll;">
			<mt-loadmore :top-method="loadTop" :autoFill="false" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
			<div class="chat-main" v-for="(i,index) in chatLists" @click="openChat(i.nickName,i.id,i.memberIdTo,i)" :key="index">
				<div style="flex:1">
					<img :src="prefix+i.headIcon" class="touxiang" />
					<div class="info">
						<div class="name">{{i.nickName}}</div>
						<div style="margin-top:0.8rem" class="fontStyle">{{i.latestMessage}}</div>
					</div>
				</div>
				<div>
					<div class="time" v-html="$utils.formatTime(i.updateTime)"></div>
					<div class="unread" v-if="i.read >0"></div>
				</div>
			</div>
		</mt-loadmore>
		</div>
	</div>
</template>

<script>
	import api from "../common/api.js";
	import _utils from "../common/utils.js";
	import { Toast, MessageBox } from 'mint-ui'
	export default {
		name: 'chat',
		data() {
			return {
				allLoaded: false,
				chatLists: [],
				pageNo: 0,
				prefix: '/chat/storage/display/'
			}
		},
		methods: {
			 handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom() {
            	console.log('1')
            	this.pageNo++
            	 this.getChatList()
            	 //this.allLoaded = true
                 this.$refs.loadmore.onBottomLoaded();
            },
            loadTop() {
            	console.log('gg')
            		this.getChatList()
                    this.$refs.loadmore.onTopLoaded();
            },
			getChatList(){
				let req = {
					pageNo:0 || this.pageNo,
					pageSize: 10
				}
				api.post(api.getUrl('getListChatSession'), req).then(res => {
					if(res.code == '0000'){
						 this.chatLists = this.chatLists.concat(res.content)
					    if(res.content.length < 10) {
				          Toast('没有更多了')
				          return;
				        }
					}
				})
			},
			openChat(name,id,memberIdTo,i) {
				sessionStorage.setItem('headIcon',i.headIcon)
				sessionStorage.setItem('myHeadIcon',i.myHeadIcon)
				if(!!sessionStorage.getItem('toolType')){
					api.setupWebViewJavascriptBridge(function(bridge) {
						let params = {
							jumpUrl: _utils.getBrowserURL+"/chat?id=" + id+'&memberIdTo='+memberIdTo,
							nickName:name
						}
						bridge.callHandler('openChat', params, (data) => {
							console.log(data)
						})
					})
				}else{
					this.$router.push("/chat?id=" + id+'&memberIdTo='+memberIdTo)
				}
			}
		},
		mounted() {
			let token =  this.$route.query.token
			let toolType = this.$route.query.toolType
			sessionStorage.setItem('token',token)
			sessionStorage.setItem('toolType',toolType)
			this.getChatList()
		},
	}
</script>

<style lang="scss">
	.chatList {
		width: 100%;
		height: 100%;
		background: #FBF8F8;
		.fontStyle {
			color: #666;
			font-size: 1.3rem;
			margin-top: 5px;
			padding-right: 1rem;
			overflow: hidden;
			display: -webkit-box;
			text-overflow: ellipsis;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			white-space: normal;
		}
		.chat-main {
			display: flex;
			justify-content: space-between;
			padding-left: 2.5rem;
			padding-right: 2.5rem;
			background: #fff;
			margin-top: 2px;
			height: 7.5rem;
			box-sizing: border-box;
			.touxiang {
				width: 4rem;
				margin-top: 1.5rem;
				vertical-align: middle;
			}
			.info {
				display: inline-block;
				margin-left: 1rem;
				margin-top: 1rem;
				vertical-align: middle;
				width: 70%;
			}
			.name {
				color: #333;
				font-size: 1.4rem;
				font-weight: 500;
			}
			.time {
				color: #999;
				font-size: 1.3rem;
				margin-top: 1rem;
			}
			.unread {
				width: 0.6rem;
				height: 0.6rem;
				border-radius: 50%;
				background: #FF4D4D;
				float: right;
				margin-top: 1.5rem;
				margin-right: 3px;
			}
		}
	}
</style>