<template>
  <div class="img_main">
    <div class="up-img" @click.stop="uploadHeadImg">
      <img :src="url" class="img-avatar" />
      <div class="location-edit-img" v-if="typeStatus">
        <span class="edit-img-text">修改图片</span>
      </div>
    </div>
    <div class="choose-img">
      <input
        type="file"
        name="avatar"
        id="uppic"
        accept="image/gif, image/jpeg, image/jpg, image/png"
        @change="changeImage($event)"
        ref="avatarInput"
        class="uppic"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['url','typeStatus'],
  methods: {
    uploadHeadImg() {
      this.$el.querySelector(".uppic").click();
    },
    changeImage(e) {
      let $target = e.target || e.srcElement;
      let file = $target.files[0];
      var reader = new FileReader();
      reader.onload = data => {
        let res = data.target || data.srcElement;
        let imgUrl = res.result;
        this.$emit("on-change", imgUrl);
      };
      reader.readAsDataURL(file);
      let imgUrl = file;
    }
  }
};
</script>


<style lang="scss" scoped>
.img_main {
  width: 80%;
  height: 194px;
  .up-img:hover {
    border: 2px dashed #eee;
  }
  .up-img:hover .location-edit-img{
    background: rgba(44, 42, 42,0.8);
  }
   .up-img:hover .edit-img-text{
    opacity: 1;
  }

  .up-img {
    width: 100%;
    border: 2px dashed #ccc;
    height: 0;
    position: relative;
    overflow: hidden;
    padding-bottom: 190px;

    .location-edit-img{
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translate(-50%, 0);
      display: flex;
      width: 90%;
      height: 60px;
      color: #409eff;
      background: rgba(44, 42, 42,0);
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: 0.5s;
    }
    .edit-img-text{
      opacity: 0;
      font-size: 14px;
      transition: 0.5s;
      color: #e1e9f1;
    }
    .img-avatar {
      height: 165px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      border-radius: 0px;
      cursor: pointer;
    }
  }

  .choose-img {
    text-align: center;

    .uppic {
      display: none;
    }
  }

  .upload-bt {
    text-align: center;
    margin-top: 20px;

    button {
      background: #019fe8;
      padding: 6px 40px;
      border-radius: 4px;
      color: #fff;
    }
  }

  .tips {
    // color: $fontColor6;
    line-height: 22px;
    margin-top: 20px;
  }

  .up-button {
    display: flex;
    margin: 14px 0;
    align-items: center;

    h3 {
      flex: 1;
    }

    button {
      height: 34px;
      padding: 0 20px;
      margin-right: 8px;
      background: #409eff;
      border-radius: 4px;
      color: #fff;
    }
  }

  h3 {
    margin: 14px 0 14px 20px;
    font-weight: bold;
  }
}
</style>