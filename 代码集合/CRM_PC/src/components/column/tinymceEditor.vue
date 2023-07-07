<template>
  <div class="tinymce-editor">
    <editor v-model="myValue"
      :init="init"
      id="tinymce"
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
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/autoresize'
import '@/static/tinymce/plugins/lineheight'
import '@/static/tinymce/plugins/ax_wordlimit'
import '@/components/tinymce/plugins/wordcountdisplay'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/icons/default/icons'
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
        media_live_embeds:true,
        ax_wordlimit_num: 10000,
        lineheight_formats: '0 1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2 2.1 2.2 2.3 2.4 2.5',
        fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 30pt 32pt 36pt",
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: true,
        plugins:"ax_wordlimit wordcountdisplay fullscreen image link lineheight table colorpicker textcolor code media",
        ax_wordlimit_callback:(editor,txt,num)=>{
          if(txt.length>num){
            this.$message({message:'当前字数：' + txt.length + '，限制字数：' + num,type: 'warning'});
            this.$emit('limit',false); //字数达到上限限制
          }else{
            this.$emit('limit',true);
          }
        },
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        // images_upload_handler: (blobInfo, success, failure) => {
        //   const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        //   success(img)
        // },
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
    }

  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('getEditorValue', newValue);
    }
  }
}

</script>
<style scoped>
</style>