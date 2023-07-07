<template>
  <div class="class-catalogue">
    <h3 class="basic-title-content">课程目录</h3>
    <div class="basic-bottom">
      <!-- 操作按钮区域 -->
    <div class="filter-container" v-if="classForm.baseShowState!==3">
      <el-button type="primary" class="add-btn" v-if="showTwoStatus" :disabled="!permissions.sys_wt_course_edit" @click="handlerAdd()">添加章节</el-button>
      <el-button type="primary" :disabled="delDisabled" v-if="(pageFrom == 2)" @click="handleDelete()">删除</el-button>
      <el-button type="primary" :disabled="delDisabled" v-if="(pageFrom == 0&&permissions.sys_wt_course_edit)" @click="handleDelete()">删除</el-button>
    </div>
    <el-row class="row-sty">
      <!-- 章节树区域 -->
      <el-col :span="8">
        <el-tree
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="getNodeData">
          <span class="custom-node" slot-scope="{node,data}">
            <span class="custom-tree-node">{{ node.label }}</span>
            <i @click.stop="showVideo(data)" v-if="data.videoId!==0" class="el-icon-video-play"></i>
          </span>
        </el-tree>
      </el-col>
      <!-- 卡片内容区域 -->
      <el-col :span="16" v-if="showCard">
        <el-card class="box-card-cantain">
          <el-form
            ref="form"
            :label-position="labelPosition"
            :rules="rules"
            :model="form"
            label-width="100px">
            <el-form-item label="父章节：" v-if="!formEdit&&form.child!==null">
              <el-input :disabled="true" v-model.trim="form.parentTitle" placeholder="请输入章节标题"/>
            </el-form-item>
            <el-form-item label="章节标题：" prop="title">
              <el-input :disabled="disabled || !permissions.sys_wt_course_edit" v-model.trim="form.title" placeholder="请输入章节标题"/>
            </el-form-item>
            <el-form-item label="章节排序：" prop="sort">
              <el-input :disabled="disabled || !permissions.sys_wt_course_edit" type="number" v-model.trim="form.sort"  placeholder="请输入章节排序"/>
            </el-form-item>
            <el-form-item label="课程视频：" v-if="!formEdit&&!isEmptyTree&&showVideoStatus">
              <el-button v-if="form.cVideoUrl==''" :disabled="!permissions.sys_wt_course_edit" type="primary" @click="showVideoList()">添加视频</el-button>
              <div v-else class="video-area">
                 <div class="video-area-top">
                   <div class="video-contain">
                    <div id="player-con"></div>
                   </div>
                   <el-button type="primary" :disabled="!permissions.sys_wt_course_edit" @click="showVideoList()">替换</el-button>
                   <el-button type="danger" :disabled="!permissions.sys_wt_course_edit" @click="delVideo()">删除</el-button>
                 </div>
                 <div class="video-area-bottom">
                   <span>标题：{{form.cVideoName}}</span>
                   <span>时长：{{form.cVideoTime}}</span>
                 </div>
              </div>
            </el-form-item>
            <el-form-item label="课程视频：" v-if="formEdit&&form.parentId!==0&&showVideoStatus">
              <el-button v-if="form.cVideoUrl==''" type="primary" :disabled="!permissions.sys_wt_course_edit" @click="showVideoList()">添加视频</el-button>
              <div v-else class="video-area">
                 <div class="video-area-top">
                   <div class="video-contain">
                    <div id="player-con"></div>
                   </div>
                   <el-button type="primary" :disabled="!permissions.sys_wt_course_edit" @click="showVideoList()" v-if="permissions.sys_wt_course_edit&&classForm.baseShowState!==3">替换</el-button>
                   <el-button type="danger" :disabled="!permissions.sys_wt_course_edit" @click="delVideo()" v-if="permissions.sys_wt_course_edit&&classForm.baseShowState!==3">删除</el-button>
                 </div>
                 <div class="video-area-bottom">
                   <span>标题：{{form.cVideoName}}</span>
                   <span>时长：{{form.cVideoTime}}</span>
                 </div>
              </div>
            </el-form-item>
            <el-form-item label="是否试看：" v-if="form.cVideoUrl!==''&&feeType!=1">
              <el-radio-group v-model="form.isView" @change="changeView()">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.cVideoUrl!==''&&form.isView==1&&feeType!=1">
              <el-input type="number" class="time-input" @change="form.minute = oninput(form.minute)" @keyup.native="form.minute = oninput(form.minute)" v-model.trim="form.minute"></el-input>分
              <el-input type="number" class="time-input" @change="form.second = oninput(form.second)" @keyup.native="form.second = oninput(form.second)" v-model.trim="form.second"></el-input>秒
            </el-form-item>
            <el-form-item class="class-btn" v-if="!disabled&&pageFrom == 2&&classForm.baseShowState!==3">
              <el-button class="save-btn" v-if="formEdit" v-preventReClick type="primary" :disabled="!permissions.sys_wt_course_edit" @click="checkTime()">保存</el-button>
              <el-button class="save-btn" v-if="!formEdit" type="primary" :disabled="!permissions.sys_wt_course_edit" @click="checkTime()">添加</el-button>
              <el-button @click="onCancel()">取消</el-button>
            </el-form-item>
             <el-form-item class="class-btn" v-if="!disabled&&(pageFrom == 0)&&(permissions.sys_wt_course_edit)&&classForm.baseShowState!==3">
              <el-button class="save-btn" v-if="formEdit" v-preventReClick type="primary" :disabled="!permissions.sys_wt_course_edit" @click="checkTime()">保存</el-button>
              <el-button class="save-btn" v-if="!formEdit" type="primary" :disabled="!permissions.sys_wt_course_edit" @click="checkTime()">添加</el-button>
              <el-button :disabled="!permissions.sys_wt_course_edit" @click="onCancel()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 预览视频 -->
    <el-dialog :visible.sync="previewVisble" :center="true" width="50%" :close-on-click-modal="false">
      <div class="video-preview">
        <div v-if="previewVisble" id="player-con"></div>
      </div>
    </el-dialog>
    <!-- 关联课程弹窗列表 -->
    <el-dialog title="选择视频" :visible.sync="relateVisble" :center="true" width="50%" :close-on-click-modal="false">
      <el-form :model="mainForm" inline @keyup.enter.native="getMainList()">
        <el-form-item label="关键字：">
          <el-input v-model="mainForm.keyWords" placeholder="请输入视频标题关键字" class="main-input"></el-input>
        </el-form-item>
        <el-form-item label="专业分类：">
          <el-select v-model="mainForm.professionalType" @change="changeProType()">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in optionList" :key="index" :label="item.categoryName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getMainList()">搜索</el-button>
        <el-button @click="resetMainForm()">重置</el-button>
      </el-form>
       <avue-crud
        v-if="relateVisble"
        class="batch-choose"
        ref="crud"
        :page.sync="mainPage"
        :data="mainDataList"
        :option="selectOption"
        @selection-change="selectionChange"
        @size-change="mainSizeChange"
        @current-change="mainCurrentChange"
        @on-load="getMainList">
        <template slot="professionalType" slot-scope="scope">
          <span>{{scope.row.professionalType|filterProType}}</span>
        </template>
       </avue-crud>
       <div class="wt-select-batch">
        <el-button type="primary" class="wt-select-batch-confirm" v-preventReClick @click="submitMinSelect()">确 定</el-button>
        <el-button @click="relateVisble = false">取 消</el-button>
      </div>
     </el-dialog>
    </div>
  </div>
</template>

<script>
let that = ""
import { getVideoUrl } from "@/api/video/upload";
import {
  getClassDetail,
  delChapterVideo,
  getOptionList,
  getVideoList,
  addChapter,
  editChapter,
  deleteChapter,
  getChapterInfo,
  getChapterTree,
} from "@/api/project/wtClass";
import { selectOption } from "@/const/crud/project/select-video";
import * as CodeMsg from "@/api/common/CodeChange";
export default {
  props: {
    pageFrom: {
      type: Number,
      default: 2, // 0-编辑页 2-添加页
    },
    classId:{
      type: Number
    },
    permissions:{
      type: Object
    }
  },
  data() {
    return {
      classForm: {},
      showCard:false,
      showTwoStatus: true, // true-可以显示添加按钮
      feeType: "",
      previewUrl: "",
      showVideoStatus: false,
      optionList: [],
      disabled: true, // 是否显示按钮
      delDisabled: true,
      isEmptyTree: true, // true：空数据 false：非空数组
      // 关联课程区域
      mainSelectList: [],
      mainForm: {
        keyWords: "",
        professionalType: "",
      },
      relateVisble: false,
      selectOption: selectOption,
      mainDataList: [],
      mainPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      // 其他
      previewVisble: false,
      baseUrl: process.env.VUE_APP_IMAGE_BASEURL,
      formEdit: false, // true编辑 false添加
      defaultProps: {
        children: "child",
        label: "sectionName",
        videoId: "videoId",
      },
      rules: {
        title: [{ required: true, message: "请输入章节标题", trigger: "blur" }],
        sort: [{ required: true, message: "请输入章节排序", trigger: "blur" }],
        cVideoUrl: [{ required: true, message: "请添加视频", trigger: "blur" }],
        isView: [{ required: true, message: "请选择", trigger: "blur" }],
      },
      labelPosition: "right",
      form: {
        id: "",
        parentId: 0, // 当前选中值的id 默认0-树根
        parentTitle: "", // 当前选中值的名称
        child: null,
        title: "",
        sort: "",
        isView: 0,
        cVideoUrl: "",
        cVideoId: "",
        cVideoName: "",
        cVideoTime: "",
        minute: 0,
        second: 0,
        totalTime: 0, // 视频总时长-单位秒
      },
      treeData: [],
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
  methods: {
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
          this.form.cVideoUrl = r.playInfoList[0].playURL;
          this.showVideoUrl(status)
        }
      });
    },
    // 展示视频
    showVideoUrl(status){
      setTimeout(() => {
        this.player = new Aliplayer(
          {
            id: "player-con",
            source: this.form.cVideoUrl,
            width: "100%",
            height: "100%",
            cover: "",
            autoplay: status,
            preload: false,
            isLive: false,
            });
       }, 100);
    },
    /**
     * 关联课程区域
     */
    changeProType() {
      this.$refs.crud.toggleSelection();
      this.currentPage = 1;
      this.getMainList();
    },
    oninput(value) {
      value = value.replace(/^0*(0\.|[1-9])/, "$1");
      value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
      value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
      value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
      value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      value =
        value.indexOf(".") > 0
          ? value.split(".")[0].substring(0, 10) + "." + value.split(".")[1]
          : value.substring(0, 10);
      return value;
    },
    // 切换到否时重置时间
    changeView() {
      if (this.form.isView == 0) {
        this.form.second = 0;
        this.form.minute = 0;
      }
    },
    submitMinSelect() {
      if (this.mainSelectList.length > 1) {
        this.$message({
          type: "warning",
          message: "只能选择一个视频！",
          offset: 300,
        });
      } else {
        this.form.cVideoUrl = ""
        this.form.cVideoId = this.mainSelectList[0].id;
        this.form.cVideoTime = this.mainSelectList[0].videoTime;
        this.form.cVideoName = this.mainSelectList[0].videoName;
        let totalTime = this.mainSelectList[0].videoTime.split(":");
        this.fixTotalTime(totalTime);
        this.getVideoInfo(this.mainSelectList[0].playVideoId, false)
        this.relateVisble = false;
      }
    },
    // 计算视频总时间
    fixTotalTime(list) {
      let hour = Number(list[0]);
      let minute = Number(list[1]);
      let second = Number(list[2]);
      let totalTime = hour * 3600 + minute * 60 + second;
      this.form.totalTime = totalTime;
    },
    getMainList() {
      let params = {
        pageNo: this.mainPage.currentPage,
        pageSize: this.mainPage.pageSize,
        videoName: this.mainForm.keyWords,
        professionalType: this.mainForm.professionalType,
        classId: this.classId,
      };
      getVideoList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let r = res.data.data;
          this.mainDataList = r.records;
          this.mainPage.total = r.total;
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
    resetMainForm() {
      this.mainForm.keyWords = "";
      this.mainForm.professionalType = "";
      this.mainPage.currentPage = 1;
      this.getMainList();
    },
    /**
     * 章节区域
     */
    // 获取feeType视频费用类型
    getDetailData() {
      let params = {
        id: this.classId,
      };
      getClassDetail(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let result = res.data.data;
          this.classForm = result
          this.feeType = result.tradingChargeType;
        }
      });
    },
    // 获取视频信息
    showVideo(data) {
      getChapterInfo({ id: data.id }).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let data = res.data.data.classVideoVo;
          // this.form.cVideoUrl = data.videoUrl;
          this.previewVisble = true;
          this.getVideoInfo(data.playVideoId, true)
        }
      });
    },
    // 弹出视频列表弹窗
    showVideoList() {
      this.relateVisble = true;
    },
    // 预览视频
    handlePreview() {
      this.previewVisble = true;
    },
    // 选择视频
    selectionChange(val) {
      this.mainSelectList = val;
    },
    // 获取章节树
    getList() {
      let params = {
        classId: this.classId,
        id: 0,
      };
      getChapterTree(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.treeData = res.data.data;
          this.isEmptyTree = this.treeData.length > 0 ? false : true;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 获取章节详情信息
    getChapterDetail() {
      let params = {
        id: this.form.id,
      };
      getChapterInfo(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          let data = res.data.data.classVideoVo;
          this.form.cVideoId = data.id;
          this.form.cVideoName = data.videoName;
          this.form.cVideoTime = data.videoTime;
          this.form.isView = res.data.data.trySeeState;
          let totalTime = data.videoTime.split(":");
          let tryTimeList = res.data.data.trySeeTime.split(":");
          this.getVideoInfo(data.playVideoId,false)
          this.fixTotalTime(totalTime);
          this.form.minute = Number(tryTimeList[1]);
          this.form.second = Number(tryTimeList[2]);
        }
      });
    },
    // 点击节点回显信息
    getNodeData(data) {
      this.showCard = true
      this.form.cVideoUrl = "";
      this.form.id = data.id;
      this.form.parentId = data.parentId;
      this.form.parentTitle = data.sectionName;
      this.form.child = data.child;
      this.form.sort = data.serialNo;
      this.form.title = data.sectionName;
      this.formEdit = true;
      this.delDisabled = false;
      this.disabled = false;
      this.showTwoStatus = this.form.parentId == 0 ? true : false;
      // 回显视频信息
      if (Number(data.videoId) !== 0) {
        this.getChapterDetail();
        this.showVideoStatus = true;
      } else {
        this.showVideoStatus = this.form.child.length > 0 ? false : true;
      }
    },
    // 点击添加章节按钮
    handlerAdd() {
      this.resetForm(true);
      this.disabled = false;
      this.formEdit = false;
      console.log(this.form,"this.formthis.formthis.form")
      if(this.form.id!==""){
        this.showVideoStatus = true
      }
    },
    // 删除选择的视频
    delVideo() {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.form.id !== "") {
          let params = {
            id: this.form.id,
            classId: this.classId,
          };
          delChapterVideo(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "删除成功！",
                offset: 300,
              });
              this.form.cVideoUrl = "";
              this.getList();
            }
          });
        } else {
          this.form.cVideoUrl = "";
        }
      });
    },
    // 点击删除章节按钮
    handleDelete() {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = {
          id: this.form.id,
          classId: this.classId,
        };
        deleteChapter(params).then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.$message({
              type: "success",
              message: "删除成功！",
              offset: 300,
            });
            this.delDisabled = true;
            this.resetForm(false);
            this.getList();
          }else{
            this.$message({
              type: "warning",
              message: res.data.msg,
              offset: 300,
            });
          }
        });
      });
    },
    // 检查试看时长是否大于视频时长
    checkTime() {
      let inputTotalTime = Number(this.form.minute) * 60 + Number(this.form.second);
      if (inputTotalTime > this.form.totalTime) {
        this.$message({
          type: "warning",
          message: "试看时长不能大于视频时长！",
          offset: 300,
        });
      } else {
        this.formEdit == true ? this.update() : this.create();
      }
    },
    // 编辑章节
    update() {
      this.$refs.form.validate((val) => {
        if (val) {
          let params = {
            id: this.form.id,
            classId: this.classId,
            serialNo: this.form.sort,
            sectionName: this.form.title,
          };
          if (this.form.cVideoUrl !== "") {
            params.videoId = this.form.cVideoId;
            params.trySeeState = this.feeType == 1 ? 0 : this.form.isView;
            if (this.form.isView == 1) {
              params.trySeeTime = this.feeType == 1 ? `00:00:00` : this.complexFixTime();
            } else {
              params.trySeeTime = `00:00:00`;
            }
          }
          editChapter(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "修改成功！",
                offset: 300,
              });
              this.getList();
              this.resetForm(false);
            }else if (res.data.code == CodeMsg.CODE_1) {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
              });
            }
          });
        }
      });
    },
    // 创建章节
    create() {
      this.$refs.form.validate((val) => {
        if (val) {
          let params = {
            classId: this.classId,
            serialNo: this.form.sort,
            sectionName: this.form.title,
            parentId: this.form.parentTitle !== "" ? this.form.id : 0,
          };
            if (this.form.cVideoUrl !== "") {
            params.videoId = this.form.cVideoId;
            params.trySeeState = this.form.isView;
            if (this.form.isView == 1) {
              params.trySeeTime = this.complexFixTime();
            }
          }
          addChapter(params).then((res) => {
            if (res.data.code == CodeMsg.CODE_0) {
              this.$message({
                type: "success",
                message: "添加成功！",
                offset: 300,
              });
              this.getList();
              this.resetForm(false);
            }else if (res.data.code == CodeMsg.CODE_1) {
              this.$message({
                type: "warning",
                message: res.data.msg,
                offset: 300,
              });
            }
          });
        }
      });
    },
    // 传参时间计算
    complexFixTime() {
      let minute = this.form.minute;
      let second = this.form.second;
      let value = Number(minute) * 60 + Number(second);
      let transLateTime = this.formatSeconds(value);
      return transLateTime;
    },
    // 时间格式转化 s(秒)-> 00:00:00
    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime >= 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 >= 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = `${
        parseInt(theTime2) < 10 ? "0" + parseInt(theTime2) : parseInt(theTime2)
      }:${
        parseInt(theTime1) < 10 ? "0" + parseInt(theTime1) : parseInt(theTime1)
      }:${
        parseInt(theTime) < 10 ? "0" + parseInt(theTime) : parseInt(theTime)
      }`;
      return result;
    },
    // 点击取消
    onCancel() {
      this.resetForm(false);
      this.form.id = ""
    },
    // 清空表单数据
    resetForm(val) {
      if (val) {
        this.form.parentTitle = this.form.parentTitle !== "" ? this.form.parentTitle : "";
        this.showCard = true
      } else {
        this.form.id = ""
        this.form.parentId = 0;
        this.form.parentTitle = "";
        this.form.child = null;
        this.showCard = false
      }
      this.disabled = true;
      this.delDisabled = true;
      this.form.title = "";
      this.form.sort = "";
      this.form.cVideoUrl = "";
      this.form.isView = 0;
      this.form.minute = 0;
      this.form.second = 0;
      this.showVideoStatus = false
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
    this.getList();
    this.getDropList();
    this.getDetailData();
  },
};
</script>

<style scoped>
.class-catalogue {
  padding-bottom: 100px;
}
.basic-title-content {
  border-left: 8px solid #409eff;
  padding-left: 12px;
  height: 20px;
  line-height: 20px;
  color: #666;
  font-size: 16px;
}
.add-btn {
  margin-right: 10px;
}
.box-card-cantain {
  padding-top: 30px;
  width: 500px;
  border: 1px solid rgb(236, 234, 234) !important;
  box-shadow: 2px 2px 12px 2px rgb(0 0 0 / 10%) !important;
  z-index: 1000 !important;
}
.basic-bottom {
  padding: 20px 0 0 30px;
}
.class-btn {
  margin-top: 30px;
  padding-right: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.save-btn {
  margin-right: 60px;
}
.video-area {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.video-area-top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.video-area-bottom {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.video-area-bottom > span:nth-of-type(1) {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 20px;
}
.video-contain {
  position: relative;
  width: 160px;
  height: 100px;
  margin-right: 20px;
  cursor: pointer;
}
.video-preview {
  width: 100%;
  height: 500px;
}
.time-input {
  width: 80px;
  margin: 0 10px;
}
.time-input:nth-of-type(1) {
  margin-left: 0 !important;
}
.main-input {
  width: 200px;
}
.wt-select-batch {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.wt-select-batch-confirm {
  margin-right: 40px;
}
.custom-tree-node {
  font-size: 14px;
  margin-right: 5px;
}
.custom-node {
  display: flex;
  align-items: center;
}
.custom-node i {
  padding-top: 2px;
  font-size: 16px;
}
.row-sty{
  margin-top: 20px
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