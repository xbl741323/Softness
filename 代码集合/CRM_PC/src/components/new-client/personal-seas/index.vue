<template>
  <el-dialog title="公海领取" :visible.sync="openVisble"  v-if="openVisble" top="5vh" :width="'900px'"
    v-loading="loading"
    element-loading-text="领取中，请稍等！"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)" 
    :before-close="handleClose"
    :close-on-click-modal="false">
    <el-alert class="bottom-sty" title="提示：以下线索为流入到公海的线索，领取后，不改变该线索的线索归属和业务员" :closable='false' type="warning" show-icon></el-alert>
    <avue-crud
      class="batch-choose"
      ref="crud"
      :option="clueType == 1?option : personOption"
      :page.sync="page"
      :data="dataList"
      :table-loading="tableLoading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
        <template slot="clueName" slot-scope="scope">
          <span v-if="clueType == 1">{{scope.row.companyName|filterNull}}</span>
          <span v-if="clueType == 0">{{scope.row.contactName|filterNull}}</span>
        </template>
        <template slot="companyName" slot-scope="scope">
          <span>{{scope.row.companyName|filterNull}}</span>
        </template>
        <template slot="orgType" slot-scope="scope">
          <span>{{scope.row.orgType | filterUnitType}}</span>
        </template>
        <template slot="clueBelong" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right">
            <span @mouseenter="showUserInfo(scope.row.clueAttributionEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{scope.row.clueAttributionEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.customerLockFlag!==null&&scope.row.customerLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="salesman" slot-scope="scope">
          <div class="disbale_content">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" :disabled="userInfo.isPartner">
            <span @mouseenter="showUserInfo(scope.row.clueSalesmanEmpId)" :class="[(scope.row.clueStatusId == 2||scope.row.clueStatusId == 3)?'gray-color':'']">{{scope.row.clueSalesmanEmpName}}</span>
          </el-tooltip>
          <img v-if="scope.row.lockFlag!==null&&scope.row.lockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
          </div>
        </template>
        <template slot="customerBelong" slot-scope="scope">
          <el-tooltip effect="dark" :content="tooltipContent" placement="right" v-if="scope.row.clueUserEmpId!==null">
            <span @mouseenter="showUserInfo(scope.row.clueUserEmpId)">{{scope.row.clueUserEmpName}}</span>
          </el-tooltip>
          <span v-else>暂无数据</span>
        </template>
    </avue-crud>
    <div class="btn-contain" v-if="dataList.length>0">
      <el-button size="medium" type="primary" class="right-sty" @click="batchReceive()">确定</el-button>
      <el-button size="medium" @click="handleClose()">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { tableOption, personOption } from "@/const/crud/new-client/personal-seas";
import * as CodeMsg from "@/api/common/CodeChange";
import { filterUnitType } from "@/util/new-client/filter";
import { mapState } from "vuex";
import { getPersonalSeas, receiveAllSeas } from "@/api/new-client/my-clue"
export default {
  props: ["clueType"],
  data() {
    return {
      loading: false,
      tableLoading: false,
      openVisble: false,
      option: tableOption,
      personOption: personOption,
      baseUrl: process.env.BASE_URL,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条,
        isAsc: false, // 是否倒序
        pageSizes: [5, 10],
      },
      dataList: [],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  filters: {
    filterNull(val) {
      return Number(val) == 0 ? "暂无数据" : val;
    },
    filterUnitType(val) {
      return filterUnitType(val);
    },
  },
  methods: {
    // 领取提示
    batchReceive(){
      this.$confirm('一键领取所有流入到公海的线索，领取后，不改变该线索的线索归属和业务员，确认领取？',{
          type:'warning',
          cancelButtonClass: 'btn-custom-cancel',
        }).then(()=>{
          this.receiveOperate();
        })
    },
    // 领取操作
    receiveOperate(){
      this.loading = true
      receiveAllSeas(this.clueType).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.loading = false
          this.$notify({
            title: this.$t("text.success"),
            message: this.$t("message.receiveSuccess"),
            type: "success",
            duration: 2000,
          });
          this.$emit('refresh')
          this.handleClose()
        }else{
          this.$notify({
            title: "提示",
            message: res.data.msg,
            type: "warning",
            duration: 2000,
          });
          this.loading = false
        }
      })
    },
    getAllList(){
      this.page.currentPage = 1
      this.getList()
    },
    // 获取我的公海列表数据
    getList() {
      this.tableLoading = true;
      let params = {
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      getPersonalSeas(params, this.clueType).then((res) => {
        let r = res.data;
        this.dataList = r.records;
        this.page.total = r.total;
        this.tableLoading = false;
       });
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
    },
    handleClose() {
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      this.openVisble = false;
    },
  },
};
</script>

<style scoped>
.bottom-sty{
  margin-bottom: 25px;
}
.btn-contain{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.right-sty{
  margin-right: 40px;
}
</style>