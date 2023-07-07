<template>
    <div class="act_records">
    <!-- 图片预览 -->
      <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>
      <img class="pre_sty" :src="imgBaseUrl+clueFileUrl" alt="">
      </span>
      </el-dialog>
      <el-dialog
        :visible="showDoc == true || showPdf == true  || showVideo == true || previewImg == true"
        :show-close="true"
        :width="'80%'"
        class="dialog-div-pre-style"
        :before-close="closePreviewClick"
        center>
          <div v-if="previewImg == true">
            <img class="pre_sty" :src="previewFileUrl" alt="">
          </div>
          <div v-if="showDoc == true" class="dialog-body-content-base-style">
              <iframe frameborder="0" :src="previewFileUrl" width='100%'></iframe>
          </div>
          <div v-else-if="showPdf == true" class="dialog-body-content-base-style" style="justify-content: center; align-items: center">
              <embed :src="previewFileUrl" style="width: 100%; height: 100%"/>
          </div>
          <div v-else-if="showVideo == true"
              class="dialog-body-content-base-style"
              style="justify-content: center; align-items: center">
              <video-player class="video-player vjs-custom-skin" ref="positiveVideoPlayer" :playsinline="true" :options="positivePlayerOptions"></video-player>
          </div>
      </el-dialog>
    <!-- 活动记录列表 -->
      <div class="handle-classify">
        <el-radio-group v-model="actType" @change="changeBtn">
            <el-radio-button :label="0">用户跟进({{ recordInfo.followUp }})</el-radio-button>
            <el-radio-button class="radio_sty" :label="1">用户编辑({{ recordInfo.distributionOrTransfer }})</el-radio-button>
        </el-radio-group>
      </div>
      <el-form v-model="filters" class="form_sty" inline @keyup.enter.native="getAllList()"  v-if="actType==0">
          <el-form-item label="关键字：" label-width="100px">
                <el-input style="width:300px;" placeholder="请输入操作人姓名或活动内容关键字" v-model="filters.kerWords"></el-input>
          </el-form-item>
          <el-form-item label="活动时间：" label-width="100px">
                <el-date-picker v-model="filters.activeTime" :unlink-panels="true" type="datetimerange" format="yyyy-MM-dd HH:mm" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-button type="primary" style="margin-left:10px;" @click="getAllList">搜索</el-button>
          <el-button style="margin-left: 10px;" @click="reset">重置</el-button>
      </el-form>
      <div class="table-distance" v-show="actType==0">
          <el-table :data="dataList" border style="width:93%;">
            <el-table-column prop="gmtCreate" label="创建时间" width="150px"></el-table-column>
            <el-table-column prop="operateEmpName" label="操作人" width="150px">
              <template slot-scope="scope">
                <div class="disbale_content">
                <el-tooltip effect="dark" :content="'工号：'+scope.row.operateEmpNo+'   部门：'+scope.row.operateEmpDeptName" placement="right">
                <span>{{ scope.row.operateEmpName }}</span>
                </el-tooltip>
                <img v-if="scope.row.operateEmpLockFlag!==null&&scope.row.operateEmpLockFlag == '9'" class="disable_img_sty" :src="baseUrl + 'img/disable.png'" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容">
              <template slot-scope="scope">
                  <div class="content_sty" v-if="scope.row.activityType==0">
                  <ul class="li_sty">
                      <li>跟进方式：{{ scope.row.followTypeName }}</li>
                      <li>跟进内容：{{ scope.row.followContent }}</li>                      
                      <li v-if="scope.row.nextFollowTime!==null">下次跟进时间：{{ scope.row.nextFollowTime }}</li>
                  </ul>
                  <ul>
                  </ul>
                  </div>
              </template>
            </el-table-column>
            <el-table-column prop="clueFile" label="附件">
              <template slot-scope="scope">
                <li v-if="scope.row.clueFile.length!==0" class="file_over">
                    <div v-for="(item,index) in scope.row.clueFile" :key="index" class="span_sty">
                      <el-tooltip effect="dark" :content="item.clueFileName" placement="right">
                          <span class="dow_sty" @click="previewPdf(item)">{{ item.clueFileName }}</span>
                      </el-tooltip>
                    </div>
                </li>
              </template>
            </el-table-column>
            <el-table-column prop="gmtModifed" label="更新时间" width="150px"></el-table-column>
          </el-table>
          <el-pagination
            v-if="total>20"
            @size-change="handleSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            :page-sizes="[10,20,30,40,50]"
            :page-size="pageSize"
            :total="total"
            style="float:right;margin-top:20px;margin-right:80px;"
          ></el-pagination>
      </div>
      <div v-if="actType==1">
        <user-allot :type='1' :id="this.id"></user-allot>
      </div>
    </div>
</template>

<script>
import { getActList,downFile } from "@/api/admin/user"
import userAllot from "@/components/user/user-allot"
export default {
    props:["userData","id"],
    components:{
      userAllot
    },
    data(){
        return{
            baseUrl: process.env.BASE_URL,
            showDoc: false,
            showPdf: false,
            showVideo: false,
            previewImg: false,
            previewFileUrl: "",
            fileUrl: "",
            images: [],
            clueFileUrl:"",
            imgBaseUrl:"",
            recordInfo:{},
            fileList:[],
            dialogVisible:false,
            addForm:{
                followType:"",
                followContent:"",
                file:"",
                followNext:""
            },
            total:0,
            currentPage:1,
            pageSize:20,
            filters:{
              kerWords:"",
              activeTime:null
            },
            actType:0,
            rules:{
                followType: [{ required: true, message: '请选择跟进方式', trigger: 'change' }],
                followContent: [{ required: true, message: '请填写跟进内容', trigger: 'change' }],
            },
            dataList:[]
        }
    },
    methods:{
      reset(){
        this.filters.kerWords=""
        this.filters.activeTime=null
        this.getAllList()
      },
      changeBtn(){
        if(this.actType == 0){
         this.getAllList()
        }
      },
      previewPdf(row) {
        let type = this.iconByType(row);
        this.fileUrl = row.clueFileUrl
        this.previewFileUrl = this.imgBaseUrl + row.clueFileUrl;
         if (type.indexOf("pdf") != -1) {
          window.open(this.previewFileUrl)
        } else if (type.indexOf("jpg") != -1 || type.indexOf("png") != -1 || type.indexOf("jpeg") != -1) {
          this.previewImg = true;
        } else {
          this.downFile(row)
        }
        
      },
      iconByType(row) {
        return row.clueFileName.substring(row.clueFileName.lastIndexOf(".") + 1, row.clueFileName.length)
      },
      closePreviewClick() {
        if (this.showDoc == true) {
            this.showDoc = false
        } else if (this.showPdf == true) {
            this.showPdf = false
        } else if (this.showVideo == true) {
            this.showVideo = false
        }else if(this.previewImg == true){
          this.previewImg = false
        }
      },
       downFile(file){
          let params = {
           filename: file.clueFileName,
           url: file.clueFileUrl
         }
          downFile(params).then(res=>{
            let blob = new Blob([res.data]);
            let objectUrl = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = objectUrl;
            a.download = file.clueFileName;
            a.click()
          })
        },
       handleClose(){
         this.dialogVisible = false
       },
        handleRemove(file, fileList) {
        console.log(file, fileList);
      },
        handlePreview(file) {
        console.log(file);
      },
        handleExceed(files, fileList) {
        this.$message.warning(`最多可添加5个附件`);
      },
        beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
        addClue(){
            this.dialogVisible = true

        },
        getAllList(){
            this.currentPage = 1
            this.getList()
        },
        getList(){
            let params = {
              userId:this.$route.query.id,
              size:this.pageSize,
              current:this.currentPage,
              keywords:this.filters.kerWords.trim(),
              userType:1,
              activityType: 0,
              startTime: this.filters.activeTime == null ?"":this.$moment(this.filters.activeTime[0]).format( "YYYY-MM-DD HH:mm:ss"),
              endTime: this.filters.activeTime == null?"":this.$moment(this.filters.activeTime[1]).format("YYYY-MM-DD HH:mm:ss"),
            }
            getActList(params).then(res=>{
               this.recordInfo = res.data.data
               this.dataList = res.data.data.list.records
               this.total  = res.data.data.list.total
            })
        },
        handleSizeChange(val){
          this.pageSize = val
          this.getAllList()
        },
        handleCurrentChange(val){
          this.currentPage = val
          this.getList()
        },
        switch() {
      if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
    },
    mounted(){
        this.getList()
        this.switch()
    }
}
</script>

<style scoped>
.dialog-body-content-base-style{
  height: 600px;
  width: 100%;
}
.handle-classify{
  margin: 0 0 20px 30px;
}
.act_records{
    padding-bottom:80px;
}
.form_sty{
    margin-top:20px;
}
.radio_sty {
  margin-left: 20px;
  border-left: 1px solid #dcdfe6;
}
.button_sty{
 display:flex;
 width:100%;
 justify-content: center;
}
.li_sty,li{
  list-style: none;
}
.content_sty{
  position: relative;
  display: flex;
  justify-content: space-between;
}
.dow_sty{
  display: inline-block;
  margin-left:10px;
  color:#409EFF;
  cursor:pointer;
  height: 20px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pre_sty{
  width:100%;
}
.preview_sty{
  display: inline-block;
  width:30px;
  height: 20px;
  display: inline-block;
  cursor:pointer;
  color:green;
}
.update_sty{
  position: absolute;
  right: 20px;
  top: 10px;
}
.file_sty{
  display: inline-block;
  width:40px;
}
.table-distance{
  margin:10px 0px 20px 20px;
}
.disbale_content{
  display: flex;
  justify-content: center;
}
.disable_img_sty{
  width:20px;
  height:20px;
  margin-left: 3px;
}
</style>
<style>
.act_records .el-textarea__inner{
    height: 150px;
    overflow-y: auto;
 }
</style>
