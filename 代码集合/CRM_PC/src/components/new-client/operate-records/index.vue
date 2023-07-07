<template>
  <div class="operate-records">
    <!-- 筛选区域 -->
    <div class="records-filter">
      <el-form :model="filters" inline>
        <el-form-item label="关键字">
          <el-input v-model.trim="filters.keyWords" @keyup.enter.native="getAllList()" class="input-style" placeholder="请输入操作人姓名/标题/内容关键字"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filters.activeTime"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-button size="small" type="primary" @click="getAllList()">搜索</el-button>
        <el-button size="small" @click="resetFilter()">重置</el-button>
      </el-form>
    </div>
    <!-- 列表区域 -客户跟进 -->
    <avue-crud
      ref="crud"
      :option="optionFollow"
      :page.sync="page"
      :data="dataList"
      :table-loading="tableLoading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="menu" slot-scope="scope">
        <el-button :disabled="scope.row.operateEmpId == userInfo.id?false:true" class="filter-item" type="text" @click="editFollowClue(scope.row)">编辑</el-button>
      </template>
      <template slot="operateEmpName" slot-scope="scope">
        <el-tooltip effect="dark" :content="'工号：' + cEmpNo + ' ' + '部门：' + cDeptName" placement="bottom-start">
          <span @mouseenter="showUserInfo(scope.row.operateEmpId)">{{scope.row.operateEmpName}}</span>
        </el-tooltip>
      </template>
      <template slot="content" slot-scope="scope">
        <div class="content-sty">
          跟进方式：{{ scope.row.followTypeId | followWay(this_) }}
        </div>
        <div class="content-sty">
          跟进内容：{{ scope.row.followContent }}
        </div>
        <div class="content-sty" v-if="scope.row.taskName">
          任务名称：{{ scope.row.taskName }}
        </div>
        <div class="content-sty" v-if="(scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0) || (scope.row.otherSpu !== '' && scope.row.otherSpu !== null)">
          <span>跟进产品：</span>
          <span v-if=" scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0">
            <span v-for="(item, index) in scope.row.clueFollowSpuList" :key="index">
              {{ item.followSpuName }}
              <span v-if="item.followSpuName != null && item.followSpuName != '' && index != scope.row.clueFollowSpuList.length - 1">,</span>
            </span>
            </span>
          <span v-if="scope.row.clueFollowSpuList && scope.row.clueFollowSpuList.length != 0 && scope.row.otherSpu !== ''">,</span>
          <span v-if="scope.row.otherSpu != ''">{{ scope.row.otherSpu }}</span>
        </div>
        <div class="content-sty" v-if="scope.row.nextFollowTime !== null">
          下次跟进时间：{{ scope.row.nextFollowTime }}
        </div>
      </template>
      <template slot="locationInfo" slot-scope="scope">
        <div class="location-contain">
          <div class="location-desc">
            <span v-if="scope.row.locationName&&scope.row.locationName!=null&&scope.row.locationName!=''">{{scope.row.locationName}}</span>
            <span v-if="scope.row.locationDetail&&scope.row.locationDetail!=null&&scope.row.locationDetail!=''">-{{scope.row.locationDetail}}</span>
          </div>
          <div @click="previewImage(imgCdnUrl + scope.row.pictureUrl)" class="location-sty" v-if="scope.row.pictureUrl&&scope.row.pictureUrl!=null&&scope.row.pictureUrl!=''">
            <span>打卡照片</span>
          </div>
        </div>
      </template>
      <template slot="clueFollowFileList" slot-scope="scope">
        <div v-for="(item, index) in scope.row.clueFollowFileList" :key="index" class="span_sty">
          <el-tooltip effect="dark" :content="item.name" placement="left">
            <a class="dow_sty" v-if="fileType.indexOf(item.name.substring(item.name.lastIndexOf('.'), item.name.length).toLowerCase()) >= 0"
              :href="imgCdnUrl + item.url"
              target="_blank">{{ item.name }}</a>
            <span class="dow_sty" @click="downFile(item)" v-else>{{ item.name }}</span>
          </el-tooltip>
        </div>
      </template>
    </avue-crud>
    <!-- 客户跟进 -->
    <follow ref="follow" @refresh="refresh"></follow>
    <!-- 查看预览图 -->
    <el-image ref="locationImage" v-show="false" :src="previewImg" :preview-src-list="[previewImg]"></el-image>
  </div>
</template>

<script>
import { getEmpInfo } from "@/api/project/wtClass";
import { getfollowTypy, getClueRecords } from "@/api/clue/clue";
import { optionFollow } from "@/const/crud/client/operate-follow";
import { downFile } from "@/api/admin/user";
import { mapState, mapGetters } from "vuex";
import follow from "@/components/new-client/common/follow";
export default {
  props: ["type", "userData"],
  components: {
    follow
  },
  data() {
    return {
      previewImg:'',
      env: process.env.NODE_ENV,
      this_: this,
      cEmpNo:"",
      cDeptName:"",
      tableLoading: false,
      fileType: [".pdf", ".jpg", ".png", ".tiff", ".psd", ".jpeg", ".bmp"],
      imgCdnUrl: process.env.VUE_APP_IMAGE_BASEURL,
      followClueTypeList: [],
      optionFollow: optionFollow,
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      filters: {
        keyWords: "",
        activeTime: null,
      },
    };
  },
  filters: {
    followWay(val, this_) {
      let followObj = this_.followClueTypeList.filter((item) => {
        return item.id == val;
      });
      return followObj.length > 0 ? followObj[0].name : "";
    },
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {
    this.checkEditBtn();
    this.getfollowTypeList();
  },
  methods: {
    previewImage(url){
      this.previewImg = url
      this.$refs['locationImage'].clickHandler()
    },
    checkEditBtn(){
      if (this.type == 1) {
        this.optionFollow.menu = false;
      } else {
      if(this.userData.clueStatusId == 0){
        this.optionFollow.menu = true;
      }else{
        this.optionFollow.menu = false;
      }
    }
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
    refresh() {
      this.$emit("refresh");
      console.log('刷新了')
      this.getAllList()
    },
    resetFilter() {
      this.filters.keyWords = "";
      this.filters.activeTime = null;
      this.page.currentPage = 1
      this.getAllList();
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
    getfollowTypeList() {
      const followClueTypeId = "15ea644a8fa2470b933e303dbc7fe19e"; //跟进方式下拉框数据id
      getfollowTypy(followClueTypeId).then((res) => {
        this.followClueTypeList = res.data.data[0].options;
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
        this.$refs.follow.followInfo = this.userData;
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
        this.$refs.follow.clueType = this.userData.clueType == 0 ? 1 : 2;
      });
      }
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
      console.log('撒胡行了')
    },
    //客户分配+跟进
    getList() {
      let param = {
        userId: this.userData.userId,
        clueType: JSON.parse(this.$route.query.clueType) ? "2" : "1",
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage,
        key: this.filters.keyWords
      };
      if (this.filters.activeTime) {
        param.startCreateTime = this.$moment(this.filters.activeTime[0]).format("YYYY-MM-DD HH:mm:ss");
        param.endCreateTime = this.$moment(this.filters.activeTime[1]).format("YYYY-MM-DD HH:mm:ss");
      }
        getClueRecords(param, true).then((res) => {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        });
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      this.getAllList();
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList();
    },
  },
};
</script>
<style scoped>
.operate-records {
  margin: 10px 20px;
  width: 95%;
  padding: 0 100px 100px 0;
}
.records-filter {
  margin-top: 17px;
  margin-left: 2px;
}
.input-style {
  width: 280px;
}
.dow_sty {
  color: #409eff;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content-sty {
  text-align: left;
  display: flex;
  justify-content: flex-start;
}
.location-contain{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.location-desc{
  text-align: left;
}
.location-sty{
  color: #36a6fe;
  cursor: pointer;
}
</style>