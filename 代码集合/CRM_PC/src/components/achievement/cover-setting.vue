<template>
<!-- 排查完成 -->
  <div class="achievement_covers">
    <!-- 封面设置 -->
    <span class="cover_span">封面设置</span>
    <el-table :data="coverList" border class="cover_table">
      <el-table-column type="index" label="序号" align='center'></el-table-column>
      <el-table-column prop="dropdownValue" label="技术类型" align='center'></el-table-column>
      <el-table-column label="推荐封面" align='center'>
        <template slot-scope="scope">
          <img class="cover_img" :src="imgSrc+scope.row.dropdownDesc" />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align='center'></el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="editImg(scope.row,scope.index)">编辑图片</el-button>
          <!-- <el-button size="small" type="warning" @click="deleteImg(scope.row,scope.index)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-button type="primary" style="margin:20px" @click="addImg()">新增成果封面</el-button> -->

    <!-- 编辑封面 -->
      <el-dialog title="编辑" :visible.sync="editDialog" width="35%" :close-on-click-modal="false" :before-close="onBeforeClose">
        <el-form :model="editList" v-if="editDialog">
          <el-form-item label="技术类型：">
            {{editList.dropdownValue}}
          </el-form-item>
          <el-form-item label="图片：">
            <el-upload
                action="#"
                list-type="picture-card"
                :limit = "1"
                ref="refundImg"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                multiple
                :on-change="upFiles"
                :on-exceed="handleExceed"
                :auto-upload="false"
                class="avatar-uploader-cover"
                accept=".jpg, .png, .jpeg, .gif">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
                >
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit()">确 定</el-button>
            <el-button @click="cancel()">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 预览 -->
      <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
  </div>
</template>

<script>
import { getAchievementsCoverList, editAchievementCover} from '@/api/achievement/index'
export default {
  data(){
    return {
      imgSrc: process.env.VUE_APP_IMAGE_BASEURL,
      coverList: [],
      editDialog: false,
      dialogVisible: false,
      fileList: [],
      files:[],
      editList:{},
      dialogImageUrl: '',
      disabled: false,
      param: new FormData(),
    }
  },
  mounted(){
    this.getCovers();
  },
  methods:{
    cancel(){
      this.editDialog = false;
      this.handleRemove();
    },
    onBeforeClose(){
      this.editDialog = false;
      this.handleRemove();
    },
    getCovers(){
      getAchievementsCoverList().then(res=>{
        this.coverList = res.data.data;
      })
    },
    handleRemove(file, fileList) {
      this.fileList=[];
      this.dialogImageUrl = '';
      this.dialogVisible = false;
      this.param = new FormData();
    },
    handlePreview(file) {

    },
    upFiles(uploadFile,filesList){       
      this.param.append('file', uploadFile.raw, uploadFile.name);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
    },
    submit(){
      this.param.append('id', this.editList.id);
      // this.param.append('technologyType', this.editList.technologyType);   
      editAchievementCover(this.param).then(res=>{
        this.$message({
          message: '图片编辑成功！',
          type: 'success',
          offset:300
        });
        this.editDialog = false;
        this.getCovers();
      }).catch(err=>{
        console.log(error);
      })
    },
    editImg(row,index){
      this.editList = row;
      this.dialogImageUrl = this.editList.dropdownDesc;
      this.editDialog = true;
    },
  }
}
</script>

<style scoped>
.achievement_covers{
  padding: 10px;
}
.cover_span{
  padding-left:15px;
  border-left:8px solid #3D85DC
}
.cover_table{
  margin: 20px 0;
}
.cover_img{
  width: 212px;
  height: 128px;
}
</style>
<style >
.achievement_covers .el-upload-list--picture-card .el-upload-list__item{
  width: 212px !important;
  height: 128px !important;
}
</style>