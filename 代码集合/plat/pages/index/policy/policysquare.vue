<template>
  <div class="iframe">
    <div class="bread_sty">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'index' }">{{$t("txt.home")}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'index-policy-policysquare' }">{{$t("txt.policySquare")}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="banner_img">
      <img :src="bannerImg" alt>
    </div>
    <div v-for="item in staticData" :key="item.id">
      <div :class="['question',item.id==1?'pad_a':'pad_b']">
        <div class="question_title">
          <span class="title">{{item.title}}</span>
          <span :class="[item.id==4?'article':'text']">{{item.content}}</span>
          <span v-if="item.id==4">
            <span class="more" @click="toList(item.id)">更多&nbsp;></span>
            <span class="hot">热门文档排行榜</span>
          </span>
        </div>
        <!-- 卧涛问答 -->
        <div class="question_con" v-if="item.id==1">
          <div class="question_left">
            <div class="question_search">
              <el-input placeholder="在此输入您想问的问题" v-model.trim="questionForm.searchContent" @keyup.enter.native="toList(item.id)" class="question_input"/>
              <div class="question_btn" @click="toList(item.id)">搜问题</div>
              <img :src="item.searchImg" alt class="question_icon">
            </div>
            <div class="question_content">
              <div class="question_little">
                <div>
                  <img :src="item.hotImg" alt>
                  <span class="title">热门问题</span>
                </div>
                <div class="more" @click="toList(item.id)">更多问题></div>
              </div>
              <div class="question_list">
                <template v-if="questionList&&questionList.length>0">
                  <question-item v-for="(citem, cindex) in questionList" :key="cindex" :item="citem" :type="1"></question-item>
                </template>
                <template v-else>
                  <div class="nodata">暂无数据</div>
                </template>
              </div>
            </div>
          </div>
          <div class="question_right">
            <img :src="item.quesImg" alt class="icon">
            <img :src="item.askImg" alt class="ask" @click="askQuestion()">
          </div>
        </div>
        <!-- 通知公告 -->
        <div class="notice_con" v-if="item.id==2">
          <div>
            <img :src="item.calendarImg" alt class="notice_img">
            <span class="notice_title">申报月历</span>
          </div>
          <div class="notice_box">
            <img :src="item.logoImg" alt class="notice_logo">
            <div class="notice_calendar">
              <el-calendar v-model="currentDate" ref="calendar">
                <template slot="dateCell" slot-scope="{date, data}">
                  <div :class="data.isSelected ? 'is-selected' : ''"   @click="changeDate(data,date)">
                    <span>{{data.day.split('-').slice(2).join('-')}}</span>
                  </div>
                </template>
              </el-calendar>
            </div>
            <div class="notice_list">
              <div class="notice_date">
                <div class="date_box">
                  <div class="month">
                    <span>{{currentMonth}}</span>
                    <span>月</span>
                  </div>
                  <div class="date">
                    <span>当前选择日期：</span>
                    <span>{{currentChooseDate}}</span>
                  </div>
                </div>
                <div class="more" @click="toList(item.id)">更多&nbsp;></div>
              </div>
              <div class="notice_content">
                <div v-if="total>0" class="notice_boxs">
                  <notice-item v-for="(citem, cindex) in noticeList" :key="cindex" :item="citem"></notice-item>
                  <div class="notice_icon">
                    <img :src="item.leftImg" alt @click="changePage('left')">
                    <img :src="item.rightImg" alt @click="changePage('right')">
                  </div>
                </div>
                <div class="nodata" v-else>暂无数据</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 行业资讯 -->
        <div class="industry_con" v-if="item.id==3">
          <div class="industry_left">
            <img :src="item.logoImg" alt>
          </div>
          <div class="industry_tabs">
            <div class="industry_tab">
              <div 
                v-for="(citem, cindex) in tabList" 
                :key="cindex" 
                :class="['tab_name',citem.id==chooseCate?'active':'']" 
                @click="changeTab(citem.id)">
                {{citem.name}}
              </div>
            </div>
            <div class="industry_list">
              <div v-if="industryList&&industryList.length>0">
                <question-item v-for="(aitem, aindex) in industryList" :key="aindex" :item="aitem" :type="2"></question-item>
              </div>
              <div class="nodata" v-else>暂无数据</div>
            </div>
          </div>
          <div class="industry_right">
            <div class="industry_title">
              <div class="right_title">热门资讯排行榜</div>
              <div class="right_more" @click="toList(item.id)">更多&nbsp;></div>
            </div>
            <img :src="item.infoImg" alt>
            <div>
              <right-item :list="industryRightList" :type="1"></right-item>
            </div>
          </div>
        </div>
        <!-- 卧涛文档 -->
        <div class="document_con" v-if="item.id==4">
          <div class="document_list" v-if="documentList&&documentList.length>0">
            <div class="item" v-for="(citem, cindex) in documentList" :key="cindex" @click="toDetail(citem)">
              <div class="img_box">
                <img :src="cdnPath+citem.file_image_url" alt class="img_sty">
                <img v-if="fileTypeArr.indexOf(citem.file_type)>-1" :src="iconUrl[citem.file_type]" alt class="icon_type">
                <span class="icon_buy" v-if="citem.is_pay==1">付费</span>
                <span class="download_icon" v-if="citem.download_times">
                  <img src="~assets/images/zhengce/icon-download.png" class="download_img"/>
                  {{citem.download_times}}
                </span>
              </div>
              <el-tooltip
                v-if="citem.file_name&&citem.file_name.length>15"
                content="Top"
                placement="top"
                effect="light"
                >
                <span slot="content">{{citem.file_name}}</span>
                <span class="tit">{{citem.file_name}}</span>
              </el-tooltip>
              <span class="tit" v-else>{{citem.file_name}}</span>
            </div>
          </div>
          <div class="document_list" v-else>
            <div class="no-data">暂无数据</div>
          </div>
          <div class="document_right">
            <right-item :list="documentRightList" :type="2"></right-item>
          </div>
        </div>
      </div>
      <div v-if="item.id==2" class="match_box">
        <div>
          <div>智能政策匹配系统</div>
          <div>数据越详细，匹配越精准</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import policyData from './policy_data'
import questionItem from '@/components/policy/questionItem'
import noticeItem from '@/components/policy/noticeItem'
import rightItem from '@/components/policy/rightItem'
import { esPagePolicy, esPageIndustry, esPageFile , pageTmIndustry, pageDoc} from '@/api/announcement'
import { pageQuestion} from '@/api/question'
import * as CodeMsg from "@/api/CodeChange"
export default {
  components: {
    questionItem,
    noticeItem,
    rightItem
  },
  head() {
    return {
      title: "全国科技项目申报通知文件快速查询-卧涛网",
      meta: [
        { name: "keywords", content: "项目申报通知、项目政策公告" },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛网平台汇集全国各地市科技项目申报通知、项目政策公告，及时更新，快速查询。落地企业项目申报最后一公里。",
        },
      ],
    };
  },
  data () {
    return {
      cdnPath: process.env.CDN_BASE_URL,
      imgUrl: '@/assets/images/zhengce/',
      staticData: policyData.staticData,
      questionForm: {
        searchContent: ''
      },
      pageNo: 1,
      total: 0,
      bannerImg: require("~/assets/images/zhengce/pic_banner.png"),
      matchImg: require("~/assets/images/zhengce/pic_matching.png"),
      tabList: policyData.tabList,//服务分类
      chooseCate: 1,//选中服务分类 默认项目申报
      currentDate: new Date(),//当前日期
      currentMonth: null,//当前选择月份
      currentChooseDate: null,//当前选择日期
      questionList: [],//卧涛问答数据
      noticeList: [],//通知公告数据
      industryList: [],//行业资讯数据
      industryRightList: [],//行业资讯右侧栏数据
      documentList: [],//卧涛文档数据
      documentRightList: [],//卧涛文档右侧栏数据
      iconUrl: policyData.iconUrl,
      fileTypeArr: policyData.fileTypeArr,
    }
  },
  watch: {
    currentDate: function (newVal, oldVal) {
      this.currentChooseDate = this.formatDateTime(newVal)
      this.getNoticeList()
    },
  },
  created () {

  },
  mounted () {
    this.currentChooseDate = this.formatDateTime(this.currentDate)
    this.getAllList()
  },
  methods: {
    // 切换服务分类类型
    changeTab(val) {
      this.chooseCate = val
      this.getIndustryList()
    },
    // 跳转列表页
    toList(id){
      // 1-卧涛问答 2-通知公告 3-行业资讯 4-卧涛文档
      this.staticData.map(item => {
        if(item.id == id){
           this.$router.push({
            name: item.path,
            query:{
              search: this.questionForm.searchContent
            }
          })
        }
      })
    },
    // 跳转卧涛文档详情页
    toDetail(item){
      // 跳转卧涛文档详情页
      window.open('/policy/files/' + item.id, '_self')
    },
    // 跳转卧涛问答提问页
    askQuestion(){
      this.$router.push({
        name: "index-policy-question"
      })
    },
    // 获取卧涛问答数据
    getQuestionList(){
      let param = {
        pageNo: 1,
        pageSize: 6,
      }
      pageQuestion(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.questionList = res.data.data.records
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 切换通知公告分页
    changePage(operate){
      if(operate=='left'){
        if(this.pageNo == 1){
          this.$message({
            message: '已经是第一页啦',
            type: 'warning',
            offset: 200,
            duration: 1000
          });
          return false
        }
        this.pageNo-=1
      }else{
        if(this.pageNo == 4){
          this.$message({
            message: '已经是最后一页啦',
            type: 'warning',
            offset: 200,
            duration: 1000
          });
          return false
        }
        this.pageNo+=1
      }
      this.getNoticeList()
    },
    // 获取通知公告数据
    getNoticeList(){
      let param = {
        sort: 'latest',//排序
        pageNo: this.pageNo,
        pageSize: 5,
      }
      if(this.currentChooseDate){
        param.policyTime =  this.currentChooseDate + ' 00:00:00'
      }
      esPagePolicy(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.noticeList = res.data.data.data.policyList
          this.total = res.data.data.data.total
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取行业资讯数据
    getIndustryList(){
      let param = {
        categoryId: this.chooseCate,//服务分类
        pageNo: 1,
        pageSize: 8,
        sort: 'latest',//排序
      }
      esPageIndustry(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.industryList = res.data.data.industryInfoList
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取卧涛文档数据
    getDocumentList(){
      let param = {
        pageNo: 1,
        pageSize: 10,
        sort: 'latest',//排序
      }
      esPageFile(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.documentList = res.data.data.data.fileList
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取行业资讯热门数据
    getIndustryRightList(){
      let param = {
        pageNo: 1,
        pageSize: 7
      }
      pageTmIndustry(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.industryRightList = res.data.data.records
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取卧涛文档热门数据
    getDocumentRightList(){
      let param = {
        pageNo: 1,
        pageSize: 9
      }
      pageDoc(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.documentRightList = res.data.data.records
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    async getAllList(){
      await this.getQuestionList()
      await this.getNoticeList()
      await this.getIndustryList()
      await this.getIndustryRightList()
      await this.getDocumentList()
      await this.getDocumentRightList()
    },
    // 中国标准时间转换为
    formatDateTime(date){
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      this.currentMonth = m
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      return y + '-' + m + '-' + d
    },
    changeDate(data, date){
      console.log(data,'data')
      console.log(date,'date')
    }
  }

}
</script>

<style lang="stylus" scoped>
@import './policysquare.styl';
</style>
<style>
.notice_calendar .el-calendar-table .el-calendar-day {
  width: 40px !important;
  border: none !important;
  background: none !important;
}
.notice_calendar .el-calendar-table td {
  border-bottom: none !important;
  border-right: none !important;
  vertical-align: middle;
}
.notice_calendar .el-calendar-table td.is-selected {
  color: #409EFF;
  border: 1px solid #36a6fe;
  border-radius: 50%;
}
.notice_calendar .el-calendar-table td.is-today {
  color: #409EFF;
  border: 1px solid #36a6fe;
  border-radius: 50%;
}
.notice_calendar .el-calendar__title {
  font-size: 13px;
}
</style>