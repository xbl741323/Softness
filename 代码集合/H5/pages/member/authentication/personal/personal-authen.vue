<template>
    <div>
        <mt-header :title="$route.query.personType==0?'支付宝认证':'阿里云认证'" class="header"> 
            <router-link to="/member/authentication/authentication-personal" slot="left"> <mt-button icon="back"></mt-button></router-link>
        </mt-header>
        <div class="content">
            <div class="personal_form">
                <el-form :model="personalForm" ref="personalForm" :rules="personalRules" label-width="2.1333333333333333rem">
                    <el-form-item label="证件类型">
                        <el-input readonly  v-model="certificateType"/>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                        <el-input placeholder="请填写真实姓名" maxlength="50" v-model="personalForm.name" />
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idCard">
                        <el-input placeholder="请填写真实的18位身份证号码" v-model="personalForm.idCard" />
                    </el-form-item>
                </el-form>
            </div>
            <div class="submit" @click="submit()">提 交</div>
        </div>
    </div>
</template>
<script>
import { checkPersonalAuth,getAliUrl,getzfbUrl } from '~/api/member'
import { Indicator } from 'mint-ui'
export default {
     head () {
        return {
            title: "个人认证",    
            meta: [
                { hid: 'description', name: '个人认证', content: '个人认证' }
            ]
        }
    },
    data(){
        let idValidator = (rule, value, callback)=>{
            if(value){
                let pattern = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                if(pattern.test(value)){
                    if(value != this.idCard){
                        let param = {
                          idCard: this.personalForm.idCard
                        }
                        checkPersonalAuth(param).then(res=>{
                            if(res.code == 0){
                                this.idCard = value;
                                callback()
                            }else{
                                callback(new Error(res.msg));
                            }
                        })
                    }else{
                        callback();
                    }
                }else{
                    callback(new Error('请输入正确的身份证号！'));
                }
            }else{
                callback(new Error('请输入正确的身份证号！'));
            }
        }
        return{
            idCard:'',
            personalForm:{},
            certificateType:'居民身份证',
            personalRules:{
                idCard:[{required: true, validator: idValidator, trigger:'blur'}],
                name:[{required: true,pattern : /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/, message:'请输入姓名！',trigger:'blur'}]
            }
        }
    },
    methods:{
        submit(){
            const userInfo = this.$store.state.userInfo
            this.$refs.personalForm.validate(valid=>{
                if(valid){
                 Indicator.open()
                 // 阿里云
                 if(this.$route.query.personType ==1){
                     let param = {
                        personalName: this.personalForm.name,
                        idCard: this.personalForm.idCard,
                        authType: 1,        
                        authSource: 1,
                        userId: userInfo.userId,
                        mobilPhone: userInfo.accountNo,
                        type: 0,
                        metaInfo: JSON.stringify(getMetaInfo())
                     }
                    getAliUrl(param).then(res=>{
                        Indicator.close()
                        param.certifyId = res.data.resultObject.certifyId
                        param.plat = 1
                        localStorage.setItem('authentication-result',JSON.stringify(param))
                        location.href = res.data.resultObject.certifyUrl
                    })
                 }else{
                   // 支付宝
                     let para ={
                        personalName: this.personalForm.name,
                        idCard: this.personalForm.idCard,
                        authType: 0,
                        authSource: 1,
                        userId: userInfo.userId,
                        mobilPhone: userInfo.accountNo,
                        type: 0
                     }
                     getzfbUrl(para).then(res=>{
                          Indicator.close()
                          para.certifyId = res.data.certifyId
                          para.plat = 0
                          localStorage.setItem('authentication-result',JSON.stringify(para))
                          location.href = res.data.certifyUrl
                     })
                 }
                }else{
                  return false
                }
            })
        }
    }
}
</script>
<style lang="stylus"  scoped>
.header{
    background: #ffffff;
    height: 56px;
    font-size: 16px;
    color:rgb(189, 172, 172);
    box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.03);
    color:#333
}
.content{
    padding:12px;
    background:#f4f4f4;
    height: 100vh;
    opacity: 0.8;
}
  .personal_form{
    margin-top 15px
    .file_box{
      display grid
      grid-template-columns repeat(2, 1fr)
      text-align top 
      .img{
        display flex
        .warning{
          text-align center
          margin-top -20px
          margin-left 10px
          color #333333
          font-size 12px
        }
        .warning i{
          color #23D96E
          margin-right 5px
        }
      }
      .img p{
        color #36A6FE
        margin-top -10px
      }
    }
    .file_box img{
      width 259px
      height 158px
      margin-left 10px
    }
  }
  .personal_form >>> .el-input__inner{
    width calc(100%-2.1333333333333333rem)
    height: 35px
  }
  .personal_form >>> .el-form-item__label{
    font-size 14px
    font-weight 550
    color #000000
  }
  .submit{
    margin 50px auto
    width 182px
    height 40px
    background #36a6fe
    border-radius 5px
    text-align center
    line-height 40px
    color #FFFFFF
    font-size 20px
    cursor pointer
    user-select none
  }
</style>