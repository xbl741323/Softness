<template>
  <div class="pay"></div>
</template>

<script>
import { getPayRes } from "@/api/wxOpen";
export default {
  data() {
    return {
      value: "",
      orderNo: "",
    };
  },
  methods: {
    trans(val) {
      let result = "";
      result = val.replace(/\\n/g, "").replace(/\\/g, "");
      return result;
    },
    getData() {
      getPayRes(this.orderNo).then((res) => {
        if (res.code == 0) {
          let body = res.data;
          document.querySelector("html").innerHTML = this.trans(body);
          document.forms[0].submit();
        }
      });
    },
  },
  created() {
    if (this.$route.query.orderNo) {
      this.orderNo = this.$route.query.orderNo;
    }
  },
  mounted() {
    this.getData();
  },
};
</script>