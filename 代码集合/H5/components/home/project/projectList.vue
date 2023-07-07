<template>
  <div class="project-list">
    <div class="list-box">
      <div style="display:flex;margin:11px 0 0 0;padding-left:20px;overflow-x: scroll;">
        <div
          class="projecttab"
          v-for="(item, parentIndex) in listData"
          :key="parentIndex"
          @click="changeTab(parentIndex)"
        >
          <div :class="{active: parentIndex == currentIndex}">
            <span>{{ item.optionName }}</span>
            <div :class="{ scroll: parentIndex == currentIndex }" style="opacity: 1;"></div>
          </div>
        </div>
      </div>
      <div
        v-for="(item, parentIndex) in listData"
        :key="parentIndex"
        @click="changeTab(parentIndex)"
      >
        <ul v-show="parentIndex == currentIndex">
          <li
            class="list-item"
            v-for="(childItem, childIndex) in item.polices"
            :key="childIndex"
          >
            <div class="item-cont" @click="toDetail(childItem)">
                <div class="item-img">
                    <img 
                    v-if="(childItem.coverUrl&&childItem.coverUrl!=='')&&
                    (childItem.coverUrl.split('.')[childItem.coverUrl.split('.').length-1]=='jpeg'
                    ||childItem.coverUrl.split('.')[childItem.coverUrl.split('.').length-1]=='png'
                    ||childItem.coverUrl.split('.')[childItem.coverUrl.split('.').length-1]=='jpg'
                    ||childItem.coverUrl.split('.')[childItem.coverUrl.split('.').length-1]=='gif'
                    )" 
                    :src="imgPath + childItem.coverUrl" alt />
                    <div 
                    v-else-if="(childItem.coverUrl&&childItem.coverUrl!=='')&&
                    (childItem.coverUrl.split('.')[childItem.coverUrl.split('.').length-1]=='mp4'
                    ||childItem.coverUrl.split('.')[childItem.coverUrl.split('.').length-1]=='avi'
                    ||childItem.coverUrl.split('.')[childItem.coverUrl.split('.').length-1]=='mov'
                    )">
                    <video  
                    v-if="childItem.spUrl&&(item.spUrl!==''&&item.spUrl!==null)"
                    :poster="imgPath+childItem.spUrl"
                    :src="imgPath + childItem.coverUrl"></video>
                    <video 
                    v-else 
                    :src="imgPath + childItem.coverUrl"></video>
                    </div>
                    <img v-else :src="imgPath + childItem.icon" alt />
              </div> 
              <div class="item-txt">
                <div class="item-title">{{ childItem.title }}</div>
                <p class="item-desc">{{ childItem.slogan }}</p>
                <div class="price_content">
                    <span v-if="childItem.earnestMoney">
                        <span class="priceIcon">￥</span><span class="price">{{childItem.earnestMoney | filterPrice}}</span><span class="priceIcon">/定金</span>
                    </span> 
                    <span v-else-if="childItem.nowFee && childItem.previousFee">
                        <span class="priceIcon">￥</span><span class="price">{{childItem.nowFee | filterPrice}}</span><span class="huaxian">{{childItem.previousFee | filterPrice}}</span>
                    </span> 
                    <span v-else-if="childItem.nowFee || childItem.previousFee">
                         <span class="priceIcon">￥</span><span class="price">{{ (childItem.nowFee || childItem.previousFee) | filterPrice}}</span>
                    </span>
                    <span v-else class="nowchat">面议</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getProjectList } from "~/api/home";
export default {
  data() {
    return {
      imgPath: process.env.CDN_BASE_URL,
      currentIndex: 0,
      listData: [],
      localAreaNo: ""
    };
  },
  filters:{
      filterPrice(val){
         return Number(val)/100
      }
  },
  computed: {
    getLocationState() {
      return this.$store.state.areaNo;
    }
  },
  methods: {
    changeTab(index) {
      this.currentIndex = index;
    },
    toProject() {
      this.$router.push({
        path: "/project"
      });
    },
    getData() {
      if (this.localAreaNo) {
        var params = {
          source: "PC",
          areaNo: this.localAreaNo
        };
      } else {
        var params = {
          source: "PC",
          areaNo: this.getLocationState
        };
      }
      getProjectList(params)
        .then(res => {
          this.listData = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showMeiqia() {
      var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
      _53.push("cmd", "mtalk");
      /*开发者文档1.7 主动发起(手机端)*/ _53.query();
    },
    toDetail(item) {
      const newPath = this.$router.resolve({
        path: "/project/" + item.number + 2,
        query: {
          sort: 2
        }
      });
      window.open(newPath.href, "_self");
      sessionStorage.setItem("proSLocation", this.scrollTop);
    },
    handleScroll() {
      this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    }
  },
  watch: {
    getLocationState(val) {
      this.getData(val);
    }
  },
  mounted() {
    if (sessionStorage.getItem("localAreaNo")) {
      this.localAreaNo = sessionStorage.getItem("localAreaNo");
    }
    this.getData();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
<style scoped>
.price_content {
    position: absolute;
    bottom: -0.05333333333333334rem;
}
.priceIcon{
    color:#FF6D27;
    font-size: 12px;
}
.price{
    color:#FF6D27;
    font-size: 16px;
}
.nowchat{
    color:#FF6D27;
    font-size: 14px;
}
.huaxian{
    font-size: 10px;
    color: #c5c5c5;
    text-decoration:  line-through;
    margin-left: 4.5px;
}

::-webkit-scrollbar {
  display: none;
}
.projecttab {
  height: 30px;
  display: flex;
  flex-shrink: 0;
  margin-right: 22px;
}
.projecttab div {
  color: #111e34;
  opacity: 0.5;
  font-size: 13px;
  position: relative;
}
.active {
  color: #233558 !important;
  opacity: 1 !important;
  font-weight: bold !important;
  font-size: 14px !important;
}
.scroll {
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 4px;
  background: linear-gradient(169deg, #b4daf8 0%, #158fea 100%);
  opacity: 1;
  border-radius: 4px;
}
.project-list {
  width: 100%;
  position: relative;
}
.list-title {
  flex: 1;
  margin: 0.213333333rem 0;
  border-left: 3px solid #ff3c31;
  padding-left: 0.2rem;
  font-size: 0.426666667rem;
  font-weight: 600;
  color: #333;
  line-height: 0.373333333rem;
}
.list-head p {
  color: #999;
  font-size: 0.32rem;
}
.list-item {
  width: 100%;
  padding: 0.32rem 0.4rem;
  border-bottom: 1px solid #e7e6eb;
}
.item-cont {
  display: flex;
  align-items: center;
}
.item-img {
  width: 2.6666666666666665rem;
  height: 1.8933333333333333rem;
  margin-right: 0.21333333rem;
  overflow: hidden;
}
.item-txt {
 flex: 1;
 height: 1.8933333333333333rem;
 position: relative;
}
.item-img img {
  width: 100%;
  height: 1.8933333333333333rem;
}
.item-img video {
  width: 100%;
  height: 1.8933333333333333rem;
}
.item-title {
  font-size: 0.3733333333rem;
  color: #333;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.item-desc {
  color: #959595;
  font-size: 0.32rem;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.item-bt {
  width: 100%;
  display: inline-block;
  margin-top: 0.2666666667rem;
}
.left-bt {
  float: left;
  width: 2.88rem;
  line-height: 0.64rem;
  color: #ff8b53;
  background: #fff4ef;
  border: none;
  border-radius: 2px;
}
.right-bt {
  float: right;
  width: 4rem;
  line-height: 0.8rem;
  color: #fff;
  background: #36a6fe;
  border: none;
  border-radius: 2px;
}
</style>
