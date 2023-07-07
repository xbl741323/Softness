<template>
  <div class="order_personal">
    <p class="order_title">我的订单</p>
    <div class="tabs">
        <div :class="type == 0 ? 'select' : 'tab-item'" @click="changeSelect(0)">服务产品</div>
        <div :class="type == 1 ? 'select' : 'tab-item'" @click="changeSelect(1)">卧涛文档</div>
    </div>
    <div>
        <productOrder v-if="type == 0" />
        <fileOrder v-if="type == 1" />
    </div>
  </div>
</template>

<script>
import productOrder from './productOrder/index.vue'
import fileOrder from './fileOrder/index.vue'
export default {
    components: {
        productOrder,
        fileOrder
    },
    head() {
        return {
            title: "我的订单",
            meta: [
                { name: "keywords", content: "我的订单" },
                {
                    hid: "description",
                    name: "description",
                    content: "我的订单",
                },
            ],
        };
    },
    data() {
        return {
            type: null,
        };
    },
    mounted() {
        if (sessionStorage.getItem('orderType')) {
            this.type = sessionStorage.getItem('orderType')
        } else {
            this.type = 0
        }
    },
    methods: {
        changeSelect(val) {
            this.type = val
            sessionStorage.setItem('orderType', val)
        }
    }
};
</script>

<style scoped>
.order_personal{
    background: #FFFFFF;
    width: 960px;
    min-height: 600px;
    margin-bottom: 0;
}
.order_title {
    font-size: 18px;
    font-weight: 550;
    line-height: 55px;
    padding-left: 30px;
    border-bottom: 1px #E0F2FB solid;
}
.tabs{
    display: flex;
    width: 100%;
    background: #f3fbfe;
    height: 38px;
    border-radius: 6px 6px 0px 0px;
    font-size: 14px;
}
.select{
    width: 150px;
    height: 38px;
    background: #36a6fe;
    text-align: center;
    color: #fff;
    line-height: 38px;
    cursor: pointer;
}
.tab-item{
    width: 150px;
    height: 38px;
    text-align: center;
    color: #666;
    line-height: 38px;
    cursor: pointer;
}
</style>