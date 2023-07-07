<template>
  <div class="frame">
    <div class="empty-box">
      <div class="conter-box">
        <div class="box">
          <img
            class="top-img"
            src="~assets/images/home/icon_foot_zhuan@2x.png"
          />
          <div class="right-title">
            <p class="big">专注项目申报10年</p>
            <p class="small">专业人做专业事</p>
          </div>
        </div>
        <div class="line"></div>
        <div class="box">
          <img
            class="top-img"
            src="~assets/images/home/icon_foot_ding@2x.png"
          />
          <div class="right-title">
            <p class="big">多对一定制服务</p>
            <p class="small">多领域团队定制服务</p>
          </div>
        </div>
        <div class="line"></div>
        <div class="box">
          <img
            class="top-img"
            src="~assets/images/home/icon_foot_gao@2x.png"
          />
          <div class="right-title">
            <p class="big">成功率高</p>
            <p class="small">500家申报成功案例</p>
          </div>
        </div>
        <div class="line"></div>
        <div class="box">
          <img
            class="top-img"
            src="~assets/images/home/icon_foot_tuan@2x.png"
          />
          <div class="right-title">
            <p class="big">高学历团队</p>
            <p class="small">团队成员均为高等学历</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer_content">
      <div class="about_us">
        <p @click="goaboutUs" style="cursor: pointer;">{{ $t("txt.aboutUs") }}</p>
        <ul>
          <li
            v-for="(item, index) in aboutUsList"
            :key="index"
            :class="[{ 'item-last': index % 2 == 1 }, 'link-item']"
          >
          <!-- item.url==='/aboutWt/'?item.url+activeId:item.url -->
            <a
              :href="item.url"
              rel="nofollow"
              class="link"
              v-if="item.url !== ''"
            >
              {{ item.label }}
            </a>
            <a v-else @click="jump(item.url, item.num)">{{ item.label }}</a>
          </li>
        </ul>
      </div>
      <div class="about_us">
        <p>{{ $t("txt.technologyService") }}</p>
        <ul>
          <li
            v-for="(item, index) in serverList"
            :key="index"
            :class="[{ 'item-last': index % 2 == 1 }, 'link-item']"
          >
            <a :href="item.url" rel="nofollow" class="link">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
      <div class="contact_us">
        <h2>{{ $t("txt.contactUs") }}</h2>
        <p>{{ $t("txt.serviceHotline") }}：{{ $t("txt.tel") }}</p>
        <p>{{ $t("txt.serviceTime") }}：8:30-12:00 13:30-17:30</p>
        <p style="cursor: pointer" @click="jump(1, 3)">
          {{ $t("txt.footerTxt1") }}
        </p>
        <p>{{ $t("txt.footerTxt2") }}</p>
      </div>
      <div class="about_us">
        <p style="margin-left: 50px; font-size: 14px">
          {{ $t("txt.footerTxt3") }}
        </p>
        <img src="~assets/images/home/code02_home.png" />
      </div>
      <div class="about_us">
        <p style="margin-left: 22%; font-size: 14px; width: 100px">
          {{ $t("txt.footerTxt4") }}
        </p>
        <img src="~assets/images/home/code01_home@2x.png" />
      </div>
    </div>
    <div class="under">
      版权所有© 卧涛科技有限公司 <a style="color: #fff" href="http://beian.miit.gov.cn/">皖ICP备13016955号-22</a>
    </div>
  </div>
</template>

<script>
import { getLeft } from "@/api/home";
export default {
  data() {
    return {
      aboutUsList: [
        {
          num: 1,
          label: this.$t("foot.txt1"),
          url: "/aboutWt/",
        },
        {
          num: 2,
          label: this.$t("foot.txt2"),
          url: "/agreement/yhzc",
        },
        {
          num: 1,
          label: this.$t("foot.txt3"),
          url: "/aboutWt/",
        },
        {
          num: 2,
          label: this.$t("foot.txt4"),
          url: "/agreement/ysbh",
        },
        {
          num: 1,
          label: this.$t("txt.aboutUs"),
          url: "/aboutWt/",
        },
        {
          num: 3,
          label: this.$t("foot.txt6"),
          url: "",
        },
        {
          num: 1,
          label: this.$t("foot.txt7"),
          url: "/aboutWt/",
        },
      ],
      serverList: [
        {
          num: 2,
          label: this.$t("foot.txt8"),
          url: "https://yagu.cn/home",
        },
        {
          num: 2,
          label: this.$t("foot.txt10"),
          url: "https://yagu.cn/cgpj",
        },
        {
          num: 2,
          label: this.$t("foot.txt11"),
          url: "https://yagu.cn/cxydj",
        },
        {
          num: 2,
          label: this.$t("foot.txt12"),
          url: "https://yagu.cn/zscq",
        },
        {
          num: 1,
          label: this.$t("foot.txt15"),
          url: "/project/",
        },
      ],
      activeId:''
    };
  },
  methods: {
    goaboutUs() {
      // window.open("/aboutWt/"+this.activeId,'_self');
      window.open("/aboutWt/",'_self');
    },
    jump(url, num) {
      if (num == 1) {
        this.$router.push({
          path: url,
        });
      } else if (num == 2) {
        window.open(url);
      } else if (num == 3) {
        window.open(
          "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
          "",
          "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
        );
      }
    },
     // 初始化数据
    getData() {
      getLeft().then((res) => {
        if (res.data.data) {
          this.activeId = res.data.data[0].id;
        }
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="stylus" scoped>
.frame {
  width: 100%;
  min-width: 1200px;
  background: #383C40;
  font-size: 14px;

  .empty-box {
    width: 100%;
    height: 100px;
    background: #FFF;

    .conter-box {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      .box {
        width: 320px;
        height: 100px;
        margin: auto 0;
        display: flex;

        .top-img {
          width: 58px;
          height: 58px;
          margin: auto 0;
        }

        .right-title {
          height: 50px;
          margin: auto 0;
          margin-left: 15px;

          .big {
            font-size: 18px;
            font-family: Microsoft YaHei, Microsoft YaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: #383c40;
          }

          .small {
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #86898b;
          }
        }
      }

      .line {
        margin: auto 0;
        margin-left: 20px;
        margin-right: 74px;
        height: 60px;
        border: 1px solid #CECECE;
      }
    }
  }

  .under {
    text-align: center;
    font-size: 12px;
    color: #FFF;
    margin-top: 30px;

    .telecom {
      margin-left: 10px;
    }
  }

  .footer_content {
    width: 1200px;
    height: 180px;
    margin: 0 auto;
    padding-top: 30px;

    .about_us {
      width: 17%;
      float: left;
      color: #FFF;
      margin-right: 1%;

      .item-last {
        width: 50%;
        float: left;
        margin: 10px 0;
        text-decoration: none;
        list-style: none;
      }

      .link {
        color: #fff;
        text-decoration: none;
      }

      .link-item {
        width: 50%;
        float: left;
        margin: 5px 0;
        font-size: 14px;
        text-decoration: none;
        list-style: none;
        cursor: pointer;
      }
    }

    .contact_us {
      width: 25%;
      padding-left: 25px;
      margin-right: 3%;
      float: left;
      font-size: 14px;
      color: #FFF;
      line-height: 28px;
    }

    .contact_us h2 {
      font-size: 18px;
      color: #FFF;
    }

    .about_us p {
      font-size: 18px;
      font-weight: bold;
      width: 92px;
      margin-left: 20%;
    }

    .about_us img {
      margin-left: 18%;
      margin-top: 5px;
      width: 114px;
      height: 114px;
    }
  }
}
</style>