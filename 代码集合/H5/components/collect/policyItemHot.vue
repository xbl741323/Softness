<template>
  <div class="nutice_item">
    <div :class="['nutice_main', showStatus == 1 ? 'nutice_change' : '']" @click="toDetail">
      <div class="item_title">
        <span>{{ type | typeFilter }}</span>
        <span> {{ collectInfo.title }} </span>
        <span class="fail_sty" v-if="collectInfo.deleted == 1||collectInfo.showStatus == 2">已失效</span>
      </div>
      <div class="item_desc">
        <div :class="['desc_time', showStatus == 0 ? 'desc_change' : '']">
          {{ collectInfo.createTime }}
        </div>
        <div class="desc_view" v-if="type!=='3'">
          <img
            :src="require('@/assets/images/policySquare/icon_view@3x.png')"
            alt=""
          />
          <span>{{ collectInfo.pageViews }}</span>
        </div>
         <div class="file_view" v-if="type=='3'">
            <span @click="download" style="text-decoration:none;color:#36a6fe;" >
            <i class="el-icon-download" style="margin-right:0.03rem;"></i>{{ this.$t('message.fileDowland') }}</span>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import {downloadFile} from "@/api/policySquare";
export default {
  props: ["collectInfo","type"],
  data() {
    return {
      filePahtUrl:process.env.baseUrl,
      sort: 1,
      showStatus:0,
      checkValue: false,
    };
  },
  filters: {
    typeFilter(val) {
      switch (val) {
        case "0":
          return "[公告]";
          break;
        case "1":
          return "[汇编]";
          break;
        case "2":
          return "[疑难]";
          break;
        case "3":
          return "[文件]";
          break;
      }
    },
  },
  methods: {
    //文件下载预处理，校验是否登录，实际上不下载
     download(item){
       downloadFile(0).then(res=>{
        if(res.data.code != 10002){
          let a = document.createElement("a");
          a.href = this.filePathUrl+'/file/download?id='+this.collectInfo.id+'&name='+this.collectInfo.title;
          a.click();
        }
      })
    },
    showValue(val) {
      this.$emit("policy-change", val);
    },
    toDetail() {
      if(this.type !=='3'){
         const newPath = this.$router.resolve({
          path:
            "/policy/" +
            this.collectInfo.number +
            this.type +
            this.sort,
        });
        window.open(newPath.href, "_self");
      }   
    },
  },
};
</script>

<style scoped>
.nutice_item {
  width: 100%;
  height: 2.42666666667rem;
  overflow: hidden;
  border-bottom: 1px solid #e7e6eb;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/**/
.nutice_main {
  width: 10rem;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}
.nutice_change {
  align-items: flex-start;
}
.item_title {
  width: 91.5%;
  height: 1.05rem;
  font-size: 0.37333333333rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.item_title > span:nth-of-type(1) {
  color: #36a6fe;
}
.item_title > span:nth-of-type(2) {
  color: #333;
}
/**/
.item_desc {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #999999;
  font-size: 0.29333333333rem;
}
.desc_time {
  margin-top: 0.2rem;
}
.desc_change {
  margin-left: 0.5rem !important;
}
.desc_view {
  margin-top: 0.2rem;
  margin-right: 0.42666666667rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.desc_view img {
  width: 0.37333333333rem;
  height: 0.37333333333rem;
  margin-right: 0.10666666667rem;
}
.trouble_ling {
  display: inline-block;
  width: 0.18rem;
  height: 0.18rem;
  margin-left: 0.06rem;
  background: #36a6fe;
  transform: rotate(45deg);
  margin-bottom: 0.05333333333rem;
}
.item_checkbox {
  width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fail_sty {
  width: 1.28rem;
  height: 0.48rem;
  background: #999999;
  opacity: 1;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  padding: 1px 7px;
}
.file_view {
  margin-top: 0.21333333333rem;
  margin-right: 0.42666666667rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.file_viewspan {
  width: 1.9rem;
  height: 0.64rem;
  font-size: 0.32rem;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.file_view > span:nth-of-type(1) {
  border: 1px solid #36a6fe;
  color: #36a6fe;
  margin-right: 0.2rem;
}
.icon_size {
  color: #36a6fe;
  font-size: 0.42666666667rem;
}
</style>