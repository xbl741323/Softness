<template>
  <div class="tinymce-editor">
    <editor v-model="myValue"
      :init="init"
      ref="ddf"
      :disabled="disabled"
      @onClick="onClick">
    </editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/icons/default/icons.min.js'
import 'tinymce/themes/silver/theme' 
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/table'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/autoresize'
import '@/static/tinymce/plugins/media'
import '@/static/tinymce/plugins/lineheight'
import '@/static/tinymce/plugins/ax_wordlimit'
import '@/components/tinymce/plugins/wordcountdisplay'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/icons/default/icons'
import { uploadMedia } from "@/api/project/project"
export default {
  components: {
    Editor
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image link media table textcolor lineheight ax_wordlimit fullscreen wordcount contextmenu'
      // 加上autoresize可自适应高度
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo font |  formatselect fontselect fontsizeselect forecolor | bold italic link underline  lineheight  pastetext | alignleft aligncenter autoresize alignright alignjustify table | bullist numlist outdent indent | lists image media | removeformat unlink fullscreen'
    }
  },
  data() {
    return {
      images_upload_base_path:process.env.NODE_ENV == "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
      //初始化配置
      init: {
        selector: 'textarea',
        language_url: 'tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: 'tinymce/skins/ui/oxide',
        images_upload_url: '/wtcrm/file/returnUrl',
        images_upload_base_path:process.env.NODE_ENV == "production"?"//static.wotao.com/":"//static-tst.wotao.com/",
        font_formats:" 宋体=simsun,serif;仿宋体=FangSong,serif;黑体='黑体';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        height: 500,
        ax_wordlimit_num: 30000,
        lineheight_formats: '0 1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2 2.1 2.2 2.3 2.4 2.5',
        fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 30pt 32pt 36pt",
        plugins: this.plugins,
        media_live_embeds:true,
        toolbar: this.toolbar,
        branding: false,
        menubar: true,
        file_picker_callback:'media',
        plugins:"ax_wordlimit wordcountdisplay fullscreen image link lineheight table colorpicker textcolor code media",
        ax_wordlimit_callback:(editor,txt,num)=>{
          if(txt.length>num){
            this.$message({message:'当前字数：' + txt.length + '，限制字数：' + num,type: 'warning'});
            this.$emit('limit',false); //字数达到上限限制
          }else{
            this.$emit('limit',true);
          }
        },
        // 本地上传视频
        file_picker_callback:function (callback, value, meta) {
          console.log(meta,"metametametametametametametametametameta")
          console.log(value,"valuevaluevaluevaluevalue")
          if(meta.filetype == 'media'){  
           let input = document.createElement('input');//创建一个隐藏的input
           input.setAttribute('type', 'file');
           input.setAttribute('accept', 'video/*');
           input.onchange = function(){
             let file = this.files[0];//选取第一个文件
             console.log(file,"file")
              if(file.size/1024 <= 100*1024){
              let formData = new FormData()
              formData.append('file',file)
              uploadMedia(formData).then(res=>{
               if(res.data.code == 0){
                 callback(res.data.data) 
               }
             })
              }else{
                alert("上传单个视频的大小不得超过100M！")
              }
           }
           //触发点击
           input.click();
         }
        },
        media_url_resolver:(data,resolve)=>{
          console.log(data,"ssssssssssssssssssssss")
          try {
           let mediaUrl = this.images_upload_base_path+data.url
           let embedHtml = 
           `<p>
               <span class="mce-preview-object mce-object-video" 
               contenteditable="false" 
               data-mce-object="video" 
               data-mce-p-controls="controls"
               data-mce-p-allowfullscreen="allowfullscreen" 
               data-mce-p-frameborder="no" 
               data-mce-p-scrolling="no" 
               data-mce-p-src=${mediaUrl} data-mce-html="%20">
                 <video src=${mediaUrl} width="300" height="150" controls="controls"></video>
               </span>
             </p>`
            resolve({ html: embedHtml });
          } catch (e) {
            resolve({ html: "" });
          }
        }
        },
          myValue: this.value,
    }
  },
  mounted() {
    tinymce.init({});
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    },
    uploadImg(file){
       
    } 

  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('getEditorValue', newValue, this.id);
    }
  }
}

</script>
<style scoped>
</style>