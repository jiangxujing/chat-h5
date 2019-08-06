<template>
  <div class="wrap">
    <el-form v-model="form">
      <el-form-item>
      	<input type="button" name="" id="messageBtn" value="按住 说话">
        <input type="button" class="btn-record-voice" @mousedown.prevent="mouseStart" @mouseup.prevent="mouseEnd" v-model="form.time"/>
       <audio :src="form.audioUrl" controls="controls" class="content-audio" style="display: block;">语音</audio>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入recorder.js
import recording from '../common/recorder.js'
	import api from "../common/api.js";
		var posStart = 0;//初始化起点坐标
		var posEnd = 0;//初始化终点坐标
		var posMove = 0;//初始化滑动坐标
export default {
  data() {
    return {
      form: {
        time: '按住说话(60秒)',
        audioUrl: ''
      },
      num: 60, // 按住说话时间
      recorder: null,
      interval: '',
      audioFileList: [], // 上传语音列表
      startTime: '', // 语音开始时间
      endTime: '', // 语音结束
    }
  },
  mounted() {
  	
			this.initEvent()
		},
  methods: {
  	 save(){
			//ajax
			 this.clearTimer()
      this.endTime = new Date().getTime()
      if (this.recorder) {
        this.recorder.stop()
        // 重置说话时间
        this.num = 60
        this.time = '按住说话（' + this.num + '秒）'
        // 获取语音二进制文件
        let bold = this.recorder.getBlob()
        // 将获取的二进制对象转为二进制文件流
        let files = new File([bold], 'test.mp3', {type: 'audio/mp3', lastModified: Date.now()})
        let fd = new FormData()
        fd.append('file', files)
//      fd.append('tenantId', 3) // 额外参数，可根据选择填写
        // 这里是通过上传语音文件的接口，获取接口返回的路径作为语音路径
        this.uploadFile(fd)
      }
		},
  	initEvent() {
  		let _this = this
  		var btnElem=document.getElementById("messageBtn");//获取ID
			btnElem.addEventListener("touchstart", function(event) {
				event.preventDefault();//阻止浏览器默认行为
				posStart = 0;
				posStart = event.touches[0].pageY;//获取起点坐标
				btnElem.value = '松开 结束';
				console.log("start");
				console.log(posStart+'---------开始坐标');
				_this.mouseStart()
			});
			btnElem.addEventListener("touchmove", function(event) {
				event.preventDefault();//阻止浏览器默认行为
				posMove = 0;
				posMove = event.targetTouches[0].pageY;//获取滑动实时坐标
				if(posStart - posMove < 500){
					btnElem.value = '松开 结束';
				}else{
					btnElem.value = '松开手指，取消发送';
				}
				/*console.log(posStart+'---------');
				console.log(posMove+'+++++++++');*/
			});
			btnElem.addEventListener("touchend", function(event) {
				event.preventDefault();
				posEnd = 0;
				posEnd = event.changedTouches[0].pageY;//获取终点坐标
				btnElem.value = '按住 说话';
				console.log("End");
				console.log(posEnd+'---------结束坐标');
				if(posStart - posEnd < 500 ){
					console.log("发送成功");
					_this.save();
				}else{
					console.log("取消发送");
					console.log("Cancel");
				};
			});
		},
    // 清除定时器
    clearTimer () {
      if (this.interval) {
        this.num = 60
        clearInterval(this.interval)
      }
    },
    // 长按说话
    mouseStart () {
      this.clearTimer()
      this.startTime = new Date().getTime()
      recording.get((rec) => {
        // 当首次按下时，要获取浏览器的麦克风权限，所以这时要做一个判断处理
        if (rec) {
          // 首次按下，只调用一次
          if (this.flag) {
            this.mouseEnd()
            this.flag = false
          } else {
            this.recorder = rec
            this.interval = setInterval(() => {
              if (this.num <= 0) {
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
    uploadFile(fd){
    	api.upload(api.getUrl('upload'), fd).then(res => {
					this.form.audioUrl = res.content
					//location.href = 'http://99.48.68.100:8092/chat/storage/display'+res.content
				})
    },
    	
    // 松开时上传语音
    mouseEnd () {
      this.clearTimer()
      this.endTime = new Date().getTime()
      if (this.recorder) {
        this.recorder.stop()
        // 重置说话时间
        this.num = 60
        this.time = '按住说话（' + this.num + '秒）'
        // 获取语音二进制文件
        let bold = this.recorder.getBlob()
        // 将获取的二进制对象转为二进制文件流
        let files = new File([bold], 'test.mp3', {type: 'audio/mp3', lastModified: Date.now()})
        let fd = new FormData()
        fd.append('file', files)
//      fd.append('tenantId', 3) // 额外参数，可根据选择填写
        // 这里是通过上传语音文件的接口，获取接口返回的路径作为语音路径
        this.uploadFile(fd)
      }
    }
  }
}
</script>

<style scoped>
</style>