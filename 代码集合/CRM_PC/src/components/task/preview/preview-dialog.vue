<!-- 预览知产证书 -->
<template>
  <el-dialog v-if="openVisble" top='5vh' center :width="'700px'"
    :title="`查看${filterFileType}证书(${currentIndex+1}/${fileList.length})`"
    :visible.sync="openVisble"
    :before-close="handleClose"
    :close-on-click-modal="false">
    <div class="contain">
      <div class="scroll-contain">
        <i v-if="currentIndex > 0" @click="changeIndex(0)" class="el-icon-arrow-left big-sty"></i>
        <i v-if="currentIndex == 0 && currentIndex < fileList.length - 1" class="el-icon-arrow-left hidden-sty"></i>
        <div class="preview-contain">
          <iframe :src="fileList[currentIndex].fileUrl + '#toolbar=0'" height="600px;" width="426px"></iframe>
        </div>
        <i v-if="currentIndex > 0 && currentIndex == fileList.length - 1" class="el-icon-arrow-right hidden-sty"></i>
        <i v-if="currentIndex < fileList.length - 1" @click="changeIndex(1)" class="el-icon-arrow-right big-sty"></i>
      </div>
      <div class="btn-contain">
        <span class="right-sty pointer-sty" v-if="downloadPermission" @click="download(fileList[currentIndex])">点击下载</span>
        <span class="pointer-sty" v-if="deletePermission" @click="confirmTip()">删除</span>
      </div>
      <div class="btn-contain">
        <span class="right-small-sty">更新于{{fileList[currentIndex].createTime}}</span>
        <span class="right-small-sty">更新人：{{fileList[currentIndex].createByName}}</span>
        <span>申请单位：{{(fileList[currentIndex].applicantUnit)|filerApplicantUnit}}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import * as CodeMsg from "@/api/common/CodeChange"
import { deleteIntellectualProperty } from "@/api/task/new-task"
export default {
  props:{
    // 父组件页面 0-我的任务详情 1-任务管理 2-其他（目前有线索详情和用户详情）
    source:{
      type: Number,
      require: true
    },
  },
  data() {
    return {
      imgUrl: process.env.VUE_APP_IMAGE_BASEURL,
      openVisble: false,
      currentIndex: 0,
      fileList:[]
    };
  },
  filters: {
    filerApplicantUnit(val){
      return val == 1?'卧涛':'其他'
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      downloadPermission(){
        let personalStatus = (this.source == 0)&&this.permissions.bt_download_my_intellectual_property
        let listStatus = (this.source == 1)&&this.permissions.bt_download_intellectual_property
        return (personalStatus || listStatus || this.source == 2)
      },
      deletePermission(){
        // 我的任务详情只有创建人为当前登录人才有删除按钮
        let personalStatus = (this.source == 0)&&this.permissions.bt_delete_my_intellectual_property
        // 任务管理详情需要有删除权限才有删除按钮
        let listStatus = (this.source == 1)&&this.permissions.bt_delete_intellectual_property
        return (personalStatus || listStatus)
      },
    }),
    ...mapGetters(['permissions']),
    // 2：发明专利；3：实用新型专利；4：外观专利；5：商标；6：版权；7：其他知产；
    filterFileType(){
     let type = Number(this.fileList[this.currentIndex].fileType)
     let r = ''
     switch(type){
      case 2: r = '发明专利'
       break
      case 3: r = '实用新型专利'
       break
      case 4: r = '外观专利'
       break
      case 5: r = '商标'
       break
      case 6: r = '版权'
       break
      case 7: r = '其他知产'
       break
     }
     return r
    },
  },
  methods: {
    getBlob(url) {
      // url:是文件在oss上的地址
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob"; // 请求类型是blob类型
        xhr.crossOrigin = "*"; // 解决跨域问题
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };
        xhr.send();
      });
    },
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename; //修改文件名
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    },
    // 下载文件
    download(file) {
      this.getBlob(file.fileUrl).then((res) => {
        this.saveAs(res, file.fileName);
      });
    },
    handleClose() {
      this.openVisble = false
      this.currentIndex = 0
    },
    // 删除提示
    confirmTip(){
      if((this.source == 0) && (this.userInfo.id != this.fileList[this.currentIndex].createBy)){
        this.$message({
          type:'warning',
          message:'只能删除自己上传的文件！'
        })
      }else{
        this.$confirm("是否确定删除？",
        {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }
        ).then(() => {
          this.handleDelete();
        }).catch(()=>{})
      }
    },
    // 修改当前下标
    setCurrentIndex(){
      let length = this.fileList.length
      if(this.currentIndex > 0 && this.currentIndex >= length){
        this.currentIndex = this.currentIndex - 1
      }
    },
    // 删除文件
    handleDelete(){
      let id = this.fileList[this.currentIndex].id
      deleteIntellectualProperty(id,!Boolean(this.source)).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$message({
            type:'success',
            message:'操作成功！'
          })
          this.$emit('refresh')
          this.fileList.splice(this.currentIndex, 1);
          this.setCurrentIndex()
          if(this.fileList.length == 0){
            this.handleClose()
          }
        }else{
          this.$message({
            type:'warning',
            message:res.data.msg
          })
        }
      })
    },
    // 切换currentIndex
    changeIndex(type){
      // 向左切换
      if(type == 0){
        if(this.currentIndex > 0 &&this.fileList.length>0){
          this.currentIndex--
        }
      }
      // 向右切换
      if(type == 1){
        if(this.currentIndex < this.fileList.length-1){
          this.currentIndex++
        }
      }
    }
  },
};
</script>

<style scoped>
.contain{
 display: flex;
 flex-direction: column;
 align-items: center;
 padding-bottom: 10px;
}
.scroll-contain{
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-contain{
  height: 600px;
  width: 426px;
  margin: 0 25px;
}
.btn-contain{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.pointer-sty{
  color: #409eff;
  cursor: pointer;
  font-size: 16px;
}
.right-sty{
  margin-right: 50px;
}
.right-small-sty{
  margin-right: 20px;
}
.big-sty{
  font-size: 45px;
  cursor: pointer;
}
.hidden-sty{
  color: #ffffff;
  font-size: 45px;
}
</style>
