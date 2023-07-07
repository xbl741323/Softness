<template>
  <div class="service">
    <div class="first">
      <span class="one">精选服务</span
      ><span class="two">/ 帮您高效搞定需求</span>
      <img
        src="~/assets/images/index/anniu@2x.png"
        class="zixun"
        @click.stop="showQia()"
      />
    </div>
    <div class="example">
      <div
        class="item"
        v-for="(item, index) in fuwuList"
        :key="index"
        @click="goProject(item.coverUrls[0])"
      >
        <template v-if="item.coverUrls && item.coverUrls.length > 0">
          <div v-for="(newItem, index) in item.coverUrls" :key="index * 6">
            <!-- 精选服务列表 -->
            <template v-if="newItem.isCover == 1">
              <img
                class="chanping"
                :src="newItem.id == 7069 ? newItem.url : cdnPath +newItem.url"
                v-if="
                  newItem.url &&
                  (newItem.url.split('.')[1] == 'jpeg' ||
                    newItem.url.split('.')[1] == 'png' ||
                    newItem.url.split('.')[1] == 'jpg' ||
                    newItem.url.split('.')[1] == 'gif') || newItem.id == 7069
                "
              />
              <video
                class="chanping"
                v-else-if="
                  newItem.spUrl &&
                  newItem.spUrl !== '' &&
                  newItem.spUrl !== null
                "
                :poster="newItem.id == 7069 ? newItem.spUrl : cdnPath +newItem.spUrl"
                :src="newItem.id == 7069 ? newItem.url : cdnPath +newItem.url"
              ></video>
              <video
                v-else
                :src="newItem.id == 7069 ? newItem.url : cdnPath +newItem.url"
                class="chanping"
              ></video>
            </template>
            <template v-else-if="newItem.zc == 1">
              <img class="chanping" :src="newItem.url" />
            </template>
          </div>
        </template>
        <template v-else>
          <img  class="chanping" :src="item.coverUrl">
          <!-- <img
            class="chanping"
            :src=" item.coverUrl"
            v-if="
              item.coverUrl &&
              (item.coverUrl.split('.')[1] == 'jpeg' ||
                item.coverUrl.split('.')[1] == 'png' ||
                item.coverUrl.split('.')[1] == 'jpg' ||
                item.coverUrl.split('.')[1] == 'gif')
            "
          />
          <video
            class="chanping"
            :src="item.coverUrl"
            v-if="
              item.coverUrl &&
              (item.coverUrl.split('.')[1] == 'mp4' ||
                item.coverUrl.split('.')[1] == 'avi' ||
                item.coverUrl.split('.')[1] == 'mov')
            "
          /> -->
        </template>
        <div class="title">
          <span v-if="index == 0 || index == 2">{{
            item.title | filterword
          }}</span
          ><span v-else>{{ item.name | filterword }}</span>
        </div>
        <div class="des">{{ item.slogan | filterdes }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getJInxuan } from "@/api/home";
export default {
  data() {
    return {
      cdnPath: process.env.CDN_BASE_URL,
      fuwuList: [
        {
          coverUrl: "icon/head/c0d93c58177643ff8b226f0253d2bda9.png",
          number: "XM20201015001",
          slogan: "好处：资金补助、减税、招投标加分等",
          spUrl: "",
          title: "高新技术企业认定",
          coverUrls: [
            {
              id: 7020,
              isCover: 1,
              number: "XM20201015001",
              sort: 1,
              spUrl: "",
              url: "icon/head/c0d93c58177643ff8b226f0253d2bda9.png",
            },
          ],
        },
        {
          // coverUrl: "filebase/60928a2a3f934eb59e40c94f89d524ae.png",
          coverUrl:"icon/head/2f622a65a67d418e8af63558833ab376.png",
          id: 9,
          name: "商标注册",
          slogan: "全程跟进，专业高效",
          coverUrls: [
            {
              id: 9,
              isCover: 1,
              sort: 1,
              url: "icon/head/2f622a65a67d418e8af63558833ab376.png",
            },
          ],
        },
        {
          coverUrl: "icon/head/26ebd506cb67457f8f6ab288debf198b.png",
          slogan: "招商融资的重要依据",
          title: "商业计划书",
          coverUrls: [
            {
              id: 7088,
              isCover: 1,
              number: "XM20210617003",
              sort: 1,
              spUrl: "",
              url: "icon/head/26ebd506cb67457f8f6ab288debf198b.png",
            },
          ],
        },
        {
          id: 1,
          name: "公司注册",
          slogan: "专业顾问团队、咨询指导",
          coverUrls: [
            {
              aicregNumber: "GS001",
              id: 301,
              isCover: 1,
              sort: 1,
              spUrl: "",
              url: "icon/head/86b76e202812460baf6d598b36461ead.png",
            },
          ],
        },
        {
          id: 1,
          name: "科技成果评价",
          slogan: "权威科技成果评价机构",
          coverUrls: [
            {
              fmNumber: "CS001",
              id: 7069,
              isCover: 1,
              sort: 1,
              spUrl: "",
              url: "http://static-tst.wotao.com/icon/head/64aa5ceeae024bd9b1223921efe216c7.jpg",
            },
          ],
        },
        {
          id: 1,
          name: "网站建设",
          slogan: "高端定制，精心设计",
          coverUrls: [
            {
              id: 501,
              ipoNumber: "RZ001",
              isCover: 1,
              sort: 1,
              spUrl: "",
                url: "icon/head/a69378f9bd034ffea0f2eec8ce3c0b08.png",
            },
          ],
        },
      ],
      isZC: process.env.PROPERTY_URL,
    };
  },
  filters: {
    filterword(val) {
      if (val && val.length <= 8) {
        return val;
      } else if (val) {
        return val.substring(0, 7) + "...";
      }
    },
    filterdes(val) {
      if (val && val.length <= 14) {
        return val;
      } else if (val) {
        return val.substring(0, 14) + "...";
      }
    },
  },
  mounted() {
    getJInxuan().then((res) => {
      if (res.data.data && res.data.data.length > 0) {
        res.data.data[1].coverUrls = [
          {
            zc: 1,
            url: "https://static.wotao.com/icon/head/2f622a65a67d418e8af63558833ab376.png",
          },
        ];
        this.list = res.data.data;
      }
    });
  },
  methods: {
    showQia() {
      window.open(
        "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
        "",
        "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
      );
    },
    goProject(item) {
      window.open(`/productdetails/details?spuId=${item.id}`);
    },
  },
};
</script>
<style lang="stylus" scoped>
.service {
  width: 1200px;
  height: 307px;
  margin: 18px auto 23px auto;
  background: url('https://static.wotao.com/icon/head/66f0959ef0264bb3847507b5d5d119db.png') no-repeat center / cover;
}

.first {
  padding: 25px 0 25px 118px;
}

.one {
  font-size: 32px;
  color: #ffffff;
  font-weight: 700;
}

.two {
  font-size: 16px;
  color: #fff;
  margin-left: 5px;
  opacity: 0.85;
}

.zixun {
  width: 104px;
  height: 40px;
  object-fit: contain;
  float: right;
  margin-right: 191px;
  cursor: pointer;
}

.example {
  display: flex;
}

.item {
  width: 187px;
  height: 197px;
  background: #ffffff;
  border-radius: 5px;
  margin-left: 11px;
  margin-top: 7px;
  padding: 10px 10px 0 10px;
  cursor: pointer;
}

.chanping {
  width: 167px;
  height: 120px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: #333333;
  margin-top: 7px;
  display: flex;
  justify-content: center;
}

.des {
  font-size: 12px;
  color: #999999;
  text-align: center;
  margin-top: 5px;
}
</style>
