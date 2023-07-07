<template>
<!-- 知识产权 -->
  <div>
    <task-list :orderType="orderType" v-if="orderType"></task-list>
  </div>
</template>

<script>
import taskList from '@/components/task/task-list'
export default {
  components:{
    taskList
  },
  data(){
    return{
      orderType: 2
    }
  }
}
</script>

<style>

</style>