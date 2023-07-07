<template>
  <div class="user_avatar">
    <img v-if="url.length<100" :src="url ? url + '?t=' + (new Date().getTime()) : ''" title="点击上传头像" class="avatar_img" />
    <img v-else :src="url" class="avatar_img" />
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-click-modal="false">
      <el-row>
        <el-col :xs="24" :md="12" :style="{height: '350px'}">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :full="options.full"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{height: '200px'}">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload :show-file-list="false" :before-upload="beforeUpload" action="">
            <el-button size="small">
              选择图片
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{span: 1, offset: 2}" :md="2" style="margin-left:65px;">
          <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{span: 1, offset: 1}" :md="2">
          <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{span: 2, offset: 6}" :md="2" style="margin-left:190px;">
          <el-button type="primary" size="small" @click="uploadImg()">上 传</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"avator",
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      avatar: "https://static.wotao.com/icon/head/d1f4aae31a3b464aa1cc4db3e2aee0ab.png",
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "修改头像",
      options: {
        img: "", //裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变,
        full: true // 输出原图比例截图 props名full
      },
      previews: {}
    };
  },
  methods: {
    // 编辑头像
    editCropper() {
      this.open = true;
    },
    // 向左旋转
    rotateLeft() {
      console.log("输出this.$refs.cropper",this.$refs.cropper)
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = data => {
          this.options.img = reader.result;
        };
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(res => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onload = data => {
          this.options.img = reader.result;
          let imgs = reader.result;
          console.log("输出选择的图片信息！");
          console.log(imgs);
          this.$emit("on-change", imgs);
        };
        this.open = false;
        this.$refs.cropper.clearCrop();
      });
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    }
  },
  watch:{
    // url(val) {
    //   console.log(val.length,'')          
    // },
  },
  mounted(){
  }
};
</script>
<style scoped>
.user_avatar {
  width: 120px;
  height: 120px;
  cursor: pointer;
  margin-left: 10px;
}

.avatar_img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
}
.avatar_preview {
  width: 200px;
  height: 200px;
}
.avatar_preview img {
  width: 200px;
  height: 200px;
  border-radius: 60px;
}
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}
.show-preview {
  background: #fff;
}
</style>