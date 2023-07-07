<template>
<!-- 排查完成 -->
  <div class="product-main">
    <div class="product-edit">
      <!-- tab切换区域 -->
      <div class="tab-change">
        <span
          @click="showTag(index)"
          :class="['tab-name', item.status == true ? 'name-color' : '']"
          v-for="(item, index) in dataList"
          :key="index">
					{{ item.tagName }}
				</span>
      </div>
      <!-- 内容区域 -->
      <div class="edit-content">
				<basic-Info ref="basic" :type="0" v-if="showIndex == 0"></basic-Info>
        <detail v-if="showIndex == 1"></detail>
        <opearte-records :productInfo="productInfo" v-if="showIndex == 2"></opearte-records>
			</div>
    </div>
  </div>
</template>
<script>
import basicInfo from "@/components/project/common-service/basic-info";
import detail from "@/components/project/common-service/detail";
import opearteRecords from "@/components/project/common-service/operate-records";
export default {
  components: { basicInfo, detail, opearteRecords },
  data() {
    return {
      productInfo: {},
      showIndex: 0,
      tinyList: [],
      dataList: [
        {
          tagName: this.$t("message.basicInfo"),
          status: true,
        },
        {
          tagName: this.$t("message.detailContent"),
          status: false,
        },
        {
          tagName: this.$t("message.operateRecords"),
          status: false,
        },
      ],
    };
  },
  methods: {
    showTag(index) {
      this.showIndex = index;
      this.dataList.forEach((item) => {
        item.status = false;
      });
      this.dataList[index].status = true;
    },
  }
};
</script>
<style scoped>
.product-main {
  width: 100%;
  background: #ffffff;
  margin-left: 10px;
  padding: 30px 20px;
}
.product-edit {
  width: 80%;
  margin-left: 5%;
}

.tab-change {
  border-bottom: 1px solid rgb(204, 204, 204);
  height: 47px;
}
.tab-name {
  display: inline-block;
  padding: 0 40px;
  line-height: 45px;
  font-size: 16px;
  cursor: pointer;
}
.name-color {
  color: rgb(16, 142, 233);
  border-bottom: 2px solid rgb(16, 142, 233);
}
.tab-content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  margin-top: 80px;
}
.edit-content {
  margin-left: 0px;
  margin-top: 30px;
}
</style>
