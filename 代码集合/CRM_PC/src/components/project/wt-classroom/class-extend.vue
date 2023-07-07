<template>
  <div class="class-extend">
    <div v-if="wxMemberVisble" class="save-member">
      <div v-if="saveQrStatus" class="save-member-btn" @click="saveMemberCode()">保存图片</div>
    </div>
    <!-- 显示小程序课堂会员码 -->
     <el-dialog title="" :close-on-click-modal="false" :visible.sync="wxMemberVisble" width="10%" :before-close="handleCloseWx">
      <div class="wx-member-contain" ref="qrCodeMember">
        <div class="class-info">
          <div class="class-info-text">{{classInfo.baseTitle}}</div>
        </div>
        <img class="class-cover-img" :src="imgBaseUrl+classInfo.baseCoverUrl" alt="">
        <div class="class-catalogue">
          <div class="catalogue-item" v-for="(item,index) in treeData" :key="index">
            <div class="catalogue-item-head" v-if="item.showChild">
              <span>{{index+1}}</span>
              <span>{{item.sectionName.slice(0,11)}}</span>
              <span v-if="item.sectionName.length>11">...</span>
              <span class="lang-line" v-if="index == 0"></span>
            </div>
            <div class="catalogue-item-body" v-if="item.child.length>0">
              <span v-for="(cItem,cIndex) in item.child" :key="cIndex">
                <span v-if="cItem.showChild">{{cItem.sectionName.slice(0,12)}}</span>
                <span v-if="cItem.sectionName.length>12&&cItem.showChild">...</span>
              </span>
            </div>
          </div>
        </div>
        <img class="wx-member-sty" :src="cMemberBgUrl" alt="" />
        <div class="wx-member-qr">
          <div>{{userInfo.number}}</div>
          <vue-qr :class="['wx-member-main-sty']" :text="wxCodeUrl" :size="250" :logoScale="0.2"></vue-qr>
        </div>
        <img v-if="saveQrStatus" @click="handleCloseWx()" class="wx-member-close" :src="closeBtnUrl" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getChapterTree } from "@/api/project/wtClass";
import VueQr from "vue-qr";
import { mapState } from "vuex";
import html2canvas from "html2canvas";
import { getWxYaoCode } from "@/api/personal/myhome";
export default {
  components: {
    VueQr,
  },
  data() {
    return {
      treeData: [],
      imgBaseUrl: process.env.VUE_APP_IMAGE_BASEURL,
      classInfo: {},
      qrMemberTitle: "课程推广码",
      wxCode: "",
      closeBtnUrl: require("@/assets/images/my-home/wx_close.png"),
      cMemberBgUrl: require("@/assets/images/classroom/pic_course@2x.png"),
      wxCodeUrl: "",
      saveQrStatus: true,
      wxMemberVisble: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {
    this.getWxYaoData();
  },
  methods: {
    // 获取章节树
    getChapterList() {
      let params = {
        classId: this.classInfo.id,
        id: 0,
      };
      getChapterTree(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let result = res.data.data;
          this.checkChild(result);
          this.wxCodeUrl = `https://www.wotao.com/class?classId=${this.wxCode}&courseId=${this.classInfo.id}`
        }
      });
    },
    // 章节树赋值（只显示6条子章节）
    checkChild(result) {
      let childLength = 0;
      result.forEach((item) => {
        item.showChild = false
        if (item.child.length > 0) {
          item.child.forEach((cItem) => {
            if (childLength < 6) {
              childLength = childLength + 1;
              cItem.showChild = true;
              item.showChild = true
            }
          });
        }
      });
      this.treeData = result;
      console.log(this.treeData,"this.treeData")
    },
    // 获取微信邀请码信息
    getWxYaoData() {
      getWxYaoCode().then((res) => {
        this.wxCode = res.data.data;
      });
    },
    // 保存截图
    saveMemberCode() {
      this.saveQrStatus = false;
      setTimeout(() => {
        html2canvas(this.$refs.qrCodeMember, {
          useCORS: true,
          width: 498,
          height: 902,
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
    // 关闭推广弹窗
    handleCloseWx() {
      this.wxMemberVisble = false;
    },
  },
};
</script>

<style scoped>
.save-member {
  position: fixed;
  display: flex;
  top: 92%;
  left: 50%;
  transform: translateX(-40%);
  z-index: 99999;
}
.save-member-btn {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 85%;
  left: 50%;
  transform: translateX(-30%);
  font-size: 16px;
  z-index: 999999;
  padding: 0;
  cursor: pointer;
  color: #ffffff !important;
  width: 228px;
  height: 54px;
  background: #19249c;
  border: 4px solid #445eff;
  border-radius: 31px;
}
.wx-member-qr {
  position: absolute;
  top: 583px;
  left: 264px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 10px;
  z-index: 9999999;
}

.wx-member-qr > div:nth-of-type(1) {
  margin-bottom: 4px;
  font-size: 10px;
  color: #89a1c6;
}

.wx-qr-save {
  width: 80px;
}

.wx-member-sty {
  width: 500px;
  height: 902px;
  position: absolute;
  top: -100px;
  left: -100px;
}

.wx-member-close {
  position: absolute;
  top: -90px;
  left: 345px;
  width: 40px;
  height: 40px;
  z-index: 10000;
  cursor: pointer;
}

.wx-member-main-sty {
  width: 80px;
  height: 80px;
  z-index: 10000;
}
.class-info {
  position: absolute;
  top: -77px;
  left: -40px;
  z-index: 99999;
  width: 380px;
  height: 80px;
  /* background: pink; */
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.class-info-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.class-cover-img {
  position: absolute;
  top: 75px;
  left: -50px;
  z-index: 99999;
  width: 400px;
  height: 245px;
}

.class-catalogue {
  position: absolute;
  top: 365px;
  left: -2px;
  z-index: 99999;
  width: 300px;
  height: 280px;
  /* background: pink; */
  overflow: hidden;
}

.catalogue-item {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.catalogue-item-head {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #445eff;
  font-weight: bold;
  margin-top: 2px;
}

.catalogue-item-head > span:nth-of-type(1) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  background: #111978;
  font-weight: normal;
  color: #f2f6ff;
  margin-right: 11px;
  z-index: 999;

}
.catalogue-item-head > span:nth-of-type(2) {
  width: 200px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.lang-line{
  display: inline-block;
  position: absolute;
  top: 38px;
  left: 18px;
  width: 1px;
  height: 300px;
  border: 1px dashed #445eff;
}
.catalogue-item-body {
  display: flex;
  flex-direction: column;
  /* background: lightgreen; */
  width: 240px;
  margin-left: 48px;
}

.active-child-sty {
  width: 240px !important;
}

.catalogue-item-body > span {
  display: inline-block;
  width: 220px;
  color: #555555;
  font-size: 16px;
  margin-bottom: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>