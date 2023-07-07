<template>
    <div>
        <div ref="editor" style="text-align:left"></div>
        <button v-on:click="getContent">查看内容</button>
        <!-- https://blog.csdn.net/xiaobinbin2372/article/details/103948503 -->
    </div>
</template>

<script>
    import E from 'wangeditor'
    export default {
      name: 'editor',
      props: {
        content: {
            type: String
        }
      }, 
      data () {
        return {
          wEditor: '',
          editorContent: ''
        }
      },
      methods: {
        getContent() {
            return this.wEditor.txt.html()
            console.log(this.editorContent)
        }
      },
      mounted() {
        this.wEditor = new E(this.$refs.editor)
        this.wEditor.customConfig.onchange = (html) => {
          this.editorContent = html
        };
        this.wEditor.customConfig.uploadImgShowBase64 = true; 
        this.wEditor.customConfig.pasteTextHandle = (content) => { //支持粘贴
            return content
        }
        editor.create()
      },
       // 用来回显内容（监控父组件中content变化）
      watch:{
        content:function (newVal,oldVal) {
            this.wEditor.txt.html(newVal)
        }
      },
    }
</script>

<style scoped>
</style>
