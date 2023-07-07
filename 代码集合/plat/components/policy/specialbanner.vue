<template>
  <div class="banner" @mouseenter="clearSwipper()" @mouseleave="runInv()">
    <div
      class="item"
      v-if="dataList.length > 0"
      :class="{ showcuror: dataList[currentIndex].linkUrl }"
    >
      <img
        src="//static.wotao.com/banner/cfbade167ba042c5b18812d7e024f081.png"
        :style="{ height: height + 'px' }"
        class="bannerimg"
        @click="jump(dataList[currentIndex])"
      />
      <!-- <img
        :src="cdnPath + dataList[currentIndex].photoUrl"
        :style="{ height: height + 'px' }"
        class="bannerimg"
        @click="jump(dataList[currentIndex].linkUrl)"
      /> -->
      <div class="zixunbtn" @click.stop="showQia()" v-if="currentIndex == 0">
        咨询客服
      </div>
    </div>
    <div class="page" v-if="this.dataList.length > 1">
      <ul>
        <li
          v-for="(item, index) in dataList"
          :key="index"
          @click="gotoPage(index)"
          :class="{ current: currentIndex == index }"
        >
          <i class="iconfont">&#xe625;</i>
        </li>
      </ul>
    </div>
    <!-- 首页推荐产品 -->
    <div
      v-if="showRecomend == true && threeimgList && threeimgList.length > 0"
      class="woshiya"
      :class="{ newwoshiya: this.dataList.length > 1 ? true : false }"
    >
      <div
        class="homerec"
        v-for="(item, index) in threeimgList"
        :key="index * 9"
        @click="goProject(item)"
      >
        <template v-if="item.coverUrls && item.coverUrls.length > 0">
          <div v-for="(newItem, index) in item.coverUrls" :key="index * 6">
            <template v-if="newItem.isCover == 1">
              <img
                class="showImg"
                :src="cdnPath + newItem.url"
                v-if="
                  newItem.url &&
                  (newItem.url.split('.')[1] == 'jpeg' ||
                    newItem.url.split('.')[1] == 'png' ||
                    newItem.url.split('.')[1] == 'jpg' ||
                    newItem.url.split('.')[1] == 'gif')
                "
              />
              <video
                class="showImg"
                v-else-if="
                  newItem.spUrl &&
                  newItem.spUrl !== '' &&
                  newItem.spUrl !== null
                "
                :poster="cdnPath + newItem.spUrl"
                :src="cdnPath + newItem.url"
              ></video>
              <video
                v-else
                :src="cdnPath + newItem.url"
                class="showImg"
              ></video>
            </template>
            <template v-else-if="newItem.zc == 1">
              <img class="showImg" :src="cdnPath + newItem.url" />
            </template>
          </div>
        </template>
        <template v-else>
          <img class="showImg" :src="item.coverUrl" />
          <!-- <img
            class="showImg"
            :src="cdnPath + item.coverUrl"
            v-if="
              item.coverUrl &&
              (item.coverUrl.split('.')[1] == 'jpeg' ||
                item.coverUrl.split('.')[1] == 'png' ||
                item.coverUrl.split('.')[1] == 'jpg' ||
                item.coverUrl.split('.')[1] == 'gif')
            "
          />
          <video
            class="showImg"
            :src="cdnPath + item.coverUrl"
            v-if="
              item.coverUrl &&
              (item.coverUrl.split('.')[1] == 'mp4' ||
                item.coverUrl.split('.')[1] == 'avi' ||
                item.coverUrl.split('.')[1] == 'mov')
            "
          /> -->
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { banner } from "@/api/home";
export default {
  props: ["typeId", "height", "showRecomend", "ThreeImage"],
  data() {
    return {
      // cdnPath: process.env.CDN_BASE_URL,
      cdnPath: "//static.wotao.com/",
      dataList: [],
      currentIndex: 0,
      timer: null,
      isZC: process.env.PROPERTY_URL,
      threeimgList: [
        {
          coverUrl: "project/cover/f3497c3e94964840b0cccecdd61b42b7.png",
          earnestMoney: "500000",
          id: 7074,
          nowFee: "3000000",
          number: "XM20210525001",
          optionName: "其他",
          previousFee: "3000000",
          slogan: "招商、购地、融资的重要依据",
          spUrl: "",
          title: "可行性研究报告",
          coverUrls: [
            {
              id: 437,
              isCover: 1,
              number: "XM20210525001",
              sort: 1,
              spUrl: "",
              url: "icon/head/38eb4037f2004e83bb8767e895365904.png",
            },
          ],
        },
        {
          coverUrl: "project/cover/f62ea9cce1dc4a09b01975012df62d00.png",
          earnestMoney: "500000",
          id: 7020,
          nowFee: "1980000",
          number: "XM20201015001",
          optionName: "科技厅",
          previousFee: "4500000",
          slogan: "好处：资金补助、减税、招投标加分等",
          spUrl: "",
          title: "高新技术企业认定",
          coverUrls: [
            {
              id: 430,
              isCover: 1,
              number: "XM20201015001",
              sort: 1,
              spUrl: "",
              url: "icon/head/c0d93c58177643ff8b226f0253d2bda9.png",
            },
          ],
        },
        {
          coverUrl:
            "https://static.wotao.com/icon/head/ca23a8abc1354abe9ca61bd0f2fa116b.png",
          earnestMoney: "500000",
          id: 1,
          nowFee: "1000000",
          number: "XM20210521001",
          optionName: "其他",
          previousFee: "1000000",
          slogan:
            "主要适用场景：科技奖申报、职称评定、技术水平认定、技术推广等",
          spUrl: "",
          title: "科技成果评价",
        },
      ],
    };
  },
  methods: {
    showQia() {
      window.open(
        "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
        "",
        "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
      );
    },
    //图片链接跳转
    jump(data) {
      if (window.location.host=='wotao.com') {
        if (data) {
          window.open(data.linkUrl);
        }
      } else {
        window.open('/');
      }
    },
    //清除定时器
    clearSwipper() {
      window.clearInterval(this.timer);
    },
    getBanner() {
      // 0-通知公告，1-政策汇编，2-卧涛问答，3.项目申报，4-首页，5-关于卧涛
      banner(this.typeId).then((res) => {
        this.dataList = res.data.data;
      });
    },
    gotoPage(index) {
      this.currentIndex = index;
    },
    //定时器
    runInv() {
      this.timer = setInterval(() => {
        this.gotoPage(this.nextIndex);
      }, 3000);
    },
    goProject(item) {
      // if (index != 2) {
        window.open(`/productdetails/details?spuId=${item.id}`);
      // } else {
      //   window.open(this.isZC + "/" + id + 2);
      // }
    },
  },
  computed: {
    //上一张
    prevIndex() {
      if (this.currentIndex == 0 && this.dataList) {
        return this.dataList.length - 1;
      } else {
        return this.currentIndex - 1;
      }
    },
    //下一张
    nextIndex() {
      if (this.dataList) {
        if (this.currentIndex == this.dataList.length - 1) {
          return 0;
        } else {
          return this.currentIndex + 1;
        }
      }
    },
  },
  created() {
    this.getBanner();
    this.runInv();
  },
};
</script>

<style lang="stylus" scoped>
.zixunbtn {
  position: absolute;
  left: 42px;
  top: 255px;
  width: 160px;
  height: 40px;
  color: #333333;
  font-size: 19px;
  background: #fed91f;
  border-radius: 40px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}

.showcuror {
  cursor: pointer;
}

.item {
  position: relative;
}

.showImg {
  width: 226px !important;
  height: 166px;
}

.bannerimg {
  width: 100%;
  height: 440px;
}

ul li {
  list-style: none;
  float: left;
  height: 48px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
}

.banner {
  width: 100%;
  min-width: 1200px;
  height: 440px;
  margin: 0 auto;

  .woshiya {
    margin-top: 10.2px;
    display: flex;
  }

  .newwoshiya {
    margin-top: 42.2px;
  }
}

.banner img {
  width: 100%;
  display: block;
}

.banner .page {
  height: 48px;
  margin-top: -80px;
  position: relative;
  width: 100%;
}

.banner .page ul {
  position: absolute;
  left: 46%;
  transform: translateX(-50%);
}

.current {
  color: #000;
}

.homerec {
  float: left;
  margin-right: 11px;
  cursor: pointer;
  width: 226px;
  height: 166px;
}

.homerec:hover {
  .showImg {
    border: 2px solid #F6AF1E;
  }
}

.homerec:nth-child(5) {
  margin-right: 0;
}
</style>