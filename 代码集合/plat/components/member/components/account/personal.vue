<template>
     <div class="main_content">
      <div class="main_head">
        <span>上传头像：</span>
        <span>
        <up-img :url="unitForm.unitLogoUrl" ref="avatar" @on-change="changeImage"></up-img>
        </span>
        <span>
        <el-button type="primary" size="small" @click="openAvatar">上传头像</el-button>
        <p style="font-size:14px;color:#A8A8A8;margin-top:10px;">建议尺寸100*100px，支持jpg、jpeg、gif、png格式，大小不超过2M</p>
        </span>
      </div>
      <el-form :model="unitForm" ref="unitForm" size="medium" label-width="120px" :rules="rules">
        <el-form-item label="姓名：" prop="contactMan">
          <el-input maxlength="50" v-model="unitForm.contactMan" :disabled="unitForm.accountStatus == '1'" style="width: 200px" placeholder="请填写联系人姓名"></el-input>
        </el-form-item>
         <el-form-item label="职务：">
          <el-input maxlength="50" v-model="unitForm.jobTitle" style="width: 400px" placeholder="请填写联系人职务，如业务经理、市场经理等"></el-input>
        </el-form-item>
        <el-form-item label="单位名称：" prop="unitName">
          <el-input maxlength="50" v-model="unitForm.unitName" style="width: 300px" placeholder="请填写单位名称"></el-input>
        </el-form-item>
        <el-form-item label="单位类型：" prop="unitType">
          <el-select v-model="unitForm.unitType" style="width: 200px" placeholder="请选择">
           <el-option v-for="(item,index) in unitTypeSelect" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业类型：" prop="industryType">
         <el-select :multiple="true" :multiple-limit="3" v-model="unitForm.industryType" style="width: 500px" placeholder="请选择">
           <el-option v-for="(item,index) in industryTypeSelect" :key="index" :label="item.name" :value="item.id"></el-option>
         </el-select>
        </el-form-item>
         <el-form-item label="所在地：" prop="area">
          <el-cascader v-model="unitForm.area" style="width: 260px" :options="areaOptions" placeholder="请选择" :props="{ value: 'id', label: 'areaName'}" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input  maxlength="100" v-model="unitForm.detailArea" style="width: 500px" placeholder="请填写单位详细地址"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input disabled v-model="unitForm.phone" style="width: 300px" placeholder="请填写联系人号码"></el-input>
          <el-button style="margin-left:20px;" type="primary" @click="toSet">换绑</el-button>
        </el-form-item>
        <el-button type="primary" size="medium" style="width:100px;margin:20px 0 0 220px;" @click="setUser">保 存</el-button>
      </el-form>
    </div>
</template>
<script>
import { setInfo, getSelectData,getAreaList } from "@/api/member";
import userAvatar from "@/components/member/userAvatar";
import upImg from "@/components/member/upImg";
export default {
  props:['unitForm'],
  components: {
    userAvatar,
    upImg
  },
  data() {
    return {
      params: "",
      unitTypeSelect: [],
      industryTypeSelect: [],
      imgFile: null,
      userVO: {
        expertVO: {},
      },
      areaOptions:[],
      rules: {
        contactMan: [{ required: true, message: "请填写", trigger: "change" }],
        unitName: [{ required: true, message: "请填写", trigger: "change" }],
        unitType: [{ required: true, message: "请选择", trigger: "change" }],
        industryType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        area: [{ required: true, message: "请选择", trigger: "change" }],
        phone: [{ required: true, message: "请填写", trigger: "change" }],
      },
    };
  },
  methods: {
     handleChange(val){
        console.log(val,"输出地区选择数据")
      },
      getAreaSelect(){
        getAreaList().then(res=>{
           this.areaOptions = res.data.data
        })
      },
    toSet(){
        this.$emit('to-safe')
      },
     refresh(){
           this.$emit('refresh')
       },
    openAvatar() {
      this.$refs.avatar.uploadHeadImg();
    },
      changeImage(imgs) {
      let imgFile = this.base64ImgtoFile(imgs);  
      console.log(imgFile,"输出头像")    
      if((imgFile.size/1024)<=2000){
       this.unitForm.unitLogoUrl = imgs;
       this.unitForm.logoBase64 = imgFile;
      }else{
        this.$message({
          type:'warning',
          message:"头像大小超过2M，请重新选择！",
          offset:300
        })
      }
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
        type: mime,
      });
    },
    setUser() {
      this.$refs["unitForm"].validate((val) => {
        if (val) {
          console.log(this.unitForm.logoBase64,"imgfile")
          this.params = new FormData();
          this.params.append("accountType", 0);
          this.params.append("id", this.unitForm.id);
          if(this.unitForm.logoBase64 != null){
            this.params.append("portraitUrlFile", this.unitForm.logoBase64);
          }
          //------userVO
          this.userVO.name = this.unitForm.contactMan;
          this.userVO.orgName = this.unitForm.unitName;
          this.userVO.orgType = this.unitForm.unitType;
          this.userVO.job = this.unitForm.jobTitle;
          this.userVO.industry = this.unitForm.industryType.join(',');
          this.userVO.orgAddress = this.unitForm.area.join(',');
          this.userVO.orgDetailAddress = this.unitForm.detailArea;
          this.userVO.accountId = this.unitForm.accountId;
          //------userVO.unitVO
          this.userVO.expertVO.userId = this.unitForm.userId;
          this.params.append("userVOJson", JSON.stringify(this.userVO));
          setInfo(this.params).then((res) => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "保存成功！",
                offset:300
              });
              // this.refresh()
            }
          });
        }
      });
    },
    getSelect() {
      getSelectData('unittype').then((res) => {
        this.unitTypeSelect = res.data.data;
      });
      getSelectData('industrytype').then((res) => {
        this.industryTypeSelect = res.data.data;
      });
    },
  },
  mounted() {
    this.getSelect();
    this.getAreaSelect()
  },
};
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
</style>