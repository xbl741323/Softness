<template>
  <div class="vvv_up">
    <div class="up-img" v-if="!shows">
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
    <a v-if="!shows" class="delete-img" @click="deleteImg">删除</a>
  </div>
</template>

<script>
export default {
  props: {
    url: "",
    shows:null,
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
    deleteImg(){
        this.$emit('update:imgParent',null);
    },    
    //转blob
    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    },   
    
  },
  mounted() {
    //this.great();
  },
};
</script>


<style scoped>
.vvv_up {
  width: 260px;
  margin: 0 0 20px 100px;
  cursor: pointer;
  display: flex;
  position: relative;
}
.delete-img{
    position: absolute;
    right: 0;
    bottom: 0;
    color: #1E90FF;
    font-size: 12px;
}
.up-img {
  width: 220px;
  height: 0;
  margin-top:-40px;
  padding-bottom: 130px;
  position: relative;
  overflow: hidden;
}

.img-avatar {
    width: 100%;
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