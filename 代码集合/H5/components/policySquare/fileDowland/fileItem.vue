<template>
    <div :class="['box',type==0?'new':'']" 
      v-loading="loading"
      element-loading-text="请点击右上角···选择浏览器打开"
      element-loading-background="rgba(0, 0, 0, 0.8)">
        <div v-if="type==0">
          <div @click="goDetail(item)">
            <div class="item new">
              <div class="img">
                <img :src="cdnUrl+item.fileImageUrl" alt class="img_sty">
              </div>
              <div class="pay" v-if="item.isPay==1">付费</div>
              <img v-if="fileTypeArr.indexOf(item.fileType)>-1" :src="iconUrl[item.fileType]" alt class="type">
            </div>
          </div>
          <div class="title">{{item.fileName}}</div>
        </div>
        <div v-else>
          <div @click="goDetail(item)">
            <div class="item">
              <div class="img">
                <img :src="cdnUrl+item.file_image_url" alt class="img_sty">
              </div>
              <div class="download" v-if="item.download_times">
                <img src="@/assets/images/policySquare/icon_download@2x.png" alt>
                <span>{{item.download_times}}</span>
              </div>
              <div class="pay" v-if="item.is_pay==1">付费</div>
              <img v-if="fileTypeArr.indexOf(item.file_type)>-1" :src="iconUrl[item.file_type]" alt class="type">
            </div>
          </div>
          <div class="title" v-html="transfer(item.file_name)"></div>
        </div>
    </div>
</template>

<script>
import * as policyData from '@/pages/policy/policy-data';
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    type: {
      type: Number,
    }
  },
  data(){
    return{
      loading: false,
      cdnUrl: process.env.CDN_BASE_URL,
      iconUrl: policyData.iconUrl ,
      fileTypeArr: policyData.fileTypeArr,
    }
  },
  methods:{
    // 跳转文档详情
    goDetail(item){
        window.open("/policy/files/"+item.id,"_self")
    },
    transfer(str){
      return str.replaceAll('font-size:17px','font-size:14px')
    }
  }
};
</script>

<style lang="stylus" scoped>
.new {
  width: 2.12rem !important;
}
.box {
  width: 2.1333333333rem;
  height: 3.9466666666667rem;
  border-radius: 0.1333333333rem;
  margin-left: 0.9rem;
  margin-bottom: var(--size-16);
  .item {
    width: 100%;
    height: 2.88rem;
    position: relative;
    .img {
      width: 100%;
      height: 2.88rem;
      border: 1px solid #eaebef;
      border-radius:  0.1333333333rem;
    }
    .img_sty{
      width: 100%;
      height: 100%;
    }
    .download {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: var(--size-16);
        height: var(--size-16);
      }
      span {
        font-size: var(--size-12);
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #36a6fe;
        margin-left: 0.1rem
      }
    }
    .pay {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 1rem;
      height: 0.4rem;
      line-height: 0.4rem;
      background: #ff6d27;
      border-radius: 8px;
      font-size: var(--size-12);
      font-family: Microsoft YaHei, Microsoft YaHei-Light;
      font-weight: 300;
      color: #fcfcfc;
      text-align: center;
    }
    .type {
      position: absolute;
      right: 0;
      bottom: 0;
      width: var(--size-16);
      height: var(--size-16);
    }
  }
  .title {
    width: 2.24rem;
    height: 0.85333333333rem;
    font-size: var(--size-12);
    font-family: Microsoft YaHei, Microsoft YaHei-Regular;
    font-weight: 400;
    text-align: center;
    color: #555555;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    vertical-align: middle;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
}
</style>