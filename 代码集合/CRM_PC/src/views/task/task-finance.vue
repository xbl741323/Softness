<template>
<!-- 融资上市 -->
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
      orderType: 9
    }
  }
}
</script>

<style>

</style>