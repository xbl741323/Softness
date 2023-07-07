<template>
  <div class="personal-order">
    <div class="ml">
      <el-tabs v-model="whichSource">
        <el-tab-pane label="线上订单" name="1"></el-tab-pane>
        <!-- <el-tab-pane label="线下订单" name="0"></el-tab-pane> -->
      </el-tabs>
    </div>
    <order-list :portType="'zc'" :source="'list'" :orderType="2"  :showfilterproperty='true' :orderSource="whichSource"  @changeSource="changeSource"  />
  </div>
</template>

<script>
import orderList from '@/components/order/order-list.vue'
export default{
  components: { 
    orderList 
  },
  data(){
    return {
      whichSource:'1'
    }
  },
  methods:{
    changeSource(val){
        this.whichSource = val
    }
  }

}
</script>

<style scoped>
.personal-order{
  background: #FFF;
  padding: 10px;
  font-size: 14px;
}
.ml{
    margin-left: 12px;
}
</style>