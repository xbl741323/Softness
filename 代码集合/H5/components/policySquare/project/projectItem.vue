<template>
  <div class="nutice_item" >
    
     <div v-if="nuticeInfo.coverUrls&&nuticeInfo.coverUrls.length>0" class="nutice_item_left" @click="toDetail">
     <div v-for="(item,index) in nuticeInfo.coverUrls" :key="index">
      <div v-if="item.isCover == 1">
      <img 
      v-if="item.url&&
      (item.url.split('.')[item.url.split('.').length-1]=='jpeg'
      ||item.url.split('.')[item.url.split('.').length-1]=='png'
      ||item.url.split('.')[item.url.split('.').length-1]=='jpg'
      ||item.url.split('.')[item.url.split('.').length-1]=='gif'
      )" 
      :src="cdnUrl + item.url" alt />
      <div v-if="item.url&&(item.url.split('.')[item.url.split('.').length-1]=='mp4'
      ||item.url.split('.')[item.url.split('.').length-1]=='avi'
      ||item.url.split('.')[item.url.split('.').length-1]=='mov'
      )">
      <video 
      v-if="item.spUrl&&(item.spUrl!==''&&item.spUrl!==null)" 
      :poster="cdnUrl+item.spUrl"
      :src="cdnUrl + item.url"></video>
       <video 
      v-else 
      :src="cdnUrl + item.url"></video>
      </div>
      </div>
     </div>
    </div>
    <div v-else class="nutice_item_left" @click="toDetail">
      <div v-if="nuticeInfo.coverUrl&&nuticeInfo.coverUrl!==''">
      <img 
      v-if="(nuticeInfo.coverUrl.split('.')[nuticeInfo.coverUrl.split('.').length-1]=='jpeg'
      ||nuticeInfo.coverUrl.split('.')[nuticeInfo.coverUrl.split('.').length-1]=='png'
      ||nuticeInfo.coverUrl.split('.')[nuticeInfo.coverUrl.split('.').length-1]=='jpg'
      ||nuticeInfo.coverUrl.split('.')[nuticeInfo.coverUrl.split('.').length-1]=='gif'
      )" 
      :src="cdnUrl + nuticeInfo.coverUrl" alt />
      <video 
      v-if="(nuticeInfo.coverUrl.split('.')[nuticeInfo.coverUrl.split('.').length-1]=='mp4'
      ||nuticeInfo.coverUrl.split('.')[nuticeInfo.coverUrl.split('.').length-1]=='avi'
      ||nuticeInfo.coverUrl.split('.')[nuticeInfo.coverUrl.split('.').length-1]=='mov'
      )" 
      :src="cdnUrl + nuticeInfo.coverUrl"></video>
      </div>
    </div>
    <div class="nutice_item_right">
      <!-- <div></div> -->
      <div class="nutice_right_top" @click="toDetail">{{ nuticeInfo.title }}</div>
      <div class="nutice_right_bottom" @click="toDetail">{{ nuticeInfo.slogan }}</div>
      <div class="price_a">
        <!-- <template v-if="nuticeInfo.earnestMoney">
          <div class="price" >￥{{nuticeInfo.earnestMoney}}/定金</div>
        </template>
        <template v-else>
          <div class="price" >面议</div>
        </template>
         -->
          <!-- 定价 -->
          <template v-if="nuticeInfo.earnestMoney">
              <div class="price" >￥{{nuticeInfo.earnestMoney | filterPrice}}/定金</div>
          </template>
          <!-- 现价+原价 -->
          <template v-else-if="nuticeInfo.nowFee && nuticeInfo.previousFee">
              <div class="price" >￥{{nuticeInfo.nowFee | filterPrice}}<span class="huaxian">{{nuticeInfo.previousFee | filterPrice}}</span></div>
              <!-- <div class="del_a"> <span class="del">￥{{Number( nuticeInfo.previousFee/100)}}</span></div> -->
          </template>
          <!-- 现价 -->
          <template v-else-if="nuticeInfo.nowFee">
              <div class="price" >￥{{nuticeInfo.nowFee | filterPrice}}</div>
          </template>
          <!-- 原价 -->
          <template v-else-if="nuticeInfo.previousFee">
                <div class="price" >￥{{nuticeInfo.previousFee | filterPrice}}</div>
          </template>
          <!-- 没填写 -->
          <template v-else>
              <div class="price">面议</div>
          </template>


        <!-- <div class="nutice_img_content"> -->
        <!-- <img :src="require('@/assets/images/policySquare/project-item@2x.png')" alt=""> -->
        <!-- <span @click.prevent="showMeiqia()">咨询客服</span>
      </div> -->
      </div>
      
    </div>

  </div>
</template>

<script>
export default {
  props: ["nuticeInfo", "sort",'showStatus',"keyWords"],
  data() {
    return {
      cdnUrl: process.env.CDN_BASE_URL,
      page:1,
    };
  },
  filters:{
      filterPrice(val){
         return Number(val)/100
      }
  },
  methods: {
    showMeiqia() {
      var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
      _53.push("cmd", "mtalk");
      /*开发者文档1.7 主动发起(手机端)*/ _53.query();
    },
    toDetail() {
      if(sessionStorage.getItem("projectPage")){
      this.page = sessionStorage.getItem("projectPage")
      }
      const newPath = this.$router.resolve({
        path: "/project/" + this.nuticeInfo.number+this.sort,
        query: {
          catch: this.showStatus,
          sort: this.sort,
          skiFrom:true,
          page:this.page,
          keyWords:this.keyWords
          }
      });
      window.open(newPath.href, "_self");
    },
  },
};
</script>
<style scoped>
.nutice_item {
  width: 100%;
  height: 100px;
  display: flex;
  border-bottom: 1px solid #E7E6EB;
  overflow: hidden;
}
.nutice_item_left {
  width: 100px;
  height: 71px;
  margin-top: 15px;
  margin-left:12px;
}
.nutice_item_left img {
  width: 100px;
  height: 71px;
}
.nutice_item_left video {
  width: 100px;
  height: 71px;
}
.nutice_item_right {
  width: 237px;
  height:100%;
  position: relative;
  /* padding-top: 15px;
  padding-left: 8px;
  padding-bottom: 14px; */
  /* margin-top: 15px;
  margin-left: 8px; */
  
}
.nutice_item_right .nutice_right_top {
  width: 100%;
  min-height: 0.45333333333rem;
  color: #333333;
  font-size: 0.37333333333rem;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  /* font-size: 14px; */
  display: -webkit-box;
  -webkit-line-clamp: 2;
 -webkit-box-orient: vertical;
 margin-left: 8px;
  margin-top: 12px;
  /* display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; */
}
.nutice_item_right .nutice_right_bottom {
  /* margin-top: 0.21333333333rem; */
  width: 100%;
  height: 17px;
  color: #999999;
  font-size: 0.32rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 8px;
}
.nutice_img_content{
  position:absolute;
  width: 64px;
  height: 22px;
  border: 1px solid #36a6fe;
  border-radius: 12px;
  right: 12px;
  top: -8px; 
}
.price{
  width: 100%;
  height: 21px;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Medium;
  font-weight: 500;
  color: #fd4a1c;
}

.del_a{
    margin-top: 26px;
    margin-top: 24px;
    margin-left: 7px;
    }
.del{
    text-decoration:  line-through;  
    font-size: 12px;
    color: #FFFFFF;
    }
.huaxian{
    font-size: 10px;
    text-decoration:  line-through;
    text-align: left;
    color: #c5c5c5;
    }
.price_a{
  display:flex;
  position:absolute;
  top: 70px;
  left: 8px;
}
/* .nutice_img_content span{
  color: #36A6FE;
  position: absolute;
  left: 6.5px;
  top: 1px; */
  /* width: 1.973333333333333;
  height: 0.5866666666666667rem;
  display: inline-block;
  color: #36A6FE;
  line-height: 0.5866666666666667rem;
  font-size: 10px;
  display: flex;
  justify-content: center;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 14.5%;
  transform: translate(-50%,-50%); */

</style>