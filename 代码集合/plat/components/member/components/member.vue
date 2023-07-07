<template>
  <div class="member_info">
    <div class="info_detail">
      <div class="detail_head" v-if="accountId&&accountId!==null">
        <img class="detail_head_img" v-if="userInfo.imgUrl!=''" :src="userInfo.imgUrl" alt="" />
        <img class="detail_head_img" v-else src="~/assets/images/home/header_center@2x.png" alt="" />
        <img class="auth_success" v-if="certificationStatus == 0" src="@/assets/images/member/certify_disabled.png" alt="">
        <img class="auth_success" v-if="certificationStatus != 0 && certifiedType == 1" src="@/assets/images/certified_unit_low.png" alt="">
        <img class="auth_success" v-if="certificationStatus != 0 && certifiedType == 2" src="@/assets/images/certified_unit.png" alt="">
      </div>
      <div class="detail_head" v-else>
        <img class="detail_head_img" src="~/assets/images/home/header_center@2x.png" alt="" />
      </div>
      <div class="detail_desc">
        <div class="desc_top">
          <span> 您好，</span>
          <span class="user-name">
            {{ userInfo.username }}
          </span>
          <span>！</span>
          <i class="el-icon-edit edit" @click="$router.push('/member/account')"></i>
        </div>
        <div>登陆账号：{{ userInfo.mobile }}</div>
        <div class="auth-name" v-if="userInfo.authStatus == 1">
          <img class="auth" v-if="certificationStatus != 0 && certifiedType == 1" src="@/assets/images/certified_unit_low.png" alt="">
          <img class="auth" v-if="certificationStatus != 0 && certifiedType == 2" src="@/assets/images/certified_unit.png" alt="">
          <p>{{ userInfo.userType == 1 ? userInfo.personName : userInfo.companyName }}</p>
        </div>
        <div class="unlogin-sty" v-else @click="goauthentication()">
          <span class="circle-sty"></span>
          <span class="unlogin-color">未认证，去认证</span>
        </div>
        <!-- <div>账户类型：{{ userInfo.userType | typeFilter }}</div> -->
        <!-- <div class="set_btn" @click="$router.push('/member/account')">修改资料</div> -->
      </div>
    </div>
    <div class="ordertitle">我的订单</div>
    <div class="tabs">
      <div :class="isSelect == 0 ? 'select' : 'tab-item'" @click="changeSelect(0)">服务产品</div>
      <div :class="isSelect == 1 ? 'select1' : 'tab-item'" @click="changeSelect(1)">卧涛文档</div>
    </div>
    <div class="info_collect">
       <myorder v-if="isSelect == 0"/>
       <myfile v-else/>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from "@/api/login";
import myorder from './myorder/index.vue';
import myfile from './myfile/index.vue';

export default {
  components: {
    myorder,
    myfile
  },
  head() {
    return {
        title: this.metaTitle,
    };
  },
  data() {
    return {
      accountId:null,
      metaTitle:"会员中心",
      cdnPath:process.env.CDN_BASE_URL,
      userInfo: {
        imgUrl: '',
      },
      mouseOver: true,
      certificationStatus:'',
      certifiedType: null,
      isSelect: 0,
    };
  },
  filters: {
    typeFilter(value) {
      return value == 2 ? "单位" : value == 1 ? "个人" : "未知"
    },
    changeInfo(value) {
      if (value) {
        var reg = /^(\d{3})\d*(\d{4})$/;
        var str = value.replace(reg, "$1****$2");
        return str;
      }
    },
  },
  methods: {
    changeSelect(val) {
      this.isSelect = val
    },
    goauthentication(){
      window.open('/member/authentication','_self');
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.data.code == 0) {
          console.log(this.cdnPath+res.data.data.diyLogoUrl)
          let userObj = res.data.data
          this.userInfo = userObj
          this.accountId = userObj.accountId
          this.certificationStatus = userObj.authStatus;
          this.certifiedType = userObj.certifiedType
          this.userInfo.imgUrl = userObj.diyLogoUrl == undefined ? '' : this.cdnPath + userObj.diyLogoUrl;
          localStorage.setItem('userInfo', JSON.stringify(userObj));
        }
      });
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>

<style scoped lang="stylus">
.ordertitle{
    width: 950px;
    height: 53px;
    border-radius: 6px;
    margin-bottom: 13px;
    font-weight: 700;
    font-size: 18px;
    color: #ffffff;
    padding-left: 30px;
    line-height:53px;
    background: url('~assets/images/person/wodedingdan_beijing@2x.png') no-repeat center/contain;
}
.info_detail {
  width: 950px;
  height: 180px;
  background: #ffffff;
  opacity: 1;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.detail_head {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 40px 40px 40px 30px;
  /* overflow: hidden; */
  position: relative;
}
.detail_head_img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.detail_desc {
  width: 207px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.detail_desc div {
  color: #86898b;
  font-size: 14px;
}
.detail_desc > div:nth-of-type(2) {
  margin: 10px 0 10px 0px;
}
.set_btn {
  width: 120px;
  height: 28px;
  border: 1px solid #36a6fe;
  opacity: 1;
  border-radius: 4px;
  color: #36a6fe !important;
  text-align: center;
  font-size: 14px;
  line-height: 26px;
  cursor: pointer;
}
.info_collect {
  width: 950px;
  min-height: 682px;
  background: #ffffff;
  opacity: 1;
  border-radius: 4px;
  font-size: 16px;
  overflow: hidden;
}
.collect_title {
  color: #373d40;
  font-weight: 400;
  margin: 20px 0px 10px 20px;
  font-weight: bold;
}
.collect_tab {
  width: 910px;
  height: 40px;
  margin-left: 20px;
  border-bottom: 2px solid #ebebeb;
  opacity: 1;
  display: flex;
  color: #656565;
  font-size: 14px;
  justify-content: flex-start;
  align-items: center;
}
.collect_tab > span {
  padding: 10px 10px;
  display: inline-block;
  cursor: pointer;
}

.tab_color {
  border-bottom: 2px solid #36a6fe !important;
}
.collect_content {
  margin-top: 20px;
}
.project_collect {
  display: grid;
  grid-template-columns: repeat(4,233px);
  justify-content: space-between;
}
.more_collect {
  width: 64px;
  height: 15px;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  color: #a8a8a8;
  opacity: 1;
  margin: 20px auto;
  margin-bottom: 5px;
  cursor: pointer;
}
.no_data{
  width: 100%;
  text-align: center;
  color: #999999;
  margin-top: 240px;
}
.subject_over{
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.desc_top{
  display: flex;
  justify-content: center;
  align-items: center;
}
.desc_top>span:nth-of-type(1){
  width: 42px;
  display: flex;
}
.auth_success{
  position: absolute;
  width: 25px;
  height: 25px;
  top: 72px;
  right: 0px;
  background: #FFFFFF;
  border-radius: 50%;
}
.del-box{
    background #FFFFFF
    position fixed
    top 25%
    left 35%
    z-index 9999
    width 458px
    padding-bottom 16px
    border-radius 5px
    color #333333
    overflow hidden
    .del-title{
      font-size 20px
      line-height 58px
      background #eef5f8
      text-align center
    }
    .del-content{
      font-size: 16px
      text-align: center
      padding 40px 60px
    }
    .del-btn{
      margin-left 112px
      text-align center
      display flex
      .cancel-del-btn{
        width 102px
        height 40px
        margin-right 20px
        border-radius 3px
        font-size 16px
        line-height 40px
        text-align center
        color #FFFFFF
        background #36A6FE
        cursor pointer
      }
      .confirm-del-btn{
        color #666
        background rgb(224,242,251)
      }
    }
  }
  .del-box img{
    width 16px
    height 16px
    position absolute
    right 21px
    top 21px
    cursor pointer
  }
  .user-name{
    color: #36a6fe
  }
  .edit{
    cursor: pointer;
    margin-left: 10px;
  }
  .auth{
    width: 20px;
    height: 20px;
  }
  .auth-name{
    display: flex;
    line-height: 20px;
    height: 20px;
  }
  .auth-name p{
    margin-left: 5px;
  }
  
.unlogin-sty{
  width: 120px;
  height: 23px;
  background: linear-gradient(90deg,#f8fcff 23%, #f1f3f3 100%);
  border: 0.5px solid #e5edf3;
  border-radius: 12.5px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-left: 6px;
  cursor: pointer;
  margin-top: 8px;
}
.unlogin-color{
  color: #5AA8EF;
  font-size: 12px;
  margin-left: 5px;
  margin-bottom: 2px;
}
.circle-sty{
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #fb846b;
  border-radius: 50%;
  margin-bottom: 2px;
}
.tabs{
  display: flex;
  width: 100%;
  background: #f3fbfe;
  height: 38px;
  border-radius: 6px 6px 0px 0px;
  font-size: 14px;
}
.select{
  width: 150px;
  height: 38px;
  background: #36a6fe;
  border-radius: 6px 0px 0px 0px;
  text-align: center;
  color: #fff;
  line-height: 38px;
  cursor: pointer;
}
.select1{
  width: 150px;
  height: 38px;
  background: #36a6fe;
  text-align: center;
  color: #fff;
  line-height: 38px;
  cursor: pointer;
}
.tab-item{
  width: 150px;
  height: 38px;
  text-align: center;
  color: #666;
  line-height: 38px;
  cursor: pointer;
}
</style>