<template>
  <div class="personal-order" v-if="permissions.bt_dsx_page">
    <div class="mt">
      <span class="order-type">订单类型：</span>
      <el-radio-group v-model="payStatus" @change="changeType" class="order-sty">
        <el-radio-button
          class="radio-sty-init"
          :class="{ 'radio-sty-left': index > 0 }"
          v-for="(item, index) in orderTypeList"
          :key="item.value"
          :label="item.value"
          size="mini">{{ item.label }}</el-radio-button>
      </el-radio-group>
    </div>
    <init-order-list :portType="'dsx'" :orderType="payStatus" :source="1" @reset="reset"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InitOrderList from "@/components/order/init-orderList";
export default {
  components: {
    InitOrderList,
  },
  data() {
    return {
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
  created(){
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      this.payStatus = keepParams.page.orderType
    }
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    // 订单类型（全部,项目，知产）
    changeType(val) {
      this.payStatus = val;
    },
    // 订单来源(线上1/线下0)
    changeSource(val) {
      this.whichSource = val;
    },
    reset(val){
      if(val){
        this.payStatus = null;
      }
    }
  },
};
</script>

<style scoped>
.personal-order {
  background: #fff;
  padding: 10px;
  font-size: 14px;
}
.radio-sty-init {
  margin-right: 20px;
}
.radio-sty-left {
  border-left: 1px solid #dcdfe6;
}
.order-type {
  color: #606266;
  margin-left: 10px;
  margin-right: 8px;
}
.order-sty {
  margin-left: -8px;
}
.mt {
  margin-top: 17px;
}
.ml {
  margin-left: 12px;
}
</style>