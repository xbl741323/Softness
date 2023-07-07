<template>
  <div class="ques_container">
    <div class="ques_son">
      <div class="ques_bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'index' }">{{$t('txt.home')}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{name:'index-policy-troubleshooting'}">{{$t('txt.troubleshooting')}}</el-breadcrumb-item>
          <el-breadcrumb-item >问答详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="ques_box">
        <div class="left_box">
          <div class="search_frame" :v-model="searchForm">
            <input type="text" class="search_input" placeholder="在此输入您的问题" v-model.trim="searchForm.content" @keydown.enter="goList()"/>
            <div class="search_button"  @click="goList()">搜问题</div>
            <div class="search">
              <img src="~/assets/images/home/icon_search.png" alt/>
            </div>
            <div class="search_btn" @click="askQuestion()">我要提问</div>
          </div>
          <div class="question">
            <div class="question_title">
              <span v-if="accountId == listData.createBy" class="font question_tag">我的提问</span>
              <el-tooltip content="Top" placement="top" effect="light" v-if="listData.title&&listData.title.length>42">
                <span slot="content">{{listData.title}}</span>
                <span class="question_t">{{listData.title}}</span>
              </el-tooltip>
              <span class="question_t" v-else>{{listData.title}}</span>
            </div>
            <div class="question_content">{{listData.description}}</div>
            <div class="question_operate">
              <div class="question_info">
                <div class="font">{{listData.createTime | filterTime}}</div>
                <div class="font">{{total}}个回答</div>
              </div>
              <div class="question_eve">
                <div :class="['font',sortField=='ReversedOrder'?'active_sty':'']" @click="changeSort('ReversedOrder')">倒序浏览</div>
                <div :class="['font',sortField=='HighQuality'?'active_sty':'']" @click="changeSort('HighQuality')">只看干货</div>
                <div class="font" @click="deleteQuestion(listData)" v-if="accountId == listData.createBy">删除问题</div>
              </div>
            </div>
          </div>
          <div class="answer" v-loading="loading">
            <div class="answer_count">{{total}}条回答</div>
            <div class="profile_con" v-if="total>0">
              <div v-for="(item, index) in questionList" :key="index" class="pad">
                <div class="profile" v-if="item.showFlag == 0">
                  <img :src="item.createByAvatar?cdnPath+item.createByAvatar:operateIcon[6]" alt class="profile_photo" @click="showImage"/>
                  <div class="profile_box">
                    <span class="profile_name">{{item.createByName}}</span>
                    <span class="profile_time">{{item.createTime}}</span>
                  </div>
                </div>
                <div class="profile_content" v-if="item.showFlag == 0">
                  <div> 
                    <div class="profile_html" ref="show" v-html="item.content" @click="showImage"></div>
                    <span v-if="item.showState"><span class="more" @click="getMore(item)">更多></span></span>
                  </div>
                  <div class="operate">
                    <img :src="item.clickType==1?operateIcon[1]:operateIcon[0]" alt @click="likeAnswer(item, 1)"/>
                    <span @click="likeAnswer(item, 1)">支持({{item.upNum}})</span>
                    <img :src="item.clickType==2?operateIcon[3]:operateIcon[2]" alt @click="likeAnswer(item, 2)"/>
                    <span @click="likeAnswer(item, 2)">不支持({{item.lowNum}})</span>
                    <img v-if="item.acceptFlag == 0&&accountId == listData.createBy" src="~/assets/images/home/icon-collect.png" alt @click="acceptAnswer(item)"/>
                    <img v-if="item.acceptFlag == 1" src="~/assets/images/home/icon-collect-show.png" alt/>
                    <span v-if="item.acceptFlag == 0&&accountId == listData.createBy" @click="acceptAnswer(item)">采纳</span>
                    <span v-if="item.acceptFlag == 1" class="collect">已采纳</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile_con" v-else>
              <div class="nodata">
                <img src="~/assets/images/home/info.png" alt class="nodata_img">
                <span class="nodata_info">暂时无人回答</span>
              </div>
            </div>
            <div class="see_more" v-if="total>0&&total>questionList.length" @click="seeMore()">查看更多</div>
            <div class="deadline" v-if="total>0&&!(total>questionList.length)">我是有底线的。</div>
          </div>
        </div>
        <div class="right_box">
          <div>
            <right-side :typeId="2"></right-side>
          </div>
        </div>
      </div>
      <!-- 文本内容弹窗 -->
      <el-dialog :before-close="handleClose" :visible.sync="contentVisible" width="820px" top="120px" center :close-on-click-modal="false" @touchmove.prevent>
        <div class="dia_con">
          <div class="dia">
            <img :src="txtItem.createByAvatar?cdnPath+txtItem.createByAvatar:operateIcon[6]" alt class="dia_photo" @click="showImage"/>
            <div class="dia_box">
              <span class="dia_name">{{txtItem.createByName}}</span>
              <div class="dia_time">
                <div>
                  <span class="font">{{txtItem.createTime}}</span>
                  <img :src="txtItem.clickType==1?operateIcon[1]:operateIcon[0]" alt width="12" height="12" class="collect_img" @click="likeAnswer(txtItem, 1)"/>
                  <span class="font">{{txtItem.upNum}}</span>
                  <img :src="txtItem.clickType==1?operateIcon[3]:operateIcon[2]" alt width="12" height="12" class="collect_img" @click="likeAnswer(txtItem, 2)"/>
                  <span class="font">{{txtItem.lowNum}}</span>
                </div>
                <div>
                  <img v-if="txtItem.acceptFlag == 0&&accountId == listData.createBy" src="~/assets/images/home/icon-collect.png" alt class="collect_img" @click="acceptAnswer(txtItem)"/>
                  <img v-if="txtItem.acceptFlag == 1" src="~/assets/images/home/icon-collect-show.png" alt  width="14" height="14" class="collect_img"/>
                  <span v-if="txtItem.acceptFlag == 0&&accountId == listData.createBy" @click="acceptAnswer(txtItem)">采纳</span>
                  <span v-if="txtItem.acceptFlag == 1" class="collect font">已采纳</span>
                </div>
              </div>
            </div>
          </div>
          <div class="profile_context pad_sty"> 
            <div v-html="txtItem.content" @click="showImage"></div>
          </div>
          <div class="know">
            <el-button type="primary" size="small" @click="contentVisible=false" class="know_btn">我知道了</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <div class="demo-image__preview image_fix_sty">
      <el-image 
        ref="preview"
        style="width: 0px; height: 0px"
        :src="preUrl" 
        :preview-src-list="srcList">
      </el-image>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import * as CodeMsg from "@/api/CodeChange"
import { getQAList, acceptAnswer, likeAnswer, deleteQuestion, getQuestionDetail } from '@/api/question'
import RightSide from '@/components/policy/rightSide'
export default {
  head() {
    return {
      title: "卧涛问答-问答详情",
      meta: [
        { name: "keywords", content: "卧涛问答" },
        {
          hid: "description",
          name: "description",
          content: "卧涛问答",
        },
      ],
    };
  },
  components: {
    RightSide
  },
  data () {
    return {
			cdnPath: process.env.CDN_BASE_URL,
      searchForm:{
        content:''
      },
      listData: {},
      userId: '',
      accountId: '',
      pageNo: 1,
      pageSize: 10,
      total: 0,
      questionList: [],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [],
      noticeList: [],
      industryList: [],
      title: '',
      count: 10,
      contentVisible: false,
      txtItem: {},
      questionId: '',
      preUrl: '',
      srcList: [],
      loading: true,
      sortField: 'ReversedOrder',
      operateIcon: [
        require("~/assets/images/home/icon-like.png"),
        require("~/assets/images/home/icon-like-show.png"),
        require("~/assets/images/home/icon-dislike.png"),
        require("~/assets/images/home/icon-dislike-show.png"),
        require("~/assets/images/home/icon-collect.png"),
        require("~/assets/images/home/icon-collect-show.png"),
        require("~/assets/images/home/default.png")
      ]
    }
  },
  filters: {
    filterContent(val){
      if(val){
        return val.length > 314 ? val.slice(0,314) : val
      }
    },
    filterTime(val){
      if(val){
        return val.length > 10 ? val.slice(0,10) : val
      }
    },
  },
  created () {
    if(this.$route.query.id){
      this.questionId = this.$route.query.id
    }
  },
  mounted () {
    if(localStorage.getItem('userInfo')){
      this.userId = JSON.parse(localStorage.getItem('userInfo')).userId
      this.accountId = JSON.parse(localStorage.getItem('userInfo')).accountId
    }
    this.getDetail()
    this.getList()
  },

  methods: {
    changeSort(str){
      this.sortField = str
      this.pageNo = 1
      this.getList(str)
    },
    showImage(e){
      e.stopPropagation()
      if(e.target.tagName=='IMG'){
        this.preUrl = e.target.currentSrc
        this.srcList = [
          this.preUrl
        ]
        this.$refs.preview.showViewer = true
      }
    },
    delHtmlTag(str) {
      if(str){
        return str.replace(/<[^>]+>/g, "");
      }
    },
    // 获取问题详情
    getDetail(){
      getQuestionDetail(this.$route.query.id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.listData = res.data.data
        }
      })
    },
     // 点击查看更多
    seeMore() {
      let page = this.pageNo
      if(this.total > this.questionList.length){
        this.pageNo = page + 1
        this.getList()
      }
    },
    // 获取点赞或点low问题
    getNewList(id){
       let params = {
        keyWord: this.searchForm.content,
        questionId: this.questionId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      getQAList(params).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          let list = res.data.data.records
          let index = this.questionList.findIndex(item => {
            return item.id == id
          })
          let obj = list.find(item => item.id == id)
          this.questionList.splice(index, 1 ,obj)
          this.questionList.map(item =>{
            item.content = item.content.replace(/\<img/g, '<img style="width: 200px;height: auto;display: block"')
            item.content = item.content.replace(/\<video/g, '<video style="width: 300px;height: auto;display: block"')
          })
          this.total = res.data.data.total
          this.$nextTick(()=>{
            this.questionList.forEach((item,index)=>{
              this.$set(item, 'showState', this.$refs.show[index].scrollHeight>this.$refs.show[index].clientHeight)
            })
          })
        }
      })
    },
    // 获取问答列表
    getList(str){
      if(str){
        this.questionList = []
      }
      let params = {
        keyWord: this.searchForm.content,
        questionId: this.questionId,
        sortField: this.sortField,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      getQAList(params).then(res => {
        let list = this.questionList
        this.loading = false
        if(res.data.code == CodeMsg.CODE_0){
          this.questionList = list.concat(res.data.data.records)
          this.questionList.map(item =>{
            item.content = item.content.replace(/\<img/g, '<img style="width: 200px;height: auto;display: block"')
            item.content = item.content.replace(/\<video/g, '<video style="width: 300px;height: auto;display: block"')
          })
          this.total = res.data.data.total
          this.$nextTick(()=>{
            this.questionList.forEach((item,index)=>{
              this.$set(item, 'showState', this.$refs.show[index].scrollHeight>this.$refs.show[index].clientHeight)
            })
          })
        }
      })
    },
    // 获取更多回答内容
    getMore(item){
      this.txtItem = item
      this.contentVisible = true
    },
    // 点赞
    likeAnswer(item, status){
      let params = {
        answerId: item.id,
        createBy: item.createBy,
        questionId: this.questionId,
        type: status,//1 点赞 2 点low
      }
      likeAnswer(params).then(res => {
        if(res.data.code == CodeMsg.CODE_0){
          if(this.contentVisible){
            this.contentVisible = false
          }
          this.getNewList(item.id)
        }else{
          if(res.data.code == 10002){
            this.$router.push("/login")
            sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
            return false
          }
          this.$message({
            type:"warning",
            message:res.data.msg,
            offset: 300,
            duration: 1500
          })
        }
      })
    },
    // 采纳
    acceptAnswer(item){
      //0 未采纳 1 已采纳
      let params = {
        questionId: this.questionId,
        acceptFlag: 1,
        id: item.id,
        acceptBy: this.userId
      }
      acceptAnswer(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message: '采纳成功',
            offset: 300,
            duration: 1500
          })
          this.getNewList(item.id)
        }else{
          if(res.data.code == 10002){
            this.$router.push("/login")
            sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
            return false
          }
          this.$message({
            type:"warning",
            message:res.data.msg,
            offset: 300,
            duration: 1500
          })
          this.getNewList(item.id)
        }
      })

    },
    // 跳转到对应列表
    toList(data) {
      this.$router.push({
        name: data
      })
    },
    // 跳转提问页
    askQuestion(){
      if(localStorage.getItem('userInfo')){
        this.$router.push({
            name: "index-policy-question"
        })
      }else{
        this.$router.push("/login")
        sessionStorage.setItem('collectLink',this.$route.path + '?' + qs.stringify(this.$route.query))
      }
    },
    // 跳转卧涛问答列表页
    goList(){
      this.$router.push({
        name: "index-policy-troubleshooting",
        query:{
          search: this.searchForm.content
        }
      })
    },
    // 下载
    download(item){
      downloadFile(0).then(res=>{
        if(res.data.code != 10002){
          let a = document.createElement("a");
          a.href = this.filePathUrl+'/file/download?id='+item.id+'&name='+item.name;
          a.click();
        }
      })
    },
    // 推荐文章详情页跳转
    checkDetail(items, type){
      if(type == 0){
          window.open('/policy/'+ items.number + '01' +'?id=' + items.id)
      }else{
          window.open('/policy/'+ items.industry_no + '101' +'?id=' + items.id)
      }
    },
    // 关闭文本内容弹窗
    handleClose(){
      this.contentVisible = false
    },
    // 删除提问
    deleteQuestion(item) {
      this.$confirm("确定删除该提问吗？删除后将不显示", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        offset:300,
        type: "warning",
      }).then(() => {
        let params = {
          id: item.id
        }
        deleteQuestion(params).then(res => {
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type: "success",
              message: "删除成功！",
              offset: 300,
              duration: 1500
            });
            this.goList()
          }else{
            this.$message({
              type: "warning",
              message: res.data.msg,
              offset: 300,
              duration: 1500
            });
          }
        })
      }).catch(() => {
        
      })
    },
  }

}
</script>

<style scoped>
.font {
  font-size: 12px;
}
.ques_container {
  display: flex;
  width: 100%;
  background: #EFF2F3;
}
.ques_son {
  display: flex;
  margin: 0 auto;
  width: 1190px;
  height: 100%;
  flex-direction: column;
}
.ques_bread {
  width: 100%;
  display: flex;
  background: #eff2f3;
  padding: 20px 0 18px 0;
}
.ques_box {
  display: flex;
  width: 100%;
  flex-direction: row;
}
.left_box {
  width: 850px;
  background: #ffffff;
  border-radius: 5px;
  margin-right: 10px;
  padding-left: 32px;
  margin-bottom: 44px;
}
.right_box {
  width: 330px;
  background: #ffffff;
  border-radius: 5px;
  margin-bottom: 44px;
}
.search_frame{
  width:97%;
  margin:0 auto;
  margin-top: 30px;
  padding-bottom: 33.5px;
  display:flex;
  position:relative;
  border-bottom: 1px solid #eaebef;
}
.search img{
  width: 18px;
  height: 18px;
  position: absolute;
  left: 18px;
  top: 16px;
}
.search_btn {
  width: 116px;
  height: 48px;
  border: 2px solid #36a6fe;
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #36a6fe;
  letter-spacing: 0.96px;
  display: flex;
  background: #fff;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-left: 22px;
  border-radius: 25px;
}
.search_btn:hover {
  cursor: pointer;
}
.search_button{
  width: 114px;
  height: 48px;
  line-height: 48px;
  background: #36a6fe;
  position: absolute;
  left: 442px;
  top: 0;
  border-radius: 0 26px 26px 0;
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  letter-spacing: 0.96px;
  cursor: pointer;
}
.search_input{
  width: 556px;
  height: 48px;
  background: #ffffff;
  border: 2px solid #36a6fe;
  border-radius: 26px;
  padding-left:38px;
}
input:focus{
  outline:0;
  padding-left:38px;
}
.question {
  width: 97%;
  margin-top: 28.5px;
  margin-left: 12px;
  display: flex;
  border-bottom: 1px solid #eaebef;
  flex-direction: column;
}
.question_tag {
  display: inline-block;
  width: 68px;
  height: 21px;
  line-height: 21px;
  background: #d2ebff;
  border-radius: 10px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #36a6fe;
  letter-spacing: 0.72px;
  vertical-align: middle;
}
.question_title {
  display: flex;
}
.question_t {
  margin-left: 12px;
  height: 21px;
  line-height: 21px;
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  letter-spacing: 0.96px;
  vertical-align: middle;
  overflow:hidden;
  text-overflow:ellipsis;
  max-width: 90%;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:1;
  word-break: break-all;
}
.question_content {
  text-indent: 2em;
  margin: 16px 0;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #555555;
  line-height: 21px;
  letter-spacing: 0.84px;
  padding-bottom: 10px;
}
.question_operate {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  line-height: 16px;
  margin-bottom: 17px;
}
.question_info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: left;
  color: #7b7b7b;
}
.question_eve {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.question_eve div {
  cursor: pointer;
}
.question_info>div:first-child {
  height: 12px;
  line-height: 12px;
  font-weight: 400;
  padding-right: 4.5px;
  border-right: 1px solid #707070;;
}
.question_info>div:last-child {
  padding-left: 6.5px;
  font-weight: 400;
}
.question_eve {
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  height: 15px;
  line-height: 15px;
}
.active_sty {
  color: #36a6fe !important;
}
.question_eve>div:first-child {
  color: #b4b4b4;
}
.question_eve>div:nth-child(2) {
  margin-left: 12px;
  color: #b4b4b4;
}
.question_eve>div:last-child {
  margin-left: 12px;
  color: #b4b4b4;
}
.answer {
  width: 97%;
  margin-left: 12px;
}
.answer>div:first-child {
  margin-top: 21px;
  margin-bottom: 20px;
  height: 21px;
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  line-height: 21px;
  letter-spacing: 0.96px;
}
.profile_photo {
  width: 36px;
  height: 36px;
  margin-right: 8px;
  border-radius: 18px;
}
.profile {
  display: flex;
  flex-direction: row;
}
.profile_con {
  padding-bottom: 19px;
  border-bottom: 1px solid #eaebef;
}
.profile_box {
  display: flex;
  flex-direction: column;
}
.profile_name {
  height: 19px;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  line-height: 21px;
  letter-spacing: 0.84px;
}
.profile_time {
  height: 15px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  color: #b4b4b4;
  line-height: 21px;
  letter-spacing: 0.72px;
}
.profile_content {
  margin-left: 44px;
  margin-top: 16px;
}
.profile_context {
  text-indent: 0.8em;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: left;
  color: #555555;
  letter-spacing: 0.84px;
  max-height: 300px;
  overflow-y: scroll;
}
.profile_html {
  display: -webkit-box; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 5;       
  overflow: hidden;
  text-overflow: ellipsis;
}
.more {
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  text-align: left;
  color: #36a6fe;
  cursor: pointer;
}
.operate {
  padding-top: 12px;
}
.operate img{
  width: 14px;
  height: 14px;
  line-height: 14px;
  vertical-align: middle;
  cursor: pointer;
}
.operate span {
  display: inline-block;
  height: 16px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 16px;
  letter-spacing: 0.72px;
  margin-right: 15px;
  cursor: pointer;
}
.margin-to {
  margin-top: 10px;
}
.policy_side {
  width: 100%;
  padding: 10px 10px;
}
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
.file_download{
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
.right_txt {
  color: #233558; 
  font-size: 14px; 
  font-weight: 600;
}
.right_sty {
  float: right;
  color: #656565;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.right_more {
  font-size: 12px;
  margin-right: 4px;
  color: #A8A8A8;
  font-weight: bold;
}
.circle{
  background: url('~@/assets/images/industry/yuanquan_gray@2x.png') no-repeat;
  background-size: 4px 4px;
  background-position: left;
}
.circle:hover{
  color: #36A6FE;
  background: url('~@/assets/images/industry/yuanquan_blue@2x.png') no-repeat;
  background-size: 4px 4px;
  background-position: left;
}
.circle_left {
  margin-left: 10px;
}
.collect {
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #36a6fe !important;
  line-height: 21px;
  letter-spacing: 0.72px;
}
.collect_img {
  vertical-align: middle;
}
.nodata {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
.nodata_img {
  width: 32px;
  height: 32px;
  line-height: 32px;
  vertical-align: middle;
}
.nodata_info {
  display: inline-block;
  margin-left: 8px;
  height: 32px;
  line-height: 32px;
  color: #555555;
}
.see_more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #36a6fe;
  cursor: pointer;
  padding: 20px 0;
}
.deadline {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #555555;
  padding: 50px 0;
}
.dia_photo {
  width: 36px;
  height: 36px;
  margin-right: 17px;
  border-radius: 18px;
}
.dia_title {
  margin-top: -20px;
  padding-left: 30px;
  font-size: 18px;
  font-weight: 500;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  height: 60px;
  line-height: 60px;
  color: #333333;
  border-bottom: 1px solid #eaebef;
}
.dia {
  display: flex;
  flex-direction: row;
}
.dia_box {
  display: flex;
  flex-direction: column;
}
.dia_name {
  height: 19px;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  line-height: 21px;
  letter-spacing: 0.84px;
}
.dia_time {
  width: 670px;
  height: 15px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  color: #b4b4b4;
  line-height: 21px;
  letter-spacing: 0.72px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.dia_con {
  display: flex;
  flex-direction: column;
  padding: 20px 40px 0 40px;
}
.dia_content {
  text-indent: 2em;
  margin-top: 25px;
  margin-bottom: 50px;
  letter-spacing: 0.72px;
  line-height: 25px;
}
.know {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px 0;
}
.know_btn {
  width: 105px;
  height: 35px;
  text-align: center;
  letter-spacing: 0.72px;
  border-radius: 22px;
}
.pad {
  padding-bottom: 30px;
}
.pad_sty{
  padding: 15px 0;
}
.demo-image__preview {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}
.preview_img {
  width: 270px;
  height: 191px;
  margin-bottom: 5px;
}
.image_fix_sty{
  position: absolute;
  top: 0;
  z-index: 10000;
}
.el-image-viewer__close{
  background: rgb(238, 235, 235) !important;
}
</style>