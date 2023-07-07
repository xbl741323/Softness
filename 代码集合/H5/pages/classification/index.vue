<template>
  <div>
    <!-- 头部搜索栏 -->
    <div class="header">
      <img :src="require('@/assets/images/classification/lack@2x.png')" @click="prev" width="24px" height="24px" alt /> 
      <div class="header-center">
        <!-- <nuxt-link to="/city" href="nofollow"> -->
          <div class="header-left">
            <span class="text" @click="goCity">{{location}}</span>
            <img class="updown" :src="require('@/assets/images/policySquare/icon_xiajiantou.png')" width="16px" height="16px" alt @click="goCity"/>
            <span class="bor"></span>
          </div>
        <!-- </nuxt-link>   -->
        <input class="search-input" :placeholder="hotSearch" v-model="searchValue" type="text" @keyup.13="toGlobalSearch" />
      </div>
      <div class="header-right" @click="toGlobalSearch">搜索</div>
    </div>
    <!-- 主体部分 -->
    <div class="box">
        <div class="nav">
          <div :class="['navitem',index==tabIndex?'bg':'']" v-for="(item,index) in navList" :key="index" @click="handleTab(item,index)">
              {{item.categoryName}}<span class="active" v-if="index==tabIndex"></span>
          </div>
        </div>
        <div class="navcontent" id="scrollbox">
          <!-- 分类 -->
          <template v-if="tabIndex==1">
            <div class="backwhite" @touchmove.prevent @mousewheel.prevent>
              <div class="classattribute">
                  <div :class="['attributeitem',show==true?'blueactive':'']" @click="show=!show">{{fenleikey=='全部'?'分类':fenleikey}}<span class="trangle"></span></div>
              </div>
              <template v-for="(item,index) in fenlei">
                <span v-if="show == true" :class="['spanitem',fenleikey==item.categoryName?'blueactive':'']" :key="index" @click="changefenlei(item,index)">
                    {{item.categoryName}}
                </span>
              </template>
            </div>
          </template>
          <!-- 属性 -->
          <template v-if="listAttributeArray.length&&tabIndex==0">
              <div class="backwhite" @touchmove.prevent @mousewheel.prevent>
                <div class="classattribute">  
                  <span class="attributeitem" v-for="(item,index) in listAttributeArray" :key="index" @click="getSpecific(item.id)">
                    <template v-if="index==0">
                      {{areaKey==addr?item.attributeName:cityName | filterName}}
                    </template>
                    <template v-if="index==1">
                      {{levelKey=='全部'?item.attributeName:levelKey | filterName}}
                    </template>
                    <template v-if="index==2">
                      {{guikouKey=='全部'?item.attributeName:guikouKey | filterName}}
                    </template>
                    <span class="trangle"></span>
                  </span>
                </div>
                <div v-if="show == true" style="padding-bottom:10px;padding-left:8px;">
                  <span v-for="(item,index) in choiceArray" :key="index">
                    <span  v-if="filterId==1" :class="['spanitem',areaKey==item.no?'blueactive':'']" @click="handleAttribute(item,filterId)">{{item.name }}</span>
                    <span  v-else-if="filterId==2" :class="['spanitem',levelKey==item.name?'blueactive':'']" @click="handleAttribute(item,filterId)">{{item.name }}</span>
                    <span  v-else :class="['spanitem',guikouKey==item.name?'blueactive':'']" @click="handleAttribute(item,filterId)">{{item.name }}</span>
                  </span>
                </div>
              </div>
          </template>
          <!-- 产品 -->
          <div :class="['navnav',listAttributeArray.length>0?'':'no-top',tabIndex==0?'mar1':tabIndex==1?'mar2':'']" v-if="total>0">
            <div :class="['chanpingitem',index==chanpingList.length-1?'lastbottom':'']" v-for="(item,index) in chanpingList" :key="index" @click="toDetail(item)">
              <img v-if="filterType(item)"  :src="cdnPath+item.imageUrl" width="80px" height="57px" alt />
              <video v-if="!filterType(item)" :src="cdnPath+item.imageUrl" width="80px" height="57px" alt /> 
              <div class="desc">
                  <div class="zhichantit">{{item.spuTitle}}</div>
                  <div class="zhichanprice" v-if="item.isOnline==false">面议</div>
                  <div class="zhichanprice" v-if="item.isOnline==true">
                      <template v-if="item.spuMaxAmount==item.spuMinAmount">
                          ¥{{item.spuMinAmount | filterViewprice}}
                      </template>
                      <template v-else>
                          ¥{{item.spuMinAmount | filterViewprice}}&nbsp;/起
                      </template>
                  </div>    
              </div>
            </div>
          </div>
          <div :class="['navnav',listAttributeArray.length>0?'':'no-top',tabIndex==0?'mar1':tabIndex==1?'mar2':'']" v-else>
            <div class="p-sty">暂无匹配数据</div>
          </div>
        </div>
    </div> 
    <div class="global-tip" v-if="show" @click="show=false" @touchmove.prevent @mousewheel.prevent></div>
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
import { getLocation,getNewArea } from "@/api/home"
import { getTree ,getProductList,getAttributeList,getLeimu } from "@/api/allserver"
export default {
  layout: "footer",  
  head() {
    return {
      title: '服务分类',
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description",
        },
      ],
    };
  },
   filters:{
      filterViewprice(val){
          if(String(Number(val)).length<=5){
              return Number(val)
          }else{
              return ((Number(val)/10000)+'万')
          }
      },
      filterName(val){
        if(val&&val.length>3){
          return val.slice(0,3) + '...'
        }else{
          return val
        }
      }
   },
  data() {
    return {
      searchValue: "",
      location: "",
      hotSearch:'搜索想要的内容',
      identification:'',
      navList:[],
      tabIndex:0,
      cdnPath: process.env.CDN_BASE_URL,
      chanpingList:[],
      selectionList: [],
      levelList: [{
          id: 0,
          name: '全部'
        },{
          id: 1,
          name: '国家级'
        },{
          id: 2,
          name: '省级'
        },{
          id: 3,
          name: '市级'
        },{
          id: 4,
          name: '区级'
        }],
      fenlei:[
        {id: 2, categoryName: "全部", parentId: 2, child: []},
        {id: 3, categoryName: "专利", parentId: 2, child: []},
        {id: 4, categoryName: "版权", parentId: 2, child: []},
        {id: 5, categoryName: "商标", parentId: 2, child: []},
        {id: 6, categoryName: "其他", parentId: 2, child: []}
      ],
      listAttributeArray:[],
      choiceArray:[],
      fenleikey:'全部',
      areaKey:'',
      levelKey:'全部',
      guikouKey:'全部',
      show:false,
      index: 0,
      chooseId: 1,
      pageNo: 1,
      pageSize: 10,
      total:0,
      visible: false,
      areaList: [],
      region: [],
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
      filterId: null,
      attributeList: [{
        attributeId: 1,
        attributeName: '地区',
        attributeValueList: [],
        otherName: '地区'
      },{
        attributeId: 2,
        attributeName: '级别',
        attributeValueList: [],
        otherName: '级别'
      },{
        attributeId: 3,
        attributeName: '归口',
        attributeValueList: [],
        otherName: '归口'
      }]
    }
  },
   mounted() {  
    this.getLeimu()
     // 获取identification
    if (localStorage.getItem("identification")) {
      this.identification = localStorage.getItem("identification")
    } 
    // 判断localStorage是否有值，无值才调用接口
    if (sessionStorage.getItem("localCity")) {
      this.location = sessionStorage.getItem("localCity")
      this.areaKey = sessionStorage.getItem("localAreaNo").split(',')[1]
      this.addr = sessionStorage.getItem("localAreaNo").split(',')[1]
      this.getNewArea() 
    } else {
      this.getLocationData()
    }
    this.getAlltree(this.homeIconId,this.tabIndex);
    window.addEventListener('scroll', this.handleScroll, true)
  },
  created(){
    if(this.$route.query.tabindex){
       this.tabIndex = Number(this.$route.query.tabindex)
    };
    if(this.$route.query.id){
       this.homeIconId = Number(this.$route.query.id)
    }
  },
  methods: {
    getLeimu(){
      getLeimu().then(res=>{
        if(res.code == 1000){
            res.data.selection[0].options.unshift({id:0,name:'全部'})
            this.selectionList = res.data.selection[0].options
          }
     })
    },
    resetChoose(){
      this.fenleikey = '全部'
      this.areaKey = sessionStorage.getItem('localAreaNo').split(',')[1]
      this.levelKey = '全部'
      this.guikouKey = '全部'
      this.chanpingList = []
      this.attributeList = [{
        attributeId: 1,
        attributeName: '地区',
        attributeValueList: [],
        otherName: '地区'
      },{
        attributeId: 2,
        attributeName: '级别',
        attributeValueList: [],
        otherName: '级别'
      },{
        attributeId: 3,
        attributeName: '归口',
        attributeValueList: [],
        otherName: '归口'
      }]
      this.getChanping(1)
    },
    handleScroll(){
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 变量 windowHeight 是可视区的高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollTop为当前页面的滚动条纵坐标位置
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 滚动条到底部得距离 = 滚动条的总高度 - 可视区的高度 - 当前页面的滚动条纵坐标位置      
      var scrollBottom = scrollHeight - windowHeight - scrollTop   
      if( scrollBottom < 50 ){
        if(this.pageNo*this.pageSize>=this.total) return;
        this.pageNo = Number(this.pageNo)+1;
        this.getChanping(this.chooseId);
      }
    },
    getAlltree(val,index){
        getTree({'parentId':0}).then(res=>{
            if(res.code==0){
              this.navList = res.data
              this.getChanping(1)
              this.getAttributeList()
            }
        })
    },  
    handleTab(item,index){
        this.tabIndex=index
        this.chanpingList = [];
        this.pageNo = 1
        this.fenleikey = '全部'
        this.guikouKey = '全部'
        this.levelKey = '全部'
        this.attributeList = [{
          attributeId: 1,
          attributeName: '地区',
          attributeValueList: [],
          otherName: '地区'
        },{
          attributeId: 2,
          attributeName: '级别',
          attributeValueList: [],
          otherName: '级别'
        },{
          attributeId: 3,
          attributeName: '归口',
          attributeValueList: [],
          otherName: '归口'
        }]
        this.show = false
        this.areaKey = sessionStorage.getItem('localAreaNo').split(',')[1]
        this.chooseId = 1
        this.chanpingList = []
        this.getChanping(item.id)
        this.getAttributeList(item.id)
    },
    //产品列表
    getChanping(id){
        let param = {
            categoryIdList: id == 2 ? [3,4,5,6] : [id],
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            spuKinds: null,
            spuArea: '',
            spuLevel: null
        }
        this.attributeList.forEach(item => {
          if(item.attributeId == 1&&item.attributeValueList!=undefined){
            param.spuArea = item.attributeValueList.toString()==''?this.addr:item.attributeValueList.toString()
          }
          if(item.attributeId == 2){
            param.spuLevel = Number(item.attributeValueList.toString()) == 0 ? '全部' : Number(item.attributeValueList.toString())
          }
          if(item.attributeId == 3){
            param.spuKinds = Number(item.attributeValueList.toString()) == 0 ? null : Number(item.attributeValueList.toString())
          }
        })
        param.spuArea = param.spuArea==''?this.addr:param.spuArea
        param.spuLevel = param.spuLevel == null ? "全部" : param.spuLevel
        getProductList(param).then(res=>{
          if(res.code==0){
              this.chanpingList = [...this.chanpingList, ...res.data.records];
              this.total = res.data.total;
          } 
        })  
    },
    //属性
    getAttributeList(id){
      this.listAttributeArray = [{
        id: 1,
        attributeName: '地区',
        categoryId: 1
      },{
        id: 2,
        attributeName: '级别',
        categoryId: 1
      },{
        id: 3,
        attributeName: '归口',
        categoryId: 1
      }]
    },
    changefenlei(item,index){
        this.fenleikey  = item.categoryName
        this.chooseId = item.id;
        this.show = false
        this.pageNo = 1
        this.chanpingList = []
        this.getChanping(item.id)
    },
    getSpecific(id){
     this.filterId = id
     this.show = true
     if(this.filterId==1){
        this.region.forEach(item => {
          item.children.forEach(cItem => {
            if(cItem.no == this.addr){
              this.districtList = [cItem].concat(cItem.children)
            }
          });
        });
        this.choiceArray = this.districtList
      }else if(this.filterId==2){
        this.choiceArray = this.levelList
      }else{
        this.choiceArray = this.selectionList
      }
    },
    handleAttribute(item,id){
      this.chanpingList = []
      this.pageNo = 1
      if(id == 1){
        this.attributeList[0].attributeValueList = [item.no]
        this.cityName = item.name
        this.areaKey = item.no
      }else if(id == 2){
        this.attributeList[1].attributeValueList = [item.id]
        this.levelKey =  item.name
      }else if(id == 3){
        this.attributeList[2].attributeValueList = [item.id]
        this.guikouKey = item.name
      }
      this.show = false;
      this.getChanping(1)
    },
    // 判断是图片还是视频
    filterType(item){
      if(item.imageUrl.match(/(jpeg|png|jpg|gif)/)){
          return true
      }else{
          return false
      }
    },
    toGlobalSearch() {
      this.$router.push({
        path: "/search",
        query: {
          type: 1,
          keywords: this.searchValue,
          source: 2
        }
      });
    },
    prev() {
      this.$router.go(-1);
    },
    toDetail(item) {
      this.$router.push({
          path: "/productdetails/details",
          query: {spuId:item.id}
      })
    },
    onConfirm(value, index) {
      let areaNo = ''
      this.visible = false;
      this.areaValue = index
      this.location = this.filterCityName(value[1])
      this.$nextTick(()=>{
        areaNo = this.areaList[index[0]].no + ',' + this.areaList[index[0]].children[index[1]].no
        this.areaNo = areaNo != '' ? areaNo : sessionStorage.getItem("localAreaNo")
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
      this.areaKey = sessionStorage.getItem("localAreaNo").split(',')[1]
      this.addr = sessionStorage.getItem("localAreaNo").split(',')[1]
      getNewArea().then(res => {
        if(res.data.code == 0){
          this.region = JSON.parse(JSON.stringify(res.data.data))
          this.areaList = res.data.data
          res.data.data.forEach(item => {
            item.children.forEach(cItem => {
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
    goCity(){
      this.visible = true
      this.$nextTick(()=>{
        if(this.visible){
          this.$refs.refRegion.setIndexes(this.areaValue)
        }
      })
    },
  },
   watch: {
    "$store.state.Set_LocationNo":{
      deep:true,
      handler:function(newVal,oldVal){
        this.addr = newVal.split(',')[1]
        this.areaKey = newVal.split(',')[1]
        
        this.region.forEach(item => {
          item.children.forEach(cItem => {
            if(cItem.no == this.addr){
              this.districtList = [cItem].concat(cItem.children)
            }
          });
        });
        this.chanpingList = []
        this.getChanping(1)
        if(this.filterId==1){
          this.choiceArray = this.districtList
        }
        if(newVal!=oldVal){
          this.resetChoose()
        }
      }
    },
  },
};
</script>
<style lang="stylus"  scoped>
@import './index.stylus'
</style>
