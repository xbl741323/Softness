<template>
  <div>
    <div class="wrapper">
      <!-- 20210104需求banner改为静态数据 -->
      <div v-if="banners.length>0">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="item of banners" :key="item.id">
            <div class="cut_img" @click="bannerClick(item)">
              <img class="swiper-img" :src="cdnUrl+item.photoUrl" />
            </div>
          </swiper-slide>
          <div v-if="banners.length!=1" class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <img v-else class="banner-static" :src="staticImg" alt="">
    </div>
  </div>
</template>

<script>
import { getBannerList } from "@/api/home";
export default {
  props:["type","staticImg"],
  data() {
    return {
      cdnUrl:process.env.CDN_BASE_URL,
      banners: [],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        loop: false,
        observer: true,
        observeParents: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      }
    };
  },
  methods: {
      getBannerData() {
          getBannerList(this.type).then(res => {
            this.banners = res.data
          }).catch(err=>{
              console.log(err)
          })   
      },
      bannerClick(item){
        if(item.linkUrl!=''){
          // window.open(item.linkUrl)
          window.location.href=item.linkUrl
        }
      }
  },
  mounted(){
      this.getBannerData()
  }
};
</script>
<style scoped>
.wrapper {
  width: 100%;
  height: 0;
  position: relative;
  padding-bottom: 2.88rem;
  overflow: hidden;
}
.banner-static{
  width: 100%;
}
.cut_img {
  width: 100%;
  height: 2.56rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-img {
  width: 100%;
  height: 100%;
}

.wrapper >>> .swiper-pagination-bullets {
  bottom: 0.2rem;
}

.wrapper >>> .swiper-container {
  height: 2.56rem;
  margin: .32rem .32rem 0 .32rem;
  border-radius:.4rem
}

.wrapper >>> .swiper-pagination-bullet-active {
  background: rgb(0, 122, 255);
}
</style>