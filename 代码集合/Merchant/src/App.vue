<template>
  <Head v-if="router.currentRoute.value.name == 'policyDetail'" :title="title"></Head>
  <RouterView />
  <tab-bar @changeTitle="changeHeadTitle" ref="tabBar"></tab-bar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import Head from '@/components/common/head.vue'
import TabBar from '@/components/common/tab-bar.vue'
const title = ref('首页')
const tabBar = ref<InstanceType<typeof TabBar>>()
const changeHeadTitle = (val: string) => {
  title.value = val
  console.log(tabBar.value?.activeIndex, '子组件暴露的activeIndex')
  tabBar.value?.open()
}
const router = useRouter()
watch(() => router.currentRoute.value, (newVal, oldVal) => {
  console.log(newVal, 'newVal输出当前路由');
})
</script>

<style scoped></style>
