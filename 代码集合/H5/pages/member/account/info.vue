<template>
  <div class="main wrap" :style="{'height': pageHeight + 'px'}">
    <!-- 头部信息 -->
    <mt-header title="基本信息" :shadow = shadow />
    <!-- 列表使用 -->
    <!-- 账户类型 -->
    <div class="cell">
      <mt-cell
        title="账户类型"
         v-if="info.userType == 1 || info.userType == 2"
      >
      <span class="disabledText">{{info.userType == 1 ? '个人' : '单位'}}</span>
        <img slot="icon" :src="imgURL" />
      </mt-cell>
      <div class="block">
        <span>单位信息</span>
      </div>
      <!-- 个人头像 -->
        <mt-cell title="头像">
          <img slot="icon" :src="imgURL"/>
          <span style="margin-right: 25px">
            <client-only>
              <user-avatar
                :url="unitLogoUrl"
                ref="avatar"
                @on-change="changeImage"
              ></user-avatar>
            </client-only>
          </span>
          
        </mt-cell>
      <!-- 单位名称 -->
        <mt-cell title="单位名称">
          <span class="disabledText" v-if="info.companyName">
            {{account.companyName}}
          </span>
          <input
            v-else
            type="text"
            style="padding: 0 0.5rem"
            placeholder="请填写小于50字的单位名称"
            maxlength="50"
            v-model="account.companyName"
            class="input_right"
            :readonly="info.certificationStatus==1?true:false"
          />
          <img slot="icon" :src="imgURL" />
        </mt-cell>
      <div class="error" v-if="error.dwmc">请填写单位名称</div>
      <!-- 单位类型 -->
      <mt-cell
        title="单位类型"
        is-link
        :value="orgType"
        @click.native="visible.orgType = true"
      >
        <img slot="icon" :src="imgURL" />
      </mt-cell>
      <div class="error" v-if="error.dwlx">请填写单位类型</div>
      <!-- 行业类型 -->
      <mt-cell
        title="行业类型"
        is-link
        :value="account.industryName"
        @click.native="visible.worType =true"
      >
        <img slot="icon" :src="imgURL" />
      </mt-cell>
      <div class="error"  v-if="error.hylx">请填写行业类型</div>
      <mt-cell
        title="所在地区"
        is-link
        :value="account.orgAddressName"
        @click.native="visible.region =true"
      >
        <img slot="icon" :src="imgURL" />
      </mt-cell>
      <div class="error" v-if="error.szdq">请填写所在地区</div>
      <div class="block">
        <span>授权人信息</span>
      </div>
      <!-- 联系人 -->
      <div class="cee margin_top" v-if="account.accountName != '个人'">
        <!-- <img slot="icon" style="margin-right: -5px" :src="imgURL" /> -->
        <div class=" field input_icon">
          <span style="width: 2rem">姓名</span>
          <span style="font-size: 0.35rem" v-if="info.authStatus == 0">
            <span style="color: #999">需要您提前认证个人信息</span>
            <span class="goConfirm" @click="toConfirm">去认证</span>
          </span>
          <span v-else>
            <span v-if="info.personName" class="disabledText">{{info.personName}}</span>
            <input
              v-else
              type="text"
              placeholder="请填写联系人姓名"
              maxlength="50"
              v-model="info.personName"
              class="input_right"
            />
          </span>
        </div>
      </div>
      <!-- 手机号码 -->
      <div class="cee margin_top">
        <img slot="icon" style="margin-right: -5px" :src="imgURL" />
        <div class=" field input_icon">
          <span style="width: 2rem">手机号码</span>
          <span style="font-size: 0.35rem; color: #999">{{account.mobile}}</span>
            <!-- <input
              type="text"
              placeholder="请输入手机号码"
              maxlength="11"
              v-model="info.mobile"
              class="input_right"
            /> -->
        </div>
      </div>
      <!-- <mt-cell
        title="手机号码"
        is-link
        to="/member/account/changePhoNum"
        :value="account.accountNo"
        @click="setUser"
      >
        <img slot="icon" :src="imgURL" />
      </mt-cell> -->
      <!-- 职务 -->
      <div class="cee margin_top" v-if="account.accountName != '个人'">
        <img slot="icon" style="margin-right: -5px" :src="imgURL" />
        <div class=" field input_icon">
          <span style="width: 2rem">职务</span>
          <input
              type="text"
              placeholder="请填写联系人职务，如业务经理"
              maxlength="50"
              v-model="account.job"
              class="input_right"
              style="color: #000"
            />
        </div>
      </div>
      <div class="error" v-if="error.zw">请填写职务</div>
      <div class="bottomInfo">
        若需修改第三方授权信息请到卧涛网页端进行修改
      </div>
    </div>
    <!-- 账户类型 poup -->
    <!-- <div v-if="visible.accountType">
      <mt-popup v-model="visible.accountType" position="bottom">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="visible.accountType = !visible.accountType" > 取消</div>
          <div class="usi-btn-sure" @click="accountSelectOk">确定</div>
        </div>
        <mt-picker
          class="picker"
          ref="refQIYE"
          value-key="name"
          :slots="accountSlots"
        ></mt-picker>
      </mt-popup>
    </div> -->
    <!-- 单位类型 poup-->
    <div v-if="visible.orgType">
      <mt-popup v-model="visible.orgType" position="bottom">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel"  @click="visible.orgType = !visible.orgType" >取消</div>
          <div class="usi-btn-sure" @click="orgSelectOk">确定</div>
        </div>
        <mt-picker
          class="picker"
          ref="refOrgType"
          value-key="name"
          :slots="orgslots"
        ></mt-picker>
      </mt-popup>
    </div>
    <!--行业类型 poup、、、、、 -->
    <div v-if="visible.worType" class="worStyle">
      <mt-popup v-model="visible.worType" position="bottom">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="visible.worType = !visible.worType" > 取消 </div>
          <div class="usi-btn-sure" @click="worSelectOk">确定</div>
        </div>
        <mt-checklist
          v-model="value"
          :options="options"  
          @change="checkon"
        >
        </mt-checklist>
      </mt-popup>
    </div>
    <!-- 上一年销售额popup -->
    <!-- <div v-if="visible.sale">
      <mt-popup v-model="visible.sale" position="bottom">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="visible.sale = !visible.sale">
            取消
          </div>
          <div class="usi-btn-sure" @click="saleSelectOk">确定</div>
        </div>
        <mt-picker
          class="picker"
          ref="refSale"
          value-key="name"
          :slots="saleSlots"
        ></mt-picker>
      </mt-popup>
    </div> -->
    <!-- 单位人数popup-->
    <!-- <div v-if="visible.emCount">
      <mt-popup v-model="visible.emCount" position="bottom">
        <div class="picker-toolbar-title">
          <div
            class="usi-btn-cancel"
            @click="visible.emCount = !visible.emCount"
          >
            取消
          </div>
          <div class="usi-btn-sure" @click="emSelectOk">确定</div>
        </div>
        <mt-picker
          class="picker"
          ref="refEm"
          value-key="name"
          :slots="emSlots"
        ></mt-picker>
      </mt-popup>
    </div> -->
    <!-- 地区选择popup-->
    <div v-if="visible.region">
      <mt-popup v-model="visible.region" position="bottom">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="visible.region = !visible.region">
            取消
          </div>
          <div class="usi-btn-sure" @click="addSelectOk">确定</div>
        </div>
        <mt-picker
          class="picker"
          ref="refRegion"
          value-key="name"
          :slots="addSlots"
          @change="onAddressChange"
        ></mt-picker>
      </mt-popup>
    </div>
    <div class="set-btn" @click="setUser()">提交修改</div>
  </div>
</template>
<script>
import { getDropdown, setInfo, getUserDetail } from "@/api/user";
import { getProvince1, uploadDiyLogoUrl } from "@/api/user";
import userAvatar from "@/components/common/userAvatar";
import { getUserInfo } from "@/api/login";
import mtHeader from '~/components/common/mtHeader'
export default {
  components: {
    userAvatar,
    mtHeader
  },
  layout: "empty",
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description",
        },
      ],
    };
  },
  data() {
    return {
      value: [],
      options: [],
      imgFile: null,
      unitLogoUrl: 'https://static.wotao.com/icon/head/d1f4aae31a3b464aa1cc4db3e2aee0ab.png',
      title: "基本信息",
      imgURL: require("@/assets/images/home/icon_account_required.png"),
      visible: {
        orgType: false,
        accountType: false,
        worType: false,
        sale: false,
        emCount: false,
        region: false,
      },
      error: {
        dwmc: false,
        dwlx: false,
        hylx: false,
        szdq: false,
        zw: false,
      },
      shadow:true,      
      account: {
        accountName: "",
        diyOrgType: "",
        industryName: "",
        orgAddressName: "",
        orgName: "",
        diyIndustry: "",
        diyOrgAddress: "",
        job: "", //职务
        mobile: "",
        userVO: {
          unitVO: {},
          expertVO: {},
        },
      },
      defaultIndex1: 1,
      cdnUrl: process.env.CDN_BASE_URL,
      id: "",
      userName: "",
      sale: "请选择", //销售额
      saleId: "",
      emCount: "请选择", //单位人数
      emCountId: "",
      addDtails: "", //详细地址
      accountType: "1", //账户类型
      accountId: "", //账户id
      userId: "", //个人用户id
      orgType: "请选择", //单位类型
      orgTypeId: "",
      orgName: "", //单位名称
      region: "请选择", //地区
      regionId: "",
      contactMan: "", //联系人姓名
      patentCount: "", //专利数量
      accountSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      saleSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      orgslots: [
        {
          flex: 1,
          values: [],
          defaultIndex: 0,
        },
      ],
      emSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      worSlots: [
        {
          flex: 1,
          values: [],
        },
      ],
      province: "北京市",
      city: "北京市",
      area: "东城区",
      proVal: "", //省地区
      addSlots: [
        {
          flex: 1,
          values: [], //省份数组
          className: "slot1",
          textAlign: "center",
          defaultIndex: 0,
        },
        {
          flex: 1,
          values: [],
          className: "slot2",
          textAlign: "center",
          defaultIndex: 0,
        },
        {
          flex: 1,
          values: [],
          className: "slot3",
          textAlign: "center",
          defaultIndex: 0,
        },
      ],
      regionInit: false, //禁止地区选择器自动初始化，picker组件会默认进行初始化，导致一进入页面就会默认选中一个初始3级地址
      info: {},
      pageHeight: 0,
    };
  },
  mounted() {
    this.pageHeight = document.documentElement.clientHeight
    this.info = JSON.parse(localStorage.getItem('userInfo'))
    this.getData();
  },
  methods: {
    toConfirm() {
      this.$router.push({
        path: "/member/authentication"
      })
    },
    checkon: function () {
      if ( this.value.length == 3) {
        this.options.forEach(item => {
          if (!this.value.includes(item.value)) {
            item['disabled'] = true
          }
        })
      } else {
        this.options.forEach(item => {
          item['disabled'] = false
        })
      }
      
    },

    showIndustry(val) {
      console.log(val);
    },
    openAvatar() {
      this.$refs.avatar.editCropper();
    },
    changeImage(imgs) {
      let imgFile = this.base64ImgtoFile(imgs);
      if ((imgFile.size /1024 /1024)<= 2) {
        this.unitLogoUrl = imgs;
        this.imgFile = imgFile;
        let params = new FormData();
        params.append("file", imgFile);
        uploadDiyLogoUrl(params).then(res => {
          if(res.data.code != 0){
            this.$message({
              type:"warning",
              message:"上传图像失败！",
              offset:300
            })
            return false;
          }
        }).catch(error=>{
          console.log(error)
        })
      } else {
        this.$message({
          type: "warning",
          message: "头像大小超过2M，请重新选择！",
          offset: 300,
        });
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
    // 账户类型下拉框确定
    accountSelectOk() {
      this.visible.accountType = false;
      this.account.accountName = this.$refs.refQIYE.getValues()[0].name;
      this.account.accountType = this.$refs.refQIYE.getValues()[0].id;
    },
    // 单位类型下拉框确定
    orgSelectOk() {
      this.visible.orgType = false;
      this.orgType = this.$refs.refOrgType.getValues()[0].name;
      this.account.diyOrgType = this.$refs.refOrgType.getValues()[0].id;
    },
    //行业类型下拉框确定
    worSelectOk() {
      this.visible.worType = false;
      this.account.diyIndustry = this.value.join(",");
      let nameList=[]
      this.value.forEach(item=>{       
        this.options.forEach(data=>{
          if(item==data.value){
           nameList.push(data.label)
          }
        })        
      })
      this.account.industryName = nameList.join(',')
    },
    //上一年下拉框确定
    saleSelectOk() {
      this.visible.sale = false;
      this.account.userVO.unitVO.orgSalesYear = this.$refs.refSale.getValues()[0].id;
      this.account.userVO.unitVO.orgSalesYearName = this.$refs.refSale.getValues()[0].name;
    },
    //员工人数下拉框确定
    emSelectOk() {
      this.visible.emCount = false;
      this.account.userVO.unitVO.orgEmployeesNumber = this.$refs.refEm.getValues()[0].id;
      this.account.userVO.unitVO.orgEmployeesNumberName = this.$refs.refEm.getValues()[0].name;
    },
    //地址下拉框确定
    addSelectOk() {
      this.visible.region = false;
      this.account.diyOrgAddress=this.region.map(item=>{
        if (item) return item.id
      }).join(',')
      this.account.orgAddressName=this.region.map(item=>{
        if (item) return item.name
      }).join(',')
    },
    // 地区联动选择插槽
    onAddressChange(picker, values) {
      if (!this.regionInit) {
        this.proVal.forEach((item, index) => {
          if(this.account.orgAddressName.includes(item.areaName)) {
            item.children.forEach((item, index) => {
              if (this.account.orgAddressName.includes(item.areaName)) {
                if (item.children) {
                  item.children.forEach((item, index) => {
                    if (this.account.orgAddressName.includes(item.areaName)) {
                    }
                  })
                }
              }
            })
          }
        })
        let city = this.proVal[values[0].index].children;
        let slots2 = [];
        let slots3 = [];
        //市
        if (city) {
          for (let i = 0; i < city.length; i++) {
            slots2.push({ id: city[i].id, name: city[i].areaName, index: i });
          }
        }
        picker.setSlotValues(1, slots2);
        //区
        if (values[1] ) {
          if (city[values[1].index]) {
            let area = city[values[1].index].children;
            if (area) {
              for (let i = 0; i < area.length; i++) {
                slots3.push({ id: area[i].id, name: area[i].areaName });
              }
            }
          }
          }
          
        if (!values[2]) {
          values.splice(2,1)
        }
        picker.setSlotValues(2, slots3);
      }
      this.region=values
    },
    //初始化信息
    getData() {
      if (this.info.diyLogoUrl) {
        this.unitLogoUrl = this.cdnUrl + this.info.diyLogoUrl
      }  
      if (this.info.job) {
        this.account.job = this.info.job
      }
      if (this.info.companyName) {
        this.account.companyName = this.info.companyName
      }
      if (this.info.diyOrgType) {
        this.account.diyOrgType = this.info.diyOrgType
      }
      if (this.info.diyOrgAddress) {
        this.account.diyOrgAddress = this.info.diyOrgAddress
      }
      if (this.info.mobile) {
        this.account.mobile = this.info.mobile
      }
      //获取地区选择省级数据
      getProvince1().then((res) => {
        this.proVal = res.data;
        let adressList = []
        this.account.orgAddressName = "请选择"
        this.proVal.forEach((item,i) => {
          this.addSlots[0].values.push({
            id: item.id,
            name: item.areaName,
            index: i,
          });
          if(this.info.diyOrgAddress.includes(item.id)) {
            this.addSlots[0].defaultIndex = i
            adressList.push(item.areaName)
            item.children.forEach((item, i) => {
              this.addSlots[1].values.push({
                  id: item.id,
                  name: item.areaName,
                  index: i,
                });
              if (this.info.diyOrgAddress.includes(item.id)) {
                this.addSlots[1].defaultIndex = i
                adressList.push(item.areaName)
                if (item.children) {
                  item.children.forEach((item, i) => {
                    this.addSlots[2].values.push({
                      id: item.id,
                      name: item.areaName,
                      index: i,
                    });
                    if (this.info.diyOrgAddress.includes(item.id)) {
                      this.addSlots[2].defaultIndex = i
                      adressList.push(item.areaName)
                    }
                  })
                }
              }
            })
          }
        })
        this.account.orgAddressName = adressList.join(',')
      });
      // 获取单位类型数据
      getDropdown("unittype").then((res) => {
        for (let item of res.data) {
          this.orgslots[0].values.push({
            id: item.id,
            name: item.name,
          });
        }
        this.orgType = '请选择'
          this.orgslots[0].values.forEach((item,index) => {
            if(item.id == this.info.diyOrgType) {
              this.orgslots[0].defaultIndex = index
              return this.orgType = item.name
            }
          })
      });
      //  获取行业类型数据
      getDropdown("industrytype").then((res) => {
        if (res.code == 0) {
          this.options = []
          res.data.forEach(item => {
          if (this.info.diyIndustry.split(',').length >= 3) {
            if (this.info.diyIndustry.includes(item.id)) {
              this.options.push({
                label: item.name,
                value: item.id,
                disabled: false
              });
            } else {
              this.options.push({
                label: item.name,
                value: item.id,
                disabled: true
              });
            }
          } else {
            this.options.push({
              label: item.name,
              value: item.id,
              disabled: false
            });
          }
            
          })
          let industryNameList = []
          this.account.industryName = "请选择"
          this.options.forEach(item => {
            if (this.info.diyIndustry.includes(item.value)) {
              industryNameList.push(item.label)
              this.value.push(item.value)
            }
          })
          this.account.industryName = industryNameList.join(',')
          this.account.diyIndustry = this.value.join(',')
        }
      })
    },
    setUser() {
      if (!this.account.diyIndustry) {
        this.error.hylx = true
      }
      if (!this.account.diyOrgAddress) {
        this.error.szdq = true
      }
      if (!this.account.diyOrgType) {
        this.error.dwlx =true
      }
      if (!this.account.companyName) {
        this.error.dwmc = true
      }
      if (!this.account.job) {
        this.error.zw = true
      }
      let params = {
        accountId: this.info.accountId,//主键ID
        diyIndustry: this.account.diyIndustry,
        diyOrgAddress:this.account.diyOrgAddress,
        companyName: this.account.companyName,
        diyOrgType: this.account.diyOrgType,
        job: this.account.job,
        userId: this.info.userId//关联用户主体ID
      }
      if (this.account.diyIndustry && this.account.diyOrgAddress && this.account.companyName && this.account.diyOrgType && this.account.job) {
        setInfo(params).then(res => {
          if (res.code == 0) {
            getUserInfo().then((res) => {
              if (res.code==0) {
                localStorage.setItem("userInfo", JSON.stringify(res.data));
                this.$store.commit('SET_USERINFO',res.data);
              }
            });
            this.$toast({
              message: "保存成功",
              position: "middle",
              duration: 3000,
            });
          }
        });
      }
      
    },
  },
};
</script>
<style scoped>
.main {
  background: #F4F4F4;
}
.field {
  padding-left: 0.31rem;
  padding-right: 0.6rem;
  background: #fff;
  font-size: 16px;
  align-items: center;
  height: 1.2rem;
  display: flex;
  justify-content: space-between;
}
.input_right {
  width: 6rem;
  text-align: right;
  color: #666;
}
.margin_top {
  margin-top: 1px;
}
.mint-checklist {
  height: 200px;
  overflow-y: scroll;
}
.picker-toolbar-title {
  display: flex;
  justify-content: space-around;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
.usi-btn-cancel,
.usi-btn-sure {
  color: #0aa1ed;
}
.main header {
  background: transparent;
  color: #000;
}
.main .pad_left {
  padding-left: 0.65rem;
  text-align: left;
}

.main .cell {
  padding-left: 0;
  padding-top: 1.6rem;
  border-bottom: 1px solid #eee;
}

.main .cell a {
  margin-top: 1px;
  text-decoration: none;
}

.main img {
  width: 20px;
}

.main .input_right {
  /* width:100%; */
  border: none;
  text-align: right !important ;
  font-size: 0.35rem !important ;
}
.cee {
  display: flex;
  background: #fff;
  align-items: center;
  padding-left: 10px;
}
.input_icon {
  flex: 12;
  /* border-bottom: 1px solid #eee; */
}
.logo_sty {
  padding: 2px 0;
  border-top: 1px solid #eee;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo_sty > span:nth-of-type(1) {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-left: 10px;
}
.org-style{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.address_sty{
  width: 100%;
  height: 48px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-top: 1px solid #eee;
}
.address_title{
  display: inline-block;
  width:120px;
  font-size: 16px;
  padding-left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.address_main{
  width: 5.9rem;
  margin-right: 0px;
  font-size: 0.35rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 48px;
  text-align: right;
  line-height: 48px;
  margin-left: 25px;
  padding-right: 8px;
  color: #989898;
}
.worStyle{
  font-size: 0.35rem;
}
.angle_sty{
    display: inline-block;
    width: 6px;
    height: 6px;
    border-right: 2px solid #c8c8cd;
    border-top: 2px solid #c8c8cd;
    transform: rotate(45deg);
    margin-right: 20px;
}
.set-btn{
  margin-top: 1rem;
  margin-bottom: 1.25rem;
  width: 9rem;
  height: 34px;
  background: #36A6FE;
  color: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  border-radius: 4px;
}
.block{
  width: 100%;
  display: flex;
  align-items: center;
  background: #F4F4F4;
  padding: 10px 0;
}
.block span{
  color: #555;
  margin-left: 20px;
  padding-left: 9px;
  font-size: 16px;
  line-height: 16px;
  border-left: 5px solid #36A6FE;
}
.bottomInfo{
  margin-top: 15px;
  font-size: 0.35rem;
  text-align: center;
  color: #999;
}
.goConfirm{
  margin-left: 10px;
  color: #36A6FE;
}
:deep(.mint-cell-value) {
  font-size: 0.35rem;
  color: #000;
}
.error{
  background: #F4F4F4;
  padding-left: 30px;
  padding-bottom: 10px;
  color: red;
  font-size: 12px;
}
.disabledText{
  font-size: 0.35rem;
  color: #999;
}
</style>
