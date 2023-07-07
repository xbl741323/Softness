<template>
  <div class="record-frame">
    <el-radio v-model="activeTab" label="0" @change="radioChange">客户跟进({{ count[0].count }})</el-radio>
    <el-radio v-model="activeTab" label="3" @change="radioChange">分配和编辑({{ count[1].count }})</el-radio>
    <el-form :model="clueForm" inline class="from">
      <el-form-item label="关键字：" prop="keyWords" v-if="activeTab == 0">
        <el-input
          placeholder="请输入操作人姓名或活动内容关键字"
          v-model="clueForm.keyWords"
          style="width: 250px"/>
      </el-form-item>
      <el-form-item label="操作时间：" prop="activeTime" v-if="activeTab == 0">
        <el-date-picker
          v-model="clueForm.activeTime"
          type="datetimerange"
          style="width: 270px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          :default-time="['12:00:00']">
        </el-date-picker>
      </el-form-item>
      <el-button size="small" v-if="activeTab == 0" @click="search()">搜索</el-button>
      <el-button size="small" v-if="activeTab == 0" @click="reset()">重置</el-button>
    </el-form>
    <div v-if="showTable">
      <!-- 客户跟进 -->
      <el-table
        :data="recordList"
        border
        class="records-table"
        :key="activeTab"
        :header-cell-style="{ 'text-align': 'center' }"
        v-if="activeTab == 0"
        :cell-style="rowSty">
        <el-table-column label="创建时间" prop="createTime" align="center" width="120px" v-if="activeTab == 0"></el-table-column>
        <el-table-column label="操作人" width="80px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="tooltipContent" placement="bottom-start">
              <p class="tooltip-info" @mouseover="showUserInfo(scope.row.createBy)">{{ scope.row.createName }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="followContent" v-if="activeTab == 0">
          <template slot-scope="scope">
            <p v-if="scope.row.followType">
              跟进方式：{{ scope.row.followType | followTypeList(this_) }}
            </p>
            <p v-if="taskInfo">任务名称：{{ taskInfo.spuName }}</p>
            <p v-if="scope.row.followContent">
              跟进内容：{{ scope.row.followContent }}
            </p>
          </template>
        </el-table-column>
        <!-- 附件 -->
        <el-table-column label="附件" v-if="activeTab == 0" width="200">
          <template slot-scope="scope" v-if="scope.row.taskFollowFileList">
            <p v-for="(item, index) in scope.row.taskFollowFileList" :key="index" class="span_sty">
              <el-tooltip effect="dark" :content="item.name" placement="left">
                <a class="dow_sty" v-if="fileType.indexOf(item.name.substring(item.name.lastIndexOf('.'), item.name.length).toLowerCase()) >= 0"
                  :href="imgCdnUrl + item.url"
                  target="_blank">{{ item.name }}</a>
                <span class="dow_sty" @click="downFile(item)" v-else>{{item.name}}</span>
              </el-tooltip>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="150px" v-if="activeTab == 0">
          <template slot-scope="scope">
            <p v-if="scope.row.updateTime">
              {{ scope.row.updateTime }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px" v-if="showEdit && this.$route.query.listType == 'personal'">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="showEdit"
              :disabled="scope.row.createBy == userInfo.id?false:true"
              @click="editFollowClue(scope.row)">编辑</el-button>
            <p type="text" v-else>---</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分配和编辑 -->
    <div v-if="!showTable">
      <el-table
        v-if="taskEditInfo"
        :data="taskEditInfo"
        border
        class="records-table"
        :key="activeTab"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="rowSty">
        <el-table-column label="操作时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="tooltipContent" placement="top">
              <p @mouseover="showUserInfo(scope.row.createBy)">
                {{ scope.row.createByName }}
              </p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作内容">
          <template slot-scope="scope">
            <p>{{ scope.row.content }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pagination"
      background
      layout="sizes, prev, pager, next, total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
     <!-- 跟进回显 -->
    <el-dialog title="客户跟进" :visible.sync="followClueDialog" width="600px" :close-on-click-modal= "false">
      <customer-follow :operateType="1" ref="follow" :taskInfo="taskInfo" :apiInfo="apiInfo" :listType="listType" @closeDialog="closeDialog" v-if="followClueDialog"  />
    </el-dialog>
  </div>
</template>

<script>
import { getClassifyList } from "@/api/siteSettings/classify";
import {
  taskEditRecords,
  recordCount,
  followCount,
  taskRecords,
} from "@/api/task/index";
import fileupload from "@/components/file/file-upload";
import customerFollow from "./customer-follow";
import { downFile } from "@/api/admin/user";
import { mapState } from "vuex";
export default {
  components: {
    fileupload,
    customerFollow,
  },
  props: {
    customerFollow: {
      //客户跟进
      type: Boolean,
      required: false,
    },
    isOpenSeas: {
      //是否是公海信息
      type: Boolean,
      required: false,
    },
    taskInfo: {
      type: Object,
      required: true,
    },
    showEdit: {
      // type: Boolean,
      required: false, // 是否显示编辑
    },
    listType:{//personal-我的 其他值-任务管理
      required: true
    },
    apiInfo:{
      type: Object,
      required: true,
      default: ()=>{}
    }
  },
  data() {
    return {
      this_:this,
      fileType: [".pdf", ".jpg", ".png", ".tiff", ".psd", ".jpeg", ".bmp"],
      type: "", //列表跳转类型 0我的线索 1客户管理
      showDoc: false,
      showPdf: false,
      showVideo: false,
      previewImg: false,
      showTable: true,
      followOperateType: "",
      timeLabel: "", //时间label
      imgCdnUrl: process.env.VUE_APP_IMAGE_BASEURL,
      followClueDialog: false,
      activeTab: "0", //客户跟进
      clueForm: {},
      followClueForm: {},
      currentPage: 1,
      pageSize: 20,
      total: 0,
      followClueTypeList:[],
      recordList: [],
      count: [{ count: 0 }, { count: 0 }], //数量统计(附上初始值解决警告！)
      fileList: [],
      taskEditInfo: [],
      expireTimeOption: {
        disabledDate: (date) => {
          return (
            date.getTime() < Date.now() ||
            date.getTime() >
              Date.now() + this.infoData.publicTime * 24 * 60 * 60 * 1000
          );
        },
      },
    };
  },
  mounted() {
    this.getRecords();
    this.getCount();
    this.getEditRecords();
    this.getDropList()
  },
  created() {
    this.type = this.$route.query.type;
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
      userInfo: (state) => state.user.userInfo,
    }),
    followCust() {
      if (this.customerFollow) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    followCust(val) {
      if (val) {
        this.fllowClue(this.followClueForm);
      }
    },
  },
  filters: {
    activityType(value) {
      return value == 0 ? "客户跟进" : "线索分配";
    },
    followTypeList(val,this_){
      let [followObj] = this_.followClueTypeList.filter( item => item.id == val) 
      return followObj ? followObj.name : '';
    },
  },
  methods: {
    getDropList() {
      getClassifyList().then(res=>{
        if(res.data.code == 1000){
          let r = res.data.data 
          this.followClueTypeList = r[9].optionList;
        }
      })
    },
    // 统计数量
    getCount() {
      let param = {
        keyId: this.taskInfo.id,
      };
      let para = {
        orderTaskId: this.taskInfo.id,
      };
      recordCount(param).then((res) => {
        this.count[1].count = res.data.data;
      });
      followCount(para, this.listType, this.apiInfo).then((res) => {
        this.count[0].count = res.data.data;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.activeTab == 3) {
        this.getEditRecords();
      } else {
        this.getRecords();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.activeTab == 3) {
        this.getEditRecords();
      } else {
        this.getRecords();
      }
    },
    closeDialog() {
      this.followClueDialog = false
      this.$emit("closeFollow", false);
      this.getRecords();
    },
    search() {
      this.getRecords();
    },
    rowSty({ row, column, rowIndex, columnIndex }) {
      return { padding: "1px 0" };
    },
    closePreviewClick() {
      if (this.showDoc == true) {
        this.showDoc = false;
      } else if (this.showPdf == true) {
        this.showPdf = false;
      } else if (this.showVideo == true) {
        this.showVideo = false;
      } else if (this.previewImg == true) {
        this.previewImg = false;
      }
    },
    downFile(file) {
      let params = {
        filename: file.name,
        url: file.url,
      };
      downFile(params).then((res) => {
        let blob = new Blob([res.data]);
        let objectUrl = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = objectUrl;
        a.download = file.name;
        a.click();
      });
    },
    reset() {
      this.clueForm = {};
      this.getRecords();
    },
    cancle() {
      this.$refs["followClueForm"].clearValidate();
      this.followClueForm = {};
      this.fileList = [];
      this.followClueDialog = false;
      this.customerFollow = false;
    },
    editFollowClue(row) {
      //编辑跟进记录
      this.followOperateType = 0; //0、编辑 1、跟进
      this.fileList = [];
      this.$set(this.followClueForm, "followType", row.followTypeId);
      this.followTypeName = row.followTypeName;
      this.$set(this.followClueForm, "followContent", row.followContent);
      this.$set(this.followClueForm, "id", row.id);
      if(row.taskFollowFileList!=null){
        for (let i = 0; i < row.taskFollowFileList.length; i++) {
        this.fileList.push(row.taskFollowFileList[i]);
       }
      }
      this.followClueDialog = true;
      this.$nextTick(()=>{
        this.$refs.follow.followClueForm.followType = row.followType
        this.$refs.follow.followClueForm.followContent = row.followContent
        this.$refs.follow.followClueForm.clueFollowId = row.clueFollowId
        this.$refs.follow.fileList = this.fileList
        this.$refs.follow.followClueForm.id = row.id
        this.$refs.follow.$refs.upload.fileList = this.fileList
      })
    },
    getFileList(val) {
      //获取文件上传组件返回的文件数组
      this.fileList = val;
    },
    fllowClue(val) {
      //添加客户跟进
      this.followOperateType = 1; //0、编辑 1、跟进
      this.followClueDialog = true;
      this.followClueForm = {};
      this.fileList = [];
    },
    radioChange(val) {
      this.clueForm = {};
      if (val != 3) {
        this.showTable = true;
        this.getRecords();
      } else {
        this.showTable = false;
        this.getEditRecords();
      }
    },
    //分配和编辑记录
    getEditRecords() {
      let param = {
        keyId: this.taskInfo.id,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        type: 7,
      };
        taskRecords(param).then((res) => {
        this.taskEditInfo = res.data.data.records;
        this.total = res.data.data.total;
      });
    },
    // 客户跟进记录
    getRecords() {
      let param = {
        orderTaskId: this.taskInfo.id,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        operateTypes: [0],
        startTime:null,
        endTime:null,
      };
      if (this.clueForm.keyWords) {
        param.keywords = this.clueForm.keyWords.trim();
      }
      if (this.clueForm.activeTime) {
        param.startTime = this.$moment(this.clueForm.activeTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        param.endTime = this.$moment(this.clueForm.activeTime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      taskEditRecords(param, this.listType, this.apiInfo).then((res) => {
        this.recordList = res.data.data.records;
        this.total = res.data.data.total;
      });
    },
  },
};
</script>

<style scoped>
.record-frame {
  width: 100%;
  padding: 20px 0;
  font-size: 14px;
}
.tab {
  padding: 8px 15px;
  margin: 0 5px;
  border: 1px solid #eee;
  cursor: pointer;
}
.active {
  font-size: 16px;
  color: #fff;
  background: #36a6fe;
}
.from {
  margin-top: 25px;
}
.records-table {
  margin: 10px 0;
}
.footer {
  text-align: right;
}
.file {
  color: #36a6fe;
}
.span_sty {
  display: flex;
}
.dow_sty {
  color: #409eff;
  cursor: pointer;
  width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview_sty {
  width: 35px;
  cursor: pointer;
  color: green;
}
.pagination {
  float: right;
}
.seas {
  font-size: 12px;
  color: #777;
}
</style>