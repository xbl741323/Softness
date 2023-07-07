<!-- 排查完成 -->
<template>
  <div class="user-info-table">
    <div class="top-bcg">
      <div class="info-top">
        <div class="userinfo-frame">
          <div class="userinfo-head">
            <img v-if="empInfo.avatar" :src="imgBaseUrl + empInfo.avatar" alt />
            <img v-else :src="require('@/assets/images/task/head.png')" alt />
            <div class="userinfo-box">
              <p>{{ empInfo.name }}</p>
              <div class="staff-number">
                <img :src="require('@/assets/images/my-home/work-permit@2x.png')" alt="" />
                <span>{{ empInfo.number }}</span>
              </div>
            </div>
            <!-- <img class="table-prompt" @click="processTotal > 0 ? toMyProcess : ''" :src="require('@/assets/images/my-home/xiaoxitishi@2x.png')" alt=""> -->
          </div>
          <div class="deptinfo">
            <div class="deptinfo-item">
              <p>组织部门：</p>
              <p>{{ empInfo.partnerName }}</p>
            </div>
            <div class="deptinfo-item">
              <p>联系电话：</p>
              <p>{{ phone }}</p>
            </div>
          </div>
        </div>
        <div class="code">
          <div class="code-img" v-if="wxStatus">
            <img :src="wx" alt="" />
            <div class="code-desc">
              <span>扫一扫二维码</span>
              <span>关注卧涛微信公众号</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shareLink">
      <p class="table-subcript">专属推广链接</p>
      <div class="table-link">
        <div v-for="(item,index) in appletLinkList" :key="index" class="applet-link-item">
          <img v-if="index == 0" :src="item.imgUrl" alt="" style="margin:0" data-clipboard-action="copy" :data-clipboard-text="wxYaoCode" @click="copyWx" class="copy_btn">
          <img v-else :src="item.imgUrl" alt="" @click="changeApplet(index)">
          <span v-if="index == 0" @click="copyWx">{{item.title}}</span>
          <span v-else @click="changeApplet(index)">{{item.title}}</span>
        </div>
      </div>
    </div>

    <div class="list-link" v-if="permissions.bt_page_product_flag">
      <div class="list-link-top">
        <p class="table-subcript">服务产品推广链接</p>
        <span class="tomore" @click="toLink(0)">查看更多</span>
      </div>
      <div class="link-list">
        <div v-for="item in productLinkList" :key="item.id" class="link-list-item" @click="handleShare(item)">
          <img :src="imgBaseUrl + item.imageUrl" alt="">
          <p>{{item.spuTitle}}</p>
        </div>
      </div>
    </div>

    <div class="list-link top-sty" v-if="permissions.bt_page_class_flag">
      <div class="list-link-top">
        <p class="table-subcript">卧涛课堂推广链接</p>
        <span class="tomore" @click="toLink(1)">查看更多</span>
      </div>
      <div class="link-list">
        <div v-for="item in classLinkList" :key="item.id" class="link-list-item" @click="classExtend(item)">
          <img :src="imgBaseUrl + item.baseCoverUrl" alt="">
          <p>{{item.baseTitle}}</p>
        </div>
      </div>
    </div>

    <div class="information-link" v-if="permissions.bt_page_info_flag">
      <div class="information-link-top">
        <div class="information-link-title">
          <img :src="require('@/assets/images/my-home/icon-information@2x.png')" alt="" />
          <p>资讯广场推广链接</p>
        </div>
        <span class="tomore" @click="toLink(2)">查看更多</span>
      </div>
      <div class="information-list">
        <div v-for="(item, index) in informationList" :key="item.id" class="information-list-item" @click="getCodeLink(item, index >= 5 ? 1 : '')" :data-clipboard-text="index >= 5 ? item.fileName+'：'+ informationLink : item.title+'：'+ informationLink">
          <span>【{{index < 2 ? '行业资讯' :  index < 5 ? '通知公告' : '文件管理'}}】{{index >= 5 ? item.fileName : item.metaTitle}}</span>
        </div>
      </div>
    </div>

    <!-- 二维码放大展示 -->
    <el-dialog :close-on-click-modal="false" title="" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
      <div class="code-big-sty">
        <img class="img-sty" :src="wx" alt="" />
        <div>{{ $t("message.codeDesc") }}</div>
      </div>
    </el-dialog>
    <!-- 显示小程序码 -->
    <el-dialog title="" :close-on-click-modal="false" :visible.sync="wxDialogVisible" width="20%" :before-close="handleCloseWx">
      <div class="wx-sty" ref="qrCodeDiv">
        <img class="wx-img-sty" :src="cAppletBgUrl" alt="" />
        <vue-qr :class="['wx-main-sty',saveQrStatus==false?'wx-max-sty':'']" :text="wxCodeUrl" :size="250" :logoSrc="logo" :logoScale="0.2"></vue-qr>
        <div :class="['wx-number-sty',saveQrStatus==false?'active-wx-number-sty':'']">{{userInfo.number}}</div>
        <img v-if="saveQrStatus" class="wx-btn-sty" @click="saveQrCode()" :src="require('@/assets/images/my-home/baocun.png')" alt="">
        <img v-if="saveQrStatus" @click="handleCloseWx()" class="wx-btn-close" :src="require('@/assets/images/my-home/wx_close.png')" alt="">
      </div>
    </el-dialog>
    <!-- 显示小程序课堂会员码 -->
    <el-dialog title="" :close-on-click-modal="false" :visible.sync="wxMemberVisble" width="10%" :before-close="handleCloseWx">
      <div class="wx-member-contain" ref="qrCodeDiv">
        <img class="wx-member-sty" :src="cMemberBgUrl" alt="" />
        <div class="wx-member-qr">
          <div>微信扫一扫</div>
          <vue-qr :class="['wx-member-main-sty']" :text="wxCodeUrl" :size="250" :logoSrc="logo" :logoScale="0.2"></vue-qr>
          <div>{{userInfo.number}}</div>
          <div>成为卧涛会员</div>
        </div>
        <div v-if="saveQrStatus" class="wx-btn-sty save-member-btn" @click="saveMemberCodeClass()">点击保存二维码图片</div>
        <img v-if="saveQrStatus" @click="handleCloseWx()" class="wx-member-close" :src="require('@/assets/images/my-home/wx_close.png')" alt="">
      </div>
    </el-dialog>
    <el-dialog width="40%" title="推广" @close="shareCancelFn" :visible.sync="shareDialog">
      <el-radio-group v-model="shareRadio">
        <el-radio :label="0">链接推广（客户使用PC端）</el-radio>
        <el-radio :label="1">二维码推广（客户使用小程序）</el-radio>
      </el-radio-group>
      <el-input
        class="shareInput"
        v-if="shareRadio == 0"
        v-model="pcCodeUrl"
        placeholder="请输入内容"
      >
        <template slot="append">
          <el-button type="primary" @click="copyToClip(pcCodeUrl)">
            {{!isCopied ? "复制推广地址" : "推广地址已复制"}}
          </el-button>
        </template>
      </el-input>
      <div v-else class="erweima " ref="erweima">
        <div class="erweimainfo wx-product-sty" 
            :style="{
              backgroundImage: `url('${wtMemberBgUrl}')`,
              backgroundSize: '100% 100%',
            }">
        <img
          class="shareBanner"
          :src="imgBaseUrl + dialogForm.imageUrl"
          alt=""
        />
          <!-- <div class="banner"></div> -->
          <div class="bottom">
            <div class="jieshao" style="margin-top: 18px">
              <div class="title">
                {{ dialogForm.spuTitle }}
              </div>
              <div class="allPrice">
                <div class="price">
                  <div class="priceNum">{{depositFee}}</div>
                </div>
              </div>
            </div>
            <div>
              <vue-qr
              :class="['wx-product-main-sty']"
              :text="wxCodeUrl"
              :size="150"
              :logoScale="0.2"
            ></vue-qr>
            <div style="text-align: center;">{{number}}</div>
            </div>
            
          </div>
        </div>
        <!-- <img class="wx-member-sty" :src="wtMemberBgUrl" alt="" /> -->
        <div>
          <el-button style="margin-top:15px" type="primary" @click="saveMemberCode">下载二维码</el-button>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="shareCancelFn">取 消</el-button>
        <el-button type="primary" @click="shareOkFn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 推广弹窗 -->
    <class-extend ref="extend"></class-extend>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import * as CodeMsg from "@/api/common/CodeChange";
import { getTotalOfMy } from "@/api/admin/client";
import { getWxYaoCode } from "@/api/personal/myhome";
import { getNewEmpDetail, getWx, getMySpuLinkList, getMyClassLinkList, getMyIndustryLinkList, getMyNoticeLinkList, getMyDocLinkList } from "@/api/admin/user";
import { deptRoleList } from "@/api/admin/role";
import { mapState, mapGetters } from "vuex";
import Clipboard from "clipboard";
import html2canvas from "html2canvas";
import classExtend from "@/components/project/wt-classroom/class-extend";
export default {
  components: {
    VueQr,
    classExtend
  },
  data() {
    return {
      wxMemberVisble: false, // 卧涛课堂会员
      // 定义二维码背景图片
      logo: "",
      wxCode: "",
      cAppletBgUrl: require("@/assets/images/my-home/WTstore_pic@2x.png"),
      cMemberBgUrl: require("@/assets/images/my-home/pic_beijing@2x.png"),
      appletLinkList: [
        {
          title: "卧涛网",
          imgUrl: require("@/assets/images/my-home/icon_link@2x.png"),
          linkTitle: "复制链接",
        },
        {
          title: "卧涛商城小程序",
          imgUrl: require("@/assets/images/my-home/icon_linkerweima@2x.png"),
        },
        {
          title: "卧涛课堂会员",
          imgUrl: require("@/assets/images/my-home/icon_linkerweima@2x.png"),
        },
      ],
      saveQrStatus: true, // 是否显示保存按钮
      qrCodeTitle: "小程序推广码",
      qrMemberTitle: "卧涛课堂会员推广码",
      wtBaseUrl: process.env.VUE_APP_WEB_URL,
      wxCodeUrl: "",
      wxYaoCode: "",
      wxDialogVisible: false,
      processTotal: 0, // 待办数量
      showStatus: false,
      wx: {},
      dialogVisible: false,
      imgBaseUrl: process.env.VUE_APP_IMAGE_BASEURL,
      empInfo: {},
      rolesOptions: [],
      rolesValue: [],
      phone: "",
      wxStatus: false,//是否显示二维码
      userData:{},
      number: this.$store.state.user.userInfo.number,
      productLinkList: [],
      classLinkList: [],
      informationList: [],
      dialogForm: {},
      wtMemberBgUrl: require("@/assets/images/project/pic_WTmember.png"),
      wxCodeUrl: "",
      pcCodeUrl: '',
      shareDialog: false,
      shareRadio: 0,
      isCopied: true,
      informationLink: "",
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    changeApplet(index) {
      this.wxCodeUrl =
        index == 1
          ? `https://www.wotao.com/mp?userId=${this.wxCode}` // 获取小程序注册推广码信息
          : `https://www.wotao.com/member?memberId=${this.wxCode}`; // 获取小程序会员推广码信息
      index == 1 ? (this.wxDialogVisible = true) : (this.wxMemberVisble = true);
    },
    // 保存截图
    saveMemberCode() {
      this.saveQrStatus = false;
      setTimeout(() => {
        html2canvas(this.$refs.qrCodeDiv, {
          useCORS: true,
          width: 425,
          height: 1500,
          scale: 3,
          windowWidth: document.body.scrollWidth,
          windowHeight: document.body.scrollHeight,
          x: -120,
          y: -160,
        }).then((canvas) => {
          let imgUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgUrl;
          link.setAttribute("download", this.qrMemberTitle + ".png");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          this.saveQrStatus = true;
        });
      }, 500);
    },
    // 保存截图
    saveQrCode() {
      this.saveQrStatus = false;
      setTimeout(() => {
        html2canvas(this.$refs.qrCodeDiv, {
          useCORS: true,
          width: 576,
          height: 619,
          scale: 3,
          windowWidth: document.body.scrollWidth,
          windowHeight: document.body.scrollHeight,
          x: -65,
          y: -65,
        }).then((canvas) => {
          let imgUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgUrl;
          link.setAttribute("download", this.qrCodeTitle + ".png");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          this.saveQrStatus = true;
        });
      }, 500);
    },
    // 复制推广链接
    copyWx() {
      let clip = new Clipboard(".copy_btn");
      clip.on("success", () => {
        this.$message({
          type: "success",
          message: "复制成功！",
          offset: 300,
        });
        clip.destroy();
      });
      clip.on("error", () => {
        this.$message({
          type: "warning",
          message: "复制失败！",
          offset: 300,
        });
      });
    },
    toMyProcess() {
      this.$router.push({
        path: "/personal/my-process",
      });
    },
    closeToop() {
      this.$refs.toop.hide();
    },
    getWxCode() {
      let params = {
        number: this.empInfo.number,
      };
      getWx(params).then((res) => {
        this.wx = res.data.data;
      });
    },
    handleClose() {
      this.dialogVisible = false;
      sessionStorage.setItem('closeDialog',true)
    },
    handleCloseWx() {
      this.wxDialogVisible = false;
      this.wxMemberVisble = false;
    },
    getUserData() {
      getNewEmpDetail().then((res) => {
        this.empInfo = res.data.data;
        this.phone = res.data.data.mobilePhone;
        this.wxStatus = false;
        if(this.empInfo.wxOpenid==null){
          this.empInfo.wxOpenid = ''
          this.wxStatus = true;
        }
        if (this.empInfo.wxOpenid != '') {
          this.dialogVisible = false;
        } else {
          this.getWxCode();
          this.dialogVisible = true;
          this.wxStatus = true;
        }
        if(sessionStorage.getItem('closeDialog')){
          this.dialogVisible = false;
        }
        this.$nextTick(() => {
          this.getRoleList();
        });
      });
      this.userData=JSON.parse(sessionStorage.getItem('pigx-userInfo'))
    },
    getRoleList() {
      deptRoleList().then((res) => {
        this.rolesOptions = res.data.data;
        this.rolesValue = [];
        this.rolesOptions.forEach((item) => {
          this.empInfo.roleList.forEach((val) => {
            if (item.roleId == val.roleId) {
              this.rolesValue.push(item.roleName);
              return;
            }
          });
        });
      });
    },
    getProcessNum() {
      getTotalOfMy().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.processTotal = res.data.data;
        }
      });
    },
    // 获取微信邀请码信息
    getWxYaoData() {
      getWxYaoCode().then((res) => {
        this.wxYaoCode = this.wtBaseUrl + "?" + "link=" + res.data.data;
        this.wxCode = res.data.data;
      });
    },
    // 推广
    classExtend(row){
      this.$nextTick(()=>{
        this.$refs.extend.wxMemberVisble = true
        this.$refs.extend.classInfo = row
        this.$refs.extend.getChapterList()
      })
    },
    getCodeLink(row){
      if (type == 1) {
        this.informationLink = process.env.VUE_APP_WEB_URL+'policy/files/'+ row.id + '?' + 'link=' +this.wxCode
      } else {
        this.informationLink = process.env.VUE_APP_WEB_URL+'policy/'+ (row.industryNo ? row.industryNo : row.number) + '01' + '?' + 'link=' +this.wxCode; 
      }
      const h = this.$createElement;
      this.$message({
        showClose: true,
        center: true,
        offset: 350,
        duration: 2000,
        dangerouslyUseHTMLString: true,
        type:'success',
        customClass: 'myMessage',
        message: h('div', {style: 'text-align: center'}, [
            h('i',{ class: 'el-icon-success' }),
            h('span', { style: 'color: #555; font-size: 18px'}, ' 您的专属推广链接如下，已自动为您复制： '),
            h('h3', { style: 'color: #67C23A; font-size: 16px' }, type == 1 ? row.fileName: row.title),
            h('p', { style: 'color: #67C23A; font-size: 14px' }, this.informationLink)
          ])
      })
      document.querySelector('.information-list-item').setAttribute('data-clipboard-text', type ==1 ? row.fileName: row.title+': &nbsp;'+ this.informationLink);
      new Clipboard('.information-list-item');
    },
    copyToClip(content) {
      const ele = document.createElement("input");
      ele.setAttribute("value", content);
      document.body.appendChild(ele);
      ele.select();
      document.execCommand("copy");
      document.body.removeChild(ele);
      this.$message({
        type: "success",
        message: "推广地址复制成功",
      });
      this.isCopied = true
    },
    shareCancelFn() {
      this.shareDialog = false
      this.shareRadio = 0
      this.wxCodeUrl = ""
      this.pcCodeUrl = ""
      this.isCopied = false
    },
    shareOkFn() {
      this.shareDialog = false
      this.shareRadio = 0
      this.wxCodeUrl = ""
      this.pcCodeUrl = ""
      this.isCopied = false
    },
    saveMemberCodeClass() {
      this.saveQrStatus = false;
      setTimeout(() => {
        html2canvas(this.$refs.qrCodeDiv, {
          useCORS: true,
          width: 425,
          height: 1500,
          scale: 3,
          windowWidth: document.body.scrollWidth,
          windowHeight: document.body.scrollHeight,
          x: -121,
          y: -160,
        }).then((canvas) => {
          let imgUrl = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgUrl;
          link.setAttribute("download", "卧涛会员课堂推广码.png");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          this.saveQrStatus = true;
          this.$message({
            type: "success",
            message: "图片下载成功"
          })
        });
      }, 500);
    },
    //推广
    handleShare(row) {
      getWxYaoCode().then(res => {
        this.shareDialog = true
        this.dialogForm = JSON.parse(JSON.stringify(row))
        let allList = this.productLinkList.filter(item => item.id == this.dialogForm.id)
        allList.forEach(item => {
          let amount = ''
          if(item.isOnline){
            amount = item.spuMaxAmount != item.spuMinAmount ? item.spuMinAmount + "起" : item.spuMinAmount
            amount.indexOf('起') != -1 ? amount = '￥'+amount.slice(0, amount.indexOf('.'))+'起' : amount = '￥' + amount.slice(0, amount.indexOf('.'))
          }else{
            amount = '面议'
          }
            this.depositFee = amount
        })
        let params = {
          spuId: this.dialogForm.id,
          spuType: this.dialogForm.categoryId,
          proSpread: res.data.data,
        }
        let data = JSON.stringify(params)
        this.wxCodeUrl = `https://www.wotao.com/product?data=${data}`
        this.pcCodeUrl = this.wtBaseUrl+`productdetails/details?spuId=${this.dialogForm.id}&type=${this.dialogForm.categoryId}&link=${res.data.data}`
      })
    },
    toLink(num) {
      let url = ""
      switch(num) {
        case 0:
          url = "/project/index"
          break;

        case 1:
          url = "/wt-classroom/course-management/index"
          break;
        
        case 2:
          url = "/policySquare/notice/noticeList"
          break;
        
        default:
          return
      }
      this.$router.push(url)
    },
    getLinkList() {
      let params = {
        pageNo: 1,
        pageSize: 10
      }
      getMySpuLinkList(params).then(res => {
        if (res.data.code == 0) {
          this.productLinkList = res.data.data.records
        }
      })
      getMyClassLinkList(params).then(res => {
        if (res.data.code == 0) {
          this.classLinkList = res.data.data.records
        }
      })
    },
    async getInformationLinkList() {
      let industryLinkList = []
      let noticeLinkList = []
      let docLinkList = []
      await getMyIndustryLinkList({pageNo: 1,pageSize: 2}).then(res => {
        if (res.data.code == 0) {
          industryLinkList = res.data.data.records
        }
      })
      await getMyNoticeLinkList({pageNo: 1,pageSize: 3}).then(res => {
        if (res.data.code == 0) {
          noticeLinkList = res.data.data.records
        }
      })
      await getMyDocLinkList({pageNo: 1,pageSize: 3}).then(res => {
        if (res.data.code == 0) {
          docLinkList = res.data.data.records
        }
      })
      this.informationList = [...industryLinkList, ...noticeLinkList, ...docLinkList]
    },
  },
  mounted() {
    this.getUserData();
    this.getProcessNum();
    this.getWxYaoData();
    this.getLinkList()
    this.getInformationLinkList()
  },
};
</script>

<style scoped>
.user-info-table{
  border-radius: 10px;
  padding: 0 0 10px;
}
.top-bcg{
  background: #fff;
  border-radius: 10px;
  width: 100%;
  height: 197px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info-top{
  display: flex;
  background: linear-gradient(326deg,#fcfeff 6%, #ebf4fc 93%);
  border-radius: 10px;
  width: 100%;
  margin: 0 15px;
  height: 165px;
}
.userinfo-frame{
  padding: 20px 16px;
  position: relative;
  border-radius: 10px;
}
.userinfo-head{
  display: flex;
  align-items: center;
  border-radius: 6px;
}
.userinfo-head img{
  width: 57px;
  height: 57px;
  border-radius: 50%;
}
.userinfo-box p{
  margin:0 0 10px 10px;
  font-size: 16px;
  font-weight: 550;
}
.userinfo-box img{
  width: 19px;
  height: 19px;
  align-items: center;
}
.staff-number{
  display: flex;
  margin-left: 10px;
  color: #333333;
  font-size: 12px;
}
.staff-number img{
  border-radius: 0 !important;
  margin-right: 3px;
}
.userinfo-box span{
  display: block;
  line-height: 19px;
}
.table-prompt{
  width: 24px !important;
  height: 24px !important;
  position: absolute;
  right: 10px;
  top: 20px;
  cursor: pointer;
}
.deptinfo{
  display: flex;
  flex-direction: column;
  margin: 10px 0 0 0;
}
.deptinfo-item{
  display: grid;
  grid-template-columns: 35% 65%;
}
.deptinfo-item p{
  margin: 10px 0 0 0;
  font-size: 12px;
}
.deptinfo-item :last-child{
  font-weight: 550;
}
.table-subcript{
  color: #333333;
  font-size: 20px;
  font-weight: 550;
  margin: 0 0 10px 0;
}
.shareLink{
  background: #fff;
  margin: 10px 0;
  padding: 10px 10px;
  border-radius: 10px;
}
.table-link{
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.special-applet-link {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.special-applet-link span {
  color: #409eff;
  cursor: pointer !important;
  margin-left: 3px;
  padding-bottom: 2px;
  border-bottom: 1px solid #409eff;
}
.table-link img{
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.applet-link-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: #e1ebff;
  border-radius: 20px;
}
.applet-link-item span{
  font-size: 12px;
  font-weight: 550;
  margin-left: 2px;
  cursor: pointer;
}
.copy_btn {
  margin-top: 2px
}

.staff-detail {
  position: relative;
  border-radius: 22px;
  flex: 5.9;
  margin: 0px 10px 10px 10px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  background-color: #409eff;
}

.staff-detail-img {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
.staff-header {
  height: 200px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.header-left {
  position: relative;
  width: 98px;
  height: 98px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 43px;
  border: 2px solid #ffffff;
  border-radius: 50%;
}
.header-left > img:nth-of-type(1) {
  display: flex;
  width: 82px;
  height: 82px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
}
.header-left > img:nth-of-type(2) {
  position: absolute;
  right: 0px;
  bottom: -6px;
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.right-link {
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 9px;
  cursor: pointer;
  z-index: 1000 !important;
}
.right-link img {
  width: 23px;
  height: 23px;
}
.right-link span {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2px;
}
.header-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 36px;
}
.nickName-sty {
  width: 128px;
  font-weight: bold;
  text-align: center;
  position: absolute;
  bottom: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.header-button {
  margin-top: 60px;
  margin-left: 400px;
}
.label-content {
  height: 25px;
  background: #ffffff;
  display: flex;
  color: #409eff;
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding-right: 10px;
}
.label-content img {
  width: 41px;
  height: 25px;
  margin-right: 5px;
}
.right-header {
  display: flex;
  align-items: center;
}
.right-header > span:nth-of-type(1) {
  font-weight: 700;
  font-size: 22px;
  line-height: 22px;
}
.right-header > span:nth-of-type(2) {
  font-weight: bold;
  margin-left: 15px;
  font-size: 10px;
}
.right-content {
  margin-top: 8px;
  font-size: 14px;
}
.right-content span {
  margin-right: 20px;
}
.code{
  margin: auto;
}
.code-contain {
  display: flex;
  justify-content: center;
  align-items: center;
}
.code-img {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.code-img img {
  width: 103px;
  height: 103px;
  margin-bottom: 2px;
}
.code-desc {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #555555;
  text-align: center;
  width: 105%;
}
.img-sty {
  width: 100%;
  margin-top: -20px;
}
.code-big-sty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.code-big-sty div {
  font-size: 18px;
}
.news-tip {
  position: relative;
  margin-left: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer !important;
}
.news-tip img {
  width: 26px;
  height: 26px;
}
.news-tip span {
  position: absolute;
  top: -5px;
  left: 50%;
  display: inline-block;
  border-radius: 10px;
  background: #ea5167;
  font-size: 10px;
  padding: 1px 5px 1px 4px;
}
.atooltip {
  background: #e4f0fc !important;
  color: #333333;
}
.atooltip img {
  width: 19px;
  height: 19px;
  margin-right: 4px;
}
.atool-desc {
  display: flex;
  justify-content: center;
  align-items: center;
}
.atool-desc-btn {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  color: #409eff;
  font-size: 10px;
  cursor: pointer;
}
.atool-desc-btn > span:nth-of-type(1) {
  margin-right: 8px;
}
.wx-img-sty {
  width: 556px;
  height: 609px;
  position: absolute;
  top: 0px;
  left: -10%;
}
.wx-main-sty {
  position: absolute;
  top: 217px;
  left: 128px;
  width: 229px;
  height: 229px;
  z-index: 10000;
}
.wx-btn-sty {
  position: absolute;
  top: 455px;
  left: 147px;
  width: 189px;
  height: 56px;
  z-index: 10000;
  cursor: pointer;
}
.wx-number-sty {
  position: absolute;
  top: 435px;
  left: 208px;
  width: 189px;
  height: 56px;
  z-index: 10000;
  cursor: pointer;
  color: #b4b4b4;
  font-size: 14px;
}
.active-wx-number-sty {
  top: 485px;
}
.wx-btn-close {
  position: absolute;
  top: 10px;
  left: 465px;
  width: 40px;
  height: 40px;
  z-index: 10000;
  cursor: pointer;
}
.wx-max-sty {
  width: 280px !important;
  height: 280px !important;
  top: 215px !important;
  left: 100px !important;
}
.code-lang {
  display: inline-block;
  width: 1px;
  height: 135px;
  background: #ffffff;
  margin: 0 15px;
}
.applet-link {
  width: 220px;
  height: 135px;
  background: #f5faff;
  border-radius: 10px;
  margin-right: 16px;
}
.applet-link-title {
  color: #000000;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 220px;
  height: 36px;
  background: #f0f3f9;
  border-radius: 10px 10px 0px 0px;
}
.applet-link-info {
  color: #555555;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  padding: 0 11px 0 16px;
}
.applet-link-info img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.save-member{
  position: fixed;
  display: flex;
  top: 85%;
  left: 50%;
  transform: translateX(-40%);
  z-index: 99999;
}

.save-member-btn {
  background: rgba(0, 0, 0, 0.9);
  width: 189px;
  height: 60px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 85%;
  left: 50%;
  transform: translateX(-40%);
  font-size: 16px;
  z-index: 999999;
  padding: 0;
  border-radius: 40px;
  cursor: pointer;
  color: #ffffff !important;
}

/*
  会员码支付样式
 */

.wx-member-qr {
  position: absolute;
  top: -80px;
  left: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 10px;
}

.wx-member-qr > div:nth-of-type(1) {
  margin-bottom: 5px;
}

.wx-member-qr > div:nth-of-type(2) {
  margin-top: 4px;
  font-size: 10px;
}

.wx-member-qr > div:nth-of-type(3) {
  width: 100px;
  margin-bottom: 2px;
  text-align: center;
  font-weight: bold;
}

.wx-qr-save {
  width: 80px;
}

.wx-member-sty {
  width: 425px;
  height: 1500px;
  position: absolute;
  top: -100px;
  left: -100px;
}

.wx-member-close {
  position: absolute;
  top: -95px;
  left: 290px;
  width: 30px;
  height: 30px;
  z-index: 10000;
  cursor: pointer;
}

.wx-member-main-sty {
  width: 70px;
  height: 70px;
  z-index: 10000;
}
.list-link {
  background: linear-gradient(326deg,#fcfeff 6%, #ebf4fc 93%);
  border-radius: 10px;
  padding: 10px 10px 10px 20px;
}
.list-link-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.list-link-top p{
  margin-bottom: 0;
}
.tomore{
  font-size: 12px;
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
.link-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.link-list-item {
  display: flex;
  flex-direction: column;
  color: #999999;
  font-size: 12px;
  cursor: pointer;
}
.link-list-item img {
  width: 90px;
  height: 69px;
  border-radius: 5px;
}
.link-list-item p {
  width: 92px;
  overflow: hidden;
  word-break:break-all;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
.link-list-item :hover{
  color: #36a6fe;
}
.information-link{
  background: #fff;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
}
.information-link-top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.information-link-title{
  display: flex;
  align-items: center;
}
.information-link-title p {
  margin: 0;
  color: #333333;
  font-size: 20px;
  font-weight: 550;
}
.information-link-title img{
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.information-list{
  display: flex;
  flex-direction: column;
  background: #f4f9fe;
  border-radius: 10px;
  color: #233558;
  font-size: 14px
}
.information-list-item{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 90%;
  margin: 7px 0;
  padding-left: 10px;
  list-style: none;
}
.information-list-item:hover{
  color: #36a6fe;
  cursor: pointer;
}
.information-list-item-doc{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 90%;
  margin: 7px 0;
  padding-left: 10px;
  list-style: none;
}
.information-list-item-doc:hover{
  color: #36a6fe;
  cursor: pointer;
}

.shareInput {
  width: 85%;
  margin-top: 30px;
}
.erweima{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.erweimainfo {
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.shareBanner {
  width: 329px; 
  height: 235px; 
  background: #ccc; 
  border-radius: 10px;
  margin-top: 70px;
  margin-left: 23px;
}
.bottom {
  display: flex;
  margin-left: 21px;
}
.wx-product-main-sty {
  width: 150px;
  height: 150px;
  z-index: 2;
}
.wx-product-sty {
  width: 380px;
  height: 532px;
}
.jieshao {
  width: 190px;
}
.title {
  max-width: 180px;
  min-height: 54px;
  font-size: 16px;
  font-weight: 600;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.allPrice {
  display: flex;
  margin-top: 10px;
}
.price {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  width: 100%;
}
.priceName {
  font-size: 12px;
  color: #979797;
  padding: 8px 0;
}
.priceNum {
  font-size: 15px;
  font-weight: 600;
  color: #fa8958;
}
.top-sty{
  margin-top: 10px;
}
</style>
<style>
.atooltip {
  background: #e4f0fc !important;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #e4f0fc !important;
}

.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #e4f0fc !important;
}
</style>