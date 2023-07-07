<template>
  <div class="pdf_frame">
    <pdf class="pdf" :src="src"></pdf>
  </div>
</template>

<script>
export default {
  components:{
    pdf: () => import('vue-pdf')
  },
  props:{
    pdfUrl:{
      type: String,
      required: true
    }
  },
  data () {
    return {
      numPages: 0,
      src: '',
      pdf: null,
      cdnUrl: process.env.CDN_BASE_URL
    }
  },
  created() {
    if(process.client) {
      this.pdfLoadTask()
    }
  },
  methods:{
    pdfLoadTask () {
      // this.src = Vue.prototype.pdf.createLoadingTask(this.cdnUrl+this.pdfUrl);
      this.src = this.cdnUrl+this.pdfUrl
    }
  }
}
</script>

<style lang="stylus" scoped>
.pdf_frame{
    position relative
    width 230px
    height 180px
    border 1px dashed #d9d9d9
    border-radius 6px;
    overflow hidden
    .pdf{
      width 56%
      margin 0 auto
    }
}
</style>