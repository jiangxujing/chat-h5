<template>
	<div class="chat" id="chat">

		<div class="content" id="content">
			<mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
				<div v-for="(l,index) in chatLists" :key="index" style="margin-bottom:2rem" :class="(index == chatLists.length-1)?'active':''">
					<div class="dateStyle">{{l.ctime}}</div>
					<div class="chatStyle">
						<div v-if="l.type == 1">
							<div class="friend" v-if="l.direction == 1">
								<img :src="l.contactAvatarUrl" class="touxiang" />
								<p v-html="$utils.toEmotion(l.content)"></p>
							</div>
							<div class="myself" v-if="l.direction == 2">
								<p v-html="$utils.toEmotion(l.content)"></p>
								<img :src="l.ownerAvatarUrl" class="touxiang" />
							</div>
						</div>
						<div v-if="l.type == 2">
							<div class="friend" v-if="l.direction == 1">
								<img :src="l.contactAvatarUrl" class="touxiang" />
								<img :src="l.content" style="width:100px;margin-left:2rem" @click="openImg">
							</div>
							<div class="myself" v-if="l.direction == 2">
								<img :src="l.ownerAvatarUrl" class="touxiang" />
								<img :src="l.content" style="width:100px;margin-right:2rem" @click="openImg">
							</div>
							<div class="bigImg" v-show="bigImgShow" @click="bigImgShow=false">
								<img :src="l.content" />
							</div>
						</div>
					</div>
				</div>
				<div style="width:100%;height:100px" v-if="expressionShow || galleryShow"></div>
			</mt-loadmore>
		</div>
		<div class="tips">
			<div style="margin-bottom:2rem;margin-left:2rem">
				<div class="inputBtn">
					<div contenteditable="true" class="tipsInput" @input="changeText" id="inputs" @focus="focusfns" ref="input">
						<img :src='item' v-for="item in selectPicLists" style="width:20px;margin-right:5px" />
					</div>
				</div>
				<img src="../images/biaoqing.png" class="photo" @click="openExpression" style="margin-left:1.5rem" />
				<img src="../images/add.png" class="expression" @click="openGallery" style="margin-left:1.5rem" v-if="!sendBtnShow" />
				<img src="../images/send.png" class="sendBtn" @click="sendBtn" style="margin-left:1.5rem" v-if="sendBtnShow" />
			</div>
			<div v-if="expressionShow" style="width:100%;margin:0 auto;background: #F9F9F9;height:15rem;overflow-x:scroll;padding: 0 0 1rem 0;">
				<div class="expressionList">
					<div v-for="(l,index) in expressionList" :key="index" @click="selectExpressionList(l,index)" :class="l.active == true?'active':''">{{l.value}}</div>
				</div>
				<div style="margin-top:4rem"><img v-if="defaultShow" v-for="(i,index) in picLists" :key="index" :src="i.src" class="expressionImg" @click="selectExpression(i.id)" /></div>
				<div v-if="!defaultShow" class="tuijian">无</div>
				<!--<mt-swipe :auto="0" :show-indicators="false">
					<mt-swipe-item v-for="(l,index) in picLists" :key="index">
							<img v-for="(i,index) in l.pic" :key="index" :src="i.src" class="expressionImg" @click="selectExpression(i.id)"/>
					</mt-swipe-item>
				</mt-swipe>-->
			</div>
			<div class="galleryWrapper" v-if="galleryShow">
				<div>
					<img src="../images/tupian.png" />
					<input type="file" class="file" accept="image/*" @change="tirggerFile($event)" />
				</div>
				<div>
					<img src="../images/paizhao.png" />
					<input type="file" capture="camera" class="file" accept="image/*" @change="tirggerPhoto($event)" />
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import api from "../common/api.js";
	import _utils from "../common/utils.js";
	let ws 
	export default {
		name: 'chat',
		data() {
			return {
				bigImgShow: false,
				defaultShow: true,
				allLoaded: false,
				textarea: '',
				expressionShow: false,
				galleryShow: false,
				expressionList: [{
					value: '默认',
					id: 1,
					active: true
				}, {
					value: '推荐',
					id: 2,
					active: false
				}],
				chatLists: [],
				//				chatLists: [{
				//						direction: 2,
				//						type: 1,
				//						content: '你好!![1]',
				//						ctime: new Date().toLocaleString(),
				//						ownerAvatarUrl: require('../images/wyz.jpg')
				//					},
				//					{
				//						direction: 1,
				//						type: 1,
				//						content: '你也好。[3]',
				//						ctime: new Date().toLocaleString(),
				//						contactAvatarUrl: require('../images/touxiang.png')
				//					},
				//					{
				//						direction: 2,
				//						type: 1,
				//						content: '这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像这是我的简历头像：',
				//						ctime: new Date().toLocaleString(),
				//						ownerAvatarUrl: require('../images/wyz.jpg')
				//					},
				//					{
				//						direction: 2,
				//						type: 2,
				//						content: require('../images/wyz.jpg'),
				//						ctime: new Date().toLocaleString(),
				//						ownerAvatarUrl: require('../images/wyz.jpg')
				//					},
				//					{
				//						direction: 1,
				//						type: 1,
				//						content: '你开心就好。[6]',
				//						ctime: new Date().toLocaleString(),
				//						contactAvatarUrl: require('../images/touxiang.png')
				//					}
				//				],
				picLists: [{
					src: require('../images/1.png'),
					id: 1
				}, {
					src: require('../images/2.png'),
					id: 2
				}, {
					src: require('../images/3.png'),
					id: 3
				}, {
					src: require('../images/4.png'),
					id: 4
				}, {
					src: require('../images/5.png'),
					id: 5
				}, {
					src: require('../images/6.png'),
					id: 6
				}, {
					src: require('../images/7.png'),
					id: 7
				}, {
					src: require('../images/8.png'),
					id: 8
				}, {
					src: require('../images/9.png'),
					id: 9
				}, {
					src: require('../images/10.png'),
					id: 10
				}, {
					src: require('../images/11.png'),
					id: 11
				}, {
					src: require('../images/12.png'),
					id: 12
				}, {
					src: require('../images/13.png'),
					id: 13
				}, {
					src: require('../images/14.png'),
					id: 14
				}, {
					src: require('../images/15.png'),
					id: 15
				}, {
					src: require('../images/16.png'),
					id: 16
				}, {
					src: require('../images/17.png'),
					id: 17
				}, {
					src: require('../images/18.png'),
					id: 18
				}, {
					src: require('../images/19.png'),
					id: 19
				}, {
					src: require('../images/20.png'),
					id: 20
				}, {
					src: require('../images/21.png'),
					id: 21
				}, {
					src: require('../images/22.png'),
					id: 22
				}, {
					src: require('../images/23.png'),
					id: 23
				}, {
					src: require('../images/24.png'),
					id: 24
				}, {
					src: require('../images/25.png'),
					id: 25
				}, {
					src: require('../images/26.png'),
					id: 26
				}, {
					src: require('../images/27.png'),
					id: 27
				}, {
					src: require('../images/28.png'),
					id: 28
				}, {
					src: require('../images/29.png'),
					id: 29
				}, {
					src: require('../images/30.png'),
					id: 30
				}, {
					src: require('../images/31.png'),
					id: 31
				}, {
					src: require('../images/32.png'),
					id: 32
				}, {
					src: require('../images/33.png'),
					id: 33
				}, {
					src: require('../images/34.png'),
					id: 34
				}, {
					src: require('../images/35.png'),
					id: 35
				}, {
					src: require('../images/36.png'),
					id: 36
				}, {
					src: require('../images/37.png'),
					id: 37
				}, {
					src: require('../images/38.png'),
					id: 38
				}, {
					src: require('../images/39.png'),
					id: 39
				}, {
					src: require('../images/40.png'),
					id: 40
				}, {
					src: require('../images/41.png'),
					id: 41
				}, {
					src: require('../images/42.png'),
					id: 42
				}, {
					src: require('../images/43.png'),
					id: 43
				}, {
					src: require('../images/44.png'),
					id: 44
				}, {
					src: require('../images/45.png'),
					id: 45
				}, {
					src: require('../images/46.png'),
					id: 46
				}, {
					src: require('../images/47.png'),
					id: 47
				}, {
					src: require('../images/48.png'),
					id: 48
				}, {
					src: require('../images/49.png'),
					id: 49
				}, {
					src: require('../images/50.png'),
					id: 50
				}, {
					src: require('../images/51.png'),
					id: 51
				}, {
					src: require('../images/52.png'),
					id: 52
				}, {
					src: require('../images/53.png'),
					id: 53
				}, {
					src: require('../images/54.png'),
					id: 54
				}, {
					src: require('../images/55.png'),
					id: 55
				}, {
					src: require('../images/56.png'),
					id: 56
				}, {
					src: require('../images/57.png'),
					id: 57
				}, {
					src: require('../images/58.png'),
					id: 58
				}, {
					src: require('../images/59.png'),
					id: 59
				}, {
					src: require('../images/60.png'),
					id: 60
				}, {
					src: require('../images/61.png'),
					id: 61
				}, {
					src: require('../images/62.png'),
					id: 62
				}, {
					src: require('../images/63.png'),
					id: 63
				}, {
					src: require('../images/64.png'),
					id: 64
				}, {
					src: require('../images/65.png'),
					id: 65
				}, {
					src: require('../images/66.png'),
					id: 66
				}, {
					src: require('../images/67.png'),
					id: 67
				}],
				selectPicLists: [],
				sendBtnShow: false,
				//ws: {},
				websocketurl: _utils.getWebsocketURL(),
				obj: {}
			}
		},
		mounted() {
			let id = this.$route.query.id
			this.init()
		},
		methods: {
			openImg() {
				this.bigImgShow = true
			},

			str2ab(type,s) {
				console.log(s)
				var b = new Blob([s], {
					type: 'text/plain'
				});
				var r = new FileReader();
				r.readAsArrayBuffer(b);
				r.onload = function() {
					ws.send(new Blob([type, s]));
				}
			},
			init() {
				let _this = this
				ws = new WebSocket(this.websocketurl + "/chat/binarySocketServer?userId=" + 3);
				console.log('gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
				ws.onmessage = (evnt) => {
					let content = evnt.data;
					console.log('contentcontentcontentcontentcontentcontentcontent' + content)
					var reader = new FileReader();
					let str = ''
					reader.onload = function(evnt) {
						str = reader.result; //内容就在这里
						var f = JSON.parse(str.substring(1))
						console.log(str)
						_this.obj = {
							direction: 1,
							type: str.substring(0,1),
							content: f.content,
							ctime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
							contactAvatarUrl: require('../images/wyz.jpg')
						}
						_this.chatLists.push(_this.obj)

					};
					reader.readAsText(content);
					console.log(_this.chatLists)
					_this.$nextTick(() => {
						let msg = document.getElementById('content') // 获取对象
						msg.scrollTop = msg.scrollHeight // 滚动高度
					})
					document.getElementById('inputs').innerHTML = ''
					_this.sendBtnShow = false
					_this.$refs.input.focus();
				};
				ws.onerror = function(evnt) {
					console.log("fail");
				};
				ws.onclose = function(evnt) {
					console.log("session closed now");
					ws = new WebSocket(_this.websocketurl + "/chat/binarySocketServer?userId=" + 3);
				}
			},
			selectExpressionList(l, index) {
				let _this = this
				this.expressionList.forEach(function(l) {
					_this.$set(l, "active", false);
				});
				this.$set(l, "active", true);
				if(this.expressionList[0].active) {
					this.defaultShow = true
				} else {
					this.defaultShow = false
				}
			},
			focusfns() {
				this.expressionShow = false;
				this.galleryShow = false
			},
			loadTop() {
				this.$refs.loadmore.onTopLoaded();
			},
			loadBottom() {
				this.allLoaded = true; // if all data are loaded
				this.$refs.loadmore.onBottomLoaded();
			},
			sendPic() {
				api.upload(api.getUrl('productUpload'), this.formData).then(res => {
					let obj = {}
					if(res.code == '0000') {
						this.galleryShow = false
						obj = {
							direction: 2,
							id: 1,
							type: 2,
							content: 'http://99.48.68.108:83/commerce-web/commerce/resource/getPicture/9cfb37a2c12040a9acbe5e5fb54572ae.jpg',
							ctime: new Date().toLocaleString(),
							ownerAvatarUrl: require('../images/wyz.jpg')
						}

						this.chatLists.push(obj)
					}
					let resObj = {
						content: obj.content,
						fromUserId: 3,
						toUserId: 1
					}
					if (ws.readyState == ws.OPEN) {    
	                //调用后台handleTextMessage方法    
					this.str2ab(2,JSON.stringify(resObj));
	            } else {    
					ws = new WebSocket(this.websocketurl + "/chat/binarySocketServer?userId=" + 3);
	            } 
				})
			},
			tirggerFile(event, file) {
				this.formData = new FormData()
				this.formData.append('file', event.target.files[0])
				this.sendPic()

			},
			tirggerPhoto(event, file) {
				this.formData = new FormData()
				this.formData.append('file', event.target.files[0])
				this.sendPic()
			},
			changeText() {
				this.expressionShow = false
				this.textarea = document.getElementById('inputs').innerHTML
				if(this.textarea == '') {
					this.sendBtnShow = false
				} else {
					this.sendBtnShow = true
				}
			},
			toEmotion(text) {
				var list = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
					'22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
					'40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55',
					'56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67'
				]
				if(!text) {
					return text;
				}
				//判断[]中括号里是否是数字
				text = text.replace(/\[[\d]{1,3}\]/gi, function(word) {
					console.log(word)
					var newWord = word.replace(/\[|\]/gi, ''); //去掉[]符号
					var index = list.indexOf(newWord) + 1;
					var imgHTML = '';
					if(index <= 0) {
						return word;
					} else {
						var path = 'http://99.48.68.109:92';
						imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.png">`
						return imgHTML;
					}

				});
				return text;
			},
			//发送按钮
			sendBtn() {
				var content = document.getElementById('inputs').innerHTML
				var list = [];
				var numArray = content.split("<");
				for(var i = 0; i < numArray.length; i++) {
					var item = numArray[i].split(">")[0];
					if(item != "") {
						list.push(item);
					}
				}
				let obj = {}
				var result = content;
				for(var i = 0; i < list.length; i++) {
					var img1 = result.split('static/img/');
					for(var j = 1; j < img1.length; j++) {
						var img2 = img1[j].split('\.');
						var img = '[' + img2[0] + ']';
						result = result.replace("<" + list[i] + ">", img);
					}
				}
				this.result = result
				console.log(result)
				let resObj = {
					content: result,
					fromUserId: 3,
					toUserId: 1
				}
				if (ws.readyState == ws.OPEN) {    
                //调用后台handleTextMessage方法    
				this.str2ab(1,JSON.stringify(resObj));
            } else {    
				ws = new WebSocket(this.websocketurl + "/chat/binarySocketServer?userId=" + 3);
            } 
				
					obj = {
						direction: 2,
						id: 1,
						type: 1,
						content: result,
						ctime: new Date().toLocaleString(),
						ownerAvatarUrl: require('../images/wyz.jpg')
					}
					this.chatLists.push(obj)
					this.$nextTick(() => {
						let msg = document.getElementById('content') // 获取对象
						msg.scrollTop = msg.scrollHeight // 滚动高度
					})
					console.log(this.toEmotion(result))
					document.getElementById('inputs').innerHTML = ''
					this.sendBtnShow = false
					this.$refs.input.focus();
			},
			selectExpression(id) {
				this.selectPicLists.push(require('../images/' + id + '.png'))
				this.expressionShow = false
				this.sendBtnShow = true
			},
			openExpression() {
				this.expressionShow = !this.expressionShow
				if(this.expressionShow == false) {
					this.$refs.input.focus();
				} else {
					this.$refs.input.blur();
				}
				this.galleryShow = false
				this.$nextTick(() => {
					let msg = document.getElementById('content') // 获取对象
					msg.scrollTop = msg.scrollHeight + 600 // 滚动高度
				})
			},
			openGallery() {
				this.galleryShow = !this.galleryShow
				this.expressionShow = false

				if(this.galleryShow == false) {
					this.$refs.input.focus();
				} else {
					this.$refs.input.blur();
				}
			}
		}
	}
</script>
<style lang="scss">
	.chat {
		width: 100%;
		height: 100%;
		/*padding: 2rem;*/
		box-sizing: border-box;
		.content {
			height: calc(100% - 100px);
			overflow-y: scroll;
			padding: 2rem;
		}
		.mint-popup {
			width: 100%;
		}
		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 148px;
			height: 148px;
			line-height: 148px;
			text-align: center;
			background-color: #fbfdff;
			border: 1px dashed #c0ccda;
			border-radius: 6px;
		}
		.file {
			position: absolute;
			top: 0;
			left: 0;
			opacity: 0;
			width: 100%;
			height: 100%;
		}
		.expressionImg {
			width: 3rem;
			padding: 0.5rem;
		}
		.expressionList {
			width: 100%;
			overflow: hidden;
			padding-top: 1.5rem;
			padding-bottom: 0.5rem;
			background: #F9F9F9;
			position: fixed;
			height: 2rem;
			div {
				float: left;
				width: 50%;
				text-align: center;
				font-size: 1.3rem;
				color: #999;
			}
			.active {
				color: #333;
			}
		}
		.dateStyle {
			text-align: center;
			color: #333;
			line-height: 3rem;
		}
		.tuijian {
			text-align: center;
			margin-top: 8rem;
			font-size: 1.3rem;
			color: #999;
		}
		.bigImg {
			width: 100%;
			height: 100%;
			position: fixed;
			left: 0;
			top: 0;
			background: #000;
			img {
				width: 100%;
				margin: auto;
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
			}
		}
		.chatStyle {
			overflow: hidden;
			.friend,
			.myself {
				.touxiang {
					width: 3rem;
					vertical-align: middle;
					margin-top: 10px;
				}
				p {
					display: inline-block;
					padding: 1.5rem;
					font-size: 1.3rem;
					max-width: 70%;
					line-height: 1.9rem;
					width: auto;
				}
			}
			.friend {
				.touxiang {
					float: left;
				}
				p {
					background: #FFF1F1;
					color: #333;
					margin-left: 1.5rem;
					border-radius: 0px 5rem 5rem 2rem;
				}
			}
			.myself {
				float: right;
				.touxiang {
					float: right;
				}
				p {
					background: #FF9F9D;
					color: #fff;
					margin-right: 1.5rem;
					border-radius: 5rem 0 2rem 5rem;
				}
			}
		}
		.tips {
			width: 100%;
			position: fixed;
			bottom: 0px;
			background: #fff;
			.photo,
			.expression,
			.sendBtn {
				width: 3rem;
				vertical-align: middle;
			}
			.expression {
				margin-left: 10px;
			}
			.inputBtn {
				position: relative;
				display: inline-block;
				width: 70%;
				margin-top: 5px;
				vertical-align: middle;
				.tipsInput {
					width: 100%;
					height: auto;
					min-height: 4rem;
					padding-left: 10px;
					background: #f5f5f5;
					border-radius: 20px;
					display: inline-block;
					outline: none!important;
					font-size: 1.3rem;
					padding-top: 1rem;
					box-sizing: border-box;
					padding-bottom: 1rem;
				}
				.sendBtn {
					float: right;
				}
			}
		}
		.galleryWrapper {
			width: 100%;
			height: 15rem;
			padding: 0 0 1rem;
			line-height: 35px;
			div {
				width: 5rem;
				height: 5rem;
				background: #F0F0F0;
				display: inline-block;
				position: relative;
				margin-left: 3.5rem;
			}
			img {
				position: absolute;
				width: 2.5rem;
				left: 50%;
				margin-left: -1.25rem;
				margin-top: 1.2rem;
			}
		}
	}
</style>