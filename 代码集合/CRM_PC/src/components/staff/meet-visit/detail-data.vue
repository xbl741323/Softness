<template>
  <div>
    <el-form :model="filters" ref="filters" inline>
      <el-form-item label="跟进时间：">
        <el-radio-group v-model="filters.followTimeType" @change="changeFollowTimeType">
          <el-radio :label="1">上月</el-radio>
          <el-radio :label="2">本周</el-radio>
          <el-radio :label="3">本月</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-date-picker
        v-model="filters.followTime"
        :unlink-panels="true"
        @change="changeFollowTime"
        format="yyyy-MM-dd HH:mm"
        type="datetimerange"
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <div>
        <el-form-item label="业务员：">
          <el-input class="input-sty" v-model.trim="filters.keyWords" @keyup.enter.native="getAllList()" placeholder="请输入员工姓名或工号"></el-input>
        </el-form-item>
        <el-form-item label="部门：" prop="deptId">
          <avue-input-tree v-model="filters.deptId" :dic="treeData" :props="{label: 'name',value: 'id'}" placeholder="请选择所属部门"/>
        </el-form-item>
        <el-button type="primary" @click="getAllList()">搜索</el-button>
        <el-button @click="reset()">重置</el-button>
      </div>
    </el-form>
    <avue-crud
      ref="crud"
      class="batch-choose"
      v-loading="tableLoading"
      :data="dataList"
      :option="tableOption"
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="locationImg" slot-scope="scope">
        <span @click="previewImage(imgCdnUrl + scope.row.clockPictureUrl)" class="location-sty">打卡照片</span>
      </template>
      <template slot="locationName" slot-scope="scope">
        <span>{{scope.row.locationName + scope.row.locationDetail}}</span>
      </template>
    </avue-crud>
    <!-- 查看预览图 -->
    <el-image ref="locationImage" v-show="false" :src="previewImg" :preview-src-list="[previewImg]"></el-image>
  </div>
</template>

<script>
import { getMeetVisitList } from "@/api/staff/meet-visit"
import { fetchNewTree } from "@/api/admin/dept";
import { tableOption } from "@/const/crud/staff/meet-visit";
import { filterDept } from "@/util/new-client/filter"
import { mapState, mapGetters } from "vuex";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  components: {
    
  },
  data () {
    return {
      imgCdnUrl: process.env.VUE_APP_IMAGE_BASEURL,
      previewImg:'', 
      treeData:[],
      dataList: [],
      tableLoading: false,
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
      filters: {
        followTimeType: 3, // // 上月-1,本周-2,本月-3,自定义-4 默认本月
        followTime: null,
        keyWords: "",
        deptId: ""
      },
    }
  },
 computed: {
    ...mapState({
      deptList: (state) => state.category.dept,
    }),
    ...mapGetters(["permissions"]),
  },
  created() {
    if(sessionStorage.getItem(`staff-meetvisit`)){
        let obj = JSON.parse(sessionStorage.getItem(`staff-meetvisit`));
        if(obj["formDatas1"]){
          this.page.currentPage = obj["formDatas1"].pageNo;
          this.page.pageSize = obj["formDatas1"].pageSize;
          this.filters.keyWords = obj["formDatas1"].empKeywords;
          this.filters.deptId = obj["formDatas1"].deptId;
          this.filters.followTime = obj["formDatas1"].followTime 
          this.filters.followTimeType= obj["formDatas1"].timeType        
        };
        if(this.filters.followTime!=null){
          this.filters.followTimeType = 4
        }
    }
  },
  mounted(){
    this.getDropList()
  },
  filters: {
    filterDept(val){ 
      return filterDept(val)
    },
  },
  methods: {
    getDropList() {  
      let params = {
        menuFlag:"emp_list"
      };            
      fetchNewTree(params).then((response) => {
        this.treeData = response.data.data;
      });
    }, 
    // 预览图片
    previewImage(url){
      this.previewImg = url
      this.$refs['locationImage'].clickHandler()
    },
    // 修改跟进时间区间
    changeFollowTimeType() {
      if(this.filters.followTimeType!=4){
        this.filters.followTime = null
      }
      this.getAllList()
    },
    // 修改跟进时间值
    changeFollowTime() {
      if(this.filters.followTime!=null){
        this.filters.followTimeType = 4
      }
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
    },
    getAllList() {
      this.page.currentPage = 1
      this.getList()
    },
    // 获取跟进列表数据
    getList() {
      this.tableLoading = true;
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
        empKeywords: this.filters.keyWords,
        deptId: this.filters.deptId,
        timeType: this.filters.followTimeType, // 上月-1,本周-2,本月-3,自定义-4
        followStartTime: this.filters.followTime == null ? "" : this.$moment(this.filters.followTime[0]).format("YYYY-MM-DD HH:mm:ss"),
        followEndTime: this.filters.followTime == null ? "" : this.$moment(this.filters.followTime[1]).format("YYYY-MM-DD HH:mm:ss"),
      };
       // 需要缓存的参数
       let keepParams = {
        followTime: this.filters.followTime,
        tabName: "1"
      };
      let obj = JSON.parse(sessionStorage.getItem(`staff-meetvisit`));               
      obj["formDatas1"] = Object.assign({}, params, keepParams)
      sessionStorage.setItem(`staff-meetvisit`, JSON.stringify(obj));
      getMeetVisitList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let r = res.data.data
          this.dataList = r.records
          this.page.total = r.total
          this.tableLoading = false;
        }
      })
    },
    // 重置筛选条件
    reset() {
      this.filters.followTimeType = 3;
      this.filters.followTime = null;
      this.filters.keyWords = "";
      this.filters.deptId = "";
      this.getAllList();
    },
  },
};
</script>

<style scoped>
.input-sty{
  width: 200px;
}
.location-sty{
  color: #36a6fe;
  cursor: pointer;
}
</style>