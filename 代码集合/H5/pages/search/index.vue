<template>
  <div v-loading.fullscreen.lock="loadingStatus">
    <div class="global">
      <!-- 全局搜索框 -->
      <div class="search-head-all">
        <div class="iconfont back-icon" @click="goBack">&#xe641;</div>
        <div class="search-input">
          <div class="local-box">
            <div class="local-city" @click="goCity">{{location}}</div>
            <img src="@/assets/images/order/xiala_icon.png" alt="" @click="goCity">
          </div>
          <input class="input-box" type="text" @keyup.13="keywordsSearch" v-model="searchValue" :placeholder="hotSearch"/>
        </div>
        <div class="search_btn" @click="keywordsSearch">搜索</div>
      </div>
      <div>
        <div class="data-count" v-if="loading!=0">
          <div class="pro-filter">
            <div v-for="(i,idx) in filters" :key="idx" class="filter-item" @click="chooseFilter(i)">
              <span class="filter-txt">{{i.otherName | filterName}}</span>
              <img :class="[choosed == i.type && searchWindow ? 'arrowTransformReturn' :'arrowTransform']" src="~/assets/images/home/icon_pack up@2x.png" alt="">
            </div>
          </div>
        </div>
        <popup v-model="searchWindow" :middle="true">
          <comprehension v-if="choosed == 'comprehension'" :choosed="choosed" @navChange="getNavValue" @itemChange="getNewItem"/>
          <areas v-if="choosed == 'area'" @childChange="chooseArea" :choosed="choosed" :areaIndex.sync="addr" :areaList="districtList"/>
          <types v-if="choosed == 'types'" :typeIndex.sync="typeIndex" @childChange="chooseType" />
          <most v-if="choosed == 'most'" :mostIndex.sync="sort" @childChange="chooseMost" />
          <putunder v-if="choosed == 'putunder'" :putunderIndex.sync="putunder" @childChange="choosePutunder" :newList="newList"/>
          <level v-if="choosed == 'level'" :levelIndex.sync="level" @childChange="chooseLevel" />
        </popup>
        <div v-if="loading==1" class="content-list" ref="contentList">
          <!-- 列表显示 -->
          <search-list v-if="!showProduct" :list="searchList" />
          <products v-else :list="searchList" />
          <div class="page_limit" v-if="this.typeCount>50">
            <el-pagination
              :page-size="params.size"
              @current-change="handleChange"
              background
              :current-page="params.current"
              :pager-count="5"
              layout="prev, pager, next"
              :total="typeCount"
            ></el-pagination>
          </div>
        </div>
        <div v-if="loading==2||loading==3" class="err-tips">
          <p v-if="loading==2">暂无匹配数据，请换个搜索条件试试吧</p>
          <p v-if="loading==3">暂无数据，请稍后重试</p>
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
    </div>
  </div>
</template>

<script>
import searchList from "@/components/search/list";
import products from "@/components/search/productList";
import comprehension from "@/components/search/comprehension";
import areas from "@/components/search/arealist";
import types from "@/components/search/types";
import most from "@/components/search/most";
import level from "@/components/search/level";
import putunder from "@/components/search/putunder";
import Popup from "@/components/policySquare/searchPopup";
import { getHotSearch } from "@/api/policySquare";
import statics from '@/components/search/datas'
import { globalSearch, pageGlobalSpu, getPolicySquare, getTechResult, getTechRequire } from "@/api/search";
import {getLeimu} from "@/api/allserver"
import { getLocation,getNewArea } from "@/api/home"
import * as CodeMsg from "@/api/CodeMsg";
export default {
  components: {
    searchList,
    Popup,
    areas,
    types,
    most,
    products,
    comprehension,
    putunder,
    level
  },
  head () {
    return {
       title: "卧涛科技-搜索",    
    }
  },
  data() {
    return {
		historyData:[],
		loadingStatus: true,
		searchWindow:false,
		searchValue: '',
		curSearchKey: 0,
		loading:0,
		timeScoped:'',
		hotSearch:'',
		indexP:'',
		indexC:'',
		typeIndex: 0,
		params:{
			current:1,
			size: 50
		},
		dataAll:'',
		typeCount:0,
		proType:null,
		searchList:[],
    sort: 'hottest',
    level: 0,
    putunder: 0,
		choosed:'',
		filters:JSON.parse(JSON.stringify(statics.filters)),
		classifyList: statics.classifyList,
		generateAttributeList: [
			{
				attributeId: 1,
				attributeValueList:[]
			}
		],
    navIndex: 0,
    itemIndex: 0,
    newList: [],
    visible: false,
    areaList: [],
    region: [],
    newAreaList: [],
    areaNo: '',
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
    districtList:[],
    showProduct: false,
    latestAreaNo: '',
    location: ''
    }
  },
  filters: {
    filterName(val){
      if(val!=''&&val.length>4){
        return val.slice(0,4) + '...'
      }else{
        return val
      }
    }
  },
  methods: {
    // 地区切换
    onConfirm(value, index) {
      let areaNo = ''
      this.visible = false;
      this.areaValue = index
      this.location = this.filterCityName(value[1])
      this.$nextTick(()=>{
        areaNo = this.areaList[index[0]].no + ',' + this.areaList[index[0]].children[index[1]].no
        if(sessionStorage.getItem("localAreaNo")){
          this.areaNo = areaNo != '' ? areaNo : sessionStorage.getItem("localAreaNo")
        }
        this.$store.commit('Set_LocationNo', areaNo);
        sessionStorage.setItem('localAreaNo', areaNo);
        sessionStorage.setItem('localCity',this.location);
      })
      
    },
    // 处理省市名
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
                this.areaNo = '340000,340100'
                this.$store.commit('Set_LocationNo','340000,340100');
                sessionStorage.setItem('localAreaNo','340000,340100');
                sessionStorage.setItem('localCity','合肥');
                this.getNewArea()
                return false
            } 
            if(res.data.data.areaName == '局域网'){
                this.location = '合肥';
                this.areaNo = '340000,340100'
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
                this.areaNo = no
                sessionStorage.setItem('localAreaNo', no);
                sessionStorage.setItem('localCity', cityName);
                this.$store.commit('Set_LocationNo', no);
            }else{
                this.location = '合肥';
                this.areaNo = '340000,340100'
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
      this.areaNo = sessionStorage.getItem("localAreaNo")
      this.addr = sessionStorage.getItem("localAreaNo").split(',')[1]
      getNewArea().then(res => {
        if(res.data.code == 0){
          this.region = JSON.parse(JSON.stringify(res.data.data))
          this.areaList = res.data.data
          res.data.data.forEach(item => {
            item.children.forEach(cItem => {
              if(cItem.no == this.addr){
                this.districtList = [cItem].concat(cItem.children)
              }
              cItem.children = null
            });
          });
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
    // 显示/隐藏地区弹窗
    goCity(){
      this.visible = true
      this.$nextTick(()=>{
        if(this.visible){
          this.$refs.refRegion.setIndexes(this.areaValue)
        }
      })
    },
    // 页面跳转
    goHistory(item){
        this.searchValue = item
        this.toNewpage()
    },
    // 清除历史记录
    delehistory(){
      if(sessionStorage.getItem('searchHistory')){
          sessionStorage.removeItem('searchHistory')
          this.historyData = []
      }
    },
    chooseFilter(i){
      this.choosed = i.type;
      this.searchWindow = !this.searchWindow;
    },
    scrollRight(num){
       document.getElementById('scroll').scrollLeft+=num
    },
    handleCommand(command){
      this.timeId = command.id;
      this.timeScoped = command.name;
      this.toNewpage()
    },
    goBack() {
      // console.log(Number(this.$route.query.source))
      // let source = Number(this.$route.query.source)
      // if(source == 1){
      //   this.$router.push({
      //     path: "/",
      //   });
      // }
      // if(source == 2){
      //   this.$router.push({
      //     path: "/classification",
      //   });
      // }
      this.$router.go(-1);
    },
    //选择类型查询
    chooseType(data){
      this.searchWindow = !this.searchWindow;
      this.filters.forEach(item => {
        if(item.type=='types'){
          item.otherName = data.title
        }
      });
      this.proType = data.type;
      this.toTop()
      this.getList()
    },
    // 选择综合排序查询
    chooseMost(data){
      this.sort = data.type
      this.searchWindow = !this.searchWindow;
      this.filters.forEach(item => {
        if(item.type=='most'){
          item.otherName = data.title
        }
      });
      this.toTop()
      this.getList()
    },
    // 选择归口
    choosePutunder(data){
      this.putunder = data.id
      this.searchWindow = !this.searchWindow;
      this.filters.forEach(item => {
        if(item.type=='putunder'){
          item.otherName = data.name
        }
      });
      this.toTop()
      this.getList()
    },
    // 选择级别
    chooseLevel(data){
      this.level = data.type
      this.searchWindow = !this.searchWindow;
      this.filters.forEach(item => {
        if(item.type=='level'){
          item.otherName = data.title
        }
      });
      this.toTop()
      this.getList()
    },
    // 选择区域查询
    chooseArea(data){
      this.searchWindow = !this.searchWindow;
      this.latestAreaNo = data.no
      this.filters.forEach(item => {
        if(item.type=='area'){
          if(data.name.indexOf(this.location)!=-1){
            item.otherName = '地区'
          }else{
            item.otherName = data.name
          }
        }
      });
      this.toTop()
      this.getList()
    },
    // 获取搜索数据
    getAreaData(){
      this.loadingStatus = true
      let params = {
        keyword: this.searchValue,
        categoryIdList: [],
        sort: this.sort,
        spuArea: '',
        spuKinds: this.putunder == 0 || this.proType == 0 || this.proType == 2  ? null : this.putunder,
        spuLevel: this.level == 0 || this.proType == 0 || this.proType == 2 ? '全部' : this.level,
        pageNo: this.params.current,
        pageSize: this.params.size,
      };
      if(this.proType){
        params.categoryIdList = (this.proType == 2 || this.proType == 0) ? [3,4,5,6] : [this.proType]
      }
      let address = sessionStorage.getItem("localAreaNo").split(',')[1]
      params.spuArea = this.addr == this.latestAreaNo ? this.addr : this.latestAreaNo
      if(params.spuArea==''){
        params.spuArea = address
      }
      this.showProduct = true
      pageGlobalSpu(params).then(res=>{
        if(res.code == 0) {
          this.searchList = res.data.records;
          this.typeCount = res.data.total;
          if(this.typeCount >0 ){						
            this.loading = 1
          } else {
            this.loading = 2
          }
        } else {
          this.loading = 3
        }
        this.loadingStatus = false
      });
      this.searchWindow = false
    },
    setCurSearchKey (val) {
        this.curSearchKey = val;
        this.toNewpage()          
    },
    toNewpage(){   
        const newPath = this.$router.resolve({
        path: "/search",
        query: {
            type: this.curSearchKey, 
            keywords: this.searchValue  
          }
        })
        this.getList()
        window.open(newPath.href, "_self")
    },    
    keywordsSearch(){
        this.loadingStatus = true
        this.toNewpage()
    },
    handleChange(val) {
      this.params.current = val;
      this.getList()
    },
    // 获取列表
    getList(){
      if(this.navIndex==0){
        this.getAreaData();
      }else if(this.navIndex==1){
        this.getPolicySquareList();
      }else{
        this.itemIndex = 0 && this.getTechResultList()
        this.itemIndex = 1 && this.getTechResultList()
      }
    },
    // 获取关键字搜索
    getSearchData(){
        this.loadingStatus = true
        if(this.searchValue){
          this.$set(this.params, 'keywords', this.searchValue)
        } else {
          this.$set(this.params, 'keywords', this.hotSearch)
        }
        if(this.curSearchKey != 1){
          this.$set(this.params, 'type', this.curSearchKey)
        }
        if(sessionStorage.getItem('searchHistory')){
            let arr = JSON.parse(sessionStorage.getItem('searchHistory'))
            this.historyData = arr   
            arr.unshift(this.params.keywords)
            sessionStorage.setItem('searchHistory',JSON.stringify(Array.from(new Set(arr))))
        }else{
          this.historyData = []
           sessionStorage.setItem('searchHistory',JSON.stringify([this.params.keywords]))
        }
        globalSearch(this.params).then((res) => {
            this.typeCount = res.data.list.count;
          if(res.data.list.count>0){
            this.dataAll = res.data.all;
            this.searchList = res.data.list.object;
            this.loading = 1
          } else if(res.data.list.count==0){
            this.loading = 2
          } else if(res.code==1){
            this.loading = 3
          } else {
            this.loading = 3
          }       
        	this.loadingStatus = false
        }).catch((err) => {
          console.log(err);
        });
    },
    // 热词搜索
    searchData(){        
        getHotSearch(5).then(res=>{
            this.hotSearch = res.data[0];            
        }).catch((err) => {
          console.log(err);
        });
        this.resetChoose()
    },
    // 重置
    resetChoose(){
      this.navIndex = 0
      this.itemIndex = 0
      this.sort = 'hottest'
      this.level = 0
      this.putunder = 0
      this.typeIndex = 0
      this.params.current = 1
      this.params.size = 50
      this.filters = JSON.parse(JSON.stringify(statics.filtersDefault))
      this.filters[0].otherName = '企业服务'
      this.filters[1].otherName = this.filters[1].name
      this.filters[2].otherName = this.filters[2].name
      this.getList()
    },
    // tab切换
    getNavValue(val){
      this.sort = 'hottest'
      this.level = 0
      this.putunder = 0
      this.typeIndex = 0
      if(sessionStorage.getItem("localAreaNo")){
        let address = sessionStorage.getItem("localAreaNo").split(',')[1]
        this.addr = address
        this.latestAreaNo = address
      }
      this.params.current = 1
      this.navIndex = val
      this.filters.forEach(item =>{
        if(item.type=='comprehension'){
          item.otherName = val == 0 ? '企业服务': val == 1 ? '政策广场' :  '技术成果'
        }else{
          item.otherName = item.name
        }
      })
      this.showProduct = val == 0 ? true:false
      this.getNewList({navIndex: val, item : {id: 0, text: val==0?'全部':val==1?'政策广场':'技术成果'}})
    },
    // tab子选项切换
    getNewItem(val){
      this.searchWindow = !this.searchWindow;
      this.navIndex = val.navIndex
      this.itemIndex = val.item.id
      this.getNewList(val)
    },
    // 获取政策广场列表
    getPolicySquareList(){
      this.loadingStatus = true
      let param = {
        areaNo: this.addr,
        keywords: this.searchValue,
        pageNo: this.params.current,
        level: '全部',
        pageSize: this.params.size,
        sort: this.sort
      }
      let address = sessionStorage.getItem('localAreaNo').split(',')[1]
      param.areaNo = this.addr == this.latestAreaNo ? this.addr : this.latestAreaNo
      if(param.areaNo == ''){
        param.areaNo = address
      }
      getPolicySquare(param).then(res =>{
        if(res.data.code == 0) {
          this.searchList = res.data.data.data;
          this.typeCount = res.data.data.total;
          if(this.typeCount >0 ){						
            this.loading = 1
          } else {
            this.loading = 2
          }
        } else {
          this.loading = 3
        }
        this.loadingStatus = false
      }).catch(error =>{
        console.log(error)
      })
    },
    // 获取技术成果列表
    getTechResultList(){
      this.loadingStatus = true
      let param = {
        keywords: this.searchValue,
        pageNo: this.params.current,
        pageSize: this.params.size,
        sort: this.sort
      }
      getTechResult(param).then(res =>{
        if(res.data.code == 0) {
          this.searchList = res.data.data.records;
          this.typeCount = res.data.data.total;
          if(this.typeCount >0 ){						
            this.loading = 1
          } else {
            this.loading = 2
          }
        } else {
          this.loading = 3
        }
        this.loadingStatus = false
      }).catch(error =>{
        console.log(error)
      })
    },
    // 获取技术需求列表
    getTechRequireList(){
      let param = {
        keywords: this.searchValue,
        pageNo: this.params.current,
        pageSize: this.params.size,
        sort: this.sort
      }
      getTechRequire(param).then(res =>{
        if(res.data.code == 0) {
          this.searchList = res.data.data.records;
          this.typeCount = res.data.data.total;
          if(this.typeCount >0 ){						
            this.loading = 1
          } else {
            this.loading = 2
          }
        } else {
          this.loading = 3
        }
        this.loadingStatus = false
      }).catch(error =>{
        console.log(error)
      })
    },
    // 获取归口数据
    getLeimu(){
       getLeimu().then(res=>{
        if(res.code == 1000){
            res.data.selection[0].options.unshift({id:0,name:'全部'})
            this.newList = res.data.selection[0].options
        }
     })
    },
    getNewList(val){
      this.toTop()
      if(this.navIndex == 0){
        this.proType = val.item.id
        if(this.itemIndex == 0){
          this.filters = JSON.parse(JSON.stringify(statics.filtersDefault))
          this.filters[0].otherName = '企业服务'
        }else if(this.itemIndex == 1){
          this.filters = JSON.parse(JSON.stringify(statics.filters1))
          this.filters[0].otherName = val.item.text
        }else if(this.itemIndex == 2){
          this.filters = JSON.parse(JSON.stringify(statics.filters2))
          this.filters[0].otherName = val.item.text
        }else{
          this.filters = JSON.parse(JSON.stringify(statics.filters))
          this.filters[0].otherName = val.item.text
        }
        this.getAreaData()
      }

      if(this.navIndex == 1){
        if(this.itemIndex == 0){
          this.filters = JSON.parse(JSON.stringify(statics.filters3))
          this.getPolicySquareList()
        }
        this.showProduct = false
        this.filters[0].otherName = '政策广场'
      }

      if(this.navIndex == 2){
        if(this.itemIndex == 0){
          this.filters = JSON.parse(JSON.stringify(statics.filters4))
          this.getTechResultList()
        }else{
          this.filters = JSON.parse(JSON.stringify(statics.filters4))
          this.getTechRequireList()
        }
        this.showProduct = false
        this.filters[0].otherName = val.item.text
      }
    },
    // 页面回到顶部
    toTop(){
      window.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth",
      })
    }
  },  
  beforeDestroy(){
    if(sessionStorage.getItem('achievement')){
        sessionStorage.removeItem('achievement')
    }
    if(sessionStorage.getItem('need')){
        sessionStorage.removeItem('need')
    }
    if(sessionStorage.getItem('newproduct')){
        sessionStorage.removeItem('newproduct')
    }
    if(sessionStorage.getItem('xunlu')){
        sessionStorage.removeItem('xunlu')
    }
    // if(sessionStorage.getItem('searchHistory')){
    //     sessionStorage.removeItem('searchHistory')
    // }
  },
  watch: {
    "$store.state.Set_LocationNo":{
      deep:true,
      handler:function(newVal,oldVal){
        this.addr = newVal.split(',')[1]
        this.region.forEach(item => {
          item.children.forEach(cItem => {
            if(cItem.no == this.addr){
              this.districtList = [cItem].concat(cItem.children)
            }
          });
        });
      }
    },
  },
  created() {    
    if(this.$route.query.keywords){
      this.searchValue = this.$route.query.keywords;
    }
	  this.curSearchKey = this.$route.query.type;
    this.$nextTick(()=>{
      if(sessionStorage.getItem("localCity")){
        this.location = sessionStorage.getItem("localCity")
      }
    })
  },
  mounted() {
    this.getLeimu()
    if(sessionStorage.getItem('achievement')){
       this.scrollRight(110)
    }
    if(sessionStorage.getItem('need')){
       this.scrollRight(140)
    }
    if(sessionStorage.getItem('newproduct')){
       this.scrollRight(520)
    }
    if(sessionStorage.getItem('xunlu')){
       this.scrollRight(600)
    }
    if(sessionStorage.getItem('searchHistory')){
       this.historyData = JSON.parse(sessionStorage.getItem('searchHistory'))
    }
    if (sessionStorage.getItem("localCity")) {
      this.location = sessionStorage.getItem("localCity")
      this.addr = sessionStorage.getItem("localAreaNo").split(',')[1]
      this.getNewArea() 
    } else {
      this.getLocationData()
    }
    this.searchData();
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
  width: 0 !important;
  height: 0;
}
.search-head-all{
  padding: 0.6rem .42666666667rem;
  width: 100%;
  height: 2.153333333rem;
  display: flex;
  align-items: center;
  background: #ffffff;
  position: fixed;
  top: 0px;
  z-index: 99;
}
.search-head-all .back-icon {
  font-weight: 600;
  color: #3d85dc;
  position: absolute;
  left: 5px;
}
.search-input {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.search-ico {
  position: absolute;
  left: 25%;
  color: #555;
  width: 0.48rem;
  height: 0.48rem;
  font-size: 0.48rem;
}
.input-box {
  width: 78%;
  margin-left: 2%;
  padding-left: 0.4rem;
  line-height: 0.9rem;
  border: 1px solid #36a6fe;
  border-radius: var(--size-10);
  color: #979797;
  font-size: 0.37333333333rem;
  background: #f4f6f8;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  color: #555555;
}
.input-box :before {
  content: "\e6ad";
}
.search_btn {
  width: auto;
  height: 0.8rem;
  border-radius: 0.42666666667rem;
  padding-left: var(--size-8);
  font-size: 0.39rem;
  text-align: center;
  font-weight: 600;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0.26666666667rem;
}
.filter_classify {
  position: fixed;
  top: 1.17333333333rem;
  width: 100%;
  display: flex;
  height: 1.17333333333rem;
  background: #F2F9FF;
  z-index: 999;
  padding: 0 5px;
}
.classify_item {
  width: 25%;
  text-align: center;
  font-size: var(--size-14);
  color: #666;
}
.classify_item span {
  width:1.8066666666666668rem;
  display: inline-block;
  height: 100%;
  line-height: 1.17333333333rem;
  position: relative;
}
.item_inner {
  display: inline-block;
  width: 16px !important;
  height: 2px !important;
  background: #36a6fe;
  color: #333;
  position: absolute !important;
  top: 82%;
  left: 50%;
  transform: translateX(-50%);
}
.filter-inner{
	display: inline-block;
	width: var(--size-10) !important;
	height: 2px !important;
	background: var(--color-blue);
	color: #333;
	position: absolute !important;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
}
.data-count{
  position: fixed;
  top: 2.153333333rem;
  width: 100%;
  font-size: .32rem;
  padding: 0 .426666667rem;
  height: 1.01333333333rem;
  background: #ffffff;
  z-index: 999;  
  box-shadow: 0px 3px 3px rgba(51, 51, 51, 0.11);
  color: #999;
}
.data-sum{
  line-height: 1.01333333333rem;
  flex: 1;
}
.pro-filter{
	width: 100%;
	display: flex;
}
.filter-txt{
	/* color: var(--color-blue); */
	color: #555;
	font-size: var(--size-14);	
}
.filter-item{
	width: 33.333333%;
	position: relative;
	text-align: center;
	display: block;
	align-items: center;
	box-sizing: border-box;
	line-height: var(--size-24);
	margin-top: var(--size-6);
	border-right: 1px solid #e8e8e8;
}
.filter-item img{
	width: var(--size-10);
  height: var(--size-10);
  line-height: var(--size-10);
}
.filter-item:last-child{
  border-right: none !important;
}
.choose-item{
	color: #42ABFE;
}
.arrowTransform{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(180deg);
}
.arrowTransformReturn{
  transition: 0.2s;
  transform-origin: center;
  transform: rotateZ(0deg);
}
.tech-filter{
  display: flex;
}
.division{
	margin: 0 var(--size-6);
}
.data-scope{
  display: flex;
  align-items: center;
}
.time-scope span{
  color: #36A6FE !important;
}
.time-scope span:first-child{
  margin-left: .32rem;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: .32rem;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: .3733333333rem;
    margin-bottom: 20px;
  }
  .time-choose{
    color: #409EFF;
  }
  .data-num{
    color: #FF3C31;
  }
  .item-loading-img{
    width: 1.2rem;
    height: 1.2rem;
    margin: 0 auto;
    margin-top: 3rem;
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
  .err-tips{
    margin-top: 5rem;
    text-align: center;
    font-size: .3733333333rem;
    color: #999;
  }
  .page_limit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.53333333333rem;
    padding-bottom: 3rem;
    width: 100%;
  }
  .fontweigh{
      font-weight: 700;
      color: #333;
  }
  .history-content{
      padding:0 12px;
      position: relative;
      top: 60px;
  }
  .historyflex{
      display: flex;
      justify-content: space-between;
  }
  .historytitle{
      font-weight: 700;
      color: #333333;
  }
  .historyinfo{
      margin-top:20px;
  }
  .historyitem{
      padding: 8px 12px;
      background: #f6f7f9;
      border-radius: 15px;
      margin-right: 6px;
  }
  .local-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    margin-left: 15px;
  }
  .local-city {
    width: 65px;
    height: 0.9rem;
    line-height: 0.9rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 700;
    font-size: .3733333333rem;
    color: #333333;
    text-align: center;
  }
  .local-box img{
    width: 15px;
    height: 15px;
    line-height: 15px;
  }
  .header {
    background: #fff;
    font-weight: 800;
    font-size: var(--size-14);
  }
  .sear-sty {
    flex: 1.1;
    font-weight: 700;
    font-size: var(--size-14);
    color: #333;
  }
  .area_box .van-popup {
    padding-bottom: 1.25rem;
  }
</style>