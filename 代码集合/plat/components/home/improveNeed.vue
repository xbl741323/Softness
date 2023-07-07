<template>
    <div class="require">
        <div class="content">
            <div>
                  <span class="a">免费提交需求</span>
                  <p class="b">尽快匹配服务商</p>
            </div>
            <div class="contact">
                <input class="phone" v-model="formDatas.phoneNumber" placeholder="输入手机号码获取定制项目报告" />
                <!-- <input class="code" v-model="formDatas.code" placeholder="输入验证码" /> -->
                <!-- <el-button class="achievecode" :class="{'ccc':codeDisabled==true}" :disabled="codeDisabled" @click="getCode">{{btnCode}}</el-button> -->
            </div>
            <div class="submit" @click="doSubmit">立即获取</div>
            <el-dialog width="600px" :visible.sync="centerDialogVisible">
                 <img  src="~/assets/images/last/tj_pic@2x.png" class="ttt"/>
                 <p class="first">亲爱的用户：</p>
                 <p class="two">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的需求已经提交，我们将尽快安排专属人员为您服务，请您保持手机畅通。</p>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import {getBtnCode,getConsult} from "@/api/home.js";
export default {
   data(){
       return{
            formDatas:{
                phoneNumber:"",
                code:"",
                origin:'0'
            },
            identification:"",
            btnCode:"获取验证码",
            num:60,
            codeDisabled:false,
            reg:/^1[3-9]\d{9}$/,
            centerDialogVisible: false
       }
    },
    mounted(){
        if(localStorage.getItem("identification")){
            this.identification = localStorage.getItem("identification")
        }
    },
   methods:{
        getCode(){
             if(this.reg.test(this.formDatas.phoneNumber)){
                 let param = {
                     phoneNumber:this.formDatas.phoneNumber,
                     origin:'0'
                 }
                getBtnCode(param).then(res=>{
                    if(res.data.code==0){
                        this.$message({
                            message: '发送成功，5分钟内有效',
                            type: 'success',
                            showClose: true,
                            offset:200,
                        });
                        this.codeDisabled= true;
                        this.timer(); 
                    }else if(res.data.code==1){
                        if(res.data.data && res.data.data.code && res.data.data.code ==1006){
                            this.$message({
                            message:'操作过于频繁，请稍后重试',
                            type: 'warning',
                            showClose: true,
                            offset:200,
                          });
                        }else{
                          this.$message({
                            message:res.data.msg,
                            type: 'warning',
                            showClose: true,
                            offset:200,
                          });
                        }
                         this.codeDisabled= false;
                    }
                })
            }else{
                this.$message({
                    message:"请先输入一个正确的手机号码",
                    type: 'error',
                    showClose: true,
                    offset:200,
                });
                 this.codeDisabled= false;
            }   
        },
        timer(){             
            if(this.num > 0){
                this.codeDisabled = true;
                this.btnCode= this.num+"s后重试";
                this.num--;                
                setTimeout(()=>{ this.timer()},1000);
            }else{
                this.btnCode="获取验证码";
                this.num=60;
                this.codeDisabled = false;
            }                               
        }, 
        doSubmit(){
              if(!this.reg.test(this.formDatas.phoneNumber)){
                    this.$message({
                        message:"请输入一个正确的手机号码",
                        type: 'error',
                        showClose: true,
                        offset:200,
                    });
                }
                // else if(!this.formDatas.code){
                //     this.$message({
                //         message:"请输入验证码",
                //         type: 'error',
                //         showClose: true,
                //         offset:200,
                //     });
                // }
                else{
                 let param = {
                    phoneNumber:this.formDatas.phoneNumber,
                    origin:'0',
                    identification:this.identification
                 }
                 getConsult(param).then(res=>{
                    if(res.data.code==0){
                            // this.$message({
                            //     message: '成功！',
                            //     type:'success',
                            //     showClose: true,
                            //     offset:200,
                            // }); 
                            this.centerDialogVisible =true;
                            this.formDatas = {};
                        }else{
                            this.$message({
                                message:res.data.msg,
                                type: 'warning',
                                showClose: true,
                                offset:200,
                            }); 
                             this.formDatas = {};
                        }
                    })
                }                
        }

   },
}
</script>
<style scoped>
.first{
    font-weight: bold;
    font-size: 16px;
    color: #000000;
    padding: 0 35px;
}
.two{
    margin-top: 16px;
    font-size: 16px;
    color: #000000;
    padding: 0 35px;
    line-height: 27px;
    font-weight: 400;
}
.ttt{
    width: 283px;
    height: 146px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
}
.ccc{
    color: #d1d1d1 !important;
}
.require{
    width: 1200px;
    height: 113.29px;
    margin: 10px auto 23px auto;
    background-image: url('~assets/images/last/xq_pic@2x.png');
    background-size: cover;
}
.content{
    padding: 45px 0 0  278px;
    display: flex;
}
.a{
    color: #FFFFFF;
    font-size: 20px;
    font-weight: bold;
}
.b{
    color: #FFFFFF;
    font-size: 12px;
    margin-top: 6px;
}
.contact{
    width: 489px;
    height: 46px;
    background: #FFFFFF;
    opacity: 1;
    border-radius: 5px;
    margin-left: 22px;
    display: flex;
    align-items: center;
}
.phone{
    /* width: 280px; */
    width: 480px;
    border: 0;
    height: 21px;
    color: #333333;
    margin-left: 12px;
    outline: none;
    /* border-right: 1px solid #d1d1d1; */
}
.code{
    width: 95px;
    border: 0;
    height: 21px;
    margin-left: 8px;
    color: #333333;
    outline: none;
    border-right: 1px solid #d1d1d1;
}
.achievecode{
    color: #FF9000;
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
    border: none;
}
.submit{
    width: 130px;
    height: 46px;
    background: #FF9000;
    opacity: 1;
    border-radius: 5px;
    margin-left: 10px;
    color: #FFFFFF;
    letter-spacing: 1px;
    font-weight: bold;
    font-size: 18px;
    line-height: 46px;
    text-align: center;
    cursor: pointer;
}
.achievecode:hover {
	background: #FFFFFF;
}
input::-webkit-input-placeholder{
 color:#999;
}
</style>