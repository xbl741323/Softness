<template>
  <div>
    <div class="wrapper">
      <div class="header">
        <div style="height: 1.0666667rem">
          <div class="headerleft">
              <span class="text" @click="goCity">{{location}}</span>
              <img :src="require('@/assets/images/wotao/wotao_xiajiantou@2x.png')" alt @click="goCity">
              <span class="bor"></span>
              <img class="hotimg" :src="require('@/assets/images/wotao/sousuo_icon@2x.png')" alt>
              <!-- <img  class="hotimg" :src="require('@/assets/images/wotao/hot_icon@2x.png')" alt> -->
              <input class="search-input" :placeholder="hotSearch" v-model="searchValue" type="text" @keyup.13="toHistorySearch" @focus="toHistorySearch" />
          </div>
        </div>
        <div class="headerright" @click="toGlobalSearch">
          <button class="top-search-button">搜 索</button>
        </div>
      </div>
    </div>
    <div @touchmove.prevent @mousewheel.prevent class="area_box">
      <van-popup v-model="visible" round position="bottom">
        <van-picker 
          ref="refRegion"
          show-toolbar  
          :columns="areaList" 
          value-key="name" 
          @cancel="visible = false"
          @confirm="onConfirm"/>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { getLocation, getNewArea } from "@/api/home";
export default {
  data() {
    return {
      searchValue: "",
      location: "",
      hotSearch:'高新技术企业',
      hotData: [],
      identification:'',
      visible: false,
      areaList: [],
      region: [],
      areaNo: [],
      addSlots: [
        {
          flex: 1,
          values: [], //市数组
          className: "slot1",
          textAlign: "center",
          defaultIndex: 0,
        },
        {
          flex: 1,
          values: [],//区数组
          className: "slot2",
          textAlign: "center",
          defaultIndex: 0,
        },
      ],
      areaValue: [0, 0]
    };
  },
  methods: {
    onConfirm(value, index) {
      let areaNo = ''
      this.visible = false;
      this.areaValue = index
      this.location = this.filterCityName(value[1])
      this.$nextTick(()=>{
        areaNo = this.areaList[index[0]].no + ',' + this.areaList[index[0]].children[index[1]].no
        this.areaNo = areaNo
        this.$store.commit('Set_LocationNo', areaNo);
        sessionStorage.setItem('localAreaNo', areaNo);
        sessionStorage.setItem('localCity',this.location);
      })
      
    },
    filterCityName(str){
      var newstr = ''
      newstr = str.lastIndexOf('市') ? str.slice(0,str.lastIndexOf('市')) : str
      if(newstr.length>3){
        newstr = newstr.slice(0, 3) + '...'
      }
      return newstr
    },
    goCity(){
      this.visible = true
      this.$nextTick(()=>{
        if(this.visible){
          this.$refs.refRegion.setIndexes(this.areaValue)
        }
      })
    },
    toGlobal(item) {
      this.searchValue = item;
      this.toHistorySearch()
    },
    toHistorySearch() {
      if(!this.searchValue){
        this.searchValue = this.hotSearch
      }
      this.$router.push({
        path: "/globalSearch/searchFilter",
        query: {
          type: 1,
          keywords: this.searchValue,
          source: 1
        }
      });
    },
    toGlobalSearch() {
      if(!this.searchValue){
        this.searchValue = this.hotSearch
      }
      this.$router.push({
        path: "/search",
        query: {
          type: 1,
          keywords: this.searchValue,
          source: 1
        }
      });
    },
    prev() {
      this.$router.go(-1);
    },
    // 获取定位值
    getLocationData() {
      getLocation(this.identification).then(res=>{
            if(res.data.code != 1000){
                this.location = '合肥'
                this.$store.commit('Set_LocationNo','340000,340100');
                sessionStorage.setItem('localAreaNo','340000,340100');
                sessionStorage.setItem('localCity','合肥');
                this.getNewArea()
                return false
            } 
            if(res.data.data.areaName == '局域网'){
                this.location = '合肥';
                this.$store.commit('Set_LocationNo','340000,340100');
                sessionStorage.setItem('localAreaNo','340000,340100');
                sessionStorage.setItem('localCity','合肥');
                this.getNewArea()
                return false
            }
            if(res.data.data.cityNo){
                let no = res.data.data.areaNo + ',' + res.data.data.cityNo
                let cityName = res.data.data.city
                cityName = cityName.lastIndexOf('市') ? cityName.slice(0, cityName.lastIndexOf('市')) : cityName
                this.location = cityName;
                sessionStorage.setItem('localAreaNo', no);
                sessionStorage.setItem('localCity', cityName);
                this.$store.commit('Set_LocationNo', no);
            }else{
                this.location = '合肥';
                this.$store.commit('Set_LocationNo','340000,340100');
                sessionStorage.setItem('localAreaNo','340000,340100');
                sessionStorage.setItem('localCity','合肥');
            }
            if(res.data.data.identification){//定位返回信息
                localStorage.setItem('identification',res.data.data.identification)
            }
            this.getNewArea()
        }).catch(err=>{
            return err;
        });
    },
    // 获取地区数据
    getNewArea(){
      getNewArea().then(res => {
        if(res.data.code == 0){
          this.region = JSON.parse(JSON.stringify(res.data.data))
          this.areaList = res.data.data
          res.data.data.forEach(item => {
            item.children.forEach(cItem => {
              cItem.children = null
            });
          });
          sessionStorage.setItem('district', JSON.stringify(this.region))
          this.getAreaIndex()
        }
      }).catch(error => {
          console.log(error)
      })
    },
    // 根据定位地区编码查询索引
    getAreaIndex(){
      let val = sessionStorage.getItem('localAreaNo')
      let arr = val.split(',')
      let index1 = 0
      let index2 = 0
      this.areaList.forEach((item,index)=>{
        if(item.no == arr[0]){
          index1 = index
        }
        item.children.forEach((citem, cindex) => {
          if(citem.no == arr[1]){
            index2 = cindex
          }
        });
      })
      this.areaValue = [index1, index2]
    }
  },
  mounted() {   
    if (localStorage.getItem("identification")) {
      this.identification = localStorage.getItem("identification")
    }
    if(sessionStorage.getItem('localAreaNo')){
      this.location = sessionStorage.getItem('localCity')
      this.getNewArea()
    }else{
      this.getLocationData();
    }
  },
};
</script>

<style lang="stylus" scoped>
.header {
  display: flex;
  height: 0.96rem;
  line-height: 0.96rem;
  border-radius: 0.48rem;
  background: #fff;  
  justify-content: space-between;
  align-items: center;
  padding-left: 0.4rem;
  .headerleft{
      display flex
      align-items: center;
      position relative
      top 0.05333333333333334rem
      .text{
          font-weight 550
          font-size: $fs14;
          color: #333333;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 80px;
      }
      img{
          width: $fs16;
          height $fs16;
      }
      .hotimg{
          margin-left: 9px;
      }
      .bor{
        width: 1px;
        height: $fs20;
        background: #e4e4e4;
        display: inline-block;
        margin-left: 6px;
      }
  }
   .search-input{
      border: none;
      font-size: $fs14;
      position: relative;
      color: #333
      top: 0px;
      left: 8px;
      height: 0.96rem
      line-height: 0.96rem
   }

  .headerright{
      img{
          width 16px
          height 16px
          position: relative;
          top: 3px;
          right:15px;
      }
      .top-search-button{
        width: 1.6rem
        height: .89rem
        line-height: .89rem
        color: #fff
        background: $bgColorB
        border: none
        margin: .1rem .05rem .1rem .1rem
        font-size: .36rem
        border-radius: .32rem .84rem .84rem .32rem;
      }
  }
}
.area_wrapper {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
    .area_dialog {
      background: #fff;
      border-radius: 0.5rem;
      width: 10rem;
      height: 10rem;
      position: absolute;
      bottom: 0;
    }
}
</style>
<style scoped>
.area_box .van-popup {
  padding-bottom: 1.25rem;
}
</style>
