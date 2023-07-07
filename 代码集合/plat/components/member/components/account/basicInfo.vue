<template>
    <div class="main_content">
        <div v-if="authStatus==1" class="accountStyle">
            账户主体：
            <el-button v-if="userInfo.userType==2" type="primary" size="small"  plain class="btn" disabled>单位</el-button>
            <el-button v-if="userInfo.userType==1" type="primary" size="small"  plain class="btn" disabled>个人</el-button>
            <div class="attestation-low" v-if="userInfo.certifiedType == 1">初级认证</div>
            <div class="attestation-high" v-if="userInfo.certifiedType == 2">高级认证</div>
        </div>
      <div class="tab_head">
        <span></span>
        <span v-if="authStatus==0">基本信息</span>
        <span v-else>单位信息</span>
      </div>
      <div class="main_head">
        <span>头像：</span>
        <span>
          <up-img :url="unitForm.unitLogoUrl" ref="avatar" @on-change="changeImage"></up-img>
        </span>
        <span>
        <el-button type="primary" size="small" @click="openAvatar">上传头像</el-button>
        <p class="tip">建议尺寸100*100px，支持jpg、jpeg、gif、png格式，大小不超过2M</p>
        </span>
      </div>
      <el-form :model="unitForm" ref="unitForm" size="medium" label-width="120px" :rules="rules">
        <el-form-item label="单位名称：" prop="unitName">
          <el-input maxlength="50" v-model.trim="unitForm.unitName"  class="wid1" placeholder="请填写单位名称" :disabled="!judge(companyName)"></el-input>
        </el-form-item>
        <el-form-item label="单位类型：" prop="unitType">
          <el-select v-model="unitForm.unitType"   class="wid1" placeholder="请选择单位类型" @change="changeType">
            <el-option v-for="(item,index) in unitTypeSelect" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业类型：" prop="industryType">
         <el-select :multiple-limit="3" :multiple="true" v-model="unitForm.industryType" class="wid1" placeholder="请选择行业类型" @change="showIndustry">
          <el-option v-for="(item,index) in industryTypeSelect" :key="index" :label="item.name" :value="item.id"></el-option>
         </el-select>
        </el-form-item>
         <el-form-item label="所在地：" prop="area">
           <el-cascader v-model="unitForm.area"   class="wid1" :options="areaOptions" placeholder="请选择所在地" :props="{ value: 'id', label: 'areaName'}" @change="handleChange"></el-cascader>
        </el-form-item>
      <div class="tab_head">
        <span></span>
        <span>授权人信息</span>
          <span class="attestation-low" v-if="userInfo.authorizedType == 1">初级授权</span>
          <span class="attestation-high" v-if="userInfo.authorizedType == 2">高级授权</span>
        <span class="editStyle" v-if="authStatus==1">若需修改信息请至账号信息页进行修改</span>
      </div>
        <el-form-item label="姓名：" prop="contactMan"> 
          <el-input v-if="authStatus==0" maxlength="50" v-model.trim="unitForm.contactMan" class="wid1" placeholder="需要您提前认证个人信息" disabled></el-input>
          <el-input v-else maxlength="50" v-model.trim="unitForm.contactMan" class="wid1" placeholder="请填写联系人姓名" disabled></el-input>
          <el-button v-show="authStatus==0" type="primary" size="small" @click="toConfirm" plain class="btn">去认证</el-button>
        </el-form-item>
        <el-form-item v-if="unitForm.phone!=''" label="手机号码：" prop="phone">
          <el-input  disabled v-model.trim="unitForm.phone" class="wid1" placeholder="请填写联系人号码"></el-input>
        </el-form-item>
         <el-form-item label="职务：" prop="job">
          <el-input maxlength="50" v-model.trim="unitForm.job" class="wid1" placeholder="请填写联系人职务"></el-input>
        </el-form-item>
        <el-button type="primary" size="medium" class="perserve" @click="updateBasic">保 存</el-button>
      </el-form>
    </div>
</template>

<script>
import { setInfo,getSelectData,getAreaList,getUserDetail,uploadUrl,updateBaseInfo} from "@/api/member"
import userAvatar from "@/components/member/userAvatar";
import upImg from "@/components/member/upImg";
import * as CodeMsg from "@/api/CodeChange"
export default {
//   props:['unitForm'],
  components:{
    userAvatar,
    upImg
  },
    data(){
        return{
          unitTypeName:"",
          industryTypeName:[],
          areaName:"",
          params:"",
          unitTypeSelect:[],
          industryTypeSelect:[],
          saleCountSelect:[],
          unitCountSelect:[],
          areaOptions:[],
          imgFile:null,
          userVO:{
              unitVO:{}
          },
          unitForm:{
            unitLogoUrl:require("@/assets/images/home/header_center@2x.png"),
            unitName:"",
            unitType:"",
            industryType:"",
            area:"",
            contactMan:"",
            phone:"",
            job:""
          },
          authStatus:null,
          userInfo:{},
          companyName:"",
      rules:{
          unitName: [ { required: true, message: '请填写单位名称', trigger: 'change',pattern: /^(?:[\u4E00-\u9FFF]{1,8}·\u4E00-\u9FFF]{1,8})|(?:[\u4E00-\u9FFF]{2,5})$/ }],
          unitType: [ { required: true, message: '请选择单位类型', trigger: 'change' }],
          industryType: [ { required: true, message: '请选择行业类型', trigger: 'change' }],
          area: [ { required: true, message: '请选择所在地', trigger: 'change' }],
          phone: [ { required: true, message: '请填写联系人号码', trigger: 'change' }],
          job: [ { required: true, message: '请填写联系人职务', trigger: 'change'}],
        },
        cdnPath:process.env.CDN_BASE_URL,
      }
    },
    methods:{
      changeType(val){
       this.unitTypeSelect.forEach(item => {
         if(item.id == val){
           this.unitTypeName = item.name
         }
       })
      },
      handleChange(val){
        console.log(val)
      },
      showIndustry(val){
        console.log(val)
      },
      toConfirm(){
        this.$router.push('/member/authentication')
      },
      getAreaSelect(){
        getAreaList().then(res=>{
           this.areaOptions = res.data.data
        })
      },
      toSet(){
        this.$emit('to-safe',0)
      },
      refresh(){
          this.$emit('refresh')
      },
      openAvatar(){
        this.$refs.avatar.uploadHeadImg()
      },
      changeImage(imgs) {
        let imgFile = this.base64ImgtoFile(imgs);  
        if((imgFile.size/1024)<=2000){
            this.unitForm.unitLogoUrl = imgs;
            this.unitForm.logoBase64 = imgFile;
        }else{
            this.$message({
              type:'warning',
              message:"头像大小超过2M，请重新选择！",
              offset:300,
              duration: 2000
            })
        }
        this.uploadAvatar()
      },
     base64ImgtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    },
      getSelect(){
        getSelectData('unittype').then(res=>{
           this.unitTypeSelect = res.data.data;
        })
        getSelectData('lastyearssales').then(res=>{
           this.saleCountSelect = res.data.data;
        })
        getSelectData('numberofunits').then(res=>{
           this.unitCountSelect = res.data.data;
        })
        getSelectData('industrytype').then(res=>{
           this.industryTypeSelect = res.data.data;
        })
      },
      uploadAvatar(){
          let params = new FormData();
          params.append("file", this.unitForm.logoBase64);
          uploadUrl(params).then(res=>{
              if(res.data.code != 0){
                  this.$message({
                    type:"warning",
                    message:"上传图像失败！",
                    offset:300,
                    duration: 2000
                })
                return false;
              }
          }).catch(error=>{
              console.log(error)
          })
      },
      setUser(){
        this.$refs['unitForm'].validate(val=>{
          if(val){
            let params = {
                accountId: this.userInfo.accountId,//主键ID
                diyIndustry: this.unitForm.industryType.join(','),
                diyOrgAddress:this.unitForm.area.join(','),
                diyOrgName: this.unitForm.unitName,
                diyOrgType: this.unitForm.unitType,
                job: this.unitForm.job,
                userId: this.userInfo.userId//关联用户主体ID
            };
            updateBaseInfo(params).then(res=>{
              if(res.data.code != CodeMsg.CODE_0){
                if(res.data.code == 10002){
                  localStorage.removeItem('userInfo');
                  location.href = "/login";
                }else{
                  this.$message({
                    type:"warning",
                    message:res.data.msg,
                    offset:300,
                    duration: 2000
                  })
                }
                return false
              }
              this.$message({
                type:"success",
                message:"保存成功！",
                offset:300,
                duration: 2000
              })
              this.toSet()
            })
          }
        })
      },
      updateBasic(){
            this.setUser()
      },
      getUserInfo(){
          getUserDetail().then(res=>{
            if(res.data.code != CodeMsg.CODE_0){
              if(res.data.code == 10002){
                localStorage.removeItem('userInfo');
                location.href = "/login";
              }else{
                this.$message({
                  type:"warning",
                  message:res.data.msg,
                  offset:300,
                  duration: 2000
                })
              }
              return false
            }
            this.userInfo = res.data.data;
            this.unitForm.phone = res.data.data.mobile;
            this.authStatus = res.data.data.authStatus;
            if(this.judge(res.data.data.diyLogoUrl)){
              this.unitForm.unitLogoUrl = require("@/assets/images/home/header_center@2x.png");
            }else{
              this.unitForm.unitLogoUrl = this.cdnPath + res.data.data.diyLogoUrl
            }
            if(this.userInfo.userType == 2){
              this.companyName = res.data.data.companyName;
              this.unitForm.unitName = res.data.data.companyName;
            }else{
              this.unitForm.unitName = res.data.data.diyOrgName;
            }
            this.unitForm.contactMan = res.data.data.personName;
            this.unitForm.job = res.data.data.job;
            this.unitForm.unitType =  res.data.data.diyOrgType;
            this.unitForm.industryType = res.data.data.diyIndustry.split(",").map(Number);
            this.unitForm.area = res.data.data.diyOrgAddress.split(",").map(Number);
          })
      },
      // 修改授权人信息
      toModify(){
        this.$router.push('/member/auth-info');
      },
      judge(value){
        if(value == ''|| value == null || value == undefined){
          return true;
        }
        return false;
      }
    },
    computed:{
      certification(){
        return this.$store.state.userInfo.certificationStatus == '0'
      }
    },
    mounted(){
      this.getSelect()
      this.getAreaSelect()
      this.getUserInfo()
    },
}
</script>

<style scoped>
.main_head {
  height: 108px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 35px 0 30px 0;
  margin-left: 38px;
}
.main_head > span:nth-of-type(1) {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  margin-right: 20px;
}
.main_head > span:nth-of-type(2) {
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 0px;
}
.main_head > span:nth-of-type(3) {
  margin-left: 30px;
}
.main_head img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.tab_head {
  margin-top: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 400;
  margin-bottom: 30px;
  margin-left: 20px;
}
.tab_head > span:nth-of-type(1) {
  display: inline-block;
  width: 6px;
  height: 18px;
  background: #3d85dc;
  opacity: 1;
  border-radius: 5px;
}
.tab_head > span:nth-of-type(2) {
  font-size: 16px;
  color: #373d40;
  margin-left: 12px;
  margin-right: 8px;
}
.btn {
  margin-left: 25px;
}
.accountStyle {
  font-size: 14px;
  color: #606266;
  margin-left: 38px;
  margin-top: 30px;
  display: flex;
  align-items: center;
}
.editStyle {
    margin-left: 10px;
    display: inline-block;
    height: 18px;
    line-height: 18px;
    color: #409EFF;
}
.main_content {
    padding-bottom: 50px;
}
.tip {
  font-size:14px;
  color:#A8A8A8;
  margin-top:10px;
}
.main_content .wid1 {
  width:300px !important;
}
.perserve {
  width:100px;
  margin:20px 0 0 220px;
}
.attestation-low{
  display: inline-block;
  width: 68px;
  height: 24px;
  background: #e2860f;
  border-radius: 12px;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  font-weight: 700;
  text-align: center;
  margin-left: 10px;
}
.attestation-high{
  display: inline-block;
  width: 68px;
  height: 24px;
  border-radius: 12px;
  background: #0f54e2;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  line-height: 24px;
  text-align: center;
  margin-left: 10px;
}
</style>