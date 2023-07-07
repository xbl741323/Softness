<template>
  <!-- 复用列表子组件 -->
  <basic-container>
    <!-- 筛选区域 -->
    <div class="common-service">
      <el-form :model="filters" ref="filters" inline @keyup.enter.native="getFirstAllList()">
        <el-form-item label="关键字：" prop="keyWords">
          <el-input v-model.trim="filters.keyWords" placeholder="请输入视频标题关键字"></el-input>
        </el-form-item>
        <el-form-item label="专业分类：" prop="professionalType">
          <el-select v-model="filters.professionalType">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新时间：" prop="publishTime">
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
        <el-button icon="el-icon-plus" type="success" @click="ShowUploadVideo()">上传视频</el-button>
      </el-form>
    </div>
    <!-- 列表区域 -->
    <avue-crud class="batch-choose" ref="crud" :page.sync="page" :data="dataList" :option="option" :table-loading="tableLoading"
      @size-change="sizeChange"
      @current-change="currentChange"
      @on-load="getList">
      <template slot="professionalType" slot-scope="scope">
        <span>{{scope.row.professionalType|filterProType}}</span>
      </template>
      <template slot="videoPreview" slot-scope="scope">
        <div class="video-pre-sty" @click="handlePreview(scope.row)">
          <i class="el-icon-video-play plsy-sty"></i>
          <img class="preview-sty" :src="baseImgUrl+scope.row.videoCover" alt="">
        </div>
      </template>
      <template slot="relateClassCount" slot-scope="scope">
        <span id="handle-style" @click="showRelateClass(scope.row)">{{scope.row.classNum}}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button v-if="scope.row.classNum==0" type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </avue-crud>
    <!-- 上传视频 -->
    <el-dialog :before-close="closeVideoDialog" v-loading="loading" element-loading-text="上传中，请稍等！" :title="operateType==0?'上传':'编辑视频'" :visible.sync="videoVisble" :center="true" width="30%" :close-on-click-modal="false">
      <el-form :model="videoForm" ref="videoForm" :rules="videoRules">
        <el-form-item label="视频标题：" label-width="100px" prop="videoTitle">
          <el-input v-model="videoForm.videoTitle" placeholder="请输入视频标题"></el-input>
        </el-form-item>
        <el-form-item label="专业分类：" label-width="100px" prop="professionalType">
          <el-select v-model="videoForm.professionalType">
            <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频文件：" label-width="100px" prop="videoUrl">
          <upload-auth v-if="videoVisble" ref="video"></upload-auth>
          <p>请上传mp4格式的视频，大小不超过500M</p>
        </el-form-item>
      </el-form>
      <div class="wt-index-batch">
        <el-button type="primary" v-if="operateType==0" size="medium" class="wt-index-batch-confirm" v-preventReClick @click="addVideo()">确 定</el-button>
        <el-button type="primary" v-if="operateType==1" size="medium" class="wt-index-batch-confirm" v-preventReClick @click="editVideo()">确 定</el-button>
        <el-button size="medium" @click="closeVideoDialog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预览视频 -->
    <el-dialog :visible.sync="previewVisble" :center="true" width="50%" :close-on-click-modal="false">
      <div class="video-preview">
        <div v-if="previewVisble" id="player-con"></div>
      </div>
    </el-dialog>
    <!-- 关联课程弹窗列表 -->
    <el-dialog title="关联课程" :visible.sync="relateVisble" :center="true" width="50%" :close-on-click-modal="false">
       <div class="show-video-title">
         <span>视频标题：{{mainTitle}}</span>
         <span>共关联{{mainCount}}节课程</span>
       </div>
       <avue-crud v-if="relateVisble" class="batch-choose" ref="crud" :page.sync="mainPage" :data="mainDataList" :option="mainOption"
        @size-change="mainSizeChange"
        @current-change="mainCurrentChange"
        @on-load="getMainList">
        <template slot="professionalType" slot-scope="scope">
          <div v-for="(item,index) in scope.row.listSubject" :key="index">
            {{item.subjectName}}
          </div>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleMainDelate(scope.row)">删除关联</el-button>
        </template>
      </avue-crud>
    </el-dialog>
  </basic-container>
</template>

<script>
let that = ""
import {
  delChapterVideo,
  addVideo,
  editVideo,
  deleteVideo,
  getVideoList,
  getOptionList,
  getRelateClass,
} from "@/api/project/wtClass";
import { getVideoUrl } from "@/api/video/upload";
import { videoOption } from "@/const/crud/project/videoLibrary";
import videoUpload from "@/components/upload/class-video-upload";
import uploadAuth from "@/components/upload/upload-auth";
import { mainOption } from "@/const/crud/project/main-class";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  components: {
    videoUpload,
    uploadAuth,
  },
  data() {
    return {
      player: "",
      optionList: [],
      // 关联课程
      relateMainId: "",
      mainTitle: "",
      mainCount: 0,
      relateVisble: false,
      mainOption: mainOption,
      mainDataList: [],
      mainPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      // 视频列表
      cVideoUrl: "",
      baseImgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      previewVisble: false,
      operateType: 0, // 0-添加 1-编辑
      videoForm: {
        id: "",
        videoTitle: "",
        professionalType: "",
        videoUrl: "",
        videoId: "",
      },
      videoRules: {
        videoTitle: [{ required: true, message: "请填写", trigger: "blur" }],
        professionalType: [
          { required: true, message: "请选择", trigger: "blur" },
        ],
        videoUrl: [{ required: true, message: "请上传", trigger: "blur" }],
      },
      videoVisble: false,
      clickStatus: false,
      tableLoading: false,
      dataList: [],
      option: videoOption,
      loading: false,
      filters: {
        keyWords: "",
        professionalType: "",
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
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.page.currentPage = keepParams.params.pageNo;
      this.page.pageSize = keepParams.params.pageSize;
      this.filters.keyWords = keepParams.params.videoName;
      this.filters.professionalType = keepParams.params.professionalType;
      this.filters.publishTime = keepParams.publishTime;
      this.clickStatus = keepParams.clickStatus;
    }
  },
  methods: {
    /**
     * 关联课程区域
     */
    getMainList() {
      let params = {
        id: this.relateMainId,
      };
      getRelateClass(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          let startIndex =
            (this.mainPage.currentPage - 1) * this.mainPage.pageSize;
          let endIndex = startIndex + this.mainPage.pageSize;
          this.mainDataList = r.slice(startIndex, endIndex);
          this.mainCount = res.data.data.length;
          this.mainPage.total = this.mainCount;
        }
      });
    },
    mainSizeChange(val) {
      this.mainPage.pageSize = val;
    },
    mainCurrentChange(val) {
      this.mainPage.currentPage = val;
      this.getMainList();
    },
    handleMainDelate(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        let params = {
          id: row.sectionId,
          classId: row.classId,
        };
        delChapterVideo(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "删除成功！",
              offset: 300,
            });
            this.mainPage.currentPage = 1;
            this.getMainList();
            this.getList()
          }
        });
      });
    },
    // 展示关联课程列表弹窗
    showRelateClass(val) {
      this.mainTitle = val.videoName;
      this.mainCount = val.relateClassCount;
      this.relateMainId = val.id;
      this.relateVisble = true;
    },
    /**
     * 视频区域
     */
    // 上传视频
    closeVideoDialog(){
      this.getAllList()
      this.videoVisble = false
    },
    addVideo() {
      if (this.$refs["video"].videoId !== "") {
        this.videoForm.videoUrl = this.$refs["video"].url;
        this.videoForm.videoId = this.$refs["video"].videoId;
      } else {
        this.videoForm.videoUrl = "";
      }
      this.$refs.videoForm.validate((val) => {
        if (val) {
          this.loading = true;
          let params = new FormData();
          params.append("playVideoId", this.videoForm.videoId);
          params.append("videoName", this.videoForm.videoTitle);
          params.append("professionalType", this.videoForm.professionalType);
          params.append("videoTime", this.$refs["video"].cVideoTime);
          params.append("videoCover", this.$refs["video"].cutUrl);
          addVideo(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "添加成功！",
                offset: 300,
              });
              this.getAllList();
              this.$refs["video"].fileList = [];
              this.videoForm.videoTitle = "";
              this.videoForm.videoUrl = "";
              this.videoForm.professionalType = "";
              this.videoVisble = false;
              this.loading = false;
            } else if (res.data.code == -1) {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
              });
              this.loading = false;
            }
          });
        }
      });
    },
    // 编辑视频
    editVideo() {
      if (this.$refs["video"].videoId !== "") {
        this.videoForm.videoUrl = this.$refs["video"].url;
        this.videoForm.videoId = this.$refs["video"].videoId
      } else { 
        this.videoForm.videoUrl = "";
      }
      this.$refs.videoForm.validate((val) => {
        if (val) {
          this.loading = true;
          let params = new FormData();
          params.append("id", this.videoForm.id);
          params.append("playVideoId", this.videoForm.videoId);
          params.append("videoName", this.videoForm.videoTitle);
          params.append("professionalType", this.videoForm.professionalType);
          params.append("videoTime", this.$refs["video"].cVideoTime);
          params.append("videoCover", this.$refs["video"].cutUrl);
          editVideo(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "修改成功！",
                offset: 300,
              });
              this.getList();
              this.$refs["video"].fileList = [];
              this.videoForm.id = "";
              this.videoForm.videoTitle = "";
              this.videoForm.videoUrl = "";
              this.videoForm.professionalType = "";
              this.videoVisble = false;
              this.loading = false;
            }
          });
        }
      });
    },
    // 获取视频信息
    getVideoInfo(videoId,status) {
      let params = new FormData();
      params.append("videoId", videoId);
      getVideoUrl(params).then((res) => {
        if(res.data.code){
          this.$message({
            type: "warning",
            message: "视频正在解码中，请稍后再试！",
            offset: 300
          })
          return;
        }else{
          let r = res.data;
          this.previewVisble = status
          this.cVideoUrl = r.playInfoList[0].playURL;
          this.$nextTick(() => {
            if(this.$refs["video"]){
              this.$refs["video"].url = this.cVideoUrl;
            }
          });
          setTimeout(() => {
          this.player = new Aliplayer(
            {
              id: "player-con",
              source: r.playInfoList[0].playURL,
              width: "100%",
              height: "100%",
              cover: "",
              autoplay: status,
              preload: false,
              isLive: false,
            });
         }, 100);
        }
      });
    },
    // 无视频提示
    showWarning(){
      this.$message({
        type:"warning",
        message:"还未上传视频，请先上传！",
        offset: 300
      })
    },
    // 预览视频
    handlePreview(row) {
      row.playVideoId!=null? this.getVideoInfo(row.playVideoId,true):this.showWarning();
    },
    // 弹出编辑视频弹窗
    handleEdit(row) {
      this.operateType = 1;
      this.videoVisble = true;
      this.videoForm.id = row.id;
      this.videoForm.videoId = row.playVideoId;
      this.videoForm.videoTitle = row.videoName;
      this.videoForm.professionalType = row.professionalType;
      if(this.$refs.videoForm){
       this.$refs.videoForm.clearValidate()
      }
      if(row.playVideoId!=null){
        this.getVideoInfo(row.playVideoId,false)
        this.$nextTick(() => {
        this.$refs["video"].authProgress = 100;
        this.$refs["video"].operateType = 1;
        this.$refs["video"].cVideoTime = row.videoTime;
        this.$refs["video"].videoId = row.playVideoId;
        this.$refs["video"].cutUrl = row.videoCover;
        this.$refs["video"].getPlayInfo()
      });
      }
    },
    // 弹出上传视频弹窗
    ShowUploadVideo() {
      this.videoForm.videoTitle = "";
      this.videoForm.professionalType = "";
      this.videoForm.videoUrl = "";
      this.videoForm.videoId = "";
      this.cVideoUrl = "";
      this.operateType = 0;
      this.videoVisble = true;
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
        videoName: this.clickStatus == true ? this.filters.keyWords : "",
        professionalType:
          this.clickStatus == true ? this.filters.professionalType : "",
        startUpdateTime:
          this.clickStatus == true
            ? this.filters.publishTime == null
              ? ""
              : this.$moment(this.filters.publishTime[0]).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
            : "",
        endUpdateTime:
          this.clickStatus == true
            ? this.filters.publishTime == null
              ? ""
              : this.$moment(this.filters.publishTime[1]).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
            : "",
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus: this.clickStatus,
        params: params,
        publishTime: this.filters.publishTime,
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getVideoList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.dataList = r.records;
          this.page.total = r.total;
        }
      });
    },
    handleDelete(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      }).then(() => {
        let params = {
          id: row.id,
        };
        deleteVideo(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "删除成功！",
              offset: 300,
            });
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
      this.filters.professionalType = "";
      this.filters.publishTime = null;
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
.video-preview {
  width: 100%;
  height: 500px;
}
.show-video-title {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.show-video-title > span:nth-of-type(1) {
  margin-bottom: 10px;
}
.change-video{
  width: 200px !important;
  height: 150px !important;
}
.prism-player .prism-big-play-btn .outter{
  left: 50% !important;
  top: 50% !important;
  transform: translateX(-50%) translateY(-50%) !important;
}
.preview-sty{
  width: 100px;
  height: 66px;
  /* margin-top: 6px; */
}
.video-pre-sty{
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.plsy-sty{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 30px;
  color: #ffffff;
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