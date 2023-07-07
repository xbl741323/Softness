<template>
  <div class="needservice">
     <div class="selectservice">
       <div class="box">
            <img :src="require('@/assets/images/wotao/yuan_jianbian@2x.png')" alt>
            <span class="need-big">技术转移</span>
            <span class="need-small">帮您高效搞定需求</span>
       </div>
       <div class="content">
           <div class="item">
              <div class="bor" @click="toTech(0)"><span class="meta">技术成果</span><img class="titleimg" :src="require('@/assets/images/wotao/youjiantou_icon@2x.png')" alt /></div>
              <div class="element" v-for="(item,index) in resultList.slice(0,3)" :key="index" @click="toDetail(item,0)">
                 <span v-for="(ele,index) in item.coverUrls" :key="index">
                    <img class="needImg" v-if="ele.picture.match(/icon/)&&ele.isCover == '1'" :src="cdnUrl + ele.picture" alt /> 
                    <img class="needImg" v-if="ele.picture.match(/images/)&&ele.isCover == '1'" :src="ygUrl + ele.picture" alt /> 
                </span>
                 <div>
                     <div class="needititle">{{item.achievementName}}</div>
                     <span class="btn">{{item.technologyTypeTxt}}</span>
                 </div>
              </div>
           </div>
            <div class="item ml">
              <div class="bor" @click="toTech(1)"><span class="meta">技术需求</span><img class="titleimg" :src="require('@/assets/images/wotao/youjiantou_icon@2x.png')" alt /></div>
               <div class="element" v-for="(item,index) in needList.slice(0,3)" :key="index" @click="toDetail(item,1)">
                 <img class="needImg" :src="require('@/assets/images/wotao/fm@2x.png')" alt>
                 <div>
                     <div class="needititle">{{item.requirementName}}</div>
                     <span class="btn">{{item.requirementTypeTxt}}</span>
                 </div>
              </div>
           </div>
            <div class="middle"></div>
       </div>
    </div>
  </div>
</template>

<script>
import { getResultList, getNeedList } from "@/api/technology"
export default {
  data() {
    return {
      resultList: [],
      needList: [],
      cdnUrl: process.env.CDN_BASE_URL,
      ygUrl:"//static.yagu.cn/",
    };
  },
  mounted() {
    this.getResultData();
    this.getNeedData();
  },
  methods: {
    toTech(which) {
      if (which== 0) {
        this.$router.push({
          path: "/result",
        });
      } else {
        this.$router.push({
          path: "/need",
        });
      }
    },
    getResultData() {
      let params = {
        pageNo: 1,
        pageSize: 3,
        orderBy: 1,
        type:8
      };
      getResultList(params).then((res) => {
        this.resultList = res.data.records;
      });
    },
    getNeedData() {
      let params = {
        pageNo: 1,
        pageSize: 3,
        industry: "",
        orderBy: 1,
        type:7
      };
      getNeedList(params).then((res) => {
        this.needList = res.data.records;
      });
    },
    toDetail(item,which) {
        if(which==0){
            const newPath = this.$router.resolve({
                path: "/result/detail",
                query: {
                id: item.id
                }
            })
            window.open(newPath.href, "_self")
        }else{
             const newPath = this.$router.resolve({
                path: "/need/detail",
                query: {
                id: item.id
                }
            })
            window.open(newPath.href, "_self");
        }
    },
  },
};
</script>

<style scoped>
.needservice{
    padding:0 0.32rem;
    margin-top: 28px;
    margin-bottom: 30px;
 }
.box{
    margin-bottom: 12px;
}
.box img{
    width : 16px;
    height:  16px;
    position: relative;
    top: -2px;
}
.need-big{
    font-size: 18px;
    color: #333333;
    font-weight: 700;
    position: relative;
    right: 12px;
}
.need-small{
    font-size: 12px;
    color: #999999;
    position: relative;
    right: 12px;
}
.content{
    display: flex;
    position: relative;
    background: #ffffff;
    height: 216px;
    padding:  14px 12px;
    border-radius: 10px;
}
 .item{
    flex: 1;
    padding-right:  15px;
}
.bor{
    border-bottom: 0.5px solid #e4e4e4; 
    padding-bottom: 8px;
}
.meta{
    font-size: 16px;
    font-weight: 700;
    color: #333333;
}
.titleimg{
    width:  16px;
    height:  16px;
    position: relative;
    left: 70px;
}
.element{
    display : flex;
    margin-top:  10px;
}
.needImg{
    width: 56px;
    height: 40px;
    margin-right: 7px;
} 
.needititle{
    max-width: 86px;
    font-weight: 700;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.btn{
    border: 1px solid #40aafe;
    border-radius: 3px;
    padding: 1.5px;
    color: #36a6fe;
    font-size: 12px;
    margin-top: 2px;
    display: inline-block;
    max-width: 86px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.ml{
    margin-left : 16px;
}
.middle{
    width: 1px;
    height: 216px;
    background:#e4e4e4; 
    position: absolute;
    left: 50%;
    bottom: 0px;
} 
</style>