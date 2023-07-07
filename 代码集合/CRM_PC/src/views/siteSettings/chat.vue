<template>
  <div>
    <el-button @click="getExample()">发送</el-button>
  </div>
</template>

<script>
import axios from 'axios'
export default {

  methods:{
    getExample(){
      let param = {
        name: '张三',
        age: '21'
      }
      axios.post('//192.168.1.106:5000/api/example',param).then(res=>{
        console.log(res);
      })
    } 
  }
}
</script>

<style>

</style>