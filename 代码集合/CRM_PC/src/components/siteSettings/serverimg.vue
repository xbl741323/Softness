<template>
  <div class="server_img_main">
    <div  style="display:flex;align-items: center;margin-left:10px" @click.stop="uploadHeadImg">
      <img v-if="url" :src="url" width="16" height="16" />
      <div class="location-edit-img">
        <span v-if="!url" class="edit-img-text" style="margin-left:8px;color:blue;display: inline-block;cursor: pointer;">点击上传</span>
        <span v-else style="margin-left:8px;color:blue;display: inline-block;cursor: pointer;">修改图标</span>
      </div>
    </div>
    <div class="choose-img">
      <input
        type="file"
        name="avatar"
        v-focus
        id="uppic"
        class="uppic"
        accept="image/gif, image/jpeg, image/jpg, image/png"
        @change="changeImage($event)"
        ref="avatarInput"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['url'],
  //input自动聚焦
    directives:{
        focus:{
            inserted:function(el){
                el.focus();
            }
        }
    },
  mounted(){
      this.switch();
  },
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
    },
      switch() {
       if (process.env.NODE_ENV === "production") {
        this.imgBaseUrl = "//static.wotao.com/";
      } else {
        this.imgBaseUrl = "//static-tst.wotao.com/";
      }
    },
  }
};
</script>


<style lang="scss" scoped>


  .choose-img {
    text-align: center;

    .uppic {
      display: none;
    }
  }

</style>