<template>
  <div class="">
    <div class="issue_detail">
      <div class="title_sty">
        <div class="title_sty_top">{{ detailInfo.title }}</div>
        <div class="title_sty_content">{{ detailInfo.description }}</div>
        <div class="answer_num_item">
          <span>{{ detailInfo.createTime }}</span>
          <span>{{ total }}个回答</span>
        </div>
      </div>
      <div class="answer_add" v-if="type == 2">
        <el-button type="primary" @click="answerFun()">我来答</el-button>
      </div>
      <div class="tinymce_sty" v-if="type == 2 && answer">
        <tinymce-editor
          :ax_wordlimit_num="30000"
          v-model="editorContent"
          @getEditorValue="getChildEditor"
          @limit="limitNum"
          ref="editor"
        ></tinymce-editor>
        <div class="submit_btn">
          <el-button type="primary" @click="submit()">提交</el-button>
        </div>
      </div>
    </div>
    <div>
      <div class="answerListVue_sty">
        <div class="noData" v-if="!answerList.length">暂无数据</div>
        <answerListVue
          :type="type"
          :source="source"
          v-for="item in answerList"
          :key="item.id"
          :answer="item"
        ></answerListVue>
        <div class="paging" v-if="answerList.length">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDetailById,
  getDetailPaging,
  submitSaveAnswer,
} from "@/api/personal/my-answer.js";
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
import * as CodeMsg from "@/api/common/CodeChange";
import answerListVue from "@/components/personal/myPublish/answer-list.vue";
export default {
  name: "CRMPCIssueDetail",
  components: {
    tinymceEditor,
    answerListVue,
  },
  data() {
    return {
      detailInfo: {},
      answer: false,
      type: null, // 1 查看 2  回复
      issueId: null,
      source: null,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      answerList: [],
      editorContent: "",
      deleteStatus: false,
    };
  },

  mounted() {
    this.type = this.$route.query.type;
    this.issueId = this.$route.query.number;
    this.source = this.$route.query.source;
    this.getDetail();
    this.getDetailPaging();
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepData = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
      this.currentPage = keepData.pageNo;
      this.pageSize = keepData.pageSize;
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDetailPaging();
    },
    // 分页获取问题
    getDetailPaging() {
      let data = {
        questionId: this.issueId,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(data));
      getDetailPaging(data, this.source == "myPublish").then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.answerList = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
    // 获取详情
    getDetail() {
      getDetailById(this.issueId, this.source == "myPublish").then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.detailInfo = res.data.data;
        }
      });
    },
    // 提交问题
    submit() {
      if (!this.editorContent) {
        this.$message({
          type: "none",
          message: "请填写内容",
        });
        return;
      }
      if (!this.limit) {
        this.$message({
          type: "none",
          message: "字数超出限制",
        });
        return;
      }
      let data = {
        content: this.editorContent,
        questionId: Number(this.issueId),
      };
      submitSaveAnswer(data, this.source == "myPublish").then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.getDetailPaging();
          this.editorContent = "";
          this.$message({
            type: "success",
            message: "提交成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        }
      });
    },
    answerFun() {
      this.answer = !this.answer;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDetailPaging();
    },
    limitNum(val) {
      this.limit = val;
    },
    getChildEditor(data) {
      this.editorContent = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.noData {
  background-color: #fff;
  font-size: 14px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  color: #8888;
}
.answerListVue_sty {
  margin: 0 500px 0 10px;
}
.title_sty {
  margin: 0 30px;
}
.issue_detail {
  margin: 0 500px 0 10px;
  padding: 10px;
  height: 100%;
  background-color: #fff;
}
.title_sty_top {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
.title_sty_content {
  margin-top: 20px;
  font-size: 14px;
  color: #333;
}
.answer_add {
  margin: 28px;
}
.submit_btn {
  position: absolute;
  right: 30px;
  bottom: -40px;
  margin-top: 20px;
}
.tinymce_sty {
  text-align: center;
  position: relative;
  margin-bottom: 70px;
}
.answer_num_item {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}
.answer_num_item span:nth-child(1) {
  padding-right: 10px;
}
.paging {
  background-color: #fff;
}
</style>
