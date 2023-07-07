import { getChangePriceList } from "@/api/order/index";
import { getOrderTaskStatus } from "@/api/receive/receive"
export const priceMixin = {
  data() {
    return {
      priceObject: {},
      changepriceDialog: false,
      hasFinalprice: false,
      finalPriceTypeNum: 0
    }
  },
  methods: {
    EditPrice(id) {
      getOrderTaskStatus(id).then(res => {
        if (res.data.code == -1) {
          this.$message({
            type: 'warning',
            message: '该订单有待审核的开启任务流程，无法改价！',
            offset: 300
          })
        }else{
          this.openEditPrice(id)
        }
      })
    },
    openEditPrice(id) {
      this.finalPriceTypeNum = 0;
      this.hasFinalprice = false;
      getChangePriceList({ id }).then(res => {
        if (res.data.code == CodeMsg.CODE_1001) {
          return false
        } else if (res.data.code == CodeMsg.CODE_0) {
          this.priceObject = res.data.data;
          this.changepriceDialog = true
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      })
    },
    closeChangePriceDialog(val) {
      this.changepriceDialog = val
      this.$emit('closeChangePriceDialog', false);
      try {
        this.getAllList();
      } catch (error) {

      };
    },
  }
}