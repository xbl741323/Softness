<template>
  <el-dialog
    title="陌拜关联"
    width="1000px"
    :center="true"
    :visible.sync="visitDialog"
    v-if="visitDialog"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <span class="client-name-sty">记录状态：</span>
    <el-radio-group v-model="recordStatus" @change="changeTab()" size="medium">
      <el-radio-button border :label="0" class="client-btn-sty">未关联</el-radio-button>
      <el-radio-button border :label="1" class="client-type-sty">已关联</el-radio-button>
    </el-radio-group>
    <div class="visit-contain">
      <el-button v-if="recordStatus==0" size="medium" type="primary" :disabled="selectVisitList.length>0?false:true" @click="showRelatedClue(1)">批量关联</el-button>
    </div>
    <div v-show="recordStatus == 1">
      <avue-crud
      v-if="recordStatus == 1"
      ref="crud"
      class="batch-choose"
      v-loading="tableLoading"
      :data="dataList"
      :option="relatedOption"
      :page.sync="page"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="locationImg" slot-scope="scope">
        <span @click="previewImage(imgCdnUrl + scope.row.clockPictureUrl)" class="location-sty">打卡照片</span>
      </template>
      <template slot="locationName" slot-scope="scope">
        <span>{{scope.row.locationName + scope.row.locationDetail}}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" @click="showRelatedClue(0,scope.row)">关联</el-button>
      </template>
    </avue-crud>
    </div>
    <div v-show="recordStatus == 0">
      <avue-crud
      v-if="recordStatus == 0"
      ref="crud"
      class="batch-choose"
      v-loading="tableLoading"
      :data="dataList"
      :option="tableOption"
      :page.sync="page"
      @selection-change="selectionChange"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="locationImg" slot-scope="scope">
        <span @click="previewImage(imgCdnUrl + scope.row.clockPictureUrl)" class="location-sty">打卡照片</span>
      </template>
      <template slot="locationName" slot-scope="scope">
        <span>{{scope.row.locationName + scope.row.locationDetail}}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" @click="showRelatedClue(0,scope.row)">关联</el-button>
      </template>
    </avue-crud>
    </div>
    <!-- 查看预览图 -->
    <el-image ref="locationImage" v-show="false" :src="previewImg" :preview-src-list="[previewImg]"></el-image>
    <!-- 陌拜记录关联线索 -->
    <related-clue @closeDialog="handleClose" ref="related"></related-clue>
  </el-dialog>
</template>

<script>
import { getStrangeVisitList } from "@/api/staff/meet-visit"
import { tableOption,relatedOption } from "@/const/crud/staff/strange-visit";
import relatedClue from "@/components/staff/strange-visit/related-clue"
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  components:{
    relatedClue
  },
  data() {
    return {
      imgCdnUrl: process.env.VUE_APP_IMAGE_BASEURL,
      previewImg: "",
      visitDialog: false,
      recordStatus: 0,
      dataList: [],
      tableLoading: false,
      tableOption: tableOption,
      relatedOption: relatedOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
        pageSizes: [5, 8, 10, 20, 30, 50, 100],
      },
      selectVisitList:[],
      selectVisitId:'',
    };
  },
  methods: {
    selectionChange(val) {
      this.selectVisitList = [];
      val.forEach(item=>{
        this.selectVisitList.push(item.visitId)
      })
    },
    // 预览图片
    previewImage(url) {
      this.previewImg = url;
      this.$refs["locationImage"].clickHandler();
    },
    showRelatedClue(type,row) {
      if(type == 0){
        this.selectVisitId = row.visitId
      }else{
        this.selectVisitId = ''
      }
      if(this.$refs.related){
        this.$refs.related.relatedDialog = true
        this.$refs.related.selectVisitList = this.selectVisitId == ''? this.selectVisitList:[this.selectVisitId]
      }
    },
    handleClose() {
      this.visitDialog = false
    },
    changeTab() {
      this.getAllList()
    },
    sizeChange(val) {
      this.page.pageSize = val;
    },
    currentChange(val) {
      this.page.currentPage = val;
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true
      let params = {
        status: this.recordStatus, // 0-未关联线索 1-已关联线索
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      }
      getStrangeVisitList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let r = res.data.data
          this.dataList = r.records
          this.dataList.forEach((item)=>{
            item.id = item.visitId
          })
          console.log(r.total,'r.totalr.total')
          this.page.total = r.total
          this.tableLoading = false
        }
      })
    },
  },
};
</script>

<style scoped>
.client-btn-sty {
  margin: 0 20px 0 5px;
}
.client-type-sty {
  border-left: 1px solid #dcdfe6;
}
.visit-contain {
  margin-top: 20px;
  margin-bottom: 15px;
}
.location-sty{
  color: #36a6fe;
  cursor: pointer;
}
</style>