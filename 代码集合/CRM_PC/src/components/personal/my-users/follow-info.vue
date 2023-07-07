<template>
<!-- 排查完成 -->
  <div class="order-records">
    <el-form :model="filters" inline @keyup.enter.native="getAllList()">
      <el-form-item label="关键字：">
        <el-input
          class="order-input-sty"
          v-model.trim="filters.keyWords"
          placeholder="请输入操作人姓名/跟进内容关键字"></el-input>
      </el-form-item>
      <el-form-item label="操作时间：">
        <el-date-picker
          v-model="filters.createTime"
          :unlink-panels="true"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList()" class="mar">搜索</el-button>
      <el-button @click="reset('filters')" class="mar">重置</el-button>
    </el-form>
    <avue-crud
      ref="crud"
      :table-loading="tableLoading"
      :page.sync="page"
      :data="dataList"
      :option="option"
      @on-load="getList">
      <template slot="menu" slot-scope="scope">
        <el-button v-show="scope.row.operateEmpName == name"
          type="text"
          size="small"
          icon="el-icon-edit"
          @click="edit(scope.row)">编辑</el-button>
      </template>
      <!-- 操作人 -->
      <template slot="operateEmpName" slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+cEmpNo +' 部门：'+ cDeptName" placement="top">
            <span @mouseenter="showUserInfo(scope.row)">{{scope.row.operateEmpName}}</span>
         </el-tooltip>
      </template>
      <!-- 标题 -->
      <template slot="id">
        <span>用户跟进</span>
      </template>
      <!-- 内容 -->
      <template slot="followTypeName" slot-scope="scope">
        <span v-show="scope.row.followTypeName&&scope.row.followTypeName!=null">
            <span class="spanStyle">跟进方式：</span>
            <span>{{ scope.row.followTypeName}}</span>
        </span><br>
        <span v-show="scope.row.followContent&&scope.row.followContent!=null">
            <span class="spanStyle">跟进内容：</span>
            <span>{{ scope.row.followContent}}</span>
        </span><br>
        <span v-show="scope.row.nextFollowTime&&scope.row.nextFollowTime!=null">
            <span class="spanStyle">下次跟进时间：</span>
            <span>{{ scope.row.nextFollowTime}}</span>
        </span>
      </template>
      <!-- 附件 -->
      <template slot="files" slot-scope="scope">
        <!-- 预览 -->
        <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" append-to-body >
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
         <span v-if="scope.row.files&&scope.row.files!=null">
            <span v-for="(item,index) in scope.row.files" :key="index" class="preview" @click="onPreview(scope.row,item.name)">{{ item.name }}<br></span>
          </span>
        <span v-else>无</span>
      </template>
      <!-- 更新时间 -->
      <template slot="updateTime" slot-scope="scope">
        <span v-if ="scope.row.updateTime&&scope.row.updateTime!=null">{{scope.row.updateTime}}</span>
        <span v-else>/</span>
      </template>
    </avue-crud>
    <el-dialog :visible.sync="followDialog" title="编辑跟进信息" width="670px" :close-on-click-modal="false">
      <follow-edit v-if="followDialog" :userInfo="userData" @changeVisible="changeVisible"></follow-edit>
    </el-dialog>
  </div>
</template>

<script>
import { getFollowList  } from "@/api/admin/user";
import { getEmpInfo } from "@/api/project/wtClass";
import { tableOption1, tableOption2 } from "@/const/crud/user/follow-info";
import followEdit from '@/components/personal/my-users/follow-edit'
export default {
  //personal-个人中心 list-订单管理
   components:{
    followEdit
  },
  data() {
    return {
      // baseUrl: process.env.BASE_URL,
      baseUrl: process.env.VUE_APP_IMAGE_BASEURL,
      dataList: [],
      tableLoading: false,
      option: this.$route.query.source == 'person'? tableOption1 : tableOption2,
      page: {
        total: 1, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes: [10, 20, 30, 50, 100],
      },
      filters: {
        keyWords: "",
        createTime: null,
      },
      cEmpNo:"",
      cDeptName:"",
      dialogVisible: false,
      dialogImageUrl:'',
      followDialog:false,
      userData:{},
      name:""
    };
  },
  mounted(){
    this.name = JSON.parse(sessionStorage.getItem('pigx-userInfo')).content.name;
    this.getAllList()
  },
  methods: {
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      let params = {
        userId: this.$route.query.userId,
        keyWord: this.filters.keyWords,
        startTime:this.filters.createTime == null ? "": this.$moment(this.filters.createTime[0]).format("YYYY-MM-DD HH:mm"),
        endTime:this.filters.createTime == null? "": this.$moment(this.filters.createTime[1]).format("YYYY-MM-DD HH:mm"),
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      getFollowList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
          this.tableLoading = false;
        }
      });
    },
    changeTab() {
      this.getList();
    },
    edit(row){
      this.userData = row;
      this.followDialog = true;
    },
    onPreview(row,name){
      if(row.files&&row.files!=null){
        row.files.forEach(item=>{
          if(name == item.name){
            this.dialogImageUrl = this.baseUrl + item.url;
          }
        })
      };
      this.dialogVisible = true;
    },
    showUserInfo(row){
      getEmpInfo(row.operateEmpId).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    //跟进取消按钮
    changeVisible(val) {
      this.followDialog = val;
      this.getAllList()
    },
    reset(filterName) {
      this.filters.keyWords = "";
      this.filters.createTime = null;
      this.getAllList();
    },
  },
};
</script>

<style scoped>
.order-records {
    margin-top: 20px;
}
.order-filter-item {
  margin: 0 0 15px 0;
}
.order-name-sty {
  font-size: 14px;
  color:#606266;
}
.order-btn-sty {
  margin: 0 20px 0 0;
}
.order-border-sty {
  border-left: 1px solid #dcdfe6;
}
.order-input-sty {
  width: 300px;
}
#handle-style {
  color: rgb(64, 158, 255) !important;
  cursor: pointer;
}
.disbale_content {
  display: flex;
  justify-content: center;
}
.disable_img_sty {
  width: 20px;
  height: 20px;
  margin-left: 3px;
}
.red-txt {
  color: red;
}
.circle-blue {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #36a6fe;
  margin-right: 6px;
}
.circleYellow {
  background: #ff9900;
}
.success {
  font-weight: bolder;
  font-size: 12px;
  float: left;
  color: green;
  margin-top: 2px;
  margin-right: 6px;
}
.transfer-status {
  font-size: 12px;
  color: #999;
  margin: -5px 0;
}
.order-status-sty{
  display: flex;
  justify-content: center;
  align-items: center;
}
.mar {
    margin:2px 5px 20px 5px;
}
.spanStyle {
    font-weight: bold;
}
.preview {
  color:blue;
}
.preview:hover {
  cursor: pointer;
}
</style>