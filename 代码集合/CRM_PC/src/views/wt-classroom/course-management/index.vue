<template>
  <!-- 复用列表子组件 -->
  <basic-container>
    <div v-if="permissions.sys_wt_course_detail || permissions.sys_wt_course_edit || permissions.sys_wt_course_del">
    <!-- 筛选区域 -->
    <div class="common-service">
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()">
        <el-form-item label="关键字：" prop="keyWords">
          <el-input class="input-sty" v-model.trim="filters.keyWords" placeholder="请输入课程标题关键字"></el-input>
        </el-form-item>
        <el-form-item label="显示状态：" prop="showStatus">
          <el-select v-model="filters.showStatus">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="显示"></el-option>
            <el-option value="0" label="不显示"></el-option>
            <el-option value="3" label="已删除"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="publishTime">
          <el-date-picker
            v-model="filters.publishTime"
            :unlink-panels="true"
            format="yyyy-MM-dd HH:mm"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getFirstAllList()">搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="resetForm()">重置</el-button>
        <el-button icon="el-icon-plus" type="success" @click="permissions.sys_wt_course_edit ? addProduct() : $notAuthorized()">新建课程</el-button>
        <div>
          <el-checkbox v-model="senior" class="senior-box">高级搜索</el-checkbox>
          <div class="senior-contain" v-if="senior">
           <el-form-item label="专业分类：" prop="themeType">
            <el-select v-model="filters.themeType">
            <el-option value="" label="全部"></el-option>
            <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
            </el-select>
           </el-form-item>
           <el-form-item label="收费类型：" prop="feeType">
            <el-select v-model="filters.feeType">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="完全免费"></el-option>
            <el-option value="2" label="VIP免费"></el-option>
            <el-option value="3" label="单独收费"></el-option>
            </el-select>
           </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="batch-operate">
      <span class="handle-txt-select" v-if="this.batchList.length != 0">已选择<b>{{batchList.length}}</b>项</span><span class="handle-txt">批量操作：</span>
      <el-button icon="el-icon-view" type="primary" :disabled="batchList.length == 0" @click="permissions.sys_wt_course_edit ? dialogbatchShowStatus = true : $notAuthorized()">{{ $t("button.showStatus") }}</el-button>
      <el-button icon="el-icon-delete" :disabled="batchList.length == 0" @click="permissions.sys_wt_course_del ? deleteBatch() : $notAuthorized()" type="danger">{{ $t("button.delete") }}</el-button>
    </div>
    <!-- 列表区域 -->
    <avue-crud class="batch-choose" ref="crud" :page.sync="page" :data="dataList" :option="option" :table-loading="tableLoading"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="classNumber" slot-scope="scope">
        <span id="handle-style" @click="handleEdit(scope.row)">{{ scope.row.classNo }}</span>
      </template>
      <template slot="classTitle" slot-scope="scope">
        <span id="handle-style" @click="handleEdit(scope.row)">{{ scope.row.baseTitle }}</span>
      </template>
      <template slot="plants" slot-scope="scope">
        <div v-for="(item,index) in scope.row.listPlate" :key="index">{{item.plateName}}</div>
      </template>
      <template slot="tradingChargeType" slot-scope="scope">
        <span>{{ scope.row.tradingChargeType|fixTradType }}</span>
      </template>
      <template slot="themeType" slot-scope="scope">
        <div v-for="(item,index) in scope.row.listSubject" :key="index">{{item.subjectName}}</div>
      </template>
      <template slot="tradingCurrentPrice" slot-scope="scope">
        <span>{{ scope.row.tradingCurrentPrice }}</span>
      </template>
      <template slot="tradingThirdFee" slot-scope="scope">
        <span v-if="scope.row.tradingThirdFeeState == 1">{{ scope.row.tradingThirdFee }}</span>
        <span v-else>/</span>
      </template>
      <template slot="showStatus" slot-scope="scope">
        <span v-if="scope.row.baseShowState == 3">已删除</span>
        <el-select v-else class="select-sty" :disabled="!permissions.sys_wt_course_edit" v-model="scope.row.baseShowState" @change="changeStatus(scope.row)">
          <el-option :value="1" label="显示"></el-option>
          <el-option :value="0" label="不显示"></el-option>
        </el-select>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.baseShowState == 1" type="text" size="small" icon="el-icon-share" @click="permissions.sys_wt_course_detail || permissions.sys_wt_course_edit || permissions.sys_wt_course_del ? classExtend(scope.row) : $notAuthorized()">推广</el-button>
        <el-button type="text" size="small" icon="el-icon-edit" v-if="scope.row.baseShowState !== 3 && permissions.sys_wt_course_edit" @click="fastEdit(scope.row)">快速修改</el-button>
        <el-button type="text" size="small" icon="el-icon-edit" v-if="scope.row.baseShowState !== 3 && permissions.sys_wt_course_edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="text" size="small" icon="el-icon-delete" v-if="scope.row.baseShowState !== 3 && permissions.sys_wt_course_del" @click="handleDelete(scope.row)">删除</el-button>
        <el-button type="text" size="small" icon="el-icon-view" @click="handleEdit(scope.row)">查看</el-button>
      </template>
    </avue-crud>
    <!-- 快速修改dialog -->
    <el-dialog :title="$t('button.amend')" :visible.sync="editVisible" :close-on-click-modal="false" center>
      <class-basic ref="basic" :permissions="permissions" :pageFrom="1" @close-dialog="closeDialog" :type="1"></class-basic>
    </el-dialog>
    <!-- 设置显示状态 -->
    <el-dialog
      :title="$t('message.batchShowStatus')"
      :visible.sync="dialogbatchShowStatus"
      width="30%"
      :close-on-click-modal="false">
      <el-form :model="batchForm" ref="batchForm">
        <p style="margin-bottom: 20px">已选择<span style="color: #ff0000">{{ this.batchList.length }}</span>篇文章</p>
        <el-form-item label="设置显示状态：" prop="showStatus">
          <el-radio-group v-model="batchForm.showStatus">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="wt-index-batch">
        <el-button type="primary" @click="batchStatus('batchForm')" class="wt-index-batch-confirm">确 定</el-button>
        <el-button @click="dialogbatchShowStatus = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 推广弹窗 -->
    <class-extend ref="extend"></class-extend>
    </div>
  </basic-container>
</template>

<script>
let that = ""
import {
  getOptionList,
  getClassList,
  batchDelClass,
  batchModStatus,
} from "@/api/project/wtClass";
import { mapGetters } from 'vuex'
import * as CodeMsg from "@/api/common/CodeChange";
import { saveDetal } from "@/util/clearDetail";
import { tableOption } from "@/const/crud/project/class-room";
import classBasic from "@/components/project/wt-classroom/class-basic";
import classExtend from "@/components/project/wt-classroom/class-extend";
export default {
  components: { classBasic,classExtend },
  data() {
    return {
      optionList: [],
      batchList: [],
      batchForm: {
        showStatus: 1,
      },
      senior: false,
      type: 1,
      dialogbatchShowStatus: false,
      editVisible: false,
      clickStatus: false,
      tableLoading: false,
      dataList: [],
      option: tableOption,
      filters: {
        keyWords: "",
        showStatus: "",
        publishTime: null,
        themeType: "",
        feeType: "",
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
    };
  },
  beforeCreate(){
    that = this
  },
  filters: {
    filterProType(val) {
     let result = that.optionList.filter(item=>{
        return item.id == val
      })
      return result.length>0? result[0].categoryName : '';
    },
    fixTradType(val) {
      return val == 1 ? "完全免费" : val == 2 ? "VIP免费" : val == 3 ? "单独收费" : "";
    },
  },
  created() {
    if(!this.permissions.sys_wt_course_detail && !this.permissions.sys_wt_course_edit && !this.permissions.sys_wt_course_del) this.$notAuthorized()
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.baseTitle;
      this.filters.showStatus = keepParams.params.baseShowState;
      if(keepParams.params.tradingChargeType){
        this.filters.feeType = keepParams.params.tradingChargeType;
      }else{
        this.filters.feeType = ""
      }
      if(keepParams.params.listSubject){
        this.filters.themeType = keepParams.params.listSubject;
      }else{
        this.filters.themeType = ""
      }
      this.filters.publishTime = keepParams.publishTime;
      this.clickStatus = keepParams.clickStatus;
      this.senior = keepParams.senior;
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    // 推广
    classExtend(row){
      this.$nextTick(()=>{
        this.$refs.extend.wxMemberVisble = true
        this.$refs.extend.classInfo = row
        this.$refs.extend.getChapterList()
      })
    },
    selectionChange(val) {
      this.batchList = [];
      val.forEach((item) => {
        this.batchList.push(item.id);
      });
    },
    changeStatus(row) {
      this.$confirm("确定修改该条显示状态么？", "提示", {
        type: "warning",
        cancelButtonClass: "btn-custom-cancel",
      }).then(() => {
          let params = {
            classIds: [row.id],
            state: row.baseShowState,
          };
          batchModStatus(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "操作成功！",
                offset: 300,
              });
              this.getList();
            }
          });
        }).catch(()=>{
          this.getList();
        })
    },
    closeDialog() {
      this.getList();
      this.editVisible = false;
    },
    addProduct() {
      let path = "/wt-classroom-add";
      let query = {
        type: this.type,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    getFirstAllList() {
      this.clickStatus = true;
      this.getAllList();
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        baseTitle: this.clickStatus == true ? this.filters.keyWords : "",
        baseShowState: this.clickStatus == true ? this.filters.showStatus : "",
        startPublishTime: this.clickStatus == true ? this.filters.publishTime == null ? "" : this.$moment(this.filters.publishTime[0]).format("YYYY-MM-DD HH:mm:ss") : "",
        endPublishTime: this.clickStatus == true ? this.filters.publishTime == null ? "" : this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss") : "",
      };
      if (this.senior) {
        params.tradingChargeType = this.clickStatus == true ? this.filters.feeType : "";
        if (this.filters.themeType !== "") {
          params.listSubject = this.clickStatus == true ? [{subjectId: this.filters.themeType}]: "";
        }
      }
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        params: params,
        senior: this.senior,
        publishTime: this.filters.publishTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getClassList(params, this.senior).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.dataList = r.records;
          this.page.total = r.total;
        }
      });
    },
    // 批量修改显示状态
    batchStatus() {
      let params = {
        classIds: this.batchList,
        state: this.batchForm.showStatus,
      };
      batchModStatus(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$message({
            type: "success",
            message: "修改成功！",
            offset: 300,
          });
          this.dialogbatchShowStatus = false;
          this.batchList = [];
          this.$refs.crud.toggleSelection();
          this.getAllList();
        }
      });
    },
    // 批量删除
    deleteBatch() {
      this.$confirm(`已选择${this.batchList.length}篇文章，确定删除吗?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
          let params = {
            classIds: this.batchList,
          };
          batchDelClass(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
              });
              this.batchList = [];
              this.$refs.crud.toggleSelection();
              this.getAllList();
            }
          });
        })
    },
    // 快速修改
    fastEdit(row) {
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.basic.classId = row.id;
        this.$refs.basic.getDetail();
      });
    },
    handleEdit(row) {
      let path = "/wt-classroom-detail";
      let query = {
        classId: row.id,
        classTitle: row.baseTitle,
      };
      saveDetal(`${this.$route.path}`, path, query);
      this.$router.push({ path: path, query: query });
    },
    handleDelete(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        let params = {
          classIds: [row.id],
        };
        batchDelClass(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "删除成功！",
              offset: 300,
            });
            this.batchList = [];
            this.getAllList();
          }
        });
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    resetForm() {
      this.clickStatus = false;
      this.filters.keyWords = "";
      this.filters.showStatus = "";
      this.filters.publishTime = null;
      this.filters.feeType = "";
      this.filters.themeType = "";
      this.senior = false;
      this.getAllList();
    },
    // 获取产品分类下拉框数据
    getDropList() {
      getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
        }
      });
    },
  },
  mounted() {
    this.getDropList();
  },
};
</script>
<style scoped>
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.senior-box {
  margin-bottom: 10px;
}
.batch-operate {
  margin-bottom: 10px;
}
.handle-txt-select {
  margin-right: 10px;
  font-size: 14px;
}
.wt-index-batch {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
.wt-index-batch-confirm {
  margin-right: 40px;
}
.input-sty{
  width: 200px;
}
</style>