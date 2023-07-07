<template>
  <client-only>
    <div
      class="frame"
      element-loading-text="请点击右上角···选择浏览器打开"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div class="article">
        <div class="head">
          <i class="iconfont" @click="goBack">&#xe641;</i>
          <p>卧涛问答详情</p>
          <i class="iconfont" @click="homePage()">&#xe617;</i>
        </div>
        <div class="collect_success" v-loading="loading">
          <div class="question">
            <div class="question_title">
              <span v-if="userId == listData.createBy" class="font question_tag">我的提问</span>
              <span :class="['question_t',userId != listData.createBy?'question_new':'']">{{listData.title}}</span>
            </div>
            <div class="question_content">{{listData.description}}</div>
            <div class="question_operate">
              <div class="question_info">
                <div class="font">{{listData.createTime | filterTime}}</div>
                <div class="font">{{total}}个回答</div>
              </div>
              <div class="question_eve">
                <img @click="changeSort(0)" :src="sortField=='ReversedOrder'?operateIcon[0]:operateIcon[1]" alt>
                <img @click="changeSort(1)" :src="sortField=='HighQuality'?operateIcon[2]:operateIcon[3]" alt>
                <img v-if="accountId == listData.createBy" @click="deleteQuestion(listData)" :src="operateIcon[4]" alt>
              </div>
            </div>
          </div>
          <div class="answer">
            <div class="answer_count">{{total}}条回答</div>
            <div class="profile_con" v-if="total>0">
              <div v-for="(item, index) in questionList" :key="index" class="pad">
                <div class="profile" v-if="item.showFlag == 0">
                  <img :src="item.createByAvatar?cdnPath+item.createByAvatar:operateIcon[5]" alt class="profile_photo" @click="showImage"/>
                  <div class="profile_box">
                    <span class="profile_name">{{item.createByName}}</span>
                    <span class="profile_time">{{item.createTime}}</span>
                  </div>
                </div>
                <div class="profile_content" v-if="item.showFlag == 0">
                  <div> 
                    <div class="profile_html" v-html="item.content" ref="show" @click="showImage"></div>
                    <div v-if="item.showState"><div class="more" @click="getMore(item)">更多></div></div>
                  </div>
                  <div class="operate">
                    <img :src="item.clickType==1?operateIcon[6]:operateIcon[7]" @click="likeAnswer(item, 1)"/>
                    <span @click="likeAnswer(item, 1)">支持({{item.upNum}})</span>
                    <img :src="item.clickType==2?operateIcon[8]:operateIcon[9]" alt @click="likeAnswer(item, 2)"/>
                    <span @click="likeAnswer(item, 2)">不支持({{item.lowNum}})</span>
                    <img v-if="item.acceptFlag == 0&&accountId == listData.createBy" :src="operateIcon[11]" alt @click="acceptAnswer(item)"/>
                    <img v-if="item.acceptFlag == 1" :src="operateIcon[10]" alt/>
                    <span v-if="item.acceptFlag == 0&&accountId == listData.createBy" @click="acceptAnswer(item)" class="font">采纳</span>
                    <span v-if="item.acceptFlag == 1" class="collect">已采纳</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile_con" v-else>
              <div class="nodata">
                <img :src="operateIcon[12]" alt class="nodata_img">
                <span class="nodata_info">暂时无人回答</span>
              </div>
            </div>
            <div class="see_more" v-if="total>0&&total>questionList.length" @click="seeMore()">查看更多</div>
            <div class="deadline" v-if="total>0&&!(total>questionList.length)">我是有底线的。</div>
          </div>
        <div>
        <div class="demo-image__preview image_fix_sty">
          <el-image 
            ref="preview"
            style="width: 0px; height: 0px"
            :src="preUrl" 
            :preview-src-list="srcList">
          </el-image>
        </div>
        <!-- 文本内容弹窗 -->
        <mt-popup
          class="pop_sty"
          v-model="contentVisible"
          popup-transition="popup-fade"> 
          <div class="dia_con pop_sty">
            <div class="dia">
              <img :src="txtItem.createByAvatar?cdnPath+txtItem.createByAvatar:operateIcon[5]" alt class="dia_photo" @click="showImage"/>
              <div class="dia_box">
                <span class="dia_name">{{txtItem.createByName}}</span>
                <div class="dia_time">
                  <div>
                    <span class="font">{{txtItem.createTime}}</span>
                    <img :src="txtItem.clickType==1?operateIcon[6]:operateIcon[7]" alt class="collect_img"/>
                    <span class="font">{{txtItem.upNum}}</span>
                    <img :src="txtItem.clickType==2?operateIcon[8]:operateIcon[9]" alt class="collect_img"/>
                    <span class="font">{{txtItem.lowNum}}</span>
                  </div>
                  <div>
                    <img v-if="txtItem.acceptFlag == 0&&accountId == listData.createBy" :src="operateIcon[11]" alt class="collect_img"/>
                    <img v-if="txtItem.acceptFlag == 1" :src="operateIcon[10]" alt  class="collect_img"/>
                    <span v-if="txtItem.acceptFlag == 0&&accountId == listData.createBy" @click="acceptAnswer(txtItem)">采纳</span>
                    <span v-if="txtItem.acceptFlag == 1" class="collect font">已采纳</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="profile_context"> 
              <div v-html="txtItem.content" @click="showImage"></div>
            </div>
            <div class="margin-to" v-if="txtItem.imgList&&txtItem.imgList.length>0">
                <div class="demo-image__preview">
                  <el-image 
                    v-for="(citem,cindex) in txtItem.imgList"
                    :key="cindex"
                    class="preview_img"
                    :src="citem" 
                    :preview-src-list="txtItem.imgList"
                    >
                  </el-image>
                </div>
            </div>
            <div class="know">
              <el-button type="primary" size="small" @click="contentVisible=false" class="know_btn">我知道了</el-button>
            </div>
          </div>
        </mt-popup>
        </div>
      </div>
    </div>
    </div>
  </client-only>
</template>

<script>
var NativeShare, mShare;
import { Toast, MessageBox, Popup } from "mint-ui";
import * as CodeMsg from "@/api/CodeMsg";
import * as policyData from '@/pages/policy/policy-data';
import { toWx } from '@/utils/toWx'
import { getQAList, acceptAnswer, likeAnswer, deleteQuestion, getQuestionDetail } from '@/api/question'
export default {
  components: {

},
  head() {
    return {
      title: '卧涛问答详情',
      meta: [
        { name: "keywords", content: '卧涛问答详情' },
        {
          hid: "description",
          name: "description",
          content: '卧涛问答详情',
        },
      ],
    };
  },
  layout: "nidaye",
  data() {
    return {
      cdnPath: process.env.CDN_BASE_URL,
      loading: false,
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
      srcList: [
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      ],
      rightList: [],
      title: '',
      count: 10,
      contentVisible: false,
      txtItem: {},
      questionId: '',
      sortField: 'ReversedOrder',
      preUrl: '',
      srcList: [],
      operateIcon: policyData.operateIcon
    };
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
  created() {
    if(this.$route.query.id){
      this.questionId = this.$route.query.id
    }
  },
  mounted() {
    if(localStorage.getItem('userInfo')){
      this.userId = JSON.parse(localStorage.getItem('userInfo')).userId
      this.accountId = JSON.parse(localStorage.getItem('userInfo')).accountId
    }
    this.getDetail()
    this.getList()
  },
  methods: {
    showImage(e){
      if(e.target.tagName=='IMG'){
        this.preUrl = e.target.currentSrc
        this.srcList = [
          this.preUrl
        ]
        this.$refs.preview.showViewer = true
      }
    },
    homePage() {
      this.$router.push({path: "/"})
    },
    goBack() {
      this.$router.go(-1)
    },
    delHtmlTag(str) {
      if(str){
        return str.replace(/<[^>]+>/g, "");
      }
    },
    toWechat(){
      toWx()
    },
    changeSort(status){
      if(status==0){
        this.sortField = 'ReversedOrder'
      }else{
        this.sortField = 'HighQuality'
      }
      this.questionList = []
      this.getList()
    },
    // 获取问题详情
    getDetail(){
      getQuestionDetail(this.$route.query.id).then(res=>{
        if(res.code == CodeMsg.CODE_0){
          this.listData = res.data
        }
      })
    },
    // 获取问答列表
    getList(){
      let params = {
        keyWord: this.searchForm.content,
        questionId: this.questionId,
        sortField: this.sortField,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.loading = true
      getQAList(params).then(res => {
        this.loading = false
        let list = this.questionList
        if(res.code == CodeMsg.CODE_0){
          this.questionList = list.concat(res.data.records)
          this.questionList.map(item =>{
            item.content = item.content.replace(/\<img/g, '<img style="width: 4rem;height: auto;display: block;"')
            item.content = item.content.replace(/\<video/g, '<video style="width: 6rem;height: auto;display: block;"')
          })
          this.total = res.data.total
          this.$nextTick(()=>{
            this.questionList.forEach((item,index)=>{
              this.$set(item, 'showState', this.$refs.show[index].scrollHeight>this.$refs.show[index].clientHeight)
            })
          })
        }else{
          this.loading = false
        }
      }).catch(error=>{
        console.log(error)
        this.loading = false
      })
    },
    // 获取更多回答内容
    getMore(item){
      this.txtItem = item
      this.contentVisible = true
    },
    // 点击查看更多
    seeMore() {
      let page = this.pageNo
      if(this.total > this.questionList.length){
        this.pageNo = page + 1
        this.getList()
      }
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
        if(res.code == CodeMsg.CODE_0){
          if(this.contentVisible){
            this.contentVisible = false
          }
          this.getList()
        }else{
          if(res.code === 10002){
            this.toWechat()
            return false
          }
          Toast({
            message: res.msg,
            position: "middle",
            duration: 1500,
          });
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
        if(res.code == CodeMsg.CODE_0){
          Toast({
            message: "采纳成功！",
            position: "middle",
            duration: 1500,
          });
          this.getList()
        }else{
          if(res.code === 10002){
            this.toWechat()
            return false
          }
          Toast({
            message: res.msg,
            position: "middle",
            duration: 1500,
          });
        }
      })

    },
    // 跳转卧涛问答列表页
    goList(){
      this.$router.push({
        path: "/policy/troubleList",
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
    checkDetail(detailRouter,number,id){
      if(id == '1' || id=='0'){
        var a = number+id+1
        window.open(detailRouter+a);
      }else if(id == '10'){
        // 行业资讯
        window.open(detailRouter+number+id+1)
      }
      else{
        window.open(detailRouter+number+id);
      }
    },
    // 关闭文本内容弹窗
    handleClose(){
      this.contentVisible = false
    },
    // 删除提问
    deleteQuestion(item) {
      MessageBox.confirm('确定删除该提问吗？删除后将不显示').then(action => {
        console.log(action)
        let params = {
          id: item.id
        }
        deleteQuestion(params).then(res => {
          if(res.code == CodeMsg.CODE_0){
            Toast({
              message: "删除成功！",
              position: "middle",
              duration: 1500,
            });
            this.goList()
          }else{
            Toast({
              message: res.msg,
              position: "middle",
              duration: 1500,
            });
          }
        })
      }).catch(() => {
        
      })
    },
  },
};
</script>

<style lang="stylus" scoped>
.collect_success {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 1.06666666667rem;
}
.frame {
  width: 100%;
  height: 100%;
  background: #E5E5EA;
  font-family: Hiragino Sans GB;
  .article {
    width: 100%;
    background: #FFF;
    .head {
      width: 100%;
      height: 1.17rem;
      border-bottom: 1px solid #E7E6EB;
      display: flex;
      line-height: 1.17rem;
      position: fixed;
      top: 0;
      z-index: 999;
      background: #fff;
    }
    .head i:nth-child(1) {
      font-size: 0.41rem;
      font-weight: normal;
      margin-left: 0.44rem;
    }
    .head p:nth-child(2) {
      width: 100%;
      margin: 0 auto;
      font-size: 0.43rem;
      color: #333333;
      font-weight bold
      text-align: center;
    }
    .head i:nth-child(3) {
      margin-right: 0.44rem;
      font-size: 0.43rem;
    }
  }
}
.collect_fail {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 1.3333333333rem;
}
.collect_fail img {
  width: 2.986666666667rem;
  height: 2.986666666667rem;
}
.collect_fail p {
  color: #999999;
  font-size: var(--size-14);
  margin-top: 0.23666666667rem;
}
.font {
  display: inline-block;
  font-size: 0.32rem;
  vertical-align: middle;
}
.question {
  width: 97%;
  margin-top: 0.76rem;
  margin-left: 0.32rem;
  display: flex;
  border-bottom: 1px solid #eaebef;
  flex-direction: column;
}
.question_title {
  position: relative;
}
.question_tag {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 1.813333333333rem;
  height: 0.56rem;
  line-height: 0.56rem;
  background: #d2ebff;
  border-radius: 0.266666666667rem;
  font-size: var(--size-12);
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #36a6fe;
  letter-spacing: 0.0192rem;
  vertical-align: middle;
}
.question_t {
  word-break: break-all;
  display: inline-block;
  margin-left: 0.32rem;
  font-size: var(--size-14);
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #555555;
  letter-spacing: 0.0256rem;
  vertical-align: middle;
  text-indent: 1.6rem;
  padding-bottom: 0.2rem;
}
.question_new {
  text-indent:0.2rem !important;
}
.question_content {
  text-indent: 2em;
  font-size: var(--size-12);
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #555555;
  letter-spacing: 0.0256rem;
  padding: 0.2rem 0;
}
.question_operate {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 0.4266666666667rem;
  line-height: 0.4266666666667rem;
  margin-bottom: 0.4533333333333333rem;
  font-size: var(--size-12);
}
.question_info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: var(--size-12);
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
.question_eve>img {
  cursor: pointer;
  width: var(--size-14);
  height: var(--size-14);
  margin-left: var(--size-16);
}
.question_eve>img:last-child {
 margin-right: var(--size-24);
}
.question_info>div:first-child {
  height: var(--size-12);
  line-height: var(--size-12);
  font-weight: 400;
  padding-right: 4.5px;
  border-right: 1px solid #707070;;
}
.question_info>div:last-child {
  padding-left: 6.5px;
  font-weight: 400;
}
.question_eve {
  font-size: var(--size-12);
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  height: 0.4rem;
  line-height: 0.4rem;
}
.question_eve>div:first-child {
  color: #36a6fe;
}
.question_eve>div:nth-child(2) {
  margin-left: var(--size-12);
  color: #b4b4b4;
}
.question_eve>div:last-child {
  margin-left: var(--size-12);
  color: #fc6d27;
}
.answer {
  width: 97%;
  margin-left: var(--size-12);
}
.answer>div:first-child {
  margin-top: 0.56rem;
  margin-bottom: var(--size-20);
  height: 0.56rem;
  font-size: 0.4266666666667rem;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  line-height: 0.56rem;
  letter-spacing: 0.0256rem;
}
.profile_photo {
  width: 0.96rem;
  height: 0.96rem;
  margin-right: var(--size-8);
  border-radius: 1var(--size-8);
  border-radius: 1rem;
}
.profile {
  display: flex;
  flex-direction: row;
}
.profile_con {
  padding-bottom: 0.5066666666667rem;
  border-bottom: 1px solid #eaebef;
}
.profile_box {
  display: flex;
  flex-direction: column;
}
.profile_name {
  height: 0.5066666666667rem;
  font-size: var(--size-14);
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  line-height: 0.56rem;
  letter-spacing: 0.0224rem;
}
.profile_time {
  height: 0.4rem;
  font-size: var(--size-12);
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  color: #b4b4b4;
  line-height: 0.56rem;
  letter-spacing: 0.0192rem;
}
.profile_content {
  margin-top: 0.4266666666667rem;
}
.profile_context {
  text-indent: 0.8em;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #555555;
  letter-spacing: 0.84px;
  max-height: 5.333333333rem;
  min-height: 1rem;
  overflow-y: scroll;
}
.more {
  font-size: var(--size-12);
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  text-align: right;
  color: #36a6fe;
  cursor: pointer;
  padding-right: 0.2rem;
}
.operate {
  padding-top: var(--size-12);
}
.operate img{
  width: var(--size-14);
  height: var(--size-14);
  line-height: var(--size-14);
  vertical-align: middle;
  cursor: pointer;
}
.operate span {
  display: inline-block;
  height: 0.4266666666667rem;
  font-size: var(--size-12);
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 0.4266666666667rem;
  letter-spacing: 0.0192rem;
  margin-right: 0.4rem;
  cursor: pointer;
}
.margin-to {
  margin-top: var(--size-10);
}
.preview_img {
  width: 7.2rem;
  height: 5.093333333333rem;
}
.policy_side {
  width: 100%;
  padding: var(--size-10) var(--size-10);
}
.policy_content {
  margin: var(--size-14) 0;
}
.art_list {
  color: #86898B;
  font-size: var(--size-14);
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
  font-size: var(--size-14);
  overflow: hidden;
  cursor: pointer;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.right_txt {
  color: #233558; 
  font-size: var(--size-14); 
  font-weight: 400;
}
.right_sty {
  float: right;
  color: #656565;
  font-size: var(--size-14);
  cursor: pointer;
  display: flex;
  align-items: center;
}
.right_more {
  font-size: var(--size-12);
  margin-right: 4px;
  color: #A8A8A8;
  font-weight: bold;
}
.circle{
  // background: url('~@/assets/images/industry/yuanquan_gray@2x.png') no-repeat;
  background-size: 4px 4px;
  background-position: left;
}
.circle:hover{
  color: #36A6FE;
  // background: url('~@/assets/images/industry/yuanquan_blue@2x.png') no-repeat;
  background-size: 4px 4px;
  background-position: left;
}
.circle_left {
  margin-left: var(--size-10);
}
.collect {
  font-size: 0.32rem;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #36a6fe !important;
  line-height: 0.56rem;
  letter-spacing: 0.0192rem;
}
.collect_img {
  vertical-align: middle;
  width: var(--size-12);
  height: var(--size-12);
}
.nodata {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8rem;
}
.nodata_img {
  width: 0.853333333333rem;
  height: 0.853333333333rem;
  line-height: 0.853333333333rem;
  vertical-align: middle;
}
.nodata_info {
  display: inline-block;
  margin-left: var(--size-8);
  height: 0.853333333333rem;
  line-height: 0.853333333333rem;
  color: #555555;
}
.see_more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #36a6fe;
  cursor: pointer;
  padding: var(--size-20) 0;
}
.deadline {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #555555;
  padding: 1.333333333333rem 0;
}
.dia_photo {
  width: 0.96rem;
  height: 0.96rem;
  margin-right: 0.4533333333333333rem;
  border-radius: 1rem;
}
.dia_title {
  margin-top: -var(--size-20);
  padding-left: 0.48rem;
  font-size: var(--size-14);
  font-weight: 800;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  height: 1.6rem;
  line-height: 1.6rem;
  color: #333333;
  border-bottom: 1px solid #eaebef;
}
.dia {
  display: flex;
  flex-direction: row;
  padding: 0.2rem 0;
}
.dia_box {
  display: flex;
  flex-direction: column;
}
.dia_name {
  height: 0.5066666666667rem;
  font-size: var(--size-14);
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 900;
  color: #333333;
  line-height: 0.56rem;
  letter-spacing: 0.0224rem;
}
.dia_time {
  font-size: var(--size-12);
  font-family: Microsoft YaHei, Microsoft YaHei-Light;
  font-weight: 300;
  color: #b4b4b4;
  line-height: 0.56rem;
  letter-spacing: 0.0192rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.dia_con {
  width: 9rem;
  display: flex;
  flex-direction: column;
  padding: 0.0666666666667rem 0.333333333333rem 0 0.333333333333rem;
  border-radius: 0.5rem;
}
.dia_content {
  text-indent: 2em;
  margin-top: 0.666666666667rem;
  margin-bottom: 1.333333333333rem;
  letter-spacing: 0.0192rem;
  line-height: 0.666666666667rem;
}
.know {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin:0.5rem 0 0.333333333333rem 0;
}
.know_btn {
  width: 2.8rem;
  height: 0.933333333333rem;
  text-align: center;
  letter-spacing: 0.0192rem;
  border-radius: 22px;
}
.pad {
  padding-bottom: var(--size-24);
}
.profile_html {
  display: inline-block; 
  max-height: 100px     
  overflow: hidden;
}
.pop_sty {
  border-radius: 15px !important;
}
.image_fix_sty>>>.el-image {
  z-index: 9999 !important;
}
</style>
