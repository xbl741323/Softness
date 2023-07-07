<template>
  <div class="record-frame">
    <el-form :model="clueForm" inline>
      <el-form-item label="关键字：" prop="keyWords">
        <el-input @keyup.enter.native="getAllList()" class="key-input" placeholder="请输入操作人姓名/标题/内容关键字" v-model.trim="clueForm.keyWords"/>
      </el-form-item>
      <el-form-item :label="activeTab == 0 ? '操作时间' : '创建时间'" prop="activeTime">
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
    <!-- 跟进、回访列表选项 -->
    <div class="follow-visit">
      <span>内&nbsp;&nbsp;&nbsp;容：</span>
      <el-radio-group v-model="activeTab" @change="changTab" class="tab-sty">
        <el-radio :label="0">跟进({{followTotal}})</el-radio>
        <el-radio :label="6">回访({{visitTotal}})</el-radio>
      </el-radio-group>
    </div>
    <!-- 创建回访按钮 -->
    <el-button type="primary" @click="openVisit()" class="return-btn" v-if="activeTab == 6">+ 创建回访</el-button>
    <!-- 跟进/回访列表 -->
    <div>
      <el-table v-if="activeTab == 0" :data="followList" border class="records-table" :header-cell-style="{'text-align':'center'}">
        <el-table-column label="创建时间" prop="createTime" lign="center" width="150px" ></el-table-column>
        <el-table-column label="操作人" width="90px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：' + cEmpNo + ' ' + '部门：' + cDeptName" placement="bottom-start">
              <p @mouseover="showUserInfo(scope.row.operateEmpId)">
                {{ scope.row.operateEmpName }}
              </p>
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
              <span v-if="scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0">
                <span v-for="(item, index) in scope.row.clueFollowSpuList" :key="index">
                  {{ item.followSpuName }}<span v-if="item.followSpuName != null && item.followSpuName != '' && index != scope.row.clueFollowSpuList.length - 1">,</span>
                </span>
              </span>
              <span v-if=" scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0 && scope.row.otherSpu !== '' ">,</span>
              <span v-if="scope.row.otherSpu !== ''">{{ scope.row.otherSpu }}</span>
            </div>
            <div v-if="scope.row.nextFollowTime">下次跟进时间：{{ scope.row.nextFollowTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="附件" width="200">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.clueFollowFileList" :key="index" class="span_sty">
              <el-tooltip effect="dark" :content="item.name" placement="left">
                <a class="dow_sty" v-if="fileType.indexOf(item.name.substring(item.name.lastIndexOf('.'), item.name.length).toLowerCase()) >= 0" 
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
        <el-table-column label="更新时间" align="center" width="200">
          <template slot-scope="scope">
            <p v-if="scope.row.createTime != scope.row.updateTime">{{ scope.row.updateTime }}</p>
          </template>
        </el-table-column>
      </el-table>
      <!-- 回访列表 -->
      <el-table v-if="activeTab == 6" :data="visitList" border class="records-table" :header-cell-style="{'text-align':'center'}">
        <el-table-column label="创建时间" prop="createTime" lign="center" width="150px" ></el-table-column>
        <el-table-column label="操作人" width="90px" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'工号：' + cEmpNo + ' ' + '部门：' + cDeptName" placement="bottom-start">
              <span @mouseover="showUserInfo(scope.row.createBy)">
                {{ scope.row.createByName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="内容" prop="content">
          <template slot-scope="scope">
            <div v-if="scope.row.returnVisitContent!=null&&scope.row.returnVisitContent!=''">
              回访内容：{{ scope.row.returnVisitContent }}
            </div>
            <div v-if="scope.row.score!=null&&scope.row.score!=''">
              服务满意度：{{ scope.row.score }}分
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime != scope.row.updateTime">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160px">
          <template slot-scope="scope">
            <!-- 回访编辑 -->
            <el-button type="text" @click="editVisit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
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
    <!-- 回访 -->
    <el-dialog v-if="visitVisible" :visible.sync="visitVisible" title="客户回访" width="700px">
      <return-visit :key="+new Date()" v-if="visitVisible" :visible.sync="visitVisible" :visitData="visitData" :userInfo="userInfo" @getAllList="getAllList"/>
    </el-dialog>
    <!-- 查看预览图 -->
    <el-image ref="locationImage" v-show="false" :src="previewImg"  :preview-src-list="[previewImg]"></el-image>
  </div>
</template>

<script>
import { getfollowTypy, getClueRecords, getClueContactByClueTypeAndId, pageClueReturnVisit } from "@/api/clue/clue";
import { downFile } from "@/api/admin/user";
import { getEmpInfo } from "@/api/project/wtClass";
import { mapGetters } from "vuex";
import * as CodeMsg from "@/api/common/CodeChange"
import returnVisit from "@/components/staff/achievement/return-visit";
export default {
  components: {
    returnVisit
  },
  props: {
    clueId: {
      //线索编号
      required: true,
    },
    infoData: {
      //线索信息
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      previewImg:'',
      userInfo:{},
      this_: this,
      cEmpNo:"",
      cDeptName:"",
      visitVisible: false,
      fileType: [".pdf", ".jpg", ".png", ".tiff", ".psd", ".jpeg", ".bmp"],
      visitData: "", // 回访编辑数据
      imgCdnUrl: process.env.VUE_APP_IMAGE_BASEURL,
      activeTab: 0, 
      clueForm: {
        keyWords: '',
        activeTime: null
      },
      currentPage: 1,
      pageSize: 20,
      total: 0,
      followTotal:0,
      visitTotal:0,
      followList:[], // 跟进列表数据
      visitList:[], // 回访列表数据
      followClueTypeList: [],
      followTypeName: "",
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  mounted() {
    let param = this.getParams();
    this.getFollowList(param);
    this.getReturnList(param); 
    this.getfollowTypeList();
  },
  filters: {
    clueType(value) {
      return value == 0 ? "个人" : value == 1 ? "单位" : "";
    },
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
    openVisit(){
      let infoData = this.infoData
      this.userInfo={
        orgName: infoData.companyName,
        contactName:infoData.clueType == 0?infoData.contactName:infoData.clueCompanyContactList[0].contactName,
        mobile:infoData.clueType == 0?infoData.mobile:infoData.clueCompanyContactList[0].mobile,
        jobName:infoData.clueType == 0?infoData.jobName:infoData.clueCompanyContactList[0].jobName,
        clueId: infoData.clueType == 0? infoData.cluePersonId:infoData.clueCompanyId,
        clueType: infoData.clueType == 0?'1':'2',
      }
      this.visitVisible = true
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
    },
    editVisit(row) {
      let para = {
        clueType: row.clueType,
        clueId: row.clueId,
      };
      getClueContactByClueTypeAndId(para).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let data = res.data.data;
          row.authName = data.authName;
          row.mobile = data.mobile;
          row.jobName = data.jobName;
          this.visitVisible = true;
          this.visitData = row;
        }
      });
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
    // 重置
    reset() {
     this.clueForm.keyWords = ''
     this.clueForm.activeTime = null
     this.getAllList();
    },
    changTab(val) {
      this.activeTab = val;
      this.currentPage = 1
      this.getAllList();
    },
    getParams(){
      let param = {
        key: this.clueForm.keyWords,
        clueId: this.clueId,
        clueType: Number(this.$route.query.clueType) == 1 ? 2 : 1,
        userType: 0,
        pageSize: this.pageSize,
        activityType: this.activeTab,
        pageNo: this.currentPage,
      };
      if (this.clueForm.activeTime!=null) {
        param.startCreateTime = this.$moment(this.clueForm.activeTime[0]).format("YYYY-MM-DD HH:mm:ss");
        param.endCreateTime = this.$moment(this.clueForm.activeTime[1]).format("YYYY-MM-DD HH:mm:ss");
      }
      return param
    },
    getRecords() {
      let param = this.getParams()
      this.activeTab == 0 ? this.getFollowList(param) : this.getReturnList(param);
    },
    // 获取回访列表
    getReturnList(param) {
      param.start = this.currentPage;
      pageClueReturnVisit(param).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.visitList = res.data.data.records;
          this.total = res.data.data.total;
          this.visitTotal = res.data.data.total;
        }
      });
    },
    // 获取跟进列表
    getFollowList(param) {
      getClueRecords(param, false).then((res) => {
        if(res.data.code == CodeMsg.CODE_0){
          this.followList = res.data.data.records;
          this.total = res.data.data.total;
          this.followTotal = res.data.data.total;
        }
      });
    },
  },
};
</script>

<style scoped>
.borcolor >>> .el-input__inner {
  border-color: red !important;
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
  margin-top: 5px;
}
.key-input {
  width: 300px;
}
.return-btn{
  margin: -5px 0 5px 0;
}
.tab-sty{
  margin-left: 12px;
}
.follow-visit{
  margin-bottom: 20px;
}
.location-sty{
  color: #36a6fe;
  cursor: pointer;
}
</style>