<template>
  <div class="ques_container">
    <div class="ques_title">
      <div class="ques_tit">我的提问</div>
      <div class="ques_status">
        <div v-for="item in statusList" :key="item.id">
          <span :class="{active: item.id == tabStatus}" @click="changeTabStatus(item)">{{item.name}}
            <span v-if="item.id==0||item.id==1">({{item.count}})</span>
          </span>
        </div>
      </div>
    </div>
    <div class="ques_content" v-if="total>0">
      <div v-for="(item, index) in questionList" :key="index">
          <div class="ques_c" @click="toDetail(item)">
          <el-tooltip content="Top" placement="top" effect="light" v-if="item.title&&item.title.length>42">
              <span slot="content">{{item.title}}</span>
              <span class="ques_a">{{item.title}}</span>
            </el-tooltip>
            <span v-else class="ques_a">{{item.title}}</span>
            <span class="ques_b">{{item.answerCount}}回答 | {{item.createTime | filterTime}}</span>
          </div>
          <div class="ques_d">
            <img src="@/assets/images/member/icon-delete.png" alt="删除" class="del_img" v-if="item.deleted==0" @click="deleteQuestion(item)"/>
            <span class="waiting" v-if="item.answerCount==0&&item.deleted==0" @click="toDetail(item)">等待解答</span>
            <span class="delete" v-if="item.deleted==1" @click="toDetail(item)">已删除</span>
            <span class="see" v-if="item.deleted!=1&&item.answerCount>0" @click="toDetail(item)">查看</span>
          </div>
      </div>
    </div>
    <div class="ques_bg" v-else>
      <div class="no_data_box">
          <img class="no_data_img" src="~assets/images/zhengce/tongzhi_img_nodata@2x.png" />
          <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/CodeChange"
import { myQAList, deleteQuestion, getCount } from '@/api/question'
export default {
  components: {

  },
  head() {
    return {
      title: "我的提问",
      meta: [
        { name: "keywords", content: "我的提问" },
        {
          hid: "description",
          name: "description",
          content: "我的提问",
        },
      ],
    };
  },
  data () {
    return {
      accountId: '',
      userId: '',
      tabStatus: null,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      questionList: [],
      statusList: [
        {
          id: null,
          name: "全部",
          count: 0
        },
        {
          id: 0,
          name: "等待解答",
          count: 0
        },
        {
          id: 1,
          name: "已解答",
          count: 0
        },
        {
          id: -1,
          name: "已删除",
          count: 0
        }
      ]
    }
  },
  filters:{
    filterTime(val){
      if(val){
        return val.length > 10 ? val.slice(0,10) : val
      }
    }
  },
  created () {

  },

  mounted () {
    if(localStorage.getItem('userInfo')){
      this.userId = JSON.parse(localStorage.getItem('userInfo')).userId
      this.accountId = JSON.parse(localStorage.getItem('userInfo')).accountId
    }
    this.getCount()
    this.getList()
  },

  methods: {
    // 切换tab标签
    changeTabStatus(item){
      this.tabStatus = item.id
      this.getCount()
      this.getList()
    },
    // 跳转详情
    toDetail(item){
     if(item.deleted == 1){
       this.$router.push({
        path: '/member/question/detail'
      })
     }else{
       this.$router.push({
        path: '/policy/questionDetail?id='+ item.id
      })
     }
    },
    // 获取数目
    getCount(){
      let params = {
        answerStatus: this.tabStatus,
        currentAccounId: this.accountId
      }
      getCount(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.statusList[1].count = res.data.data.waiteAnswerNum
          this.statusList[2].count = res.data.data.answeredNum
        }
      })
    },
    // 获取列表
    getList(){
      let params = {
        answerStatus: this.tabStatus,//0 等待解答 1 已解答 -1 已删除
        deleted: this.tabStatus == -1 ? 1 : this.tabStatus == null ?  null : 0,//0-未删除 1-已删除
        currentAccounId: this.accountId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      }
      myQAList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.questionList = res.data.data.records
          this.total = res.data.data.total
        }else{
          this.total = 0
        }
      })
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
            this.getList()
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
.ques_container {
  background: #eff2f3;
}
.ques_title {
  width: 960px;
  height: 116px;
  background: #ffffff;
  border-radius: 5px;
  margin-bottom: 10px;
}
.ques_tit {
  width: 100%;
  height: 64.5px;
  line-height: 64.5px;
  padding-left: 30px;
  font-size: 18px;
  font-family: Microsoft YaHei, Microsoft YaHei-Bold;
  font-weight: 700;
  color: #333333;
  border-bottom: 1px solid #cecece;
}
.ques_content {
  width: 960px;
  background: #ffffff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
}
.ques_content>div{
  width: 100%;
  height: 100.5px;
  border-bottom: 1px solid #cecece;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px 0 30px;
}
.ques_bg {
  width: 960px;
  background: #ffffff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
}
.ques_status {
  display: flex;
  width: 100%;
  flex-direction: row;
}
.ques_status>div {
  margin: 16px 10px 8px 33px;
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #999999;
  cursor: pointer;
  padding-bottom: 24.5px;
}
.active {
  color: #36a6fe;
  border-bottom: 2px solid #36a6fe;
  padding-bottom: 4px;
}
.waiting {
  display: inline-block;
  background: #f3fbfe;
  border: 1px solid #36a6fe;
  border-radius: 4px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #36a6fe;
  padding: 3px 7px;
  margin-right: 5px;
  cursor: pointer;
}
.delete {
  background: #b4b4b4;
  border-radius: 4px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  line-height: 24px;
  padding: 0px 14px;
  cursor: pointer;
}
.see {
  background: #36a6fe;
  border: 1px solid #36a6fe;
  border-radius: 4px;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  padding: 3px 19px;
  cursor: pointer;
}
.ques_a {
  font-size: 16px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: #666666;
  padding-top: 28px;
  margin-bottom: 12px;
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:1;
  word-break: break-all;
  max-width: 690px;
}
.ques_b {
  font-size: 14px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
  line-height: 14px;
}
.ques_c {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.ques_d {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.del_img {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.no_data_box {
  height: 210px;
  width: 210px;
  text-align: center;
  margin: 100px auto;
  color: #BFBFBF;
}
.no_data_img {
  width: 100%;
  height: 100%;
}
</style>