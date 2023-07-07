<template>
  <div class="head-contain">{{ props.title }}</div>
</template>

<script setup lang="ts">
// 方式1：运行时声明
const props = defineProps({
  title: { type: String, required: true },
})

// 方式2：基于类型的声明，使用泛型接收
// const props = defineProps<{
//   title: string
// }>()

// 当使用基于类型的声明时，我们失去了为 props 声明默认值的能力，这可以通过 withDefaults 编译器宏解决
// const props = withDefaults(defineProps<{
//   title: string
// }>(), {
//   title: '我是默认值',
// })
</script>

<style scoped>
.head-contain {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e7e6eb;
  font-size: 14px;
}
</style>