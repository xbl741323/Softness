<template>
    <div class="frame">
        <div class="course_content">
            <ul class="member-wrapper">
                <li
                    :class="[{'member-last' : (index+1) % 4 === 0},'member-list']"
                    v-for="(item,index) of List"
                    :key="item.id"
                >
                    <div class="course">
                        <div class="photo">
                            <img src="images/home/img_class_home@2x.png" />
                        </div>
                        <div class="introduction">
                            <p class="introduction_title">2020德国广告标识及视觉2020德国广告标识及视觉.</p>
                            <p class="introduction_content">2020-01-07~2020-01-17</p>
                            <p class="the_label">科技</p>
                            <img class="introduction_img" src="images/home/label_class_home@2x.png"/>
                        </div>
                    </div>
                </li>
                </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            List:[
                {},
                {},
                {},
                {},
            ]
        }
    },
    methods:{

    }
}
</script>

<style lang="stylus" scoped>
.frame{
    width:100%;
    height:300px;
    font-size:14px;
    font-family:Microsoft YaHei UI;
    .course_content{
        width:100%;
        .member-wrapper {
            width: 100%;
            padding:5px;
            margin:0 auto;
            display: inline-block;
            .member-last {
              margin-right: 0 !important;
              box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
            }
            .member-list {
              list-style :none;
              text-align: center;
              background: rgba(255, 255, 255, 1);
              width: 248px;
              height: 236px;
              float: left;
              margin-right: 5.5%;
              margin-bottom: 40px;
              box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
              .course{
                width:248px;
                height:252px;
                .photo{
                  width:100%;
                  height:58.8%;
                }
                .photo img{
                  width:100%;
                  height:100%;
                }
                .introduction{
                  width:100%;
                  height:22px;
                  .introduction_title{
                    width:80%;
                    margin :5px 0;
                    font-size:14px;
                    color:#373D40;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:1;
                  }
                  .introduction_content{
                    width:60%;
                    margin:5px 0;
                    font-size:12px;
                    color:#BFBFBF;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:1;
                  }
                  .the_label{
                    width:60px;
                    line-height:22px;
                    margin-left:5px;
                    background-color:#CFE2FB;
                    border-radius:12px;
                  }
                  .introduction_img{
                    float:right;
                    margin-top:-25px;
                    width:62px;
                    height:27px;
                  }
                }
                
              }
            }
        }
    }
}
</style>