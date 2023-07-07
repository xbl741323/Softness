<template>
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
        <classBasic ref="basic" :pageFrom="0" v-if="showIndex == 0" :permissions="permissions"></classBasic>
        <classCatalogue :classId="classId" :pageFrom="0" v-if="showIndex == 1" :feeType="feeType" :permissions="permissions"></classCatalogue>
        <classContent :classId="classId" :pageFrom="0" v-if="showIndex == 2" :permissions="permissions"></classContent>
        <opearte-record :productInfo="productInfo" v-if="showIndex == 3"></opearte-record>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import classBasic from "@/components/project/wt-classroom/class-basic";
import classContent from "@/components/project/wt-classroom/class-content";
import opearteRecord from "@/components/project/wt-classroom/operate-record";
import classCatalogue from "@/components/project/wt-classroom/class-catalogue";
export default {
  components: { classBasic, classContent, opearteRecord, classCatalogue },
  data() {
    return {
      classId: "",
      feeType: "",
      productInfo: {},
      showIndex: 0,
      tinyList: [],
      dataList: [
        {
          tagName: "基本信息",
          status: true,
        },
        {
          tagName: "课程目录",
          status: false,
        },
        {
          tagName: "课程介绍",
          status: false,
        },
        {
          tagName: "操作记录",
          status: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  created() {
    if (this.$route.query.classId) {
      this.classId = this.$route.query.classId;
    }
    if (this.$route.query.feeType) {
      this.feeType = this.$route.query.feeType;
    }
  },
  methods: {
    showTag(index) {
      this.showIndex = index;
      this.dataList.forEach((item) => {
        item.status = false;
      });
      this.dataList[index].status = true;
    },
  },
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
