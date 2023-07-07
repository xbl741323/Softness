<template>
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      action="https://jsonplaceholder.typicode.com/posts/"
      :auto-upload="false"
      :on-change="onChange"
      :accept="acceptFileType"
    >
    <div v-if="imageUrl.length > 0">
      <div :style="imgStyle" v-if="type == 'application/pdf'" >
        <img style="width:80px;height:80px;margin-top:15%" src="~assets/images/order/pdf.png" />
        <p class="file_name">{{pdfName}}</p>
      </div>
      <img :src="imageUrl" v-else :style="imgStyle">
    </div>
    <div v-else class="avatar-uploader-icon" :style="boxStyle">
      <img :style="iconStyle" src="~/assets/images/order/tianjia@2x.png" alt="">
      <!-- <p :style="iconStyle"><i class="el-icon-plus icon"></i></p> -->
      <p>{{fileType}}</p>
    </div>
    </el-upload>
</template>

<script>
import { upload } from '~/api/order'
  export default {
    props:{
      fileType:{//+下面显示文字
        type: String,
        require: true
      },
      width:{//文件上传框宽度
        type: Number,
        default: 230
      },
      height:{//文件上传框高度
        type: Number,
        default:180
      },
    },
    data() {
      return {
        pdfName:'',
        imageUrl: '',
        type: '',
        url: '',
        acceptFileType: "image/png, image/jpeg, image/png,"
      };
    },
    computed:{
      imgStyle(){
        const imgStyle = {};
        imgStyle.width = this.width + 'rem';
        imgStyle.height = this.height + 'rem';
        imgStyle.black = 'block';
        imgStyle.border = '1px dashed #d9d9d9';
        imgStyle.borderRadius= '6px';
        return imgStyle;
      },
      boxStyle(){
        const boxStyle = {};
        boxStyle.width = this.width + 'rem';
        boxStyle.height = this.height + 'rem';
        return boxStyle;
      },
      iconStyle(){
        const iconStyle = {};
        iconStyle.width = '40px'
        iconStyle.marginTop = this.height/3+ 'rem';
        return iconStyle;
      },
    },
    methods: {
      onChange(file){
        this.type = file.raw.type;
        let reg = new RegExp(`${file.raw.type}`);
        const isJPG = this.acceptFileType.match(reg);
        const isLt5M = file.raw.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message({
            type:'error',
            message:'上传文件只能是 '+this.acceptFileType+' 格式!',
            offset: 60
          })
        }else if (!isLt5M) {
          this.$message({
            type:'error',
            message:'上传文件大小不能超过 5MB!',
            offset: 60
          })
        }else{
          let param = new FormData();
          param.append('file',file.raw);
          if(file.raw.type == 'application/pdf'){
            this.pdfName = file.name;
          };
          upload(param).then(res=>{
            this.url = res.data.data;
            this.imageUrl = URL.createObjectURL(file.raw);
            this.$emit('file',this.url);
          })
        };
        return isJPG && isLt5M;
      },
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    /* border: 1px dashed #d9d9d9; */
    /* border-radius: 6px; */
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    color: #8c939d;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .icon{
    font-size: 28px;
  }
  .el-upload-dragger{
    border: none;
    border-radius: 0;
    width: 230px !important;
  }
  .file_name{
    font-size: 12px;
    margin-top: 1%;
  }
  /* .avatar {
    width: 230px;
    height: 180px;
    display: block;
  } */
</style>