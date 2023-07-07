<template>
  <div class="vvv_up">
    <div class="up-img">
      <img :src="url" class="img-avatar" />
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
import { getUserInfo } from '~/api/login';
export default {
  props: {
    url: "",
  },
  methods: {
    uploadHeadImg() {
      this.$el.querySelector(".uppic").click();
    },
    changeImage(e) {
      let $target = e.target || e.srcElement;
      let file = $target.files[0];
      var reader = new FileReader();
      reader.onload = (data) => {
        let res = data.target || data.srcElement;
        let imgUrl = res.result;
        this.$emit("on-change", imgUrl);
      };
      reader.readAsDataURL(file);
      let imgUrl = file;
      //this.$emit('change-license', imgUrl)
    },
  },
  mounted() {
    //this.great();
  },
};
</script>


<style scoped>
.vvv_up {
  width: 108px;
  height: 108px;
  cursor: pointer;
}
.up-img {
  width: 108px;
  height: 108px;
  position: relative;
  overflow: hidden;
}

.img-avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 108px;
  border-radius: 100%;
}

.choose-img {
  text-align: center;
}

.uppic {
  display: none;
}

.upload-bt {
  text-align: center;
  margin-top: 20px;
}

button {
  background: #019fe8;
  padding: 6px 40px;
  border-radius: 4px;
  color: #fff;
}

.up-button {
  display: flex;
  margin: 14px 0;
  align-items: center;
}

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

h3 {
  margin: 14px 0 14px 20px;
  font-weight: bold;
}
</style>