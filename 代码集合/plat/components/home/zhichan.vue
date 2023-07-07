<template>
  <div class="zhipage">
    <div class="chipage">
      <span class="tia">企业服务</span>
      <span class="tib">/ 一站式服务 满足企业所有需求</span>
      <!-- @click="go(item.url)" -->
      <span style="float: right"
        >
        <span
          class="everyitem"
          v-for="(item, index) in allservice"
          :key="index"
          @click="getAllservice(item.id,item.categoryName)"
          >{{ item.categoryName }}</span
        >
        </span
      >
    </div>
    <!-- 项目申报  知识产权 -->
    <div class="one">
      <div class="zhuan">
        <div class="left" @click="moreview(1)">
          <p class="lalala">项目申报</p>
          <div class="hengxian"></div>
          <p class="yiyiyi">优质申报服务</p>
          <p class="yiyiyi">企业诊断快狠准，评</p>
          <p class="yiyiyi">优质申报服务</p>
        </div>
        <div class="right">
          <template v-if="xiangmu.length <= 4">
            <div v-for="item in xiangmu" :key="item.id" class="item">
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 1)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
            </div>
            <div class="nodata" v-if="xiangmu.length <= 2">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
            <div class="newnodata" v-if="xiangmu.length == 3">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in xiangmu.slice(0, 2)"
              :key="item.id"
              class="item"
            >
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 1)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="rest">
              <div class="moretit" @click="moreview(1)">更多服务</div>
              <div class="morechanping">
                <span
                  class="motit"
                  v-for="element in xiangmu.slice(2, 5)"
                  :key="element.id"
                  @click="goDetail(element, 1)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div class="morechanping" style="margin-top: 6px">
                <span
                  class="motit"
                  v-for="element in xiangmu.slice(5, 8)"
                  :key="element.id"
                  @click="goDetail(element, 1)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div
                class="askbtn"
                style="margin-top: 20px"
                @click.stop="showQia()"
              >
                立即咨询
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 知识产权 -->
      <div class="shang">
        <div class="left" @click="moreview(2)">
          <p class="lalala">知识产权</p>
          <div class="hengxian"></div>
          <p class="yiyiyi">专利申请、商标、版</p>
          <p class="yiyiyi">权登记、等知识产权</p>
          <p class="yiyiyi">保护及交易一站式服</p>
          <p class="yiyiyi">务。</p>
        </div>
        <div class="right">
          <template v-if="zhichan.length <= 4">
            <div v-for="item in zhichan" :key="item.id" class="item">
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 2)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
              <!-- <div class="pricebtn" v-if="!item.nowFee">面议</div>
              <div class="pricebtn" v-else>
                <span>¥</span
                ><span style="margin-left: 5px">{{
                  Number(item.nowFee) / 100
                }}</span>
              </div> -->
            </div>
            <div class="nodata" v-if="zhichan.length <= 2">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
            <div class="newnodata" v-if="zhichan.length == 3">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in zhichan.slice(0, 2)"
              :key="item.id"
              class="item"
            >
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 2)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="rest">
              <div class="moretit" @click="moreview(2)">更多服务</div>
              <div class="morechanping">
                <span
                  class="motit"
                  v-for="element in zhichan.slice(2, 5)"
                  :key="element.id"
                  @click="goDetail(element, 2)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div class="morechanping" style="margin-top: 6px">
                <span
                  class="motit"
                  v-for="element in zhichan.slice(5, 8)"
                  :key="element.id"
                  @click="goDetail(element, 2)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div
                class="askbtn"
                style="margin-top: 20px"
                @click.stop="showQia()"
              >
                立即咨询
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 工商注册  财税服务 -->
    <div class="two">
      <div class="banquan">
        <div class="left" @click="moreview(3)">
          <p class="lalala">工商财税</p>
          <div class="hengxian"></div>
          <p class="yiyiyi">提供公司注册、代理</p>
          <p class="yiyiyi">记账、工商变更、金</p>
          <p class="yiyiyi">融信息等工商财税相</p>
          <p class="yiyiyi">关服务。</p>
        </div>
        <div class="right">
          <template v-if="gongshang.length <= 4">
            <div
              v-for="item in gongshang.slice(0, 4)"
              :key="item.id"
              class="item"
            >
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 3)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="nodata" v-if="gongshang.length <= 2">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
            <div class="newnodata" v-if="gongshang.length == 3">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in gongshang.slice(0, 2)"
              :key="item.id"
              class="item"
            >
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 3)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="rest">
              <div class="moretit" @click="moreview(3)">更多服务</div>
              <div class="morechanping">
                <span
                  class="motit"
                  v-for="element in gongshang.slice(2, 5)"
                  :key="element.id"
                  @click="goDetail(element, 3)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div class="morechanping" style="margin-top: 6px">
                <span
                  class="motit"
                  v-for="element in gongshang.slice(5, 8)"
                  :key="element.id"
                  @click="goDetail(element, 3)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div
                class="askbtn"
                style="margin-top: 20px"
                @click.stop="showQia()"
              >
                立即咨询
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 软件开发 -->
      <div class="qita">
        <div class="left" @click="moreview(4)">
          <p class="lalala">软件开发</p>
          <div class="hengxian"></div>
          <p class="yiyiyi">针对各行业，不同规模</p>
          <p class="yiyiyi">不同阶段的企业提供</p>
          <p class="yiyiyi">专业产品解决方案</p>
        </div>
        <div class="right">
          <template v-if="ruanjian.length <= 4">
            <div v-for="item in ruanjian" :key="item.id" class="item">
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 4)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="nodata" v-if="ruanjian.length <= 2">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
            <div class="newnodata" v-if="ruanjian.length == 3">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in ruanjian.slice(0, 2)"
              :key="item.id"
              class="item"
            >
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 4)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="rest">
              <div class="moretit" @click="moreview(4)">更多服务</div>
              <div class="morechanping">
                <span
                  class="motit"
                  v-for="element in ruanjian.slice(2, 5)"
                  :key="element.id"
                  @click="goDetail(element, 4)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div class="morechanping" style="margin-top: 6px">
                <span
                  class="motit"
                  v-for="element in ruanjian.slice(5, 8)"
                  :key="element.id"
                  @click="goDetail(element, 4)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div
                class="askbtn"
                style="margin-top: 20px"
                @click.stop="showQia()"
              >
                立即咨询
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 法律服务  融资上市 -->
    <div class="three">
      <div class="falv">
        <div class="left" @click="moreview(5)">
          <p class="lalala">法律服务</p>
          <div class="hengxian"></div>
          <p class="yiyiyi">优质法律服务</p>
          <p class="yiyiyi">任选平台提供保障</p>
        </div>
        <div class="right">
          <template v-if="falv.length <= 4">
            <div v-for="item in falv" :key="item.id" class="item">
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 5)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="nodata" v-if="falv.length <= 2">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
            <div class="newnodata" v-if="falv.length == 3">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
          </template>
          <template v-else>
            <div v-for="item in falv.slice(0, 2)" :key="item.id" class="item">
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 5)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="rest">
              <div class="moretit" @click="moreview(5)">更多服务</div>
              <div class="morechanping">
                <span
                  class="motit"
                  v-for="element in falv.slice(2, 5)"
                  :key="element.id"
                  @click="goDetail(element, 5)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div class="morechanping" style="margin-top: 6px">
                <span
                  class="motit"
                  v-for="element in falv.slice(5, 8)"
                  :key="element.id"
                  @click="goDetail(element, 5)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div
                class="askbtn"
                style="margin-top: 20px"
                @click.stop="showQia()"
              >
                立即咨询
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- 融资上市 -->
      <div class="rongzi">
        <div class="left" @click="moreview(6)">
          <p class="lalala">融资上市</p>
          <div class="hengxian"></div>
          <p class="yiyiyi">优质融资上市服务</p>
          <p class="yiyiyi">风险小</p>
        </div>
        <div class="right">
          <template v-if="rongzi.length <= 4">
            <div v-for="item in rongzi" :key="item.id" class="item">
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 6)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="nodata" v-if="rongzi.length <= 2">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
            <div class="newnodata" v-if="rongzi.length == 3">
              <p class="quanyiword">敬请期待</p>
              <p><span class="ping">权益在手，品牌升级无忧</span></p>
            </div>
          </template>
          <template v-else>
            <div v-for="item in rongzi.slice(0, 2)" :key="item.id" class="item">
              <div style="display: flex">
                <div class="des" @click="goDetail(item, 6)">
                  <p class="title">{{ item.spuTitle }}</p>
                  <p class="content">{{ item.spuSlogan }}</p>
                </div>
              </div>
              <div
                class="pricebtn"
                v-if="item.spuMinAmount && item.isOnline == true"
              >
                <span v-if="item.spuMaxAmount==item.spuMinAmount" class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}</span>
                <span v-else class="price"><span class="priceIcon">¥</span>{{item.spuMinAmount | filterViewprice}}<span class="earn">/起</span></span>
              </div>
              <div v-else class="nowchat pricebtn">面议</div>
            </div>
            <div class="rest">
              <div class="moretit" @click="moreview(6)">更多服务</div>
              <div class="morechanping">
                <span
                  class="motit"
                  v-for="element in rongzi.slice(2, 5)"
                  :key="element.id"
                  @click="goDetail(element, 6)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div class="morechanping" style="margin-top: 6px">
                <span
                  class="motit"
                  v-for="element in rongzi.slice(5, 8)"
                  :key="element.id"
                  @click="goDetail(element, 6)"
                  >{{ element.spuTitle | filtername }}</span
                >
              </div>
              <div
                class="askbtn"
                style="margin-top: 20px"
                @click.stop="showQia()"
              >
                立即咨询
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductList } from "@/api/productdetails";
import { getNewProject, getProduct } from "@/api/home";
import Banner from "@/components/policy/banner";
import tools from '@/utils/priceDeal' 
export default {
  components: {
    Banner,
  },
  data() {
    return {
      id: null,
      sfurl: process.env.SOFTWARE_URL,
      allservice: [],
      imgPath: process.env.CDN_BASE_URL,
      xiangmu: [],
      zhichan: [],
      gongshang: [],
      ruanjian: [],
      falv: [],
      rongzi: [],
      isZC: process.env.PROPERTY_URL,
    };
  },
  filters: {
    filtername(val) {
      if (val && val.length <= 6) {
        return val + ">";
      } else {
        return val.substring(0, 6) + "..." + ">";
      }
    },
    filterPrice(val) {
      return Number(val) / 100;
    },
    filterViewprice(val){
        return tools.filterViewprice(val)
    }
  },
  computed: {
    areaNo() {
      if (this.$store.state.Set_LocationNo !== null) {
        return this.$store.state.Set_LocationNo;
      } else {
        return 100001;
      }
    },
  },
  watch: {
    areaNo(val) {
      if (val !== null) {
        setTimeout(() => {
          this.getData(val);
        }, 500);
      } else {
        setTimeout(() => {
          this.getData(100000);
        }, 500);
      }
    },
  },
  mounted() {
    if (this.$store.state.Set_LocationNo) {
      setTimeout(() => {
        this.getData(this.$store.state.Set_LocationNo);
      }, 500);
    } else {
      setTimeout(() => {
        this.getData(100000);
      }, 500);
    }
    this.getChanping();
  },
  methods: {
    getData(positionNo) {
      if (typeof positionNo == "number") {
        var area = toString(positionNo);
      } else if (typeof positionNo == "string") {
        var area = positionNo;
      }
      let param = {
        parentId: 0,
        type: 4,
        areaNo: area,
        categories: [{ id: 2, name: "归口", optionIds: [] }],
        start: 1,
        size: 25,
        isNewest: false,
        isHotSpot: false,
      };
      getNewProject(param)
        .then((res) => {
          if (res.data) {
            // this.xiangmu = res.data.data.records.slice(0,8);
            this.allservice = res.data.data;
          }
        })
        .catch((err) => {
          return err;
        });
    },
    getChanping() {
      let param1 = {
        categoryId: 1,
        generateAttributeList: [],
        pageNo: 1,
        pageSize: 8,
      };
      getProductList(param1).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.xiangmu = res.data.data.records.slice(0, 8);
        }
      });
      let param2 = {
        categoryId: 2,
        generateAttributeList: [],
        pageNo: 1,
        pageSize: 8,
      };
      getProductList(param2).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.zhichan = res.data.data.records;
        }
      });
      let param7 = {
        categoryId: 7,
        generateAttributeList: [],
        pageNo: 1,
        pageSize: 8,
      };
      getProductList(param7).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.gongshang = res.data.data.records;
        }
      });
      let param11 = {
        categoryId: 11,
        generateAttributeList: [],
        pageNo: 1,
        pageSize: 8,
      };
      getProductList(param11).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.ruanjian = res.data.data.records;
        }
      });
      let param9 = {
        categoryId: 9,
        generateAttributeList: [],
        pageNo: 1,
        pageSize: 8,
      };
      getProductList(param9).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.rongzi = res.data.data.records;
        }
      });
      let param10 = {
        categoryId: 10,
        generateAttributeList: [],
        pageNo: 1,
        pageSize: 8,
      };
      getProductList(param10).then((res) => {
        let data = res.data.data.records;
        if (data.length > 0) {
          this.falv= res.data.data.records;
        }
      });
    },
    moreview(type) {
      if (type == 1) {
        window.open("/project");
      } else if (type == 2) {
        window.open(this.isZC);
      } else if (type == 3) {
        window.open("/businessTax");
      } else if (type == 4) {
        window.open(process.env.SOFTWARE_URL);
      } else if (type == 5) {
        window.open("/legalService");
      } else if (type == 6) {
        window.open("/financingListing");
      }
    },
    getAllservice(id,name) {
      if (name == '工商财税') window.open("/businessTax");
      if (id == 1) {
        window.open("/project");
      } else if (id == 2) {
        window.open(this.isZC);
      } else if (id == 7) {
        window.open("/businessTax");
      } else if (id == 8) {
        window.open("/fiscalTax");
      } else if (id == 9) {
        window.open("/financingListing");
      } else if (id == 10) {
        window.open("/legalService");
      } else if (id == 11) {
        window.open(process.env.SOFTWARE_URL);
      }
    },
    // 详情
    goDetail(item) {
      window.open(`/productdetails/details?spuId=${item.id}`);
    },
    showQia() {
      window.open(
        "https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2",
        "",
        "height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no"
      );
    },
  },
};
</script>

<style lang="stylus" scoped>
@import './zhichan.styl';
</style>
