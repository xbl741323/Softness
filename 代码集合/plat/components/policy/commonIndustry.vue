<template>
  <div v-loading="loading" class="iframe">
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
        />
        <div class="search" @click="getList()">
         <img src="~/assets/images/home/icon_search_home.png"/>
        </div>
      </div>
      <!-- 关键词库 -->
      <div v-if="searchMark !== 0" class="hot_project">
        <p v-if="this.searchList.length > 0" style="color: #36A6FE;">{{ $t("txt.hotSearch") }}：</p>
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
      <div v-if="searchMark !== 0" class="line"></div>         
      <div class="centralized">
        <p class="class-name">服务分类</p>
        <div class="classification">
          <div v-for="(item,index) in optionList" :key="index" :class="['btn', industryType == item.id ? 'activeSty':'']"   @click="chooseItem(item,'industry')">
              <span>{{item.name}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="content-List">
      <div class="left_content" :class="{ newSty: this.announceList.length == 0 }">
        <div class="sorting">
          <!-- 排序 -->
          <div class="sort-right">
              <span
                :class="['sortsty',sort == item.type ? 'activeSort':'']"
                style="margin-right: 13px;"
                v-for="(item,index) in most"
                :key="index"
                @click="chooseItem(item, 'sort')"
              >{{item.title}}</span>
          </div> 
        </div>
        <div
          v-if="this.announceList.length == 0"
          class="nodata-box">
          <img class="nodata" src="~assets/images/zhengce/tongzhi_img_nodata@2x.png"/>
          {{ $t("txt.noContentTxt") }}
        </div>
        <div v-if="this.announceList.length != 0" class="list-box">
          <div
            v-for="(item, index) in announceList"
            :key="index"
            class="list-item">
            <div
              class="industrytitle"
              style="cursor: pointer"
              @click="go(item)">
              <span class="industrysmall" v-html="item.title"></span>
            </div>
            <div
              class="industrycontent"
              style="cursor: pointer"
              @click="go(item)"
              v-html="item.content"
              >
            </div>
            <span class="toped" v-if="item.state==0">置顶</span>
            <!-- 底部 -->
            <div class="industryfoot">
              <div class="footleft">
                <div>
                  <el-tag v-if="item.industryType">{{item.industryType}}</el-tag>
                </div>
              </div>
              <div class="footright">
                <i class="iconfont"> &#xe618;</i>
                <span class="rightword">{{ item.create_time | filterTime }}</span>
                <i class="iconfont" style="margin-left: 38px"> &#xe693;</i>
                <span class="leftword">{{ item.page_views }}次</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right_content">
        <div>
          <right-side :typeId="1"></right-side>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div
      v-if="this.announceList.length != 0"
      style="position: relative; padding: 30px 0"
    >
      <el-pagination
        class="page"
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
  downloadFile,
  esPageIndustry
} from "@/api/announcement";
import { getHotSearch } from "@/api/home";
import city from '@/components/search/city'
import policyData from '@/pages/index/policy/policy_data'
import RightSide from '@/components/policy/rightSide'
export default {
  props: ["typeId", "prompt", "searchMark", "content"],
  components: {
    city,
    RightSide
  },
  data() {
    return {
      filePathUrl: process.env.baseUrl,
      title: "",
      txt: this.txt,
      isContent: false,
      isHotSpot: false,
      isNewest: true,
      isTitle: true,
      show: true,
      putUnder: "",
      activeId: null,
      newsId: ["new"],
      pagesize: 10,
      currentPage: 1,
      total: 0,
      announceList: [],
      active: [],
      titleId: ["title"],
      provinceValue: "",
      searchForm: {
        content: ""
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
      searchId: "",
      curr: false,
      loading: false,
      hasProvinces: [],
      showProvince: true,
      callInterface: false,
      provinceNo: null,
      keepChildOpen: false,
      provinceInfo: {}, //临时存储当前省份信息
      cityNo: "unlimit",
      most: policyData.most,
      optionList: policyData.optionList,
      industryType: null,
      addr: '',
      sort: 'latest'
    };
  },
  filters: {
    filterTime(val) {
       if(val){
         return val.slice(0,10);
       }
    }
  },
  computed: {
    searchTxt() {
      return this.$store.state.searchTxt;
    },
    location() {
      return this.$store.state.Set_LocationNo;
    }
  },
  watch: {
    "searchForm.content"(val) {
      if (val == "") {
        this.$router.push({
          query: {
            search: ""
          }
        });
        this.searchId = "";
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
      this.searchForm.content = this.$route.query.search;
      this.getList();
    } else {
      this.$router.push({
        query: {
          search: ""
        }
      });
    }
    if (this.$route.query.cityId) {
      this.activeId = this.$route.query.provinceId;
      this.activeNum = 1;
      // this.cityList.push(this.$route.query.cityId);
      // this.active = this.cityList;
    } else if (this.$route.query.optionsNo) {
      // this.attributionId.push(this.$route.query.optionsNo);
      // this.homeOptionId = this.$route.query.optionsNo;
      // this.homeClassSetNumber = this.$route.query.classSetNumber;
    }
  },
  mounted() {
    // 二级页面全站搜索获取搜索值
    if (this.$store.state.searchTxt) {
      this.content = this.$store.state.searchTxt;
    }
    if(sessionStorage.getItem('locationNo')){
      let data = sessionStorage.getItem('locationNo')
      this.addr = data.split(',')[1]
    }
    this.getHotWords();
    this.getList()
  },
  methods: {
    chooseItem(item, val){
      switch (val) {
          case 'industry': // 行业类型
              this.industryType = item.id
              break;
          case 'sort': // 排序
              this.sort = item.type
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
      });
      this.searchId = data;
      this.searchForm.content = data;
      this.currentPage = 1;
      this.getList();
    },
    getHotWords() {
      getHotSearch(this.typeId).then(res => {
        this.searchList = res.data.data;
      });
    },
    // 文件下载预处理，校验是否登录，实际上不下载
    download(item) {
      downloadFile(0).then(res => {
        if (res.data.code != 10002) {
          const a = document.createElement("a");
          a.href =
            this.filePathUrl +
            "/file/download?id=" +
            item.id +
            "&name=" +
            item.title;
          a.click();
        }
      });
    },
    go(item) {
      if (this.newsId.includes("new")) {
        window.open("/policy/" + item.industry_no + this.typeId + 1 + '?id=' + item.id);
      } else if (this.newsId.includes("hot")) {
        window.open("/policy/" + item.industry_no + this.typeId + 0 + '?id=' + item.id);
      }
    },
    // 获取列表信息
    getList() {
      // type   类型0-通知公告，1-政策汇编，2-卧涛问答，10-行业资讯
      if (this.content != undefined || this.content == "") {
        if (this.content || this.content.length == 0) {
          this.searchForm.content = this.content;
          this.show = false;
          if (this.curr) {
            // 全局搜索点击分页
          } else {
            this.currentPage = 1;
          }
        }
      }
      var param = {
          keywords: this.searchForm.content,//关键字
          sort: this.sort,//排序
          categoryId: this.industryType,//服务分类
          pageNo: this.currentPage,
          pageSize: this.pagesize,
        }
        esPageIndustry(param).then(res => {
          if (res.data.code == 0) {
            this.loading = false
            this.announceList = Array.from(res.data.data.industryInfoList)
            this.total = res.data.data.total
          }
        }).catch((err) => {
          return err
        })
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.curr = true;
      this.getList();
    },
    handleSizeChange(val) {}
  }
};
</script>

<style lang="stylus" scoped>
.circle{
  background:url('~@/assets/images/industry/yuanquan_gray@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.circle:hover{
  color: #36A6FE;
  background:url('~@/assets/images/industry/yuanquan_blue@2x.png') no-repeat;
  background-size:4px 4px;
  background-position: left;
}
.font-sty {
  font-size: 13px;
  margin-left:12px;
}
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: transparent !important;
  color: transparent !important;
}

.el-tag {
  border-radius: 40px !important;
  margin-right: 10px;
}

.iframe {
  width: 100%;
  min-width: 1200px;
  background: #F1F1F1;
  font-size: 14px;
  font-family: Microsoft YaHei UI;

  .banner_img {
    height: 340px;
    background-image: url('/images/zhengce/zhengce_banner@2x.png');
    background-size: cover;
  }

  .search_box {
    width: 1200px;
    margin: 20px auto;
    font-size: 14px;
  }

  .search_frame {
    width: 931px;
    margin: 0 auto;
    padding: 10px 24px;
    display: flex;

    .search {
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

    .search img {
      width: 36px;
      height: 36px;
    }

    .search_input {
      width: 100%;
      height: 40px;
      border-radius: 20px;
      border: 1px solid #36A6FE;
      outline: one;
      padding-left: 15px;
      padding-right: 15%;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    input:focus {
      outline: 0;
      padding-left: 15px;
    }
  }

  .hot_project {
    display: flex;
    width: 876px;
    margin: 10px auto;
    color: #666666;
    align-items: center;
    .btn {
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

    .btn:hover {
      color: #36A6FE;
    }

    .searchStyle {
      background: #36A6FE;
      color: #FFF;
    }

    .searchStyle:hover {
      color: #FFF;
    }
  }

  .line {
    border-bottom: 1px solid #D6D6D6;
  }

  .address {
    width: 1200px;
    margin: 0 auto;
    background: #FFF;

    .attribution {
      padding: 0;
      border-bottom: 1px solid #D6D6D6;
    }

    .attribution li {
      list-style: none;
      cursor: pointer;
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
    .centralized {
      min-height: 40px;
      line-height: 40px;
      display: flex;
      flex-flow: row wrap;
      border-bottom: 1px solid #D6D6D6;

      .class-name {
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        width: 150px;
        padding-right: 10px;
        text-align: right;
        border-right: 1px solid #eee;
      }

      .classification {
        width: 80%;
        display: flex;
        flex-flow: row wrap;

        // margin-left:15px;
        .btn {
          color: #656565;
          cursor: pointer;
        }

        .btn span {
          padding: 3px 15px;
        }

        .btn:hover {
          color: #36A6FE;
        }
      }
    }

    li:hover {
      color: #36A6FE;
    }

    .city-box {
      width: 1050px;
      background: #F2F2F2;
      min-height: 100px;
      margin-left: 149px;
      padding-top: 12px;
      border-left: 1px solid #eee;
      margin-top: -12px;

      .city-list {
        float: left;
        cursor: pointer;
        margin: 10px 10px;
      }

      .city-list span {
        padding: 6px 12px;
        font-size: 14px;
        color: #656565;
        background: #fff;
        border: 1px solid #E9E9E9;
        border-radius: 4px;
      }
    }

    .has-province {
      margin-top: -40px !important;
      background: #FFF;
    }

    .provinces {
      line-height: 40px;
      display: flex;

      .area {
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        width: 150px;
        padding-right: 10px;
        text-align: right;
        margin-right: 15px;
        border-right: 1px solid #eee;
      }

      .list {
         max-width:1042px;
                margin-left: -15px;
                display:flex;
                flex-flow:row wrap;
                .activeTab{
                    // color:#36A6FE !important;
                    background: #F2F2F2 ;
                }
      }

      .areaListSty {
        padding: 5px 15px;
        font-size: 14px;
        color: #656565;
        cursor: pointer;
         // pointer-events:none;
      }

      .areaListSty:hover {
        color: #36A6FE !important;
      }
    }

    .provinces li {
      list-style: none;
      display: inline-block;
      margin-left: 30px;
      font-size: 14px;
      color: #656565;
      cursor: pointer;
    }

    .city {
      background: #F5F8FAFF;
      cursor: pointer;
      font-size: 14px;
      padding: 0 8px;
      line-height: 30px;
    }

    .activeStyle {
      color: #FFF !important;
      background: #36A6FE !important;
    }

    .activeSty {
      color: #36A6FE !important;
    }

    .activeTab {
      color:#36A6FE !important;
            // background: #F2F2F2 ;
    }
  }

  .sorting {
    margin: 0 auto;
    padding-left: 20px;
    padding-top: 10px;
    margin-bottom: -10px;
    background: #FFF;
    display: flex;
    text-align: right;
    .new-hot {
      display: flex;
      width: 200px;
    }

    .newestSort {
      color: #8A8A8A;
      cursor: pointer;
    }

    .hotestSort {
      color: #8A8A8A;
      cursor: pointer;
    }

    .activeSort {
      color: #36A6FE !important;
    }

    .inactiveSort {
      color: none !important;
    }
  }

  .content-List {
    width: 1200px;
    margin: 0 auto;
    display: flex;

    .left_content {
      min-height: 400px;
      width: 78%;
      margin-top:11px;

      .industrytitle {
        display: flex;
        margin-top: 5px;

        .industrysmall {
          font-size: 15px;
          color: #373d40;
          font-weight: bold;
        }

        .the-top {
          margin-left: 28px;
          width:42px;
          padding: 0 5px;
          height: 20px;
          background: #FD651C;
          color: #FFF;
          line-height: 20px;
          font-size: 14px;
          text-align: center;
          border-radius: 2px;
        }
      }

      .industrycontent {
        font-size: 14px;
        opacity: 0.5;
        margin-top: 8px;
        color: #000000;
        // height: 38px;
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .industryfoot {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .footleft {
          display: flex;

          .industry-tag {
            width: 94px;
            height: 24px;
            background: #36a6fe;
            opacity: 0.85;
            border-radius: 40px;
            text-align: center;
            line-height: 24px;
            font-size: 12px;
            margin-right: 10px;
          }
        }

        .footright {
          display: flex;

          .rightword {
            margin-left: 13px;
            font-size: 12px;
            color: #000000;
            opacity: 0.3;
          }

          .leftword {
            margin-left: 11px;
            font-size: 12px;
            color: #000000;
            opacity: 0.3;
          }
        }
      }

      .diamond {
        width: 8px;
        height: 8px;
        margin: 12px 3px;
        background-color: #3F93D6;
        transform: rotate(45deg);
      }

      .diamond_content {
        width: 100%;
        color: #373D40;
        margin: 6px;
        display: flex;

        .listTitle {
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          cursor: pointer;
        }

        .the-top {
          margin-left: 28px;
          width:42px;
          padding: 0 5px;
          height: 20px;
          background: #FD651C;
          color: #FFF;
          line-height: 20px;
          font-size: 14px;
          text-align: center;
          border-radius: 2px;
        }

        .top-views {
          width: 35px;
          height: 20px;
          background: #FFF;
          color: #FFF;
          font-size: 14px;
          text-align: center;
          border-radius: 2px;
        }
      }
    }

    .newSty {
      margin: 10px 0;
      background: #F9F9F9;
    }

    .right_content {
      width: 25%;
      margin-left: 1%;
      margin-bottom: 10px;
      margin-top: 10px;
      background: #FFF;

      .policy_side {
        width: 100%;
        padding: 10px 10px;

        .policy_content {
          margin: 14px 0;
        }

        .art_list {
          color: #86898B;
          font-size: 14px;
          overflow: hidden;
          cursor: pointer;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .file_download {
          text-decoration: none;
          color: #36A6FE;
          font-size: 14px;
          overflow: hidden;
          cursor: pointer;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
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
  .sort-right {
    width: 100%;
    height: 60px;
    line-height: 60px;
  }
  .sortsty {
    color: #b6b6b6;
  }
  .sortsty:hover {
    cursor: pointer;
  }
  .nodata-box {
    height: 210px;
    width: 210px;
    text-align: center;
    margin: 30px auto;
    color: #bfbfbf;
  }
  .nodata {
    width: 210px; 
    height: 210px;
  }
  .list-box {
    background: #fff; 
    margin: 10px 0; 
    padding: 0px 25px 5px 20px;
  }
  .list-item {
    border-bottom: 1px dashed #f0f0f0;
    margin-bottom: 6px;
    padding-bottom: 5px;
    position: relative;
  }
  .toped {
    display: inline-block;
    background: #F05138;
    color: #fff;
    width: 50px;
    height: 18px;
    line-height: 18px;
    border-radius: 5px;
    font-size: 12px;
    text-align: center;
    position: absolute;
    top: 0px;
    right: 15px;
  }
  .list-label {
    color: #233558; 
    font-size: 14px; 
    font-weight: bold;
  }
  .flex-sty {
    float: right;
    color: #656565;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .flex-font {
    font-size: 12px;
    margin-right:4px;
    color: #A8A8A8;
    font-weight: bold;
  }
  .page {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
