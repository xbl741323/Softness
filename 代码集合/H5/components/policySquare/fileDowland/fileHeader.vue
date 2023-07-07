<template>
<client-only>
  <div class="nutice_header">
    <mt-header :title="title" class="mutice_header_title">
      <router-link to slot="left" class="mutice_header_left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </router-link>
    </mt-header>
    <div class="search">
      <div class="search-head">
        <div class="search-input">
          <input
            class="input-box"
            type="text"
            @keyup.13="searchContent"
            v-model.trim="searchValue"
            :placeholder="placeHoldContent"
          />
        </div>
        <div class="search_btn" @click="searchContent()">搜索</div>
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
  </client-only>
</template>

<script>
import { getLocation, getNewArea } from "@/api/home";
export default {
  props: ["title", "type","content"],
  data() {
    return {
      searchWindow: true,
      searchValue: "",
      historyData: [],
      location: '',
      visible: false,
      areaList: [],
      region: [],
      areaNo: '',
      placeHoldContent:'搜索想要的内容',
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
      areaValue: [0, 0],
      addr: ''
    };
  },
  filters: {
    filterName(val){
      if(val&&val.length>2){
        return val.slice(0,2) + '...'
      }else{
        return val
      }
    }
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
          this.areaList = res.data.data
          res.data.data.forEach(item => {
            item.children.forEach(cItem => {
              cItem.children = null
            });
          });
          this.region = JSON.parse(JSON.stringify(res.data.data))
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
    },
    goCity(){
      this.visible = true
      this.$nextTick(()=>{
        if(this.visible){
          this.$refs.refRegion.setIndexes(this.areaValue)
        }
      })
    },
    searchContent(){
      this.$emit('search', this.searchValue)
    }
  },
  watch: {
    searchValue(val){
      if(val){
        this.$emit('changeSort', {
          name: '综合排序',
          value: 'hottest'
        })
      }else{
        this.$emit('changeSort', {
          name: '发布时间',
          value: 'latest'
        })
      }
    }
  },
  mounted() {
   if(sessionStorage.getItem('localAreaNo')){
      this.location = sessionStorage.getItem('localCity')
      this.getNewArea()
    }else{
      this.getLocationData();
    }
    if(this.content){
      this.placeHoldContent = this.content
    }
  }
};
</script>

<style lang="stylus" scoped>
.nutice_header {
  top: 0px;
  position: fixed;
  width: 100%;
  z-index: 10;
}

.mutice_header_title {
  font-size: 16px
  line-height 16px
  height: 1.2rem;
  border-bottom 1px solid #F4F6F8
  font-weight: 500
}

.mutice_header_left {
  width: 0.26666666667rem;
  height: 0.48rem;
}

.mutice_header_right {
  width: 0.6rem;
  height: 0.6rem;
  color #333333
}

.search {
  padding: 0.2rem 0;
  background-color: #fff;
}

.search-title {
  display: flex;
}

.search-title h3 {
  flex: 1;
  color: #333;
  margin-left: 4px;
  font-size: 16px;
}

.search-title i {
  color: #999;
  font-size: 0.4rem;
}

.search-recommend {
  margin: 0.6rem 0 0.4rem 0;
  display: flex;
  flex-direction: column;
}

.flexDiv {
  display: flex;
  align-items: center;
}

.search-item {
  background: rgba(241, 241, 241, 1);
  line-height: 0.48rem;
  padding: 0.1rem 0.3rem;
  font-size: 0.24rem;
  color: #666;
  float: left;
  margin: 0 0.3rem 0.3rem 0;
}

.search-head {
  width: 100%;
  display: flex;
  align-items: center;
}

.search-head .back-icon {
  color: #3D85DC;
}

.search-input {
  width: 8rem;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 0.96rem;
  background: #f9fafe;
  border: .0156rem solid #36a6fe;
  border-radius: .2813rem;
  margin-left: 0.36rem;
}

.search-ico {
  position: absolute;
  left: 20%;
  color: #D1D1D6;
  width: .5625rem;
  height: .5625rem;
  font-size: 18px;
}

.input-box {
  width: 93%;
  margin-left: 5%;
  line-height: .7rem;
  background: #F8F8F8;
  border: none;
  outline: none;
  font-size: 14px;
  padding-left: 0.25rem;
}

.input-box :before {
  content: '\e6ad', ;
}

.search-cont {
  margin-top: 0.4rem;
  margin-left: 0.1rem;
}

.search_btn {
  height: .9375rem;
  line-height: .9375rem;
  display: flex;
  justify-content: center;
  font-size: var(--size-14);
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 500;
  color: #333333;
  letter-spacing: -0.15px;
  padding-left: 0.2rem;
}
</style>

<style>
.nutice_header .mint-header{
  background: #ffffff;
}
.nutice_header .mintui-back:before{
  color: #333333;
  font-size: 18px;
}
.nutice_header .mint-header-title{
  color: #333333;
  font-size: 16px;
  line-height: 1.2rem;
  height: 1.2rem;
  font-weight: 500;
}
.font-sty {
  font-size: 1.875rem;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 600 !important;
  color: #333333;
  display: inline-block;
  padding-left: .25rem;
  width: 1.9rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
.area_box .van-popup {
  padding-bottom: 2rem;
}
</style>