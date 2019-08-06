<template>
	<div class="chat" id="chat">
		<div class="content" id="content" @touchmove="touchmove()">
			<!--<mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" ref="loadmore">-->
			<div v-show="loadingShow" style="text-align: center;">
				<img src="../images/loading.png" style="width:2rem;" />
			</div>
			<div v-for="(l,index) in chatLists" :key="index" style="margin-bottom:2rem" :class="(index == chatLists.length-1)?'active':''">
				<div class="dateStyle" v-text="$utils.formatTime(l.createTime)" v-show="l.timer"></div>
				<div class="chatStyle">
					<div v-if="l.type == 0 || l.type == 1">
						<div class="friend" v-if="l.direction == 1">
							<img :src="l.headIcon" class="touxiang" />
							<p v-html="$utils.toEmotion(l.content)"></p>
						</div>
						<div class="myself" v-if="l.direction == 2">
							<div class="loadingStyle">
								<mt-spinner type="snake" :size="10" class="spinner" v-if="!l.status"></mt-spinner>
								<img src="../images/error.png" v-if="l.error" style="width:1.6rem" />
								<p v-html="$utils.toEmotion(l.content)"></p>
							</div>
							<img :src="l.headIcon" class="touxiang" />
						</div>
					</div>
					<div v-if="l.type == 2">
						<div class="friend" v-if="l.direction == 1">
							<img :src="l.headIcon" class="touxiang" />
							<img :src="prefix+l.content" style="width:100px;margin-left:2rem" @click="openImg">
						</div>
						<div class="myself" v-if="l.direction == 2">
							<img :src="l.headIcon" class="touxiang" />
							<div class="loadingStyle">
								<mt-spinner type="snake" :size="10" class="spinner" v-if="!l.status"></mt-spinner>
								<img src="../images/error.png" v-if="l.error" style="width:1.6rem" />
								<img :src="prefix+l.content" style="width:100px;margin-right:2rem" @click="openImg">
							</div>
						</div>
						<div class="bigImg" v-show="bigImgShow" @click="bigImgShow=false">
							<img :src="prefix+l.content" />
						</div>
					</div>
					<div v-if="l.type == 3">
						<div class="friend" v-if="l.direction == 1">
							<img :src="l.headIcon" class="touxiang" />
							<audio :src="prefix+audioUrl" controls="controls" class="content-audio" style="display: block;">语音</audio>
						</div>
						<div class="myself" v-if="l.direction == 2">
							<img :src="l.headIcon" class="touxiang" />
							<div class="loadingStyle">
								<mt-spinner type="snake" :size="10" class="spinner" v-if="!l.status"></mt-spinner>
								<img src="../images/error.png" v-if="l.error" style="width:1.6rem;float:left" />
							<!--	<audio :src="prefix+audioUrl" controls class="content-audio"></audio>-->
								<div class="audioStyle" @click="play">
									<img src="../images/audio.png" style="width:2rem;vertical-align: middle;position: absolute; right: 2rem;top: 1rem;"/>
									 <audio preload="auto" id="downloadRec"><source :src="audioUrl" type="audio/mpeg" ></audio>
								</div>
								<!--<audio controls>
									  <source :src="audioUrl" type="audio/mpeg">
								</audio>-->
							</div>
						</div>
						<div class="bigImg" v-show="bigImgShow" @click="bigImgShow=false">
							<img :src="l.content" />
						</div>
					</div>
				</div>
			</div>
			<div style="width:100%;height:100px" v-if="expressionShow || galleryShow"></div>
			<!--</mt-loadmore>-->
		</div>
		<div class="tips">
			<div style="margin-bottom:2rem;margin-left:2rem">
				<img src="../images/audio.png" style="width:3rem;vertical-align: middle;" id="messageBtn" />
				<div class="inputBtn">
					<div contenteditable="true" class="tipsInput" @input="changeText" id="inputs" @focus="focusfns" ref="input">
						<img :src='item' v-for="item in selectPicLists" style="width:20px;margin-right:5px;vertical-align: middle;" />
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
	import { Toast, MessageBox, Swipe, SwipeItem } from 'mint-ui'
	import recording from '../common/recorder.js'
	let ws
	var posStart = 0; //初始化起点坐标
	var posEnd = 0; //初始化终点坐标
	var posMove = 0; //初始化滑动坐标
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
				websocketurl: _utils.getWebsocketURL(),
				obj: {},
				arr: [],
				pageNo: 0,
				loadingShow: false,
				chatRecord: [],
				recodeList: [],
				prefix: 'http://99.48.68.109:8092/chat/storage/display/',
				audioUrl: ''
			}
		},
		mounted() {
			this.id = this.$route.query.id
			this.memberIdTo = this.$route.query.memberIdTo
			this.init()
			this.getListMemberChat()
			this.initEvent()
		},
		methods: {
			play(){
				var audio = document.querySelector('audio');
				  if (audio.paused) {
			        // 开始播放当前点击的音频
			        audio.play();
			    } else {
			        audio.pause();
			    }
			},
			save() {
				//ajax
				this.clearTimer()
				this.endTime = new Date().getTime()
				if(this.recorder) {
					this.recorder.stop()
					// 重置说话时间
					this.num = 60
					this.time = '按住说话（' + this.num + '秒）'
					// 获取语音二进制文件
					let bold = this.recorder.getBlob()
					// 将获取的二进制对象转为二进制文件流
					let files = new File([bold], 'test.mp3', {
						type: 'audio/mp3',
						lastModified: Date.now()
					})
					let fd = new FormData()
					fd.append('file', files)
					//      fd.append('tenantId', 3) // 额外参数，可根据选择填写
					// 这里是通过上传语音文件的接口，获取接口返回的路径作为语音路径
					this.sendPic(fd, 3)
				}
			},
			initEvent() {
				let _this = this
				var btnElem = document.getElementById("messageBtn"); //获取ID
				btnElem.addEventListener("touchstart", function(event) {
					event.preventDefault(); //阻止浏览器默认行为
					posStart = 0;
					posStart = event.touches[0].pageY; //获取起点坐标
					btnElem.value = '松开 结束';
					console.log("start");
					console.log(posStart + '---------开始坐标');
					_this.mouseStart()
				});
				btnElem.addEventListener("touchmove", function(event) {
					event.preventDefault(); //阻止浏览器默认行为
					posMove = 0;
					posMove = event.targetTouches[0].pageY; //获取滑动实时坐标
					if(posStart - posMove < 500) {
						btnElem.value = '松开 结束';
					} else {
						btnElem.value = '松开手指，取消发送';
					}
					/*console.log(posStart+'---------');
					console.log(posMove+'+++++++++');*/
				});
				btnElem.addEventListener("touchend", function(event) {
					event.preventDefault();
					posEnd = 0;
					posEnd = event.changedTouches[0].pageY; //获取终点坐标
					btnElem.value = '按住 说话';
					console.log("End");
					console.log(posEnd + '---------结束坐标');
					if(posStart - posEnd < 500) {
						console.log("发送成功");
						_this.save();
					} else {
						console.log("取消发送");
						console.log("Cancel");
					};
				});
			},
			// 清除定时器
			clearTimer() {
				if(this.interval) {
					this.num = 60
					clearInterval(this.interval)
				}
			},
			// 长按说话
			mouseStart() {
				this.clearTimer()
				this.startTime = new Date().getTime()
				recording.get((rec) => {
					// 当首次按下时，要获取浏览器的麦克风权限，所以这时要做一个判断处理
					if(rec) {
						// 首次按下，只调用一次
						if(this.flag) {
							this.mouseEnd()
							this.flag = false
						} else {
							this.recorder = rec
							this.interval = setInterval(() => {
								if(this.num <= 0) {
									this.recorder.stop()
									this.num = 60
									this.clearTimer()
								} else {
									this.num--
										this.time = '松开结束（' + this.num + '秒）'
									this.recorder.start()
								}
							}, 1000)
						}
					}
				})
			},
			uploadFile(fd) {
				api.upload(api.getUrl('upload'), fd).then(res => {
					this.audioUrl = res.content

				})
			},
			// 松开时上传语音
			mouseEnd() {
				this.clearTimer()
				this.endTime = new Date().getTime()
				if(this.recorder) {
					this.recorder.stop()
					// 重置说话时间
					this.num = 60
					this.time = '按住说话（' + this.num + '秒）'
					// 获取语音二进制文件
					let bold = this.recorder.getBlob()
					// 将获取的二进制对象转为二进制文件流
					let files = new File([bold], 'test.mp3', {
						type: 'audio/mp3',
						lastModified: Date.now()
					})
					let fd = new FormData()
					fd.append('file', files)
					//      fd.append('tenantId', 3) // 额外参数，可根据选择填写
					// 这里是通过上传语音文件的接口，获取接口返回的路径作为语音路径
					this.uploadFile(fd)
				}
			},
			openImg() {
				this.bigImgShow = true
			},
			str2ab(type, s) {
				var b = new Blob([s], {
					type: 'text/plain'
				});
				var r = new FileReader();
				r.readAsArrayBuffer(b);
				r.onload = function() {
					console.log(type)
					console.log(s)
					ws.send(new Blob([type, s]));
				}
			},
			touchmove() { // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
				let _this = this
				this.$nextTick(function() {
					console.log('hhhhhhhhhhhhhhhhhhhh')
					let msg = document.getElementById('content') // 获取对象
					console.log(msg.scrollTop)
					if(msg.scrollTop < 100) {
						if(_this.move) {
							_this.loadingShow = true
							console.log('男男女女女女女女女女女女女女')
							_this.pageNo++
								_this.getListMemberChat()
							_this.move = false
						}
					}
				})
			},
			getListMemberChat() {
				let req = {
					memberIdTo: this.memberIdTo,
					pageNo: 0 || this.pageNo,
					pageSize: 10
				}
				api.post(api.getUrl('getListMemberChat'), req).then(res => {
					let _this = this

					if(res.code == '0000') {
						let arr = res.content.reverse();
						arr.forEach(function(i) {
							_this.$set(i, 'status', true);
							_this.$set(i, 'timer', true);
						});
						for(var n = 0; n < arr.length; n++) {
							if(arr[n - 1]) {
								if(new Date(arr[n].createTime).getTime() - new Date(arr[n - 1].createTime).getTime() < 10000) {
									arr[n].timer = false
								} else {
									arr[n].timer = true
								}
							} else {
								arr[n].timer = true
							}
						}
						console.log(arr)
						//						this.chatLists = this.recodeList.concat(this.chatLists); //倒序合并
						this.chatLists = res.content.concat(this.chatLists);;
						this.loadingShow = false
						this.move = true
						if(res.content.length < 10) {
							Toast('没有更多了')
							return;
						}
						this.$nextTick(function() {
							console.log('hhhhhhhhhhhhhhhhhhhh')
							let msg = document.getElementById('content') // 获取对象
							let innerHeight = document.querySelector('.content').clientHeight
							// 变量scrollTop是滚动条滚动时，距离顶部的距离
							let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
							// 变量scrollHeight是滚动条的总高度
							let scrollHeight = document.documentElement.clientHeight || document.body.scrollHeight
							//msg.scrollTop = innerHeight + scrollHeight + scrollTop+500
							msg.scrollTop = innerHeight + scrollTop + scrollHeight - 100
						})
					}
				})
			},
			init() {
				let _this = this
				ws = new WebSocket(this.websocketurl + "/chat/binarySocketServer?userId=" + this.id);
				console.log('gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
				ws.onmessage = (evnt) => {
					let content = evnt.data;
					_this.onmessage = true
					console.log('contentcontentcontentcontentcontentcontentcontent' + typeof(content))
					if(typeof(content) == 'string') {
						if(JSON.parse(content).status == 1) {
							let length = _this.chatLists.length
							_this.chatLists[length - 1].status = true
						} else if(JSON.parse(content).status == 0) {
							let length = _this.chatLists.length
							_this.chatLists[length - 1].status = true
							_this.chatLists[length - 1].error = true
						}
					} else {
						var reader = new FileReader();
						let str = ''
						let obj = {}
						let arrObj = {}
						reader.onload = function(evnt) {
							str = reader.result; //内容就在这里
							console.log('sssssssssssssssssssssssssssssss' + str)
							var f = JSON.parse(str.substring(1))
							console.log(str)
							obj = {
								direction: 1,
								type: str.substring(0, 1),
								content: f.content,
								createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
								headIcon: require('../images/wyz.jpg')
							}
							_this.arr.push(obj)
							for(var i = 0; i < _this.arr.length; i++) {
								if(_this.arr[i - 1]) {
									if(new Date(_this.arr[i].createTime).getTime() - new Date(_this.arr[i - 1].createTime).getTime() < 10000) {
										arrObj = {
											direction: 1,
											type: str.substring(0, 1),
											content: f.content,
											headIcon: require('../images/wyz.jpg'),
											timer: false
										}
									} else {
										arrObj = {
											direction: 1,
											type: str.substring(0, 1),
											content: f.content,
											createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
											headIcon: require('../images/wyz.jpg'),
											timer: true
										}
									}
								} else {
									arrObj = {
										direction: 1,
										type: str.substring(0, 1),
										content: f.content,
										createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
										headIcon: require('../images/wyz.jpg'),
										timer: true
									}
								}
							}
							_this.chatLists.push(arrObj)
						};
						reader.readAsText(content);
						console.log(_this.chatLists)
					}
				};
				ws.onerror = function(evnt) {
					let length = _this.chatLists.length
					if(!_this.chatLists[length - 1].status) {
						setTimeout(function() {
							if(!_this.chatLists[length - 1].status) {
								_this.chatLists[length - 1].status = true
								_this.chatLists[length - 1].error = true
							}
						}, 3000);
					}
				};
				ws.onclose = function(evnt) {
					console.log("session closed now");
					_this.init()
					let length = _this.chatLists.length
					if(!_this.chatLists[length - 1].status) {
						setTimeout(function() {
							if(!_this.chatLists[length - 1].status) {
								_this.chatLists[length - 1].status = true
								_this.chatLists[length - 1].error = true
							}
						}, 3000);
					}
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
			//			loadTop() {
			//				this.pageNo++
			//					this.getListMemberChat()
			//				this.$refs.loadmore.onTopLoaded();
			//			},
			sendPic(params, type) {
				api.upload(api.getUrl('upload'), params).then(res => {
					let obj = {}
					let arrObj = {}
					if(res.code == '0000') {
						this.audioUrl = 'https://cms-images.lovehaimi.com/images/resources/documentAudio/1538032236530.mp3'
						//this.audioUrl = res.content
						this.galleryShow = false
						obj = {
							direction: 2,
							type: type,
							content: res.content,
							createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
							headIcon: require('../images/wyz.jpg')
						}
						this.arr.push(obj)
						for(var i = 0; i < this.arr.length; i++) {
							if(this.arr[i - 1]) {
								if(new Date(this.arr[i].createTime).getTime() - new Date(this.arr[i - 1].createTime).getTime() < 10000) {
									console.log('尽力啊没有')
									arrObj = {
										direction: 2,
										type: type,
										content: res.content,
										headIcon: this.ownerAvatarUrl || require('../images/wyz.jpg'),
										status: false,
										error: false,
										timer: false
									}
								} else {
									arrObj = {
										direction: 2,
										type: type,
										content: res.content,
										createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
										headIcon: this.ownerAvatarUrl || require('../images/wyz.jpg'),
										status: false,
										error: false,
										timer: true
									}
								}
							} else {
								arrObj = {
									direction: 2,
									type: type,
									content: res.content,
									createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
									headIcon: this.ownerAvatarUrl || require('../images/wyz.jpg'),
									status: false,
									error: false,
									timer: true
								}
							}

						}
						this.chatLists.push(arrObj)
					}
					let resObj = {
						//content: this.prefix + obj.content,
						content: obj.content,
						fromUserId: this.id,
						toUserId: this.memberIdTo,
						type: type,
						duration:10
					}
					console.log(resObj)
					let _this = this
					let length = this.chatLists.length
					if(!this.chatLists[length - 1].status) {
						setTimeout(function() {
							console.log(_this.chatLists[length - 1].status)
							if(!_this.chatLists[length - 1].status) {
								_this.chatLists[length - 1].status = true
								_this.chatLists[length - 1].error = true
							}
						}, 30000);
					}
					if(ws.readyState == ws.OPEN) {
						this.str2ab(type, JSON.stringify(resObj));
					} else {
						this.init()
						let _this = this
						let length = _this.chatLists.length
						if(!_this.chatLists[length - 1].status) {
							setTimeout(function() {
								console.log('定时器执行了没有')
								if(!_this.chatLists[length - 1].status) {
									_this.chatLists[length - 1].status = true
									_this.chatLists[length - 1].error = true
								}
							}, 3000);
						}
					}
				})
			},
			tirggerFile(event, file) {
				this.formData = new FormData()
				this.formData.append('file', event.target.files[0])
				this.sendPic(this.formData, 2)

			},
			tirggerPhoto(event, file) {
				this.formData = new FormData()
				this.formData.append('file', event.target.files[0])
				this.sendPic(this.formData, 2)
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
				let arrObj = {}
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

				let resObj = {
					content: result,
					fromUserId: this.id,
					toUserId: this.memberIdTo,
					type: 1
				}
				console.log(resObj)
				//调用后台handleTextMessage方法    
				obj = {
					direction: 2,
					type: 1,
					content: result,
					createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss")
				}
				this.arr.push(obj)
				console.log(this.arr)
				for(var i = 0; i < this.arr.length; i++) {
					if(this.arr[i - 1]) {
						console.log(new Date(this.arr[i].createTime).getTime() - new Date(this.arr[i - 1].createTime).getTime())
						console.log(new Date(this.arr[i - 1].createTime).getTime() - new Date(this.arr[i].createTime).getTime())
						if(new Date(this.arr[i].createTime).getTime() - new Date(this.arr[i - 1].createTime).getTime() > 10000) {
							arrObj = {
								direction: 2,
								type: 1,
								content: result,
								headIcon: this.ownerAvatarUrl || require('../images/wyz.jpg'),
								createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
								status: false,
								error: false,
								timer: true
							}
						} else {
							arrObj = {
								direction: 2,
								type: 1,
								content: result,
								createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
								headIcon: this.ownerAvatarUrl || require('../images/wyz.jpg'),
								status: false,
								error: false,
								timer: false
							}
						}
					} else {
						arrObj = {
							direction: 2,
							type: 1,
							content: result,
							createTime: _utils.dateFormatter(new Date(), "yyyy-MM-dd HH:mm:ss"),
							headIcon: this.ownerAvatarUrl || require('../images/wyz.jpg'),
							status: false,
							error: false,
							timer: true
						}
					}

				}
				this.chatLists.push(arrObj)
				console.log(this.chatLists)
				this.$nextTick(() => {
					let msg = document.getElementById('content') // 获取对象
					msg.scrollTop = msg.scrollHeight // 滚动高度
				})
				console.log(this.toEmotion(result))
				document.getElementById('inputs').innerHTML = ''
				let _this = this
					let length = _this.chatLists.length
					if(!_this.chatLists[length - 1].status) {
						setTimeout(function() {
							if(!_this.chatLists[length - 1].status) {
								_this.chatLists[length - 1].status = true
								_this.chatLists[length - 1].error = true
							}
						}, 30000);
					}
				this.sendBtnShow = false
				this.$refs.input.focus();
				if(ws.readyState == ws.OPEN) {
					this.str2ab(1, JSON.stringify(resObj));
				} else {
					this.init()
					console.log('失败')
					let _this = this
					let length = _this.chatLists.length
					if(!_this.chatLists[length - 1].status) {
						setTimeout(function() {
							if(!_this.chatLists[length - 1].status) {
								_this.chatLists[length - 1].status = true
								_this.chatLists[length - 1].error = true
							}
						}, 3000);
					}
				}
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
			},
		},
		beforeDestroy() {
			ws.close()
		}
	}
</script>
<style lang="scss">
	.chat {
		width: 100%;
		height: 100%;
		.audioStyle{
			width:100px;
			height:4rem;
			 background: #FF9F9D;
		    color: #fff;
		    margin-right: 1.5rem;
		    border-radius: 5rem 0 2rem 5rem;
		    display: inline-block;
		    position:relative;
		    margin-top:1rem;
		}
		.mint-spinner-snake {
			border-width: 2px!important;
		}
		/*padding: 2rem;*/
		box-sizing: border-box;
		.content {
			height: 90%;
			/*height:calc(100%-100px);*/
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
					padding: 1.2rem;
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
				.loadingStyle {
					position: relative;
					overflow: hidden;
					vertical-align: middle;
					display: inline-block;
					.spinner {
						float: left;
						vertical-align: middle;
						margin-top: 15px;
					}
				}
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
				width: 60%;
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