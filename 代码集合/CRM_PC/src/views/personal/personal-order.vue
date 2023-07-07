<!-- 排查完成 -->
<template>
  <div class="personal-order">
    <div class="ml">
      <el-tabs v-model="whichSource" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in permissionsList"
          :key="item.name"
          :label="item.label"
          :name="item.name"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="mt" v-if="whichSource == 1 || whichSource == 2">
      <span class="order-type">订单类型：</span>
      <el-radio-group v-model="payStatus" class="order-sty">
        <el-radio-button
          class="radio-sty-btn"
          :class="{ 'radio-sty-left': index > 0 }"
          v-for="(item, index) in orderTypeList"
          :key="item.value"
          :label="item.value"
          size="mini">
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <order-list
      v-if="whichSource == 1"
      :source="'personal'"
      :orderType="payStatus"
      @changeType="changeType"
      :orderSource="whichSource"
      @changeSource="changeSource"/>
    <init-order-list v-if="whichSource == 2" :source="0" :orderType="payStatus" />
    <course-list v-if="whichSource == 3" :source="'personal'"></course-list>
    <member-list v-if="whichSource == 4" :source="'personal'"></member-list>
    <document-list v-if="whichSource == 5" :isMine="true"></document-list>
  </div>
</template>
<script>
import OrderList from "@/components/order/order-list";
import InitOrderList from "@/components/order/init-orderList";
import courseList from "@/components/course/course-list.vue";
import memberList from "@/components/member/member-list.vue";
import documentList from "@/components/order/document-list";
import { mapGetters } from "vuex";
export default {
  components: {
    OrderList,
    InitOrderList,
    courseList,
    memberList,
    documentList
  },
  data() {
    return {
      permissionsList: [
        {
          name: "1",
          showStr: "bt_check_product_list_my",
          label: "产品订单",
        },{
          name: "3",
          showStr: "bt_check_list_courses_my",
          label: "课程订单",
        },{
          name: "4",
          showStr: "bt_check_list_courses_vip_my",
          label: "会员订单",
        },{
          name: "2",
          showStr: "bt_check_list_init_my",
          label: "待生效",
        },{
          name: "5",
          showStr: "bt_order_document_my",
          label: "文档订单",
        }
      ],
      orderTypeList: [
        { value: null, label: "全部" },
        { value: 1, label: "项目申报" },
        { value: 2, label: "知识产权" },
        { value: 7, label: "工商注册" },
        { value: 8, label: "财税服务" },
        { value: 9, label: "融资上市" },
        { value: 10, label: "法律服务" },
        { value: 11, label: "软件开发" },
      ],
      whichSource: "1",
      payStatus: null,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if (this.$route.query.whichSource) {
      this.whichSource = this.$route.query.whichSource;
    };
    let permissionsList = Object.keys(JSON.parse(sessionStorage.getItem('pigx-permissions')).content);
    this.permissionsList = this.permissionsList.filter(item=>{
      return permissionsList.some(el=>{
        return el == item.showStr
      })
    });
    this.setWhichSource();
    if(sessionStorage.getItem("myOrderType")){
      this.whichSource = sessionStorage.getItem("myOrderType").toString();
    };
  },
  methods: {
    setWhichSource() {
      if (this.permissions.bt_check_product_list_my) {
        return (this.whichSource = '1');
      }
      if (this.permissions.bt_check_list_courses_my) {
        return (this.whichSource = '3');
      }
      if (this.permissions.bt_check_list_courses_vip_my) {
        return (this.whichSource = '4');
      }
      if (this.permissions.bt_check_list_init_my) {
        return (this.whichSource = '2');
      }      
      if (this.permissions.bt_order_document_my) {
        return (this.whichSource = '5');
      }
    },
    handleClick(){
      sessionStorage.setItem("myOrderType", this.whichSource);
    },
    // 订单类型（全部,项目，知产）
    changeType(val) {
      this.payStatus = val;
    },
    // 订单来源(线上1/线下0)
    changeSource(val) {
      this.whichSource = val;
    },
  },
  beforeRouteEnter(to, from, next) {
    let paths = ['/orderonline-detail','/wt-course-detail','/wt-member-detail','/initorder-detail','/document-order-detail']
    if(!paths.includes(from.path)){
      sessionStorage.removeItem("myOrderType")
    }
    next()
  },
};
</script>

<style scoped>
.personal-order {
  background: #fff;
  padding: 10px;
  font-size: 14px;
}
.radio-sty-btn {
  margin-right: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.order-type {
  margin-left: 10px;
  color: #606266;
}
.order-sty {
  margin-left: 0px;
}
.mt {
  margin-top: 17px;
}
.ml {
  margin-left: 12px;
}
</style>
