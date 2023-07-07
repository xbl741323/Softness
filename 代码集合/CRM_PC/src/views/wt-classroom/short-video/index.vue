<template>
  <basic-container>
    <!-- 筛选区域 -->
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()">
        <el-form-item label="关键字：" prop="keyWords">
          <el-input v-model.trim="filters.keyWords" placeholder="请输入视频标题/发布人姓名关键字" class="input-sty"></el-input>
        </el-form-item>
        <el-form-item label="发布时间：" prop="publishTime">
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
        <el-button icon="el-icon-plus" type="success" @click="addVideo()">添加短视频</el-button>
      </el-form>
    <!-- 列表区域 -->
    <avue-crud class="batch-choose" ref="crud" :page.sync="page" :data="dataList" :option="option" :table-loading="tableLoading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="professionalType" slot-scope="scope">
         {{scope.row.professionalType|filterProType}}
      </template>
      <template slot="createByName" slot-scope="scope">
         <el-tooltip effect="dark" :content="$t('label.jobNumber')+'：'+ cEmpNo + ' '+ $t('message.emp')+ cDeptName" placement="right">
            <span @mouseenter="showUserInfo(scope.row)">{{scope.row.createByName}}</span>
         </el-tooltip>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="small" icon="el-icon-view" @click="handlePreview(scope.row)">预览</el-button>
        <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </avue-crud>
    <!-- 添加/编辑短视频 -->
    <el-dialog v-if="videoVisible" :before-close="closeVideo" :title="operateType==0?'添加视频':'编辑视频'" :visible.sync="videoVisible" :close-on-click-modal="false" width="40%" center>
       <el-form :model="videoForm" ref="videoForm" :rules="videoRules">
         <el-form-item label-width="100px" label="视频标题：" prop="videoTitle">
           <el-input v-model="videoForm.videoTitle" placeholder="请填写" maxlength="30" show-word-limit></el-input>
         </el-form-item>
          <el-form-item label-width="100px" label="封面图片：" prop="coverUrl">
           <imgUpload ref="upload" :imageDesc="imageDesc"></imgUpload>
         </el-form-item>
          <el-form-item label-width="100px" class="video-file-sty" label="视频文件：" prop="videoUrl">
           <el-button v-if="videoForm.videoUrl==''" size="small" type="primary" @click="showSelectVideo()">上传</el-button>
           <div v-else class="video-info">
             <div class="change-video" v-if="videoForm.videoUrl!==''">
               <div id="player-con"></div>
             </div>
             <el-button class="select-btn" type="text" size="mini" @click="showSelectVideo()">替换</el-button>
           </div>
         </el-form-item>
          <el-form-item label-width="100px" label="序号：" prop="sort">
           <el-input type="number" v-model="videoForm.sort" placeholder="请填写" class="sort-width"></el-input>
         </el-form-item>
          <el-form-item label-width="100px" label="描述：" prop="videoDesc">
           <el-input type="textarea" placeholder="请填写" maxlength="200" show-word-limit :autosize="{ minRows: 5 }" v-model="videoForm.videoDesc"></el-input>
         </el-form-item>
       </el-form>
       <div class="video-btn">
         <el-button size="medium" type="primary" class="confirm-btn" @click="saveVideo()">保存</el-button>
         <el-button size="medium" @click="closeVideo()">取消</el-button>
       </div>
    </el-dialog>
    <!-- 预览视频 -->
    <el-dialog :visible.sync="previewVisble" :center="true" :close-on-click-modal="false">
      <div class="video-preview" v-if="previewVisble||videoForm.videoUrl!==''">
        <div id="player-con" v-if="previewVisble"></div>
      </div>
    </el-dialog>
    <!-- 选择视频 -->
    <select-video ref="selectVideo" @selectVideo="selectVideo"></select-video>
  </basic-container>
</template>

<script>
let that = ""
import { getVideoUrl } from "@/api/video/upload";
import { getSVideoList,addSVideo,updateSVideo,deleteSVideo,getEmpInfo,getOptionList } from "@/api/project/wtClass";
import * as CodeMsg from "@/api/common/CodeChange";
import imgUpload from "@/components/upload/class-upload";
import selectVideo from "@/components/project/wt-classroom/select-video";
import { tableOption } from "@/const/crud/wt-classroom/short-video";
export default {
  components: { imgUpload,selectVideo },
  data() {
    return {
      optionList:[],
      player: "",
      cEmpNo:"",
      cDeptName:"",
      previewVisble: false,
      // 添加/编辑
      videoForm:{
       id:"",
       videoTitle:"",
       coverUrl:"",
       videoUrl:"",
       videoId:"",
       sort:"",
       videoDesc:""
      },
      videoRules:{
        videoTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        videoUrl: [{ required: true, message: "请上传", trigger: "blur" }],
        sort: [{ required: true, message: "请填写", trigger: "blur" }],
        videoDesc: [{ required: true, message: "请填写", trigger: "blur" }],
      },
      imageDesc:"仅可上传一张图片作为封面，格式为jpg，png等，建议比例：竖版16:9，大小控制在4M以内。",
      // 列表
      baseUrl: process.env.VUE_APP_IMAGE_BASEURL,
      operateType: 0, // 0-添加 1-编辑
      videoVisible: false,
      clickStatus: false,
      tableLoading: false,
      dataList: [],
      option: tableOption,
      filters: {
        keyWords: "",
        publishTime: null,
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
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
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(
        sessionStorage.getItem(`${this.$route.path}`)
      );
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.keyWord;
      this.filters.publishTime = keepParams.publishTime;
      this.clickStatus = keepParams.clickStatus;
    }
  },
  mounted(){
    this.getDropList()
  },
  methods: {
    // 获取产品分类下拉框数据
    getDropList() {
      getOptionList().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.optionList = res.data.data;
          console.log(this.optionList, "optionList");
        }
      });
    },
    // 获取视频信息
    getVideoInfo(videoId,status) {
      let params = new FormData();
      params.append("videoId", videoId);
      getVideoUrl(params).then((res) => {
        if(res.data.code&&res.data.code == CodeMsg.CODE_2001){
          this.$message({
            type: "warning",
            message: "视频正在解码中，请稍后再试！",
            offset: 300
          })
          return;
        }else{
          let r = res.data;
          this.videoForm.videoUrl = r.playInfoList[0].playURL;
          this.showVideo(status)
        }
      });
    },
    // 展示视频
    showVideo(status){
      setTimeout(() => {
        this.player = new Aliplayer(
          {
            id: "player-con",
            source: this.videoForm.videoUrl,
            width: "100%",
            height: "100%",
            cover: "",
            autoplay: status,
            preload: false,
            isLive: false,
            });
       }, 100);
    },
    showUserInfo(row){
      getEmpInfo(row.createBy).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.cEmpNo = res.data.data.number
          this.cDeptName = res.data.data.deptName
        }
      })
    },
    selectVideo(val){
      this.videoForm.videoId = val[0].id
      this.$refs['selectVideo'].relateVisble = false
      this.getVideoInfo(val[0].playVideoId, false)
      console.log(this.videoForm.videoUrl)
    },
    showSelectVideo(){
      this.videoForm.videoUrl = ''
      this.$refs['selectVideo'].relateVisble = true
    },
    // 保存视频
    saveVideo(){
      console.log('撒大声地')
      this.$refs['videoForm'].validate(val=>{
        if(val){
          this.saveCVideo()
        }
      })
    },
    saveCVideo(){
      if(this.$refs.upload.imgList.length>0){
        this.videoForm.coverUrl = this.$refs.upload.imgList[0].response.data
      }
      let params = {
        title:this.videoForm.videoTitle,
        coverPicUrl:this.videoForm.coverUrl,
        videoId:this.videoForm.videoId,
        serialNum:this.videoForm.sort,
        description:this.videoForm.videoDesc,
      }
      this.operateType == 0?this.saveData(params):this.updateData(params)
    },
    // 添加短视频
    saveData(params){
      addSVideo(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"添加成功！",
            offset:300
          })
          this.videoVisible = false
          this.getAllList()
        }
      })
    },
    // 编辑短视频
    updateData(params){
      params.id = this.videoForm.id
       updateSVideo(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:"success",
            message:"修改成功！",
            offset:300
          })
          this.videoVisible = false
          this.getList()
        }
      })
    },
    closeVideo(){
      this.clearFormData()
      this.videoVisible = false
    },
    // 添加短视频
    addVideo() {
      this.operateType = 0
      this.clearFormData()
      this.videoVisible = true;
    },
    // 清空表单数据
    clearFormData(){
      this.videoForm.id = ""
      this.videoForm.videoTitle = ""
      this.videoForm.videoUrl = ""
      this.videoForm.videoId = ""
      this.videoForm.videoDesc = ""
      this.videoForm.coverUrl = ""
      this.videoForm.sort = ""
      this.$nextTick(()=>{
        if(this.$refs.upload){
        this.$refs.upload.imgList = []
      }
      })
    },
    // 编辑短视频
    handleEdit(row) {
      this.operateType = 1
      this.videoVisible = true;
      this.videoForm.id = row.id
      this.videoForm.videoTitle = row.title
      this.videoForm.videoDesc = row.description
      this.videoForm.sort = row.serialNum
      this.getVideoInfo(row.playVideoId, false)
      this.$nextTick(()=>{
        if(this.$refs.upload&&row.coverPicUrl!=''){
        this.$refs.upload.imgList = []
        this.$refs.upload.imgList.push({
          response:{
            data: row.coverPicUrl
          }
        })
      }
      })
    },
    // 短视频预览
    handlePreview(row){
      this.previewVisble = true
      this.getVideoInfo(row.playVideoId, true)
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
        pageSize:this.page.pageSize,
        pageNo:this.page.currentPage,
        keyWord: this.clickStatus == true ?this.filters.keyWords:"",
        queryStartTime:this.clickStatus == true ? this.filters.publishTime == null ? "" : this.$moment(this.filters.publishTime[0]).format("YYYY-MM-DD HH:mm:ss") : "",
        queryEndTime:this.clickStatus == true ? this.filters.publishTime == null ? "" : this.$moment(this.filters.publishTime[1]).format("YYYY-MM-DD HH:mm:ss") : "",
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        params: params,
        publishTime: this.filters.publishTime,
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getSVideoList(params).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          let r = res.data.data
          this.dataList = r.records
          this.page.total = r.total
        }
      })
    },
    handleDelete(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        let params = {
          id: row.id
        }
        deleteSVideo(params).then(res=>{
          if(res.data.code == CodeMsg.CODE_0){
            this.$message({
              type:"success",
              message:"删除成功!",
              offset:300
            })
            this.getAllList()
          }
        })
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
      this.filters.publishTime = null;
      this.getAllList();
    },
  },
};
</script>
<style scoped>
.video-file-sty{
  margin-top: -40px;
}
.sort-width{
  width: 200px;
}
.video-btn{
  margin-top: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.confirm-btn{
  margin-right: 100px;
}
.video-info{
  display: flex;
  justify-content: flex-start;
  width: 300px;
  height: 120px;
}
.video-info i{
  position: absolute;
  top: 50%;
  left: 84px;
  transform: translateY(-50%);
  padding-top: 2px;
  font-size: 36px;
  color: #ffffff;
  cursor: pointer;
}
.video-preview {
  width: 100%;
  height: 500px;
}
.input-sty{
  width: 280px;
}
.change-video{
  width: 200px !important;
  height: 120px !important;
}
.select-btn{
  margin-left: 10px;
}
</style>

<style>
.prism-player .prism-big-play-btn{
  position: absolute;
  left: 50% !important;
  top: 50% !important;
  transform: translateY(-50%) translateX(-50%) !important;
  display: block;
}
</style>