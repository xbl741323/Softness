<!-- 排查完成 -->
<template>
  <div class="set_account">
    <div class="modify">
      <div v-if="status == 0">
        <div class="modify-head">
          <h3>{{$t('message.accountSet')}}</h3>
          <div class="modify_avatar">
            <div class="img_avatar"><info-avatar></info-avatar></div>
          </div>
        </div>
        <div class="modify-input">
          <el-form ref="userInfo" :model="empInfo" :rules="rules" label-width="180px">
            <el-form-item label="单位名称：" class="update-three-sty" prop="partnerName" v-if="empInfo.isPartner == 1">
              <el-input v-model="empInfo.partnerName" class="update-one-sty" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('label.jobNumber')+'：'" class="update-three-sty" prop="id">
              <el-input v-model="empInfo.number" class="update-one-sty" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称：" class="update-three-sty">
              <el-input v-model="empInfo.nickname" class="update-one-sty" disabled></el-input>
              <el-button type="primary" size="small" class="update-two-sty" @click="openDialog">{{$t('button.modify')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('label.phoneNumber')+'：'" class="update-three-sty" prop="telephone">
              <el-input v-model="empInfo.phone" class="update-one-sty" disabled></el-input>
              <el-button type="primary" size="small" class="update-two-sty" @click="status=1">{{$t('button.modify')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('label.password')+'：'" prop="password">
              <el-input v-model="empInfo.password" class="update-one-sty" type="password" disabled></el-input>
              <el-button type="primary" size="small" class="update-two-sty" @click="status=2">{{$t('button.modify')}}</el-button>
            </el-form-item>
            <el-form-item label="第三方登录：">
              <div class="bind-icon-item" v-if="empInfo.bindWxFlag">
                <img :src="empInfo.wxAvatar" class="wx-icon-sty" />
                <span class="spanSty1">{{empInfo.wxUsername}}</span>
                <el-link  class="bind-link" type="primary" :underline="false" @click="openUnbindingWindow">/解绑</el-link>   
              </div> 
              <div class="bind-icon-item" v-else>
                <img src="@/assets/images/my-home/icon_wet_unlogin.png" class="wx-icon-sty" />
                <span class="spanSty2">微信</span>
                <el-link class="bind-link" type="primary" :underline="false" @click="openBindingWindow">/绑定</el-link>
              </div>  
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 修改昵称 --> 
      <el-dialog
       title="修改昵称"
       :visible.sync="dialogVisible"
       width="20%"      
       :before-close="handleClose">
       <el-form :model="nickForm" ref="nickForm" inline :rules="nickRules">
          <el-form-item label="昵称：" prop="nickName">
            <el-input @input="checkName" maxlength="10" v-model="nickForm.nickName" placeholder="请输入昵称" class="update-four-sty"></el-input>
          </el-form-item>
       </el-form>
          <div class="update-btn-sty">
             <el-button class="update-five-sty" type="primary" @click="setName" :disabled="btnStatus==false?true:false">确 定</el-button>
             <el-button @click="dialogVisible = false">取 消</el-button>
          </div>
      </el-dialog>
      <!-- 绑定微信二维码 -->
      <el-dialog :before-close="handleCloseWx" :visible.sync="bindVisible" width="420px" top="300px" center :close-on-click-modal="false">
        <div class="qr-box" >
          <!-- <img class="img-sty" :src="this.qrcodeImg" alt="" />  -->
          <iframe :src="qrcodeImg" frameborder="0" scrolling="no" width="340" height="340" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe>
        </div>
        <div class="qr-text">微信扫一扫绑定</div>
      </el-dialog>

      <div v-if="status == 1"><set-phone @toSet="toSet" :info="empInfo"></set-phone></div>
      <div v-if="status == 2" class="update-six-sty">
        <set-password @setTo="toSet" :info="empInfo"></set-password>
      </div>
    </div>
  </div>
</template>
<script>
import infoAvatar from "@/components/personal/setAccount/info";
import setPhone from "@/components/personal/setAccount/setPhone";
import setPassword from "@/components/personal/setAccount/setPassword";
import { mapState } from "vuex";
import * as CodeMsg from "@/api/common/CodeChange"
import { closeTop } from "@/util/close-top.js"
import { getNewEmpDetail,checkNickname,setNickname,getWxUrl,myWxBind,myWxUnBind } from "@/api/admin/user";
export default {
  components: {
    setPhone,
    setPassword,
    infoAvatar
  },
  data() {
    return {
      bindVisible: false,
      qrcodeImg: "",
      btnStatus:true,
      nickForm:{
        nickName:""
      },
      dialogVisible:false,
      empInfo: {},
      status: "0",
      nickRules:{nickName: [{required: true,message: "请输入",trigger: "change"}],},
      rules: {
        id: [{required: true,message: "",trigger: "blur"}],
        name: [{required: true,message: "",trigger: "blur"}],
        telephone: [{required: true,message: "",trigger: "blur"}],
        password: [{required: true,message: "",trigger: "blur"}]
      },
      code: '',
      obj: {},
      bindWxFlag: null
    };
  },
   watch: {
    $route: {
      handler(val) {
        if(val.query.code){
          this.code = val.query.code 
          this.addBind()
          // let newQuery = JSON.parse(JSON.stringify(val.query))
          // delete newQuery.code
          // // closeTop("/personal/setAccount")
          // this.$router.replace({query:{newQuery}})
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      lockPasswd: state => state.user.lockPasswd
    })
  },
  methods: {
    openDialog(){
      this.btnStatus = true
      this.dialogVisible = true
      this.nickForm.nickName = this.empInfo.nickname
    },
    setName(){
      this.$refs["nickForm"].validate((valid)=>{
         if(valid){
           let params = {
           username:this.empInfo.username,
           nickname:this.nickForm.nickName
        }
        setNickname(params).then(res=>{
         if(res.data.code == CodeMsg.CODE_0){
              this.$message({
                type: "success",
                message: "修改成功！",
                offset: 300,
                duration: 1000
              })
             this.dialogVisible = false
             this.getUserData()
            }
           })
          }
        })
    },
    checkName(){
      checkNickname(this.nickForm.nickName).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.btnStatus = true
        }else if(res.data.code == 1){
          this.btnStatus = false
          this.$message({
            type:"warning",
            message:res.data.msg,
            offset: 300,
            duration: 1000
          })
        }
      })
    },
    getUserData() {
      getNewEmpDetail().then(res => {
        this.empInfo = res.data.data;
        this.nickForm.nickName = this.empInfo.nickname
        this.bindWxFlag = this.empInfo.bindWxFlag
      });
    },
    toSet() {
      this.status = "0";
      this.getUserData();
    },
    // 微信绑定
    openBindingWindow(){
      this.getWxUrl()      
    },
    // 微信解绑
    openUnbindingWindow() {
        this.$confirm('解除绑定后，将无法使用该微信扫码登录', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          confirmButtonClass: 'mar-left',
          cancelButtonClass: 'mar-right',
          center: true
        }).then(() => {
          this.delBind()
        }).catch(() => {
         
        });
    },
    // 获取二维码
    getWxUrl(){
      getWxUrl({type: 2}).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.qrcodeImg = res.data.data
          this.bindVisible = true
        }
      })
    },
    addBind(){
      let params = {
        code: this.code,
      }
      closeTop("/personal/setAccount")
      myWxBind(params).then(res => {
        if(res.data.code != CodeMsg.CODE_0){
          this.$message({
            type: 'warning',
            message: res.data.msg,
            offset: 300,
            duration: 1000
          })
         return false
        }
        this.$message({
          type: 'success',
          message: '绑定成功',
          offset: 300,
          duration: 1000
        })
        this.getUserData()
      })
    },
    // 解绑
    delBind(){
      myWxUnBind().then(res=>{
        if(res.data.code != CodeMsg.CODE_0){
          this.$message({
            type: 'warning',
            message: res.data.msg,
            offset: 300,
            duration: 1000
          })
          return false
        }
        this.$message({
          type: 'success',
          message: '解绑成功',
          offset: 300,
          duration: 1000
        })
        this.getUserData();
      })
    },
    // 关闭弹窗时
    handleClose(){
      this.dialogVisible = false;
    },
    handleCloseWx(){
      this.bindVisible = false
    },
  },
  created(){
    
  },
  mounted() {
    this.getUserData();
  },
  destroyed(){
  }
};
</script>
<style scoped>
.set_account{
  background:#fff;
  height:100%;width:100%;
  margin-top:-20px;
  margin-left:10px;
}
.modify {
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 600px;
}
.modify-head {
  position: relative;
  margin-left: 180px;
  margin-bottom: 25px;
}
.modify-head h3 {
  margin-left: -150px;
}
.img_avatar {
  margin-left: 25px;
  margin-bottom: -55px;
}
.modify-input span {
  margin-left: 15px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}
.modify-input span:hover {
  color: #3d85dcff;
  text-decoration: underline;
}
.modify-input .desc {
  color: #666666;
  height: 20px;
  line-height: 20px;
  margin-bottom: -15px;
  font-size: 12px;
}
.update_head {
  cursor: pointer;
  width: 100px;
  height: 30px;
  background: #3d85dc;
  text-align: center;
  line-height: 30px;
  border-radius: 3px;
  color: #fff;
  font-size: 14px;
  margin-top: 15px;
}
.update-btn-sty{
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.update-one-sty{
  width:260px;
}
.update-two-sty{
  margin-left:30px;
}
.update-three-sty{
  margin-bottom:25px;
}
.update-four-sty{
  width:200px;
}
.update-five-sty{
  margin-right:30px;
}
.update-six-sty{
  margin-top:30px;
  width:110%;
  margin-left:60px;
}
.wx-icon-sty{
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 2px;
}
.bind-icon-item{
  display: inline-block;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  vertical-align: middle;
}
.spanSty1 {
  color:#3DA1FF;
  margin-left: 8px !important;
  vertical-align: middle;
}
.spanSty2 {
  color: #999999;
  margin-left: 8px !important;
  vertical-align: middle;

}
.bind-link{
  margin-left: 5px;
  line-height: 24px;
}
.qr-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-text {
  text-align: center;
  font-size: 16px;
  color: #000;
}
.img-sty {
  width: 100%;
  margin-top: -20px;
}
</style>
<style>
  .mar-left {
    margin-top: 15px !important;
    margin-left: 35px !important;
  }
  .mar-right {
    margin-top: 15px !important;
    margin-right: 35px !important;
  }
</style>