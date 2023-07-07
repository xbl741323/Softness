<template>
  <div class="frame">
    <no-ssr>
      <div class="banner-box">
        <banner :typeId="5"></banner>
      </div>
      <div class="content">
        <div class="left-box">
          <div class="list">
            <div
              v-for="item in programList"
              :key="item.id"
              class="program"
              :class="{ activeSty: activeId == item.id }"
              @click="leftSlide(item.id)"
            >
              <p style="width: 160px">{{ item.name }}</p>
              <p style="margin-right: 20px"><i class="iconfont">&#xe62a;</i></p>
            </div>
          </div>
        </div>
        <div class="right-box" style="position: relative" v-loading="loading">
          <!-- 列表 -->
          <template v-if="isShow == 1">
            <div
              class="rightlist"
              v-for="(item, index) in rightList"
              :key="index"
              @click="rightContent(item)"
              style="cursor: pointer"
            >
              <div class="icon" />
              <div class="iconcontent">
                <div class="icontitle">{{ item.title }}</div>
                <div class="icondate">
                  {{ item.createTime ? item.createTime.substring(0, 10) : "" }}
                </div>
              </div>
            </div>
          </template>
          <!-- 详情 -->
          <template v-if="isShow == 0">
            <p style="text-align: center; font-size: 18px; margin-bottom: 15px">
              {{ detail.title }}
            </p>
            <p v-html="detail.content"></p>
          </template>
          <!-- 分页 -->
          <div class="pageclass" v-if="total > 50 && isShow == 1">
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page="current"
              :page-size="size"
              :total="total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </div>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import axios from "axios";
import { getLeft, getRight, getRightdetail,getView } from "@/api/home";
import Banner from "@/components/policy/banner";
export default {
  async asyncData({ params, query }) {
    try {
      // 列表跳详情
    if (query.id) {
      const res = await axios.get(
        process.env.ASYNC_DATA_API + "/program/getById?id=" + query.id
      );
      return {
        metaTitle: res.data.data.records[0].metaTitle,
        metaKeyword: res.data.data.records[0].metaKeyword,
        metaDescription: res.data.data.records[0].metaDescription
      };
    } else {
      const res = await axios.get(process.env.ASYNC_DATA_API + "/program");
      if(params.aboutWt){
          var response = await axios.get(process.env.ASYNC_DATA_API + "/program/page?programId="+  params.aboutWt  +'&current=' +1 +'&size=' +50);
      }else{
          params.aboutWt = res.data.data[0].id
          var response = await axios.get(process.env.ASYNC_DATA_API + "/program/page?programId="+  params.aboutWt +'&current=' +1 +'&size=' +50);
      }
        let metaTitle = "";
        let metaKeyword = "";
        let metaDescription ="";
        res.data.data.forEach(item => {
          // 1列表,0图文详情
          if (item.id == params.aboutWt && item.type ==1) {
            metaTitle = "关于卧涛-" + item.name;
            metaKeyword = "关于卧涛-" + item.name;
            metaDescription = "关于卧涛-" + item.name;
          }else if(item.id == params.aboutWt && item.type ==0){
            metaTitle = response.data.data.records[0].metaTitle;
            metaKeyword = response.data.data.records[0].metaKeyword;
            metaDescription = response.data.data.records[0].metaDescription;
          }
        });
          return {
            metaTitle,
            metaKeyword,
            metaDescription,
            ids:res.data.data
          };
    }
    }catch(error){
      console.log(error)
    }
  },
  components: {
    Banner
  },
  head() {
    return {
      title: this.metaTitle,
      meta: [
        { name: "keywords", content: this.metaKeyword },
        {
          hid: "description",
          name: "description",
          content: this.metaDescription
        }
      ]
    };
  },
  data() {
    return {
      cdnPath: process.env.CDN_BASE_URL,
      bannerImg: [],
      programList: [],
      activeId: "",
      detail: {},
      size: 50,
      current: 1,
      total: 0,
      rightList: [],
      isShow: "",
      loading: true
    };
  },
  created() {
    if(this.$route.params.aboutWt){
       this.activeId = this.$route.params.aboutWt;
    }else{
      this.activeId = this.ids[0].id
    }
  },
  mounted() {
    this.getData();
    if (this.$route.query.id) {
      this.getDetail();
       getView(this.$route.query.id)
    }
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    // 初始化
    getData() {
      getLeft().then(res => {
        if (res.data.data) {
          this.programList = res.data.data;
          // 根据type类型判断,1列表,0图文详情
          res.data.data.forEach(item => {
            if (item.id == this.activeId && !this.$route.query.id) {
              this.isShow = item.type;
            } else if (this.$route.query.id) {
              this.isShow = 0;
            }
          });
          this.changeProgram();
        }
      });
    },
    changeProgram() {
      this.loading = true;
      let params = {
        programId: this.activeId,
        current: this.current,
        size: 50
      };
      getRight(params).then(res => {
        this.loading = false;
        if (this.isShow == 1) {
          this.total = res.data.data.total;
        }
        if (this.isShow == 1) {
          this.rightList = res.data.data.records;
        } else if (this.isShow == 0) { 
          if (
            res.data.data.records &&
            res.data.data.records.length > 0 &&
            !this.$route.query.id
          ) {
            // 孩子id有无,来区分取哪一个详情接口
            this.detail = res.data.data.records[0];
            getView(res.data.data.records[0].id)
          }
        }
      });
    },
    getDetail() {
      this.loading = true;
      getRightdetail(this.$route.query.id).then(res => {
        this.loading = false;
        if (res.data.data.records[0]) {
          this.detail = res.data.data.records[0];
        }
      });
    },
    // 跳转控制
    leftSlide(id) {
      window.open("/aboutWt/" + id, "_self");
    },
    rightContent(item) {
      window.open("/aboutWt/" + this.activeId + "?id=" + item.id);
    },
    handleScroll() {
      //改变元素#searchBar的top值
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var offsetTop = document.querySelector(".list").offsetTop;

      if (scrollTop <= 534) {
        offsetTop = 534 - Number(scrollTop);
        var a = (document.querySelector(".list").style.top = offsetTop + "px");
      } else {
        document.querySelector(".list").style.top = "0px";
      }
    },
    handleCurrentChange(val) {
      this.current = val;
      this.changeProgram();
    },
    handleSizeChange(val) {}
  },
  destroyed() {
    //离开该页面需要移除这个监听的事件
    window.removeEventListener("scroll", this.handleScroll, true);
  }
};
</script>

<style lang="stylus" scoped>
.pageclass{
    position: relative;
    top: 15px;
    left: 38%;
}
.frame {
  width: 100%;
  background: #F1F1F1;
  padding-bottom: 30px;

  .banner-box {
    height: 440px;
  }

  .banner-box img {
    width: 100%;
    height: 440px;
  }

  .content {
    width: 1200px;
    min-height: 650px;
    background: #FFF;
    margin: 0 auto;
    padding-bottom: 20px;
    display: flex;

    .left-box {
      width: 246px;

      .list {
        position: fixed;
        width: 186px;
        margin-top: 25px;
        margin-left: 25px;

        .program {
          color: #666666;
          font-size: 16px;
          padding-left: 10px;
          display: flex;
          cursor: pointer;
          line-height: 44px;
          border-bottom: 1px solid #DCDCDC;
        }

        .activeSty {
          color: #FFF;
          background: #36A6FE;
        }
      }
    }

    .right-box {
      padding: 10px;
      width: 964px;
      min-height: 750px;
      margin-top: 14px;

      .rightlist {
        display: flex;
        align-items: center;
        padding: 0px 5px 0px 20px;
        font-size 15px

        .icon {
          width: 8px;
          height: 8px;
          margin: 12px 3px;
          background-color: #3f93d6;
          transform: rotate(45deg);
        }

        .iconcontent {
          width: 100%;
          color: #373d40;
          margin: 2px 6px;
          display: flex;

          .icontitle {
            width: 80%;
          }

          .icondate {
            font-size: 14px;
            color: rgb(134, 137, 139);
          }
        }
      }
    }
  }
}
</style>
