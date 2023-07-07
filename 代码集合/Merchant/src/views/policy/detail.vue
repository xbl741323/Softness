<template>
  <div class="contain">
    <span>{{ $route.query.title }}</span>
    <span>{{ routerInfo.content }}</span>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

interface essayInte {
  title: string,
  content: string
}

const essayInfo = reactive<essayInte>({
  title: '',
  content: ''
})

const routerInfo = router.currentRoute.value.query
console.log(route.query,'route中的数据')

</script>

<style scoped>
.contain {
  padding: 10px 5px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}

.contain>span:nth-of-type(1) {
  text-align: center;
  margin-bottom: 20px;
}
</style>