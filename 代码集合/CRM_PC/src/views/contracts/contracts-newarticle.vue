<template>
  <div class="aaa">
     <div class="contracts">
      <!-- <div class="avue-header top-fixed">
        <a class="avue-logo" href="/#/wel/index"
          ><span class="avue-logo_title">卧涛管理中心 </span></a
        >
        <detail-head></detail-head>
      </div> -->
      <div class="details">
        <div class="top-detail">
          <div class="processnumber">
             <img src="../../assets/images/process/liucheng_icon.png" style="width:24px;height:24px;position: relative;top: 5px;"  />
          <span style="margin-left: 8px;font-weight: 600;">流程编号：{{$route.query.taskNo}}</span>
          </div>
          <div class="processnum">文章标题</div>
          <div class="processnum">
            {{ detailarticle.title }}
          </div>
          <table class="table">
            <tr>
              <th>流程状态</th>
              <th>发布人</th>
              <th>创建时间</th>
              <th>提审时间</th>
            </tr>
            <tr>
              <td>
                <span
                  v-show="detail.taskStatus == '0'"
                  class="circleBluec"
                ></span>
                <span v-show="detail.taskStatus == '1'" class="successc"
                  ><b>✔</b></span
                >
                <span v-show="detail.taskStatus == '2'" class="circleRedc"></span>
                <span>{{ detail.taskStatus | filterstatus }}</span>
              </td>
              <td>
                <el-tooltip
                  effect="dark"
                  :content="detailarticle.createUserName"
                  placement="right"
                > 
                  <span>
                      {{ detailarticle.createUserName }}
                  </span>
                </el-tooltip>
              </td>
              <td>
                <span>{{ detailarticle.createTime }}</span>
              </td>
              <td>
                <span class="left-space">{{ detail.gmtCreate }}</span>
              </td>
            </tr>
          </table>
        </div>
        <div class="article-detail" v-if="detailarticle != null">
          <setArticle
            @getTitle="titleData"
            :detailarticle="detailarticle"
            :detail="detail"
          ></setArticle>
        </div>
        <!-- 审核记录 -->
        <div class="process-record">
          <div class="list-header">
            <p class="rectangle"></p>
            <b class="text">审核记录</b>
          </div>
          <div class="record-top">
          <el-timeline  v-if="listData.length>0">
              <el-timeline-item
                v-for="(processitem, index) in listData"
                :key="index"
                placement="top"
                hide-timestamp
              >
                <p>
                  {{ processitem.policyStatus | filterstatus}}
                </p>
                <el-tooltip
                  v-if="processitem.operId == 0"
                  effect="dark"
                  content="系统"
                  placement="right"
                > 
                  <span>
                    操作人：系统
                  </span>
                </el-tooltip>
                <el-tooltip
                  v-else-if="processitem.operatorNo && processitem.operId != 0"
                  effect="dark"
                  :content="'工号：'+processitem.operatorNo+'  部门：'+processitem.operatorDeptName"
                  placement="right"
                > 
                  <span>
                    操作人：{{
                        processitem.operatorName ? processitem.operatorName : "暂无"
                    }}
                  </span>
                </el-tooltip>
                <el-tooltip
                  v-else
                  effect="dark"
                  content="暂无"
                  placement="right"
                > 
                  <span>
                    操作人：{{
                      processitem.operatorName ? processitem.operatorName : "暂无"
                    }}
                  </span>
                </el-tooltip>
                  <p v-if="processitem.policyStatus != 2">
                  备注：{{
                    processitem.auditNote ? processitem.auditNote : "暂无"
                  }}
                </p>
                  <p v-if="processitem.policyStatus == 2" style="color: #409EFF;cursor: pointer;" @click="showDialog(processitem.id)">详细原因</p>
                <p>
                  {{
                    processitem.gmtCreate
                  }}
                </p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <el-dialog
          :visible.sync="Dialog"
          v-if="Dialog"
          title="详细原因"
          :close-on-click-modal="false"
          width="60%">
          <div>
            <avue-crud
              ref="crud"
              :option="option"
              :data="dataList"
              :page.sync="page"
              @size-change="sizeChange"
              @current-change="currentChange"
              >
              <template slot="failContent" slot-scope="scope">
                  <div>
                      <span style="font-weight: bold;">{{scope.row.failDesc}}：</span>
                      <span style="white-space: normal;">{{ scope.row.failContent }}</span>
                  </div>
              </template>
            </avue-crud>
          </div>
      </el-dialog>
      </div>
    </div>
  </div>
   
</template>

<script>
import detailHead from "@/page/index/top/index";
import orderInfo from "@/components/personal/contracts/order-info";
import setArticle from "@/components/policy/setArticle";
import { auditingOption } from "@/const/crud/personal/auditing";
import { option } from "@/const/crud/articlecheck/artdetail";
import {
  newgetartcileDetail,
  getarticlerecordDetail,
  checkArticle,
  failDetailRecords,
  approveRecords,
} from "@/api/contracts/contracts";
// import SetArticle from "../../components/policy/setArticle.vue";
export default {
  components: {
    detailHead,
    orderInfo,
    setArticle,
  },
  data() {
    // SetArticle;
    return {
      detail: {},
      detailarticle: {},
      orderData: [],
      isShow: true,
      textarea: "",
      tableData: [],
      data: "",
      imgBaseUrl: "",
      previewFileUrl: "",
      auditingOption: auditingOption,
      productType: "",
      listData: [],
       Dialog:false,
      dataList:[],
      page: {
        total: 10, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 5, // 每页显示多少条
        pageSizes: [5, 10],
      },
      option:option,
      recordId:null
    };
  },
  filters: {
    filterstatus(val) {
      if (val == "1") {
        return "已通过";
      } else if (val == "0") {
        return "待审核";
      } else {
        return "未通过";
      }
    },
    contractsStatus(val) {
      if (val === null) {
        return "全部";
      } else if (val == "2") {
        return "待审核";
      } else if (val == "1") {
        return "已通过";
      } else if (val == "3") {
        return "未通过";
      } else if (val === "0") {
        return "草稿";
      } else if (val == 4) {
        return "已删除";
      }
    },
    filename(val) {
      if (val) {
        let fname = val.slice(val.lastIndexOf("/") + 1);
        if (fname.slice(0, fname.lastIndexOf(".")).length < 9) {
          return fname;
        } else {
          return fname.slice(0, 8) + "..." + ".pdf";
        }
      } else {
        return val;
      }
    },
    attachmentName(val) {
      if (val) {
        if (val.slice(0, val.lastIndexOf(".")).length < 9) {
          return val;
        } else {
          return val.slice(0, 8) + "..." + ".pdf";
        }
      } else {
        return "-";
      }
    },
  },
  mounted() {
    this.getData();
    this.switch();
    //引入pdf插件
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "@pdfjs/build/pdf.js";
    document.body.appendChild(oScript);
  },

  methods: {
    getDetailList() {
      let params = {
        auditId:this.recordId,
        current:this.page.currentPage,
        size:this.page.pageSize
      };
      
      failDetailRecords(params).then((res) => {
        this.dataList = res.data.data.records;
        this.page.total = res.data.data.total;
      });
    },
    // 详细原因
    showDialog(recordId){
        this.recordId = recordId;
        this.Dialog = true;
        this.getDetailList();
    },
    sizeChange(val) {
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getDetailList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getDetailList();
    },
    switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    //初始化
    getData() {
      let taskId = this.$route.query.taskId;
      let taskNo = this.$route.query.taskNo;
      newgetartcileDetail(taskId).then((res) => {
        this.detail = res.data.data;
        res.data.data.policyVO.content=res.data.data.policyVO.content.replace(/&nbsp;/ig,' ').replace(/&ldquo;/ig,'"').replace(/&rdquo;/ig,'"').replace(/<[^>]+>|&[^>]+;\s*/g, "");
        this.detailarticle = res.data.data.policyVO;
      });
      getarticlerecordDetail(taskNo).then((res) => {
        this.listData = res.data.data;
      });
    },
    //合同下载
    download(url) {
      this.previewFileUrl = this.imgBaseUrl + url;
      window.open(this.previewFileUrl, "_blank");
    },
    prview() {
      let routeData = this.$router.resolve({
        path: "/article-preview",
        query: {
          taskId: this.$route.query.taskId,
        },
      });
      window.open(routeData.href);
    },
  
    titleData(data) {
      this.title = data.title;
      this.number = data.number;
    },
  },
};
</script>
<style scoped>
.aaa{
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 20px 100px 20px 30px;
}
.record-top >>> .el-timeline-item__tail {
  position: absolute;
  left: 4px;
  height: 115%;
  border-left: 2px solid #e4e7ed;
}
.bottom-detail .el-tabs--border-card {
  background: #fff;
  border: 0;
  border-top: 0.1px solid #dcdfe6;
  box-shadow: 0 0 0 #fff;
}
</style>
<style scoped>
.cell-blue {
  color: #36a6fe;
  cursor: pointer;
}
.contracts {
  /* height: 100%; */
  margin-bottom: 0;
  background: #f6f7fa;
}
.record-top {
  margin-top: 10px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  background: #36a6fe;
  top: -2px;
  margin-right: 4px;
}
.circleRedc {
  width: 6px;
  height: 6px;
  position: relative;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
  top: -2px;
  background: red;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 4px;
}
.details {
  min-width: 1200px;
  background: #ffffff;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.table {
  margin-left: 20px;
  width: 100%;
}
.top-detail {
  /* margin-top: 20px; */
  background: #fff;
  padding-bottom: 15px;
}
.processnumber {
  font-weight: 300;
  margin-top: 10px;
  font-size: 20px;
  margin-left: -12px;
}
.processnum {
  margin-top: 10px;
  margin-left: 20px;
}
.top-detail tr {
  height: 30px;
  font-size: 14px;
  text-align: left;
}
.top-detail td {
  font-size: 14px;
  color: #333;
  width: 200px;
}
.top-detail th {
  padding-top: 25px;
}
.circleBluec {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 7px;
}
.circleRed {
  background: red;
}
.circleRedc {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 7px;
  background: red;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.successc {
  font-weight: bolder;
  font-size: 12px;
  color: green;
  margin-right: 6px;
}
.topBtn {
  padding: 25px;
}
.circle {
  position: relative;
  top: 2px;
  margin-left: 5px;
  width: 14px;
}
.delete {
  margin-left: 30px;
}
.cell-blue {
  display: inline-block;
  color: #36a6fe;
  cursor: pointer;
  max-width: 140px;
}
.tabottom {
  margin-bottom: 50px;
}
.bottom-detail {
  margin-top: 16px;
  background: #fff;
}
.list-header {
  display: flex;
  margin: 0 0;
}
.rectangle {
  width: 5px;
  height: 15px;
  background: #0aa1ed;
  border-radius: 3px;
  padding: 0;
}
.text {
  font-size: 14px;
  padding: 10px 10px;
  margin: 3px 0;
}
.process-record {
  background: #fff;
  margin-bottom: 30px;
}
.examine {
  margin-top: 16px;
  /* margin-bottom:200px; */
  background: #fff;
  /* padding:20px; */
  margin-bottom: 80px;
}
.examine-content {
  width: 800px;
  margin: 0 auto;
  font-size: 14px;
}
.button {
  margin: 30px;
  text-align: center;
}
.unpassed {
  margin-left: 50px;
}
.showBottom {
  margin-bottom: 200px;
}
.article-detail {
  background: #fff;
  margin-top: 30px;
  margin-bottom: 30px;
  padding-right: 10px;
}
</style>