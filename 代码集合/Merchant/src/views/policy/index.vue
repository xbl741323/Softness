<template>
  <div class="contain">
    <div v-for="(item) in dataInfo.dataList" :key="item.id">{{ item.title }}</div>
    <div v-for="(item) in dataList" :key="item.id">{{ item.title }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getListColumn } from '@/api/index'

interface info {
  id: number,
  title: string
}
interface dataInfoFace {
  title: string, dataList: info[]
}

const dataList = ref<info[]>([])
const dataInfo = reactive<dataInfoFace>({
  title: '',
  dataList: []
})

const getList = () => {
  let params = {
    substationId: 20
  }
  getListColumn(params).then((res: any) => {
    if (res.code == 0) {
      dataList.value = res.data
      dataInfo.dataList = res.data
    }
  })
}

onMounted(() => {
  getList()
  console.log(import.meta.env,'import.meta.env.')
})

</script>

<style scoped>
.contain {
  padding: 10px;
}

.policy-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
  padding: 5px 0;
}

.policy-item>span:nth-of-type(1) {
  font-size: 14px;
  font-weight: bold;
}

.policy-item>span:nth-of-type(2) {
  font-size: 14px;
}
</style>