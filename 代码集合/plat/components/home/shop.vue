<template>
  <div class="tech-wrapper">
    <div style="margin-top: 28px;text-align: center;">
         <!-- <img src="~/assets/images/home/jszy_pic.png" width="260" height="42"/> -->
    </div>
    <div class="tech-con">
      <div class="tech-type" id="jszy" style="border-radius:6px 6px 0 0;">
        <div class="tech-title" style="border-radius:6px 6px 0 0;">
          <h2 style="color:#FFFFFFFF">技术成果</h2>
          <p style="color:#FFFFFFFF;font-weight:400;">全国领先技术，助力企业发展</p>
          <span style="margin-left:190px;color:#666666;font-weight:400;">
            <a :href="shopUrl+'/result'" style="color:#FFFFFFFF;font-weight:400;font-size:14px; text-decoration:none">
              更多
              <span
                style="display:inline-block;width:7px;height:7px;border-top: 1px solid #FFFFFFFF;border-right: 1px solid #FFFFFFFF;transform: rotate(45deg);font-size:10px;"
              ></span>
            </a>
          </span>
        </div>
        <div class="tech-list">
          <ul>
            <li v-for="(item,index) of resultInfo" :class="[{'item-last' : index % 3 == 2},'tech-item']" :key="item.id">           
              <div class="tec_result" @click="toResult(item,index)">
                <div class="item-img">
                  <img class="show_img" :src="cdnUrl+item.coverUrl" />
                </div>
                <div
                  class="item-title"
                  style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-left:5px;padding-bottom:3px;"
                >{{ item.achievementName }}</div>
                <div class="jszy">
                  <!-- {{ item.technologyTypeValue }} -->
                  <div class="jszy-type" style="padding-left:5px;display:flex;">
                    <span>类型：</span>
                    <span
                      style="display:inline-block;width:75px;
                      overflow:hidden;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                    >{{ item.technologyTypeValue }}</span>
                  </div>
                  <!-- {{ item.priceType|judge }}{{ item.tradePrice|price }} -->
                  <div
                    class="jszy-price"
                    style="display:inline-block;width:55px;
                  overflow:hidden;overflow: hidden;
                  text-overflow: ellipsis;white-space: nowrap;text-align:right;"
                  >{{ item.priceType|judge }}{{ item.tradePrice|price }}</div>
                </div>
                <!-- <div class="get iconfont" v-if="item.get" style="font-size:12px;">&#xe6ab; 已获得成果评价认证</div> -->
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="tech-type" id="jsNeed" style="border-radius:6px 6px 0 0;">
        <div class="tech-title" style="background:#6FDBECFF;border-radius:6px 6px 0 0;">
          <h2 style="color:#FFFFFFFF;">技术需求</h2>
          <p style="color:#FFFFFFFF;font-weight:400;">真实需求，真正商机</p>
          <span style="margin-left:250px;">
            <a :href="shopUrl+'/need'" style="color:#FFFFFFFF;font-weight:400;font-size:14px; text-decoration:none">
              更多
              <span
                style="display:inline-block;width:7px;height:7px;border-top: 1px solid #FFFFFFFF;border-right: 1px solid #FFFFFFFF;transform: rotate(45deg);font-size:10px;"
              ></span>
            </a>
          </span>
        </div>
        <div class="tech-list">
          <ul>
            <li v-for="(val,index) of requireInfo"  @click="toNeed(val,index)" :class="[{'item-last' : index % 3 == 2},'tech-item','need-item']" :key="val.id">
              <!-- {{ val.requirementName }} -->
              <div
                class="item-img"
                style="height:36px;line-height:17px;margin-top:-5px;"
              >需求：{{ val.requirementName }}</div>
              <!-- <div
                class="item-title"
                style="-webkit-line-clamp:2; -webkit-box-orient: vertical; display: -webkit-box"
              >{{ val.title }}</div>-->
              <div
                class="need-budget"
                style="color:#333333FF;font-size:12px;display:flex;align-items:center;margin-top:2px;"
              >
                <span style="width:46px;font-size:14px;">预算：</span>
                <span
                  class="price_desc"
                  style="color:#E94242FF;font-size:14px;"
                  v-if="val.priceType == 1"
                >面议</span>
                <span
                  class="price_desc"
                  style="color:#E94242FF;font-size:14px;"
                  v-if="val.tradePriceMax&&val.tradePriceMin"
                >{{ val.tradePriceMin|priceStatus }}-{{ val.tradePriceMax|priceStatus }}万元</span>
                <span
                  class="price_desc"
                  style="color:#E94242FF;font-size:14px;"
                  v-if="(val.tradePriceMin==''||val.tradePriceMin==null||val.tradePriceMin=='undefined')&&(val.tradePriceMax!=null)"
                >{{ val.tradePriceMax|priceStatus }}万元</span>
                <span
                  class="price_desc"
                  style="color:#E94242FF;font-size:14px;"
                  v-if="(val.tradePriceMax==''||val.tradePriceMax==null||val.tradePriceMax=='undefined')&&(val.tradePriceMin!=null)"
                >{{ val.tradePriceMin|priceStatus }}万元</span>
                <!-- <span style="color:#E94242FF;font-size:14px;">{{ val.tradePriceMax }}万元</span> -->
              </div>
              <div class="need-key">
                <span style="color:#AAAAAAFF;font-size:12px;">类型：</span>
                <span
                  class="key-word"
                  style="color:#397DCFFF;font-size:12px;"
                >{{ val.requirementType }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      /*  */
	      cdnUrl:process.env.SHOP_BASE_URL,
        resultInfo: {},
        shopUrl:process.env.SHOP_URL,
        requireInfo: {}
    };
  },
  filters: {
    priceStatus(value) {
      if (value) {
        return value / 1000000;
      }
    },
    judge(value) {
      return value == 1 ? "面议" : "";
    },
    price(value) {
      if (value == "" || value == 0 || value == null) {
        return "";
      } else {
        return value / 1000000 + "万元";
      }
    }
  },
  methods: {
    getData() {
        let url = process.env.SHOP_DATA_API+'/achievement/list';
        let urlNeed = process.env.SHOP_DATA_API+'/requirement/list';
      let param = {
        page: 1,
        pageSize: 6,
        pageFlag: 1
      };
      axios.post(url,param).then(res => {
        this.resultInfo = res.data.data.list;
      });
      let param1 = {
        page: 1,
        pageSize: 9,
        pageFlag: 1
      };
      axios.post(urlNeed,param1).then(res => {
        this.requireInfo = res.data.data.list;
      });
    },
    toResult(item,index){
      window.open(this.shopUrl+'/result/:detail?achievementNo='+item.achievementNo,'_self');  
    },
    toNeed(val,index){
      window.open(this.shopUrl+'/need/:detail?requirementNo='+val.requirementNo,'_self');  
    },
  },
  mounted() {
    this.getData();
    // this.flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
  }
};
</script>
<style lang="stylus" scoped>
.tech-wrapper {
  width: 1200px;
  margin: 0 auto;
}

.tech-wrapper .tech-con {
  width: 100%;
  display: flex;
  position: relative;
  margin: 30px 0;

  .tech-type:last-child {
    margin-right: 0;
  }

  #jszy .tech-title h2 {
    color: #FFFFFFFF;
  }

  #jsNeed .tech-title h2 {
    color: #FFFFFFFF;
  }

  .jsNeed, .need-budget span {
    display: inline-block;
    width: 134px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tech-type {
    width: 49%;
    padding-bottom: 30px;
    margin-right: 2%;
    background: #fff;    
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);

    .tech-title {
      background: #4A9DF1FF;
      display: flex;
      padding: 20px 0;
      padding-left: 20px;
      align-items: center;
    }

    .tech-title h2 {
      font-size: 18px;
      font-weight: bold;
    }

    .tech-title p {
      font-size: 16px;
      margin-left: 30px;
      color: #FFFFFFFF;
    }

    .tech-list {
      margin: 0 15px;
      margin-right: 15px;
    }

    .tech-list ul {
      width: 100%;
      display: inline-block;
      padding-left:0

      .item-last {
        margin-right: 0 !important;
      }

      .tech-item:hover {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
      }

      .tech-item {
        width: 32%;
        float: left;
        overflow: hidden;
        margin-top: 36px;
        margin-right: 2%;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;

        .item-img {
          width: 100%;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;

          .item-play {
            position: absolute;
            left: 50%;
            top: 12%;
            transform: translateX(-50%);
          }
        }        
        .item-img img {
          width: 100%;
          transition: all 1s;
        }

        .show_img {
          width: 178px;
          height: 82px;
        }

        .tec_result:hover .show_img {
          transform: scale(1.1);
        }

        .tec_result {
          transition: all 1s;
          height: 150px;
        }

        .item-title {
          margin-top: 12px;
          line-height: 18px;
          height: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
        }

        .jszy {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .jszy, .need-budget {
          display: flex;
          position: relative;
          margin: 6px 0;

          .jszy-type {
            color: $fontColor9;
            font-size: 12px;
          }
        }
      }
    }

    .jszy-price {
      position: absolute;
      right: 4px;
      font-weight: bold;
      color: #EE3D3DFF;
    }
  }

  .get {
    color: #fd651c;
    margin-top: 12px;
    font-size: 14px;
    font-weight: bold;
  }

  .need-budget {
    font-weight: bold;
    color: $fontColor3;
  }

  .need-key {
    color: $fontColor9;
    margin-top: 0px;

    .key-word {
      color: $mainColor !important;
    }
  }
}
</style>
<style>
.need-item {
    background: #fff;
    padding: 14px 3px 14px 5px; 
    margin-bottom: -25px;
    border: 1px solid #EEEEEE
}
.head_title {
    font-size: 26px;
    width: 108px;
    padding-top: 30px;
    margin: 0 auto;
    color: #373d40;
}
.title_line {
    width: 48px;
    height: 3px;
    background: #36a6fe;
    margin: 5px auto;
}
</style>