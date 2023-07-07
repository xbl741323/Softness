<template>
  <!-- 首页通知公告 -->
  <div class="frame">
    <div style="width:1200px;margin:20px auto">
      <span style="font-weight: bold;font-size: 32px;color: #333333;cursor: pointer;" @click="gogo" >资讯广场</span>
      <span style="margin-left:13px;color: #333333;font-size: 16px;font-weight: 400;cursor: pointer;"  @click="gogo">/ 探究行业热点 掌握最新动态</span>
    </div>
    <div class="policy_box">
      <div class="area-list">
        <div class="doright yayya">
          <div class="frame">
             <!-- 导航 -->
            <div class="policyNav" @click="gogo">
                <img
                src="~assets/images/last/newtzgg_icon@2x.png"
                alt=""
                width="20"
                height="20"
                style="margin-right:5px;cursor: pointer;"
                />
              <div class="notice">通知公告</div>
              <span class="des">捕捉国内各行业政策动态</span>
              <div class="more">
                  更多&nbsp;
                 <img
                    src="~assets/images/last/newicon_right_arrow@2x.png"
                    alt=""
                    width="14"
                    height="14"
                    style="margin-right:5px;cursor: pointer;"
                  />
                </div>
            </div>
            
            <div class="box" style="display:flex">
              <!-- 通知公告图片 -->
              <div class="noticeImg" @click="toPolicy">
                 <div style="width:407px;height:271px;position: relative;cursor: pointer;">
                     <img :src="imgPath+firstInfo.coverUrl" width="100%" height="100%" />
                     <div class="policytitle">{{firstInfo.title}}</div>
                 </div>
              </div>
              <div>
             <!-- 地区 -->
              <div style="display:flex;align-items: center;height: 67px;width:520px;padding-left: 15px;">
                <div
                  v-if="this.active !== undefined"
                  style="display:flex;overflow-x: scroll;"
                  id="scroll"
                >
                  <div
                    v-for="item in dataList"
                    :label="item.label"
                    :key="item.value"
                    @click="getId(item)"
                    :class="[{ activeTabs: active == item.areaNo }]"
                    class="areaword"
                  >
                     <span>{{ item.areaName }}</span>
                     <span  :class="[{ scrollsmall: active == item.areaNo }]"></span>
                  </div>
                </div>
                <div class="national" style="display:flex" v-else>
                  <p>{{ $t("txt.hotNotice") }},</p>
                  <p>{{ $t("txt.noticeTxt1") }}</p>
                </div>
                <div style="display:flex;margin-top: -5px;margin-right:17px">
                  <img
                    src="~assets/images/home/icon_left_arrow.png"
                    alt=""
                    width="14"
                    height="14"
                    style="margin-right:5px;cursor: pointer;"
                     @click="scrollLeft"
                      v-if="this.active !== undefined && dataList.length>=7"
                  />
                  <img
                    src="~assets/images/home/icon_right_arrow.png"
                    alt=""
                    width="14"
                    height="14"
                     @click="scrollRight"
                     style="cursor: pointer;"
                      v-if="this.active !== undefined && dataList.length>=7"
                  />
                </div>
              </div>
              <div
                class="content"
                v-for="(item, index) in policyList"
                :key="index"
              >
                <div style="display:flex;width:100%;align-items: center;">
                  <div class="circle"></div>
                  <p class="content-title" @click="toDetails(item.number)">
                    {{ item.title }}
                  </p>
                </div>
              </div>
              </div>
          
            </div>
          </div>
        </div>
        <div class="rightRecommend">
            <div class="rechead">
                <img src="~/assets/images/last/newhot_icon@2x.png" width="20" height="20" />
                <div class="word">热门推荐</div>
                <span class="des">解决项目产品问题</span>
            </div>
            <div class="reccontent" v-if="NineImage && NineImage.length>0">
                <div class="ebve" v-for="(t,index) in NineImage.slice(5)" :key="index*8" @click="goProject(t.number)">
                      <template v-if="t.coverUrls && t.coverUrls.length>0">
                           <div v-for="(newItem,index) in t.coverUrls" :key="index*6">
                             <template v-if="newItem.isCover == 1">
                                     <img class="aaa" :src='imgPath+newItem.url' v-if="newItem.url && (newItem.url.split('.')[1]=='jpeg' || newItem.url.split('.')[1]=='png' ||newItem.url.split('.')[1]=='jpg' ||newItem.url.split('.')[1]=='gif')" />                    
                                    <video 
                                    class="aaa"
                                    v-else-if="newItem.spUrl&&(newItem.spUrl!==''&&newItem.spUrl!==null)" 
                                    :poster="imgPath+newItem.spUrl"
                                    :src="imgPath + newItem.url"></video>
                                    <video v-else :src="imgPath + newItem.url"  class="aaa"></video>
                            </template>
                        </div>
                    </template>
                      <template v-else>
                          <img class="aaa" :src='imgPath+newItem.coverUrl' v-if="newItem.coverUrl&&(newItem.coverUrl.split('.')[1]=='jpeg' || newItem.coverUrl.split('.')[1]=='png' ||newItem.coverUrl.split('.')[1]=='jpg' ||newItem.coverUrl.split('.')[1]=='gif')" />
                          <video class="aaa" :src='imgPath+newItem.coverUrl' v-if="newItem.coverUrl &&(newItem.coverUrl.split('.')[1]=='mp4' || newItem.coverUrl.split('.')[1]=='avi' ||newItem.coverUrl.split('.')[1]=='mov')" />
                    </template>
                   <div>
                       <p class="tit">{{t.title}}</p>
                       <div class="fot">
                              <div class="zixun"  @click.stop="showQia()"></div>
                              <div class="liji" @click.stop="showQia()">立即咨询</div>
                       </div>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RightAnnouncement from "~/components/home/compontents/rightAnnouncement";
import { getArea, getPolicyList, getLocation,getFirst } from "@/api/home";
import { getAreaList } from "~/api/announcement";
export default {
  props:['NineImage'],
  components: {
    RightAnnouncement
  },
  data() {
    return {
      imgPath:process.env.CDN_BASE_URL,
      activeName: this.parentKey,
      active: this.areaNo,
      parentKey: "",
      value: "",
      address: "",
      tabPosition: "left",
      dataList: [],
      policyList: [],
      areaInfo: {},
      provinceValue: "",
      firstInfo:{}
    };
  },
  methods: {
    getFirstNotice(){
       getFirst().then(res=>{
         if(res.data.data){
            this.firstInfo = res.data.data
         }      
       })
    },
    scrollLeft(){
      document.getElementById('scroll').scrollLeft-=120
    },
    scrollRight(){
      document.getElementById('scroll').scrollLeft+=120
    },
    newmore() {
      let cityNo = this.area.areaNo;
      let provinceNo = this.area.parentNo;
      this.$router.push({
        name: "index-policy-announcement",
        query: {
          cityId: cityNo,
          provinceId: provinceNo
        }
      });
    },
    toDetails(num) {
      var id = num + 0 + 1;
      window.open("/policy/" + id);
    },
    toPolicy(){
          window.open('/policy/'+this.firstInfo.number+'0'+'1');
    },
    // 推荐跳转
    goProject(num){
           window.open('/project/'+num+2);
    },
    gogo(){
        this.$router.push({
        name: "index-policy-announcement"
      });
    },
    more() {
      if(sessionStorage.getItem('policySquareChildNO')){
         
      }else{
          // 默认取第一个(无点击操作情况下)
          if(this.dataList && this.dataList.length>=1 && this.dataList[0].areaNo){
            sessionStorage.setItem("policySquareChildNO",this.dataList[0].areaNo )
          }else{
            sessionStorage.setItem("policySquareChildNO",'' )
          }
          
      }
      this.$router.push({
        name: "index-policy-announcement"
      });
    },
    getId(data) {
      sessionStorage.setItem("policySquareChildNO",data.areaNo)
      this.active = data.areaNo;
      this.getList(data.areaNo);
    },
    //获取省下面的地级市
    getAreaList(data) {
      getArea(data).then(res => {
        if (res && res.data && res.data.data) {
          if (res.data.data.length > 1 && res.data.data.parentNo != 100000) {
            this.dataList = res.data.data;
            this.parentNo = res.data.data[0].parentNo;
            this.areaNo = res.data.data[0].areaNo;
            this.active = this.areaNo;
            this.getList(this.areaNo);
          } else {
            this.active = undefined;
            this.getList(100001);
          }
        } else {
          this.active = undefined;
          this.getList(100001);
        }
      });
    },
    //通知公告列表
    getList(value) {
      let param = {
        size: 8,
        areaNo: value
      };
      getPolicyList(param).then(res => {
        this.policyList = res.data.data.noticeList;
        this.areaInfo = res.data.data.area;
      });
    },
    showQia() {
      window.open(
        "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
        "",
        "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
      );
    }
  },
  computed: {
    getLocationState() {
      if (this.$store.state.Set_LocationNo !== null) {
        return this.$store.state.Set_LocationNo;
      } else {
        return 100001;
      }
    }
  },
  watch: {
    activeName(val) {
      this.parentKey = val;
      this.getList(val);
    },
    getLocationState(val) {
      // if(val !== null){
      this.getAreaList(val);
      // }else{
      //     this.getAreaList(100000);
      // }
    },
    policyList(val) {
      if (val != undefined) {
        if (val.length > 0) {
          this.provinceValue = val[0].provinceValue;
        } else {
          this.provinceValue = "";
        }
      } else {
        return false;
      }
    }
  },
  mounted() {
    if (this.$store.state.Set_LocationNo) {
      this.getAreaList(this.$store.state.Set_LocationNo);
    } else {
      this.getAreaList(100000);
    }
    this.getFirstNotice();
  }
};
</script>

<style lang="stylus" scoped>
@import './policySquare.styl'
</style>
<style scoped>
::-webkit-scrollbar {
  display: none;
}
.scrollnav{
  width: 980px;
  height: 1px;
  position: relative;
  background: #CECECE;
  top: -12px;
  left: 16px;
  opacity: 0.3;
}
/* .scrollsmall{
    width: 21px;
    height: 2px;
    background: #323232;
    opacity: 1;
    position: absolute;
    top: 32px;
    left: 24px;
} */
/* .area-list ::-webkit-scrollbar {
  width: 3px;
  
}
.area-list ::-webkit-scrollbar-track {
  border-radius: 3px;
  background: #eee;
}

.area-list ::-webkit-scrollbar-thumb {
  border-radius: 3px;
  width: 5px !important;
  height: 3px !important;
  background: #fa8d39;
} */
</style>
