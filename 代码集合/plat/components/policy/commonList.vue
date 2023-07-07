<template>
  <div v-loading="loading" class="frame">
    <!-- 归口、地址 -->
    <div class="address">
      <!-- 搜索 -->
      <div v-if="searchMark !== 0" class="search_frame" :v-model="searchForm">
        <input
          v-model="searchForm.content"
          type="text"
          class="search_input"
          :placeholder="this.prompt"
          @keydown.enter="getList()"
        >
        <div class="search" @click="getList()">
          <img src="~/assets/images/home/icon_search_home.png"/>
        </div>
      </div>
      <div v-if="searchMark !== 0" class="hot_project">
        <p v-if="this.searchList.length > 0" style="color: #36A6FE;">
          {{ $t('txt.hotSearch') }}：
        </p>
        <div
          v-for="(item, index) in searchList"
          :key="index"
          class="btn"
          :class="[{ searchStyle: searchId == item }]"
          @click="getSearchId(item)"
        >
          {{ item }}
        </div>
      </div>  
      <div class="line" v-if="searchMark !==0"></div>
      <!-- 地区 -->   
      <div class="line" v-if="searchMark !== 0" >
        <div class="provinces">
          <p class="area">
            {{ $t('txt.area') }}
          </p>
          <div class="list" style="margin-left: -28px;">
            <city @areaChange="childArea" />
          </div>
        </div>
      </div>
      <!-- 级别 -->
      <div class="line" v-if="searchMark !== 0&&$route.path=='/policy/announcement'" >
        <div class="provinces">
          <p class="area">级别</p>
          <div class="list">
            <div v-for="(item, index) in level" :key="index" :class="['btn',rank==item.value ? 'activeSty':'']" @click="chooseItem(item, index, 'level')">
              <span>{{item.label}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 归口 -->
      <div class="centralized">
        <p class="class-name">
          {{typeId == 0 ? '归口' : '汇编类型'}}
        </p>
        <div class="classification"  v-if="typeId == 0">
          <div
            v-for="(item,index) in optionList"
            :key="index"
            :class="['btn', putunder == item.id ? 'activeSty':'']"
            @click="chooseItem(item, index, 'putunder')">
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="classification"  v-else>
          <div
            v-for="(item,index) in optionList"
            :key="index"
            :class="['btn',assemblyType == item.id ? 'activeSty':'']"
            @click="chooseItem(item, index,  'assemblyType')">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <!-- 申报时间 -->
      <div class="centralized" v-if="searchMark !== 0&&$route.path=='/policy/announcement'">
        <p class="class-name">申报时间</p>
        <div class="classification" >
          <div
            v-for="(item,index) in declarationData"
            :key="index"
            :class="['btn', declarationTime == index ? 'activeSty':'']"
            @click="chooseItem(item, index, 'declarationTime')">
            <span v-if="index==0">全部</span>
            <span v-else>{{currentYear}}.{{ item}}月</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="content-List">
      <div
        :class="[$route.path!='/policy/announcement'?'left_content':'left_contents',this.announceList.length == 0?'newSty':'']"
      >
        <div class="sorting" :class="{ istop: this.announceList.length == 0 }">
          <!-- 排序 -->
          <div class="sort-right">
            <span
              :class="['sortsty',sort == item.type ? 'activeSort':'']"
              style="margin-right: 13px;"
              v-for="(item,index) in most"
              :key="index"
              @click="chooseItem(item, index,  'sort')"
            >{{item.title}}</span>
          </div>
        </div>
        <div
          v-if="this.announceList.length == 0"
          class="anSty"
        >
          <img
            style="width:100%;height:100%;"
            src="~assets/images/zhengce/tongzhi_img_nodata@2x.png"
          >
          {{ $t('txt.noContentTxt') }}
        </div>
        <div style="background:#FFF;">
          <div
            v-for="(items, index) in announceList"
            :key="index"
            class="list_box"
          >
            <div class="diamond_content">
              <el-tooltip
                v-if="items.title.length > 42"
                content="Top"
                placement="top"
                effect="light"
              >
                <span slot="content" v-html="items.title"></span>
                <div class="tipSty" @click="go(items.number, items.id)">
                  <div class="tip_sty">
                     <div class="diamond" />
                  <p class="listTitle" v-html="items.title"></p>
                  </div>
                </div>
              </el-tooltip>
              <div
                v-else
                class="tip_new_sty"
                @click="go(items.number, items.id)"
              > 
                <div class="tip_sty">
                  <div class="diamond" />
                  <p class="listTitle" v-html="items.title"></p>
                </div>
              </div>
            </div>
                <div class="commonListContent"  @click="go(items.number, items.id)" v-html="items.small_content"></div> 
                <div class="dateSty">
                    <span>{{ items.create_time | filterTime }}</span>
                    <span v-if="items.apply_start_time">起止时间：{{items.apply_start_time}}--{{items.apply_end_time}}</span>
                </div>
              <div class="reSty">
                <!-- <div style="border-bottom: 1px dashed rgb(206 206 206 / 31%);" class="dotSty"></div> -->
                <div :class="[items.applyType==1?'orange':items.applyType==2?'blue':'grey','iconSty']" v-if="searchMark !== 0&&$route.path=='/policy/announcement'&&items.applyType">
                  {{items.applyType | filterValue}}
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="right_content"  >
          <div>
            <right-side :typeId="Number(this.typeId)"></right-side>
          </div>
      </div>
    </div>

    <!-- 分页 -->
    <div
      v-if="this.announceList.length != 0"
      style="position:relative;padding:30px 0;"
    >
      <el-pagination
        class="pageSty"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import {
  esPagePolicy,
  downloadFile,
  getSelection
} from '@/api/announcement'
import { getHotSearch } from '@/api/home'
import city from '@/components/search/city'
import policyData from '@/pages/index/policy/policy_data'
import RightSide from '@/components/policy/rightSide'
import * as CodeMsg from "@/api/CodeChange"
export default {
  props: ['typeId', 'prompt', 'searchMark', 'content'],
  components:{
    city,
    RightSide
  },
  data() {
    return {
      filePathUrl: process.env.baseUrl,
      title: '',
      txt: this.txt,
      isContent: false,
      isHotSpot: false,
      isNewest: true,
      isTitle: true,
      show: true,
      activeId: null,
      newsId: ['new'],
      pagesize: 50,
      currentPage: 1,
      total: 0,
      announceList: [],
      active: [],
      titleId: ['title'],
      provinceValue: '',
      searchForm: {
        content: ''
      },
      attributionId: [],
      cityId: 0,
      attributionList: [],
      areaList: {},
      cityList: [],
      citysList: [],
      listLength: 0,
      numberList: [],
      classList: [],
      policySearchParams: [],
      activeNum: 0, // 首页跳转标识
      searchList: [],
      searchId: '',
      curr: false,
      loading: false,
      hasProvinces: [],
      showProvince: true,
      callInterface: false,
      provinceNo: null,
      keepChildOpen: false,
      provinceInfo:{},//临时存储当前省份信息
      cityNo: 'unlimit',
      level: policyData.level,
      most: policyData.newMost,
      optionList: [],
      rank: null,
      putunder: null,
      assemblyType: null,
      declarationTime: 0,
      declarationData: policyData.declarationData,
      addr: '',
      sort: 'hottest',
      currentYear: new Date().getFullYear()
    }
  },
  filters: {
    filterTime(val) {
       return val.slice(0,10);
    },
    filterValue(val) {
      return val == 3 ? '已结束' : val == 2 ? '申报中' : val == 1 ? '未开始' : ''
    },
    filterStatus(val) {
      let date = new Date()
      let y = date.getFullYear()
      let m = (date.getMonth() + 1) < 10 ? '0'+ (date.getMonth() + 1) : date.getMonth() + 1
      let d = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()
      // 当前日期
      let currentDate = new Date(y+'-'+m+'-'+d)
      // 起始日期
      let date1 = new Date(val[0])
      // 截止日期
      let date2 = new Date(val[1])
      if(currentDate > date2){
        return '已结束'
      }else if(currentDate < date1 ){
        return '未开始'
      }else {
        return '申报中'
      }
    }
  },
  computed: {
    searchTxt() {
      return this.$store.state.searchTxt
    },
    location() {
      return this.$store.state.Set_LocationNo
    }
  },
  watch: {
    'searchForm.content'(val) {
      if (val == '') {
        this.$router.push({
          query: {
            search: ''
          }
        })
        this.searchId = '';
        this.show = true;
        this.getList();
      } else {
        this.sort = 'hottest'
        this.getList();
      }
    },
    searchTxt(val) {
      this.content = val;
      this.getList();
    },
    location(val) {
      this.addr = val.split(',')[1]
      this.getList();
    }
  },
  created() {
    if (this.$route.query.search) {
      this.searchForm.content = this.$route.query.search
      this.getList()
    } else {
      this.$router.push({
        query: {
          search: ''
        }
      })
    }
    if (this.$route.query.cityId) {
      this.activeId = this.$route.query.provinceId
      this.activeNum = 1
    } else if (this.$route.query.optionsNo) {
      // this.attributionId.push(this.$route.query.optionsNo);
      // this.homeOptionId = this.$route.query.optionsNo;
      // this.homeClassSetNumber = this.$route.query.classSetNumber;
    }
    if(this.$route.path=='/policy/announcement'){
      this.most = [{
          title: '发布时间',
          type: 'latest'
      },{
          title: '综合排序',
          type: 'hottest'
      }]
      this.sort = 'latest'
    }else{
      this.most = [{
          title: '综合排序',
          type: 'hottest'
      },{
          title: '发布时间',
          type: 'latest'
      }]
      this.sort = 'hottest'
    }
  },
  mounted() {
    this.getSelection()
    // 二级页面全站搜索获取搜索值
    if (this.$store.state.searchTxt) {
      this.content = this.$store.state.searchTxt
    } 
   if(sessionStorage.getItem('locationNo')){
    let data = sessionStorage.getItem('locationNo')
    this.addr = data.split(',')[1]
   }
    this.getHotWords()
    this.getList();
  },
  beforeDestroy(){
    if(sessionStorage.getItem('policySquareChildNO')){
      sessionStorage.removeItem('policySquareChildNO')
    }
  },
  methods: {
    // 获取筛选项
    getSelection(){
      let id = 2
      if(this.typeId == 0){
        id = 2
      }else if(this.typeId == 1){
        id = 4
      }
      getSelection(id).then(res => {
        if(res.data.code == CodeMsg.CODE_1000){
           this.optionList = [{
            id: null,
            name: '全部'
           }].concat(res.data.data.selection)
        }
      })
    },
    chooseItem(item, index, val){
      switch (val) {
          case 'level': // 级别
              this.rank = item.value
              break;
          case 'assemblyType': // 汇编类型
              this.assemblyType = item.id
              break;
          case 'putunder': // 归口
              this.putunder = item.id
              break;
          case 'sort': // 排序
              this.sort = item.type
              break;
          case 'declarationTime': // 申报时间
              this.declarationTime = index
              break;
      }
      this.currentPage = 1
      this.getList()
    },
    // 筛选地区
    childArea(data){
        this.addr = data
        this.currentPage = 1
        this.getList();
    },
    getSearchId(data) {
      this.$router.push({
        query: {
          search: data
        }
      })
      this.searchId = data
      this.searchForm.content = data
      this.currentPage = 1
      this.getList()
    },
    getHotWords() {
      getHotSearch(this.typeId).then((res) => {
        this.searchList = res.data.data
      })
    },
    // 文件下载预处理，校验是否登录，实际上不下载
    download(item) {
      downloadFile(0).then((res) => {
        if (res.data.code != 10002) {
          const a = document.createElement('a')
          a.href =
            this.filePathUrl +
            '/file/download?id=' +
            item.id +
            '&name=' +
            item.title
          a.click()
        }
      })
    },
    go(num,id) {
      if (this.newsId.includes('new')) {
        window.open(`/policy/${num+this.typeId+1}?id=${id}`)
      } else if (this.newsId.includes('hot')) {
        window.open(`/policy/${num+this.typeId+0}?id=${id}`)
      }
    },
    // 获取列表信息
    getList() {
      // type   类型0-通知公告，1-政策汇编，2-卧涛问答,10-行业资讯
      if (this.content != undefined || this.content == '') {
        if (this.content || this.content.length == 0) {
          this.searchForm.content = this.content
          this.show = false
          if (this.curr) {
            // 全局搜索点击分页
          } else {
            this.currentPage = 1
          }
        }
      }
        var param = {
          keywords: this.searchForm.content,//关键字
          type: this.typeId,//类型
          areaNo: this.addr,//地区编号
          level: this.rank == null ? '全部' : this.rank,//级别
          sort: this.sort,//排序
          optionId: this.typeId == 0 ? this.putunder : this.assemblyType,//归口或汇编类型
          month: this.declarationTime,
          pageNo: this.currentPage,
          pageSize: this.pagesize,
        }
        esPagePolicy(param).then(res => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.loading = false
            this.announceList = res.data.data.data.policyList
            this.total = res.data.data.data.total
          }
        }).catch((err) => {
          return err
        })
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val
      this.curr = true
      this.getList()
    },
    handleSizeChange(val) {}
  }
}
</script>

<style lang="stylus" scoped>
.istop{
  margin-top:0px !important;
}
.commonListContent {
  font-size: 14px;
  opacity: 0.5;
  margin-left: 15 px;
  color: #000000;
  cursor: pointer;
  width: 95%;
  margin-bottom: 15px;
  height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.aaacircle{
  background:url('~@/assets/images/industry/yuanquan_gray@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.aaacircle:hover{
  color: #36A6FE;
  background:url('~@/assets/images/industry/yuanquan_blue@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.frame{
    width:100%;
    min-width:1200px;
    background:#F1F1F1;
    font-size:14px;
    font-family:Microsoft YaHei UI;
    .banner_img{
        height:340px;
        background-image:url('/images/zhengce/zhengce_banner@2x.png');
        background-size:cover;
    }
    .search_box{
        width:1200px;
        margin:20px auto;
        font-size:14px;
    }
    .search_frame{
        width:931px;
        margin:0 auto;
        padding:10px 24px;
        display:flex;
        .search{
           width: 15%;
          height: 40px;
          border-radius: 20px;
          border: 1px solid #36A6FE;
          background: #36A6FE;
          color: #FFF;
          font-size: 16px;
          padding-top: 2px;
          margin-left: -15%;
          display: flex;
          cursor: pointer;
          justify-content: center;
        }
        .search img{
           width: 36px;
           height: 36px;
        }
        .search_input{
            width:100%;
            height:40px;
            border-radius:20px;
            border:1px solid #36A6FE;
            outline:one;
            padding-left:15px;
            padding-right:15%;
            font-size:14px;
            overflow: hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
        }
        input:focus{
            outline:0;
            padding-left:15px;
        }
    }
    .hot_project{
        display:flex;
        width:876px;
        margin:10px auto;
        color:#666666;
        align-items: center;
        .btn{
            border: 1px solid #36A6FE;
            border-radius: 40px;
            font-size: 12px;
            height: 20px;
            padding: 15px 10px;
            text-align: center;
            line-height: 1px;
            margin-left: 10px;
            color: #36A6FE;
            cursor: pointer;
        }
        .btn:hover{
            color:#36A6FE;
        }
        .searchStyle{
            background:#36A6FE;
            color:#FFF;
        }
        .searchStyle:hover{
            color:#FFF;
        }
    }
    .line{
        border-bottom:1px solid #D6D6D6;
    }
    .address{
        width:1200px;
        margin:0 auto;
        background:#FFF;
        .attribution{
            padding:0;
            border-bottom:1px solid #D6D6D6;
        }
        .attribution li{
            list-style:none;
            cursor pointer;
        }
        .only-show-city{
          min-height:50px;
          line-height:40px;
          display:flex;
          flex-flow:row wrap;
          border-bottom:1px solid #D6D6D6;
          .area{
            color:#333333;
            font-size:14px;
            font-weight:bold;
            width:150px;
            padding-right: 10px;
            text-align: right;
            border-right:1px solid #EEE;
          }
          .city-name{
            width: 1050px;
            display: flex;
            flex-flow:row wrap;
          }
          .city-name p{
            color:#656565;
            margin:0 15px;
            cursor:pointer;
          }
        }
        .centralized{
            min-height: 40px;
            line-height:40px;
            display:flex;
            flex-flow:row wrap;
            border-bottom:1px solid #D6D6D6;
            .class-name{
                color:#333333;
                font-size:14px;
                font-weight:bold;
                width:150px;
                padding-right:10px;
                text-align: right;
                border-right:1px solid #eee;
            }
            .classification{
                width:80%;
                display: flex;
                flex-flow:row wrap;
                // margin-left:15px;
                .btn{
                    color:#656565;
                    cursor:pointer;
                }
                .btn span{
                    padding:3px 15px;
                }
                .btn:hover{
                    color:#36A6FE;
                }
            }
        }
        li:hover{
            color:#36A6FE;
        }
        .city-box{
          width:1050px;
          background:#F2F2F2;
          min-height:100px;
          margin-left:149px;
          margin-top:-12px;
          padding-top: 12px;
          border-left:1px solid #eee;
          .city-list{
              float:left;
              cursor:pointer;
              margin:10px 10px;
          }
          .city-list span{
              padding:6px 12px;
              font-size:14px;
              color:#656565;
              background:#fff;
              border: 1px solid #E9E9E9;
              border-radius: 4px;
          }
        }
        .has-province{
          margin-top: -40px !important;
          background:#FFF;
        }
        .provinces{
            line-height:40px;
            display:flex;
            .area{
                color:#333333;
                font-size:14px;
                font-weight:bold;
                width:150px;
                padding-right:10px;
                text-align: right;
                margin-right:15px;
                border-right:1px solid #eee;
            }
            .list{
                max-width:1042px;
                margin-left: -15px;
                display:flex;
                flex-flow:row wrap;
                .activeTab{
                    // color:#36A6FE !important;
                    background: #F2F2F2 ;
                }
                .btn{
                    color:#656565;
                    cursor:pointer;
                }
                .btn span{
                    padding:3px 15px;
                }
                .btn:hover{
                    color:#36A6FE;
                }
            }
            .areaListSty{
                padding:5px 15px;
                font-size:14px;
                color:#656565;
                cursor:pointer;
                // pointer-events:none;
            }
            .areaListSty:hover{
                color:#36A6FE !important;
            }
        }
        .provinces li{
            list-style:none;
            display:inline-block;
            margin-left:30px;
            font-size:14px;
            color:#656565;
            cursor:pointer;
        }

        .city{
            background:#F5F8FAFF;
            cursor:pointer;
            font-size:14px;
            padding:0 8px;
            line-height:30px;
        }
        .activeStyle{
            color:#FFF !important;
            background:#36A6FE !important;
        }
        .activeSty{
            color:#36A6FE !important;
        }
        .activeTab{
            color:#36A6FE !important;
            // background: #F2F2F2 ;
        }
    }
    .sorting{
      margin: 10px auto;
      padding-left: 20px;
      padding-top: 10px;
      margin-bottom: -10px;
      background: #fff;
      display: flex;
      padding-right: 30px;
      text-align: right;
        .new-hot{
            display:flex
            width:200px;
        }
        .newestSort{
            color:#8A8A8A;
            cursor:pointer;
        }
        .hotestSort{
            color:#8A8A8A;
            cursor:pointer;
        }
        .activeSort{
            color:#36A6FE !important;
        }
        .inactiveSort{
            color:none !important;
        }
    }
    .content-List{
        width:1200px;
        margin:0 auto;
        display:flex;
        .left_content{
            min-height:400px;
            width:78%;
            padding-bottom: 10px;
            .diamond{
                // width:8px;
                // height:8px;
                // margin:12px 3px;
                // background-color: #3F93D6;
                // transform: rotate(45deg);
                width:6px;
                height:6px;
                background: #36A6FE;
                border-radius: 50%;
                margin:12px 3px;
            }
            .diamond_content{
                width:100%;
                color:#373D40;
                display:flex;
                .listTitle{
                    // max-width:96%
                    overflow:hidden;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:1;
                    cursor:pointer;
                    margin-left: 3px;
                    color: #373D40;
                    font-weight: bold;
                    font-size: 15px;
                }
                .the-top{
                    margin-left: 28px;
                    width:42px;
                    padding:0 5px;
                    height:20px;
                    background:#FD651C;
                    color:#FFF;
                    line-height:20px;
                    font-size:14px;
                    text-align:center;
                    border-radius:2px;
                }
                .top-views{
                    width:35px;
                    height:20px;
                    background:#FFF;
                    color:#FFF;
                    font-size:14px;
                    text-align:center;
                    border-radius:2px;
                }
            }
        }
        .left_contents{
            min-height:400px;
            width:100%;
            padding-bottom: 10px;
            .diamond{
                // width:8px;
                // height:8px;
                // margin:12px 3px;
                // background-color: #3F93D6;
                // transform: rotate(45deg);
                width:6px;
                height:6px;
                background: #36A6FE;
                border-radius: 50%;
                margin:12px 3px;
            }
            .diamond_content{
                width:100%;
                color:#373D40;
                display:flex;
                .listTitle{
                    // max-width:96%
                    overflow:hidden;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:1;
                    cursor:pointer;
                    margin-left: 3px;
                    color: #373D40;
                    font-weight: bold;
                    font-size: 15px;
                }
                .the-top{
                    margin-left: 28px;
                    width:42px;
                    padding:0 5px;
                    height:20px;
                    background:#FD651C;
                    color:#FFF;
                    line-height:20px;
                    font-size:14px;
                    text-align:center;
                    border-radius:2px;
                }
                .top-views{
                    width:35px;
                    height:20px;
                    background:#FFF;
                    color:#FFF;
                    font-size:14px;
                    text-align:center;
                    border-radius:2px;
                }
            }
        }
        .newSty{
            margin:10px 0;
            background:#F9F9F9;
        }
        .right_content{
            width:25%;
            margin-left:1%;
            margin-bottom:10px;
            margin-top:10px;
            background:#FFF;
            .policy_side{
                width:100%;
                padding:10px 10px;
                .policy_content{
                    margin:14px 0;
                }
                .art_list{
                    color:#86898B;
                    font-size:14px;
                    overflow:hidden;
                    cursor:pointer;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:1;
                }
                .file_download{
                    text-decoration:none;
                    color:#36A6FE;
                    font-size:14px;
                    overflow:hidden;
                    cursor:pointer;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:1;
                }
            }
        }
    }
  .STY {
    background-image: url('~assets/images/industry/gouxuan_icon@2x.png') !important;
    background-size: 16px 16px !important;
    border:none !important;
  }

  .noSty {
    background: #ffffff !important;
    border: 1px solid #707070 !important;
    border-radius: 2px !important;
  }

  .titleSearch {
    width: 16px;
    height: 16px;
    background-image: url('~assets/images/industry/gouxuan_icon@2x.png');
    background-size: 16px 16px;
    cursor: pointer;
  }

  .contentSearch {
    width: 16px;
    height: 16px;
    background: #ffffff;
    cursor: pointer;
    margin-left:25px;
    border: 1px solid #707070;
    border-radius: 2px;
  }
  .active {
    color: #36a6fe !important
  }
  .sort-right {
    width: 100%;
    height: 60px;
    line-height: 60px;
  }
  .sortsty:hover {
    cursor: pointer;
  }
  .sortsty {
    color: #b6b6b6;
  }
  .anSty {
    height: 210px;
    width: 210px;
    text-align: center;
    margin: 0 auto;
    color: #BFBFBF;
  }
  .pageSty {
    position: absolute;
    left: 50%; 
    top: 50%; 
    transform: translate(-50%,-50%);
  }
  .tipSty {
    display: flex;
    width: 96%;
    justify-content: space-between;
    align-items: center;
  }
  .tip_sty {
    display: flex;
    align-items: center;
    margin-top: 13.5px;
    margin-left: -28px;
  }
  .tip_new_sty {
    display: flex;
    width: 96%;
    justify-content: space-between;
    align-items: center;
  }
  .dateSty {
    margin: 0 15px 0 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #86898B;
    padding-bottom: 5px;
  }
  .labSty {
    color: #233558; 
    font-size: 14px; 
    font-weight: 400;
  }
  .listSty {
    float: right;
    color: #656565;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .moreSty {
    font-size: 12px;
    margin-right: 4px;
    color: #A8A8A8;
  }
  .dotSty {
    width: 96%;
    margin-left: 2px;
  }
  .iconSty {
    text-align: center;
    width: 50px;
    height: 20px;
    position: absolute;
    right: 2px;
    top: -3px;
    border-radius: 0 9px 0 9px; 
    color: #fff;
    font-size: 12px;
    line-height: 20px;
  }
  .blue {
    background: #0989E8;
    color: #fff;
  }
  .grey {
    background: #B4B4B4;
    color: #fff;
  }
  .orange {
    background: #FA7F49;
    color: #fff;
  }
}
.list_box {
  width: 100%;
  height: 122.5px;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 2px;
  padding-left: 20px;
  border-bottom: 1px dashed #F0F0F0;
}
.wid {
  width: 23%;
}
.widt {
  width: 100%;
}
</style>
