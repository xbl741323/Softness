<template>
  <div class="container">
    <div>
      <logo />
      <div>
        <nuxt-link to="/">首页</nuxt-link>
      </div>
      <h1 class="title">
        卧涛-专注企业服务
      </h1>
      <h2 class="subtitle">
        UserNone
      </h2>
       <ul>
        <li v-for="todo in todos" :key="todo.text">
          <input :checked="todo.done" @change="toggle(todo)" type="checkbox">
          <span :class="{ done: todo.done }">{{ todo.text }}</span>
        </li>
        <li><input @keyup.enter="addTodo" placeholder="What needs to be done?"></li>
      </ul>
      
      <div><button v-on:click="getSessionData()" style="width:100px;height:50px;margin-top:10px;">GET-DATA</button></div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  components: {
    Logo
  },
  computed:{
    todos (){
      return this.$store.state.todos.list
    }
  },
  methods: {
    addTodo (e) {
      this.$store.commit('todos/add', e.target.value)
      e.target.value = ''
    },
    ...mapMutations({
      toggle: 'todos/toggle'
    }),
    getSessionData(){
      this.$axios.get('//nuxt-api.leaplearner.com/api/two',{withCredentials:true}).then(res=>{
        console.log("res:"+res.data.data);
      });
    }
  }
}
</script>

<style>
.done {
  text-decoration: line-through;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
