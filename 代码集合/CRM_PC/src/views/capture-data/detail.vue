<template>
  <div >
      <div class="capture_detail">
        <p v-html="content"></p>
      </div>
  </div>
</template>

<script>
import { getCaptureDetail } from '@/api/capture-data/index'
export default {
    data(){
        return {
            id:'',
            content:''
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.getDetail();
    },
    methods:{
        getDetail(){
            let param = {
                id: this.id
            }
            getCaptureDetail(param).then(res=>{
                this.content = res.data.data.content;
                // 文件前缀处理
                var c = this.content.replace(/\/group5/g,'http://kjt.ah.gov.cn/group5')
                this.content = c;
                var d = this.content.replace(/\/oldfiles/g,'http://kjt.ah.gov.cn/oldfiles');
                this.content = d;
                // var b = this.content.match(/<a.+?href=\"(.+?)\".*>/g);

            }).catch(()=>{

            });
        }
    }
}
</script>

<style scoped>
.capture_detail{
    height: 100%;
    padding: 20px;
    background: #FFFFFF;
}
</style>