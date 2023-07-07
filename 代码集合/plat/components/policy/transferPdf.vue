<template>
  <div class="pdf-contain">
    <div class="contain">
      <div v-for="(item, i) in imgFiles" :key="i">
        <canvas :id="`pdf_canvas_${item}`" class="cavans-sty"></canvas>
      </div>
    </div>
  </div>
</template>
 
<script>
import * as pdfjs from "pdfjs-dist";
import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
export default {
  props: {
    pdfUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgFiles: [],
      pdfName: "",
      pdfUrl: "https://static-tst.wotao.com/contract-paper/e8cffd63dc3a4c9ea82c735c5794c1cd.05见面拜访打卡与陌拜关联.pdf",
    };
  },
  mounted() {
    this.createPdf(this.pdfUrl)
  },
  methods: {
    createPdf(url) {
      this.getFileFromUrl(url, this.fileName).then((res) => {
          this.handlePdf(res);
        }).catch((e) => {
          console.error(e);
        });
    },
    // 在线url转换成pdf file
    getFileFromUrl(url, fileName) {
      return new Promise((resolve, reject) => {
        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader("Accept", "application/pdf");
        xhr.responseType = "blob";
        // 加载时处理
        xhr.onload = () => {
          // 获取返回结果
          blob = xhr.response;
          let file = new File([blob], fileName, { type: "application/pdf" });
          resolve(file); // 返回结果
        };
        xhr.onerror = (e) => {
          reject(e);
        };
        xhr.send(); // 发送
      });
    },
    // 处理pdf
    handlePdf(res) {
      let that = this;
      let file = res;
      this.pdfName = file.name.substring(0, file.name.lastIndexOf("."));
      var reader = new FileReader();
      reader.readAsDataURL(file); //将文件读取为 DataURL
      reader.onload = function () {
        console.log(reader, "reader.result");
        //文件读取成功完成时触发
        const loadingTask = pdfjs.getDocument(reader.result);
        loadingTask.promise.then((pdf) => {
          var pageNum = pdf.numPages;
          // console.log("页数:" + pageNum);
          //准备图片
          for (let i = 1; i <= pageNum; i++) {
            let one = i;
            that.imgFiles.push(one);
          }
          //处理
          for (let i = 1; i <= pageNum; i++) {
            pdf.getPage(i).then((page) => {
              const canvas = document.getElementById("pdf_canvas_" + i);
              const ctx = canvas.getContext("2d");
              const viewport = page.getViewport({ scale: 1 });
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              // const destWidth = 500;
              // canvas.style.width = destWidth/2 + 'px';
              // canvas.style.height = destWidth * (viewport.height / viewport.width)/2 + 'px';
              page.render({
                canvasContext: ctx,
                viewport,
              });
            });
          }
        });
      };
    },
  },
};
</script>
<style scoped>
.pdf-contain {
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.contain {
  width: 700px;
  height: 600px;
  background: pink;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.cavans-sty{
  border: 1px solid #eeeeee;
  display: flex;
  flex-direction: column;
}
</style>