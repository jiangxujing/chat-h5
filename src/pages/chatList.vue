<template>
	<div class="chatList">
		<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
			<div class="chat-main" v-for="(i,index) in chatLists" @click="openChat(i.id)" :key="index">
				<div style="flex:1">
					<img :src="i.img" class="touxiang" />
					<div class="info">
						<div class="name">{{i.name}}</div>
						<div style="margin-top:0.8rem" class="fontStyle">{{i.chatContent}}</div>
					</div>
				</div>
				<div>
					<div class="time">{{i.time}}</div>
					<div class="unread" v-if="i.read >0"></div>
				</div>
			</div>
		</mt-loadmore>
	</div>
</template>

<script>
	export default {
		name: 'chat',
		data() {
			return {
				    allLoaded:false,
					chatLists:[
					{
						id:1,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才,现实扭曲，喜欢掌控一切！追求完美主义，没有妇人之仁，不是一个正义之士，但的确是个创意大师，商业奇才!',
						time:'一小时前',
						read:3,
					},{
						id:2,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:3,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:1,
					},{
						id:4,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:5,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:5,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:6,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:7,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:8,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:9,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:10,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					},{
						id:11,
						img:require('../images/touxiang.png'),
						name:'乔布斯',
						chatContent:'做一个侠盗，天才',
						time:'一小时前',
						read:0,
					}
				]
			}
		},
		methods: {
			loadTop() {
			  this.$refs.loadmore.onTopLoaded();
			},
			loadBottom() {
			  this.allLoaded = true;// if all data are loaded
			  this.$refs.loadmore.onBottomLoaded();
			},
			getChatList(){
			},
			openChat(id){
				this.$router.push("/chat?id="+id)
			}
		}
	}
</script>

<style lang="scss">
	.chatList {
		width: 100%;
		height: 100%;
		background: #FBF8F8;
		.fontStyle{
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
				width:70%;
			}
			.name {
				color: #333;
				font-size: 1.4rem;
				font-weight:500;
			}
			.time {
				color: #999;
				font-size: 1.3rem;
				margin-top:1rem;
			}
			.unread{
			    width: 0.6rem;
			    height: 0.6rem;
			    border-radius: 50%;
			    background: #FF4D4D;
			    float:right;
			    margin-top:1.5rem;
			    margin-right:3px;
			}
		}
	}
</style>