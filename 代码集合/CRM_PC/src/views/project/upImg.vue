<template>
<!-- 排查完成 -->
    <div class="line-pay">    
        <el-button :disabled="editable" @click.stop="uploadHeadImg" type="primary">{{$t('button.addPng')}}</el-button>
        <div class="up-img" v-if="url">
            <img :src="url" class="img-avatar">     
        </div>    
        <div class="choose-img">
            <input 
            type="file" 
            name="avatar" 
            id="uppic" 
            accept="image/gif,image/jpeg,image/jpg,image/png" 
            @change="changeImage($event)" 
            ref="avatarInput" 
            class="uppic">
        </div>    
    </div>
</template>

<script>
export default {
  data() {
       return {       
           showImg:true
       }
  },
  props: {
    url: String,
    editable: Boolean
  },
  methods:{
    uploadHeadImg () {
      this.$el.querySelector('.uppic').click()
    },
    changeImage(e) {
        this.showImg = true;
        let $target = e.target || e.srcElement
        let file = $target.files[0]
        var reader = new FileReader()
        reader.onload = (data) => {
          let res = data.target || data.srcElement           
          let imgUrl = res.result  
          this.$emit('change-license', imgUrl)        
        }
        reader.readAsDataURL(file);
        let imgUrl = file;
        //this.$emit('change-license', imgUrl)
    },
},
mounted () {
}
}
</script>


<style scoped>
.line-pay{
  width: 50%;
  margin-top: -24px;
}
  .up-img{
    width: 320px; 
    height: 0;
    position: relative;
    margin: 20px 0;
    overflow: hidden;
    padding-bottom: 190px;
  }
  .up-img img{
    width: 100%;
  }
    .img-avatar{
      position: absolute;       
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 90%;
    }
  .choose-img{
    text-align: center
  } 
    .uppic{
      display: none
    }
  .upload-bt{
    text-align: center;
    margin-top: 20px
  }
   .upload-bt button{
      background: #019fe8;
      padding: 6px 40px;
      border-radius: 4px;
      color: #fff;
   }
  .tips{
    color: #666;
    line-height: 22px;
    margin-top: 20px;
  }
  .up-button{
    display: flex;
    margin: 14px 0;
    align-items: center;
  }
    h3{
      flex: 1;
    }
    button{
      height: 34px;
      padding: 0 20px;
      margin-right: 8px;
      background: #409EFF;
      border-radius: 4px;
      color: #fff;
    }
  h3{
    margin: 14px 0 14px 20px;
    font-weight: bold;
  };
</style>