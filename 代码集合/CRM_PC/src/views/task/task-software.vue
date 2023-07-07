<template>
  <div>
    <!-- 软件开发 -->
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
      orderType: 11
    }
  }
}
</script>

<style>

</style>