<template>
  <div class="record-frame">
    <div class="tab-sty">
      <span class="tab" @click="changTab(0)" :class="{ active: activeTab == 0 }">客户跟进({{ followTotal }})</span>
      <span class="tab" @click="changTab(3)" :class="{ active: activeTab == 3 }">线索编辑({{ editTotal }})</span>
      <span class="tab" v-if="permissions.sys_achievements_createFollow" @click="changTab(1)" :class="{ active: activeTab == 1 }">客户回访({{ visitTotal }})</span>
    </div>
    <el-form :model="clueForm" inline class="from">
      <el-form-item label="关键字：" prop="keyWords">
        <el-input @keyup.enter.native="getAllList()" class="input-sty" :placeholder="activeTab == 3 ? '请输入操作人姓名或字段名称关键字' : '请输入操作人姓名/标题/内容关键字'" v-model.trim="clueForm.keyWords"/>
      </el-form-item>
      <el-form-item label="操作时间" prop="activeTime">
        <el-date-picker
          v-model="clueForm.activeTime"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getAllList()">搜索</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form>
    <div>
      <!-- 跟进列表 -->
      <el-table v-if="activeTab == 0" :data="followList" border class="records-table" :key="activeTab" :header-cell-style="{'text-align':'center'}">
        <el-table-column label="创建时间" prop="createTime" align="center" width="150px"></el-table-column>
        <el-table-column label="操作人" width="150px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：' + cEmpNo + ' ' + '部门：' + cDeptName" placement="bottom-start">
              <span class="tooltip-info" @mouseover="showUserInfo(scope.row.operateEmpId)">
                {{ scope.row.operateEmpName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="followContent">
          <template slot-scope="scope">
            <div v-if="scope.row.followTypeId">
              跟进方式：{{ scope.row.followTypeId | followWay(this_) }}
            </div>
            <div v-if="scope.row.taskName">任务名称：{{ scope.row.taskName }}</div>
            <div v-if="scope.row.followContent">
              跟进内容：{{ scope.row.followContent }}
            </div>
            <div v-if="(scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0) || (scope.row.otherSpu !== '' && scope.row.otherSpu !== null)">
              <span>跟进产品：</span>
              <span v-if=" scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0">
                <span v-for="(item, index) in scope.row.clueFollowSpuList" :key="index">
                  {{ item.followSpuName }}<span v-if="item.followSpuName != null && item.followSpuName != '' && index != scope.row.clueFollowSpuList.length - 1">,</span>
                </span>
              </span>
              <span v-if="scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0 && scope.row.otherSpu !== ''">,</span>
              <span v-if="scope.row.otherSpu != ''">{{ scope.row.otherSpu }}</span>
            </div>
            <div v-if="scope.row.nextFollowTime">下次跟进时间：{{ scope.row.nextFollowTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="附件" width="200">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.clueFollowFileList" :key="index" class="span_sty">
              <el-tooltip effect="dark" :content="item.name" placement="left">
                <a class="dow_sty" 
                   v-if="fileType.indexOf(item.name.substring(item.name.lastIndexOf('.'), item.name.length).toLowerCase()) >= 0"
                   :href="imgCdnUrl + item.url"
                   target="_blank">{{ item.name }}</a>
                <span class="dow_sty" @click="downFile(item)" v-else>{{ item.name }}</span>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="定位信息" width="200">
          <template slot-scope="scope">
            <div>
             <span v-if="scope.row.locationName&&scope.row.locationName!=null&&scope.row.locationName!=''">{{scope.row.locationName}}</span>
             <span v-if="scope.row.locationDetail&&scope.row.locationDetail!=null&&scope.row.locationDetail!=''">-{{scope.row.locationDetail}}</span>
             <div @click="previewImage(imgCdnUrl + scope.row.pictureUrl)" class="location-sty" v-if="scope.row.pictureUrl&&scope.row.pictureUrl!=null&&scope.row.pictureUrl!=''">
               <span>打卡照片</span>
             </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="160px">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime != scope.row.updateTime">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px" v-if="type == 0 && activeTab == 0 && (infoData.clueStatusId == 0||infoData.clueStatusId == 4)">
          <template slot-scope="scope">
            <!-- 跟进编辑 -->
            <el-button :disabled="(scope.row.operateEmpId == userInfo.id)&&(scope.row.followTypeId!=0)?false:true" type="text" @click="editFollowClue(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 回访列表 -->
      <el-table v-if="activeTab == 1" :data="visitList" border class="records-table" :key="activeTab" :header-cell-style="{'text-align':'center'}">
        <el-table-column label="创建时间" prop="createTime" align="center" width="150px"></el-table-column>
        <el-table-column label="操作人" width="150px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：' + cEmpNo + ' ' + '部门：' + cDeptName" placement="bottom-start">
              <span class="tooltip-info" @mouseover="showUserInfo(scope.row.createBy)">
                {{ scope.row.createByName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content">
          <template slot-scope="scope">
            <div v-if="scope.row.returnVisitContent&&scope.row.returnVisitContent!=null&&scope.row.returnVisitContent!=''">
              回访内容：{{ scope.row.returnVisitContent }}
            </div>
            <div v-if="scope.row.score!=null&&scope.row.score!=''">
              服务满意度{{ scope.row.score }}分
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="160px">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime != scope.row.updateTime">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 线索编辑列表 -->
    <div v-if="activeTab == 3">
      <el-table :data="editList" border class="records-table">
        <el-table-column label="操作时间" prop="createTime" align="center"></el-table-column>
        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：' + cEmpNo + ' ' + '部门：' + cDeptName" placement="bottom-start">
              <span @mouseover="showUserInfo(scope.row.createBy)">{{ scope.row.createByName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content" align="center"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pagination-sty"
      background
      layout="sizes, prev, pager, next, total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="total">
    </el-pagination>
    <!-- 客户跟进 -->
    <follow ref="follow" @refresh="refresh"></follow>
    <!-- 查看预览图 -->
    <el-image ref="locationImage" v-show="false" :src="previewImg"  :preview-src-list="[previewImg]"></el-image>
  </div>
</template>

<script>
import { getfollowTypy, getClueRecords, getClueEditRecords, pageClueReturnVisit} from "@/api/clue/clue";
import { downFile } from "@/api/admin/user";
import { getEmpInfo } from "@/api/project/wtClass";
import follow from "@/components/new-client/common/follow";
import * as CodeMsg from "@/api/common/CodeChange"
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    follow,
  },
  props: {
    clueId: { // 线索编号
      required: true,
    },
    infoData: { // 线索信息
      type: Object,
      required: true,
    },
    isOpenSeas: { // 是否是公海信息
      type: Boolean,
      required: false,
    },
    type: { // 来源-> 0:个人中心 1:客户管理
      type: String,
      required: true,
    },
  },
  data() {
    return {
      previewImg:'',
      env: process.env.NODE_ENV,
      this_: this,
      cEmpNo:"",
      cDeptName:"",
      followTotal: 0,
      editTotal: 0,
      visitTotal: 0,
      visitVisible: false,
      fileType: [".pdf", ".jpg", ".png", ".tiff", ".psd", ".jpeg", ".bmp"],
      imgCdnUrl: process.env.VUE_APP_IMAGE_BASEURL,
      activeTab: 0,
      clueForm: {
        keyWords: "",
        activeTime: null,
      },
      currentPage: 1,
      pageSize: 20,
      total: 0,
      followList:[], // 跟进列表
      visitList:[], // 回访列表
      editList: [], // 编辑列表
      followClueTypeList: [],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    ...mapGetters(["permissions"]),
  },
  mounted() {
    if(this.infoData.clueNo){
      this.getfollowTypeList()
      let params = this.getParams()
      this.getFollowList(params) 
      this.getVisitList(params)
      this.getEditList()
    }
  },
  filters: {
    followWay(val, this_) {
      let followObj = this_.followClueTypeList.filter((item) => {
        return item.id == val;
      });
      return followObj.length > 0 ? followObj[0].name : "";
    },
  },
  methods: {
    previewImage(url){
      this.previewImg = url
      this.$refs['locationImage'].clickHandler()
    },
    // 获取员工信息
    showUserInfo(id){
      getEmpInfo(id).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    getfollowTypeList() {
      const followClueTypeId = "15ea644a8fa2470b933e303dbc7fe19e"; //跟进方式下拉框数据id
      getfollowTypy(followClueTypeId).then((res) => {
        if(res.data.code == CodeMsg.CODE_1000){
          this.followClueTypeList = res.data.data[0].options;
        }
      });
    },
    refresh() {
      this.$emit("refresh");
      this.getRecords()
    },
    // pageSize修改
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getRecords();
    },
    // pageNo修改
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRecords();
    },
    // 重置列表
    reset() {
      this.clueForm.keyWords = ''
      this.clueForm.activeTime = null
      this.currentPage = 1
      this.getRecords();
    },
    getAllList() {
      this.currentPage = 1;
      this.getRecords();
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
    // 编辑跟进记录
    editFollowClue(row) {
      if(row.followTypeId == (this.env == 'development' ? 109 : this.env == 'test' ? 58 : 58)){
        this.$message({
          type: "warning",
          message: "请到CRM小程序进行编辑！",
          offset: 300,
        });
      }else{
      let proList = []
      if(row.clueFollowSpuList!=null){
        row.clueFollowSpuList.forEach(item=>{
        proList.push({
          id:item.spuId, // 产品ID
          spuCode:item.followSpuCode, // 跟进产品编号
          spuTitle:item.followSpuName, // 跟进产品名称
        })
      })
      }
      this.$nextTick(() => {
        this.$refs.follow.followClueDialog = true;
        this.$refs.follow.followInfo = this.infoData;
        this.$refs.follow.followTitle = "跟进编辑";
        this.$refs.follow.followId = row.id;
        this.$refs.follow.operateType = 1;
        if(Number(row.otherSpu)!=0){
          this.$refs.follow.checked = true;
        }
        this.$refs.follow.followClueForm = {
          followType: row.followTypeId,
          followContent: row.followContent,
          time: row.nextFollowTime,
          productOther: row.otherSpu,
        }
        this.$refs.follow.selectOption = proList;
        this.$refs.follow.fileList = row.clueFollowFileList;
        this.$refs.follow.clueType = this.infoData.clueType == 0 ? 1 : 2;
      });
      }
    },
    changTab(val) {
      this.activeTab = val;
      this.currentPage = 1
      this.getAllList()
    },
    // 获取线索编辑列表
    getEditList() {
      let params = {
        keyId: this.infoData.clueNo,
        type: 1,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        keywords: this.clueForm.keyWords,
      };
      if (this.$route.query.type == 1) {
        params.token = "pwd";
      }
      if (this.clueForm.activeTime) {
        params.startCreateTime = this.$moment(this.clueForm.activeTime[0]).format("YYYY-MM-DD HH:mm:ss");
        params.endCreateTime = this.$moment(this.clueForm.activeTime[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      getClueEditRecords(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.editList = res.data.data.records;
          this.editTotal = res.data.data.total;
          this.total = res.data.data.total;
        }
      });
    },
    // 获取跟进列表
    getFollowList(params) {
      getClueRecords(params, false).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.followList = res.data.data.records;
          this.followTotal = res.data.data.total;
          this.total = res.data.data.total;
        }
      });
    },
    // 获取回访列表
    getVisitList(params) {
      if(this.permissions.sys_achievements_createFollow){
        pageClueReturnVisit(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.visitList = res.data.data.records;
          this.visitTotal = res.data.data.total;
          this.total = res.data.data.total;
        }
      });
      }
    },
    // 获取参数
    getParams(){
      let params = {
        key: this.clueForm.keyWords,
        clueId: this.clueId,
        clueType: this.infoData.clueType == 1 ? 2 : 1,
        userType: 0,
        pageSize: this.pageSize,
        activityType: this.activeTab,
        pageNo: this.currentPage,
      };
      if (this.clueForm.activeTime!=null) {
        params.startCreateTime = this.$moment(this.clueForm.activeTime[0]).format("YYYY-MM-DD HH:mm:ss");
        params.endCreateTime = this.$moment(this.clueForm.activeTime[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      return params
    },
    getRecords() {
      let params = this.getParams()
      this.activeTab == 0 ? this.getFollowList(params) : this.activeTab == 3 ? this.getEditList() : this.getVisitList(params)
    },
  },
};
</script>

<style scoped>
.tab-sty{
  margin: 10px 0 0 0;
}
.record-frame {
  width: 95%;
  padding: 0px 100px 200px 0;
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
.file {
  color: #36a6fe;
}
.span_sty {
  display: flex;
}
.dow_sty {
  color: #409eff;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pagination-sty {
  float: right;
  margin-top: 6px;
}
.input-sty{
  width: 260px;
}
.location-sty{
  color: #36a6fe;
  cursor: pointer;
}
</style>