<template>
	<div class="chat">
		<div>
				<div class="dateStyle">星期二 10:38</div>
				<div class="chatStyle">
					<div class="friend">
						<img src="../images/touxiang.png" />
						<div>我们已互相关注，现在开始聊天吧！</div>
					</div>
					<div class="myself">
						<div>hello</div>
						<img src="../images/touxiang.png" />
					</div>
				</div>
		</div>
		<div class="tips">
				<div style="height:33px;margin-bottom:10px">
					<img src="../images/touxiang.png" class="photo" @click="openGallery"/>
				<img src="../images/touxiang.png" class="expression" @click="openExpression"/>
				<div class="inputBtn">
					<!--<input type="text" class="tipsInput"/>-->
					<el-input
						class="tipsInput"
					  type="textarea"
					  :autosize="{ minRows: 1, maxRows: 4}"
					  placeholder="请输入内容"
					  v-model="textarea">
					</el-input>
					<img src="../images/touxiang.png" class="sendBtn"/>
				</div>
				</div>
				<div v-if="expressionShow">
		   		<img :src="i.src" class="expressionImg" v-for="(i,index) in picLists" @click="selectExpression(i.id,index)" :key="index"/>
				 </div>
		</div>
		
			<mt-popup
		  v-model="galleryShow"
		   position='bottom'>
		   <div class="galleryWrapper">
					<div @click="sendPic">发送图片</div>
		   		<div style="position: relative;height:35px;">
								<div style="position:absolute;">拍照</div>
								<input type="file" capture="camera" class="file" accept="image/*"/> 
					</div>
		   		<div style="position: relative;height:35px;">
								<div style="position:absolute;">从相册中选择</div>
								<input type="file" class="file" accept="image/*"/> 
					</div>
		   		<div @click="galleryShow=false">取消</div>
		   </div>
		</mt-popup>
	</div>
</template>

<script>
	export default {
		name: 'chat',
		data() {
			return {
				   textarea: '',
				   expressionShow:false,
				   galleryShow:false,
				   picLists:[{
            src:require('../images/1.png'),
            id:1
          },{
            src:require('../images/2.png'),
            id:2
          },{
            src:require('../images/3.png'),
            id:3
          },{
            src:require('../images/4.png'),
            id:4
          },{
            src:require('../images/5.png'),
            id:5
          },{
            src:require('../images/6.png'),
            id:6
          },{
            src:require('../images/7.png'),
            id:7
          },{
            src:require('../images/8.png'),
            id:8
          },{
            src:require('../images/9.png'),
            id:9
          },{
            src:require('../images/10.png'),
            id:10
          }]
			}
		},
		methods: {
			openGallery(){
				this.galleryShow = true
			},
			sendPic(){
				
			},
			selectExpression(){
				
			},
			openExpression(){
				this.expressionShow = !this.expressionShow
			}
		}
	}
</script>
<style lang="scss">
	.chat {
		padding: 1rem;
		.mint-popup{
			width:100%;
		}
		.avatar-uploader-icon{
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
    height: 35px;
    opacity: 0;
    width: 100%;
}
.expressionImg{
	width:50px;
	padding:5px;
}
		.dateStyle {
			text-align: center;
			color: #333;
			line-height:3rem;
		}
		.chatStyle {
			.friend {
				img {
					width: 30px;
					vertical-align: middle;
				}
				div {
					display: inline-block;
					padding: 1rem;
					border: 1px solid #eee;
					border-radius: 20px;
					margin-left:1rem;
				}
			}
			.myself {
				float: right;
				img {
					width: 30px;
					vertical-align: middle;
				}
				div {
					display: inline-block;
					padding: 1rem;
					border: 1px solid #eee;
					border-radius: 20px;
					margin-right:1rem;
				}
			}
		}
		.tips{
			width:100%;
			position: fixed;
			bottom:10px;
			.photo,.expression,.sendBtn{
				width:20px;
				vertical-align: middle;
    		margin-top: 5px;
			}
			.expression{
				margin-left:10px;
			}
			.inputBtn{
				position: relative;
				float:right;
				width:80%;
				.tipsInput{
					width:90%;
				}
				.sendBtn{
					position:absolute;
					right:40px;
				}
			}
		}
		.galleryWrapper{
			width:100%;
			height:200px;
			text-align: center;
			line-height: 35px;
			div{
				width:100%
			}
		}
	}
</style>