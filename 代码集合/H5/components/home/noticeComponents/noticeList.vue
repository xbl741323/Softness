<template>
  <div class="list">
     <!-- 通知公告 -->
    <div class="slider" v-if="this.active && (type == 0)&&(shwoStatus == false)">
      <div class="mask-block"></div>
      <div class="slider-list">
        <ul>
          <li
            v-for="(item, index) in sliderData"
            :key="index"
            :class="[{ activeTabs: active == item.areaNo }, 'slider-item']"
            @click="chooseItem(item)"
          >
            {{ item.areaName }}
          </li>
        </ul>
      </div>
    </div>
     <!-- 政策汇编 -->
    <div class="slider" v-if="type == 1">
      <!-- <div class="mask-block"></div> -->
      <div class="slider-list">
        <ul>
          <li
            v-for="(item, index) in policyList"
            :key="index"
            :class="[{ activeTabs: activeP == item.optionName },'slider-item',]"
            @click="choosePolicy(item)"
            style="width:50%;text-align: center;"
          >
            {{ item.optionName }}
          </li>
          <div v-if="policyList.length>=2" style="width: 0px;height: 16px;border: 1px solid #B7BBC2;opacity: 1;position: absolute;left: 50%;top: 13px;"></div>
        </ul>
      </div>
    </div>
    <!-- 卧涛问答 -->
    <div class="slider" v-if="type == 2">
      <!-- <div class="mask-block"></div> -->
      <div class="slider-list">
        <ul>
          <li
            v-for="(item, index) in troubleList"
            :key="index"
            :class="[{ activeTabs: activeT == item.optionName },'slider-item',]"
            @click="chooseTrouble(item)"
            style="width:50%;text-align: center;"
          >
            {{ item.optionName }}
          </li>
           <div v-if="troubleList.length>=2" style="width: 0px;height: 16px;border: 1px solid #B7BBC2;opacity: 1;position: absolute;left: 50%;top: 13px;"></div>
        </ul>
      </div>
    </div>
      <!-- 行业资讯 -->
    <div class="slider" v-if="type == 10">
      <!-- <div class="mask-block"></div> -->
      <div class="slider-list">
        <ul>
          <li
            v-for="(item, index) in industryList"
            :key="index"
            :class="[{ activeTabs: activeI == item.optionName },'slider-item',]"
            @click="chooseIndustry(item)"
          >
            {{ item.optionName }}
          </li>
        </ul>
      </div>
    </div>
     <!-- 列表 -->
    <ul class="list-box" v-if="listDataStatus == 1">
      <li
        v-for="(item, index) in listData"
        :key="index"
        @click="toDetail(item, index)"
        style="position:relative"
      >
        <div class="margin-16 list-item">
          <div class="list-data">
            <div :class="[{ 'question-color': type == 2 }]"></div>
            <h3>{{ item.title }}</h3>
          </div>
          <p>{{ item.createTime }}</p>
        </div>
        <div style="position:absolute;top: 35px;right: 30px;"><i class="el-icon-arrow-right" style="font-size: 18px;"/></div>
      </li>      
    </ul>
    <div class="item-img" v-if="listDataStatus == 0 && (type != 0)">
        <img :src="require('@/assets/images/home/icon_nodata@3x.png')" alt />
        <p>暂无数据</p>
    </div>
    <div class="item-loading-img" v-if="listDataStatus == null">
        <!-- <img :src="require('@/assets/images/policySquare/icon_loading.gif')" alt />
        <p>加载中</p> -->
    </div>
    <div class="click-more" @click="clickMore()">
      <p>
        <span>更多</span>
        <span><img :src="imgUrl" alt="" /></span>
      </p>
    </div>
  </div>
</template>

<script>
import { getCity, getPolicyList, getPolicyClassList, getTroubleClassList,getIndustryClassList} from "~/api/home";
export default {
  props: ["type"],
  data() {
    return {
      imgUrl: require("~/assets/images/technology/pointer.png"),
      shwoStatus:false,
      translateObj: {},
      activeName: this.parentKey,
      active: this.areaNo,
      activeP: "",
      activeT: "",
      activeI:"",
      parentKey: "",
      listData: [],
      sliderData: [],
      policyList: [],
      troubleList: [],
      industryList:[],
      moreData: "",
      localAreaNo:'',
      provinceCity:'',
      listDataStatus:null,
      params:{},
      timer: null,
    };
  },
  computed: {
    getLocationState() {
      return this.$store.state.areaNo;
    },
  },
  methods: {
    toDetail(item, index) {
      const newPath = this.$router.resolve({
        path: "/policy/" + item.number + this.type + 1
      });
      window.open(newPath.href, "_self");
    },
    chooseItem(item) {
      this.translateObj = item;
      this.active = item.areaNo;
      this.getList(item.areaNo);
    },
    //获取省下面的地级市
    getCityList() {
      this.sliderData = [];
      clearTimeout(this.timer);
      //判断显示横向滑动（定位全国不显示）
      if(this.getLocationState==100000 && !sessionStorage.getItem("localAreaNo") ||  sessionStorage.getItem("localAreaNo") == 100000){
        this.shwoStatus = true
      }else{
        this.shwoStatus = false
      }
      // 本地存储定位数据有值直接使用本地存储数据
      if(this.localAreaNo){
        this.provinceCity = this.localAreaNo
      } else {
        this.provinceCity = this.getLocationState;
      }      
      console.log(this.provinceCity,'ooooooooooooooooooo')
      this.timer = setTimeout(() => {
        getCity(this.provinceCity).then((res) => {
          if (res.data) {
            this.translateObj = res.data[0];
            this.sliderData = res.data;
            this.parentNo = res.data[0].parentNo;
            this.areaNo = res.data[0].areaNo;
            this.active = this.areaNo;
            this.getList(this.areaNo);
          } else {
            this.active = null;
            this.getList(100001);
          }        
          console.log(this.sliderData,'ppppppppppppppppppp')
          this.$forceUpdate();
        });      
      }, 500)
    },
    //获取通知公告列表数据
    getList(value) {
      let param = {
        size: 5,
        areaNo: value,
      };
      getPolicyList(param).then((res) => {
        if (this.type == 0) {
          this.listData = res.data.noticeList;
          this.$nextTick(() => {
            if(this.listData.length>0){
                this.listDataStatus = 1
            } else {
              this.listDataStatus = 0
            }
          })
        }
      });
    },
    // 获取政策数据
    getPolicyData() {
      if(this.localAreaNo){
        this.params = {
          size: 5,
          areaNo: this.localAreaNo,
        };
      } else {
        this.params = {
          size: 5,
          areaNo: this.getLocationState,
        };
      }  
      getPolicyClassList(this.params).then((res) => {
          this.policyList = res.data;
          this.$emit('getPolicyList', this.policyList)
          this.activeP = this.policyList[0].optionName;
          if (this.type == 1) {
            this.listData = this.policyList[0].polices;
            this.$nextTick(() => {
              if(this.listData.length>0){
                  this.listDataStatus = 1
              } else {
                this.listDataStatus = 0
              }
            })
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    // 获取卧涛问答数据
    getTroubleData() {
      if(this.localAreaNo){
        this.params = {
          size: 5,
          areaNo: this.localAreaNo,
        };
      } else {
        this.params = {
          size: 5,
          areaNo: this.getLocationState,
        };
      }  
      getTroubleClassList(this.params).then((res) => {
          this.troubleList = res.data;
          this.activeT = this.troubleList[0].optionName;
          if (this.type == 2) {
            this.listData = this.troubleList[0].polices;
            this.$nextTick(() => {
              if(this.listData.length>0){
                  this.listDataStatus = 1
              } else {
                this.listDataStatus = 0
              }
            })
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    // 获取行业资讯数据
    getIndustryData() {
      if(this.localAreaNo){
        this.params = {
          size: 5,
          areaNo: this.localAreaNo,
        };
      } else {
        this.params = {
          size: 5,
          areaNo: this.getLocationState,
        };
      }  
      getIndustryClassList(this.params).then((res) => {
         console.log(res.data)
          this.industryList = res.data;
          this.activeI = this.industryList[0].optionName;
          if (this.type == 10) {
            this.listData = this.industryList[0].polices;
            this.$nextTick(() => {
              if(this.listData.length>0){
                  this.listDataStatus = 1
              } else {
                this.listDataStatus = 0
              }
            })
          }
        }).catch((err) => {
          console.log(err);
        });
    },
    choosePolicy(item) {
      this.translateObj = item;
      this.activeP = item.optionName;
      this.moreData = item.classSetNumber;
      if (this.type == 1) {
        this.listData = item.polices;
        this.$nextTick(() => {
          if(this.listData.length>0){
              this.listDataStatus = 1
          } else {
            this.listDataStatus = 0
          }
        })
      }
    },
    chooseTrouble(item) {
      this.translateObj = item;
      this.moreData = item.classSetNumber; //点击更多时传值用
      this.activeT = item.optionName;
      if (this.type == 2) {
        this.listData = item.polices;
        this.$nextTick(() => {
          if(this.listData.length>0){
              this.listDataStatus = 1
          } else {
            this.listDataStatus = 0
          }
        })
      }
    },
    chooseIndustry(item) {
      this.translateObj = item;
      this.moreData = item.classSetNumber; 
      this.activeI = item.optionName;
      if (this.type == 10) {
        this.listData = item.polices;
        this.$nextTick(() => {
          if(this.listData.length>0){
              this.listDataStatus = 1
          } else {
            this.listDataStatus = 0
          }
        })
      }
    },
    // 控制显隐
    changeValue(index) {
      if (index == 1) {
        this.translateObj = this.policyList[0];
      } else if (index == 2) {
        this.translateObj = this.troubleList[0];
      } else if(index ==3){
         this.translateObj = this.industryList[0];
      }
    },
    clickMore() {
      //点击更多跳转
      if (this.type == 0) {
        this.$router.push({
          path: "/policy/announcement",
          query: {
            areaObj: this.translateObj,
          },
          //带入省数据
        });
      } else if (this.type == 1) {
        if (this.moreData == "") {
          this.moreData = this.policyList[0].classSetNumber;
        }
        this.$router.push({
          path: "/policy/assembly",
          query: {
            obj: this.translateObj,
          },
        });
        //带入分类数据
      } else if(this.type == 2){
        if (this.moreData == "") {
          this.moreData = this.troubleList[0].classSetNumber;
        }
        this.$router.push({
          path: "/policy/troubleList",
          query: {
            obj: this.translateObj,
          },
        });
        //带入分类数据
      }else{
         if (this.moreData == "") {
          this.moreData = this.industryList[0].classSetNumber;
        }
        this.$router.push({
          path: "/policy/industryinfo",
          query: {
            obj: this.translateObj,
          },
        });
        //带入分类数据
      }
    },
  },
  watch: {
    activeName(val) {
      this.parentKey = val;
      this.getList(val);
    },
    getLocationState(val) {      
      this.getPolicyData(val);
      this.getTroubleData(val);
      this.getIndustryData(val)
      this.getCityList(val);
      this.$forceUpdate();
    },
  },
  mounted() {
    console.log("输出获取的城市",this.getLocationState)
    // 判断localStorage是否有值
    if (sessionStorage.getItem("localAreaNo")) {
      this.localAreaNo = sessionStorage.getItem("localAreaNo");
    } else {
    };
    //防止多次调用接口
    if (this.type == 0) {
      this.getCityList();
    } else if (this.type == 1) {
      this.getPolicyData();
    } else if(this.type == 2){
      this.getTroubleData();
    }else{
      this.getIndustryData()
    }
  },
};
</script>

<style scoped>
.list {
  width: 100%;
  position: relative;
}
.click-more {
  width: 100%;
  height: 1.01333333rem;
  line-height: 1.01333333rem;
}
.click-more p {
  /* float: right;
  margin-right: 0.426666666rem; */
  color: #999;
  font-size: 0.32rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.click-more img{
  width: 0.1333333333333333rem;
  height: 0.1778666666666667rem;
  margin-left: 0.1066666666666667rem;
}
.list-title {
  margin: 0.5rem 0 0.46rem 0;
  border-left: 2px solid #ff3c31;
  padding-left: 0.2rem;
  font-size: 0.373333333rem;
  color: #333;
  line-height: 0.373333333rem;
}
.slider {
  width: 100%;
  padding: 0 0.426666666rem;
  position: relative;
  display: flex;
  align-items: center;
  line-height: 1.066667rem;
  height: 1.066667rem;
  box-shadow: 0px 3px 3px rgba(100, 98, 98, 0.1);
}
.mask-block {
  position: absolute;
  width: 0.85333333333rem;
  height: 1.066667rem;
  right: 0;
  top: 0;
  background: #fff;
  box-shadow: -3px 0px 6px rgba(51, 51, 51, 0.13);
  opacity: 0.78;
}
.slider-list {
  width: 100%;
}
.slider-list ul {
  display: -moz-box; /*Firefox*/
  display: -webkit-box; /*Safari,Opera,Chrome*/
  display: flex;
  /* display: flex; */
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}
.slider-item {
  font-size: 0.373333333rem;
  display: block;
  color: #666;
  line-height: 1.1rem;
  height: 1.066667rem;
  margin-right: 0.6rem;
}
.slider-list ul::-webkit-scrollbar {
  display: none;
}
.list-box {
  width: 100%;
  position: relative;
}
/* .list-box li:nth-child(2n + 2) {
  background: #f4f6f8;
} */
.list-item {
  padding: 0.32rem 0;
  /* border-bottom: 1px dashed #e7e6eb; */
  border-bottom: 1px solid #e7e6eb9e;
}
.list-data {
  position: relative;
}
.list-data h3 {
  color: #333;
  font-size: 0.373333333rem;
  /* width: 100%; */
  width: 90%;
  line-height: 0.586666667rem;
  /* padding-left: 0.42rem; */
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.list-item p {
  color: #999;
  margin-top: 0.32rem;
  font-size: 0.32rem;
  /* padding-left: 0.42rem; */
}
.item-img {
  width: 3rem;
  height: 3rem;
  margin: 1rem auto;
}
.item-loading-img{
  width: 1.2rem;
  height: 1.2rem;
  margin: 1rem auto;
}
.item-loading-img p{
  text-align: center;
  font-size: .32rem;
  color: #666;
  margin-top: .4rem;
}
.item-loading-img img{
  width: 100%;
}
.item-img img{
  width: 100%;
}
.item-img p{
  text-align: center;
  font-size: .32rem;
  color: #666;
  margin-top: .4rem;
}
.diamond {
  position: absolute;
  width: 0.2rem;
  height: 0.2rem;
  left: 2px;
  margin-top: 0.18rem;
  background: #3f93d6;
  transform: rotate(45deg);
}
/* .question-color{
    background: #FD651C !important;
} */
.activeTabs {
  color: #36a6fe;
}
</style>
