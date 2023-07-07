<template>
    <div class="preview">
        <div class="fileName">{{docDetail.fileName}}</div>
        <div class="fileDetail">
            <div class="blue-block">
                {{docDetail.level | filterLevel}}
            </div>
            <div class="blue-block">
                {{docDetail.areaName}}
            </div>
            <div>
                {{docDetail.createTime}}
            </div>
            <img src="" alt="">
        </div>
        <div v-for="item in urlList" :key="item" class="previewImg">
            <img :src="item" alt="">
        </div>
        <div ref="wrapper">1</div>
        <div class="end-text" v-if="viewPage != total">
            试读已结束，付费{{docDetail.amount}}元,查看剩余<span>{{docDetail.pages - viewPage}}页信息</span>
        </div>
        <div class="beijing" v-if="viewPage != total"></div>
    </div>
</template>

<script>
import { previewDoc, docDetail } from '@/api/policy/detail'
export default {
    data() {
        return {
            urlList: [],
            total: 0,
            docDetail: {},
            pageSize: 5,
            lastTime: new Date(),
            pageNo: 1,
            dict: {},
            viewPage: 0,
            newAreaOptions: [],
            isLoading: false,
            observer: null, // Intersection Observer 实例
        }
    },
    filters: {
        filterLevel(val) {
            if(val){
                return val == 1 ? '国家级' : val == 2 ? '省级' : val == 3 ? '市级' : val == 4 ? '区级' : ''
            }
        }
    },
    mounted() {
        this.getDocPreview()
        this.getDocDetail()
        // 创建 Intersection Observer 实例
        this.observer = new IntersectionObserver((entries) => {
            // const target = entries[0].target;
            // 判断元素是否进入视口
            if (entries[0].isIntersecting) {
                this.loadMore(); // 加载更多数据
            }
        });
        // 监听 wrapper 元素与视口的交叉程度
        this.observer.observe(this.$refs.wrapper);
    },
    methods: {
        getDocPreview() {
            let params = {
                id: this.$route.query.id,
                pageSize: this.pageSize,
                pageNo: this.pageNo,
            }
            previewDoc(params).then(res => {
                if (res.data.code == 0) {
                    this.urlList = this.isLoading ? [...this.urlList,...res.data.data.urls] : res.data.data.urls,
                    this.total = res.data.data.total
                    this.viewPage = res.data.data.viewPage
                    this.isLoading = false
                }
            })
        },
        getDocDetail() {
            docDetail({id: this.$route.query.id}).then(res=> {
                if (res.data.code == 0) {
                    this.docDetail = res.data.data
                    this.docDetail.createTime = this.docDetail.createTime.slice(0, 10)
                }
            })
        },
        loadMore() {
            let now = new Date()
            if (now - this.lastTime > 1000){
                this.pageNo += 1
                this.isLoading = true
                if (this.docDetail.isPay == 0) {
                    this.getDocPreview()
                }
                this.lastTime = now
            }
        },
    },
}
</script>

<style scoped>
.preview{
    text-align: center;
    font-size: 12px;
    height: 100%;
}
.fileName{
    font-weight: 700;
    font-size: 14px;
    margin: 10px;
}
.previewImg{
    text-align: center;
}
.previewImg img{
    width: 65%;
}
.fileDetail{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
}
.blue-block{
    padding: 4px 8px;
    background: #D2EBFF;
    color: #36A6FE;
    border-radius: 4px;
    margin-right: 10px;
}
.end-text{
    color: #36A6FE;
    font-size: 14px;
    position: relative;
    top: -74px;
    z-index: 10;
}
.beijing{
    backdrop-filter: blur(8px);
    height: 96px;
    position: relative;
    top: -129px;
    opacity: 0.8;
    background: rgba(0,0,0,0.00);
}
</style>