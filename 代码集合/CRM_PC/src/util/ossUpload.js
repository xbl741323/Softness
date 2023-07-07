import {getOssToken, getOssTokenMy} from "@/api/policy/list";
import OSS from 'ali-oss'

export default class OSSUploader {
  constructor(isMy = false) {
    this.client = null;
    let OssTokenTime = isMy ? sessionStorage.getItem('OssTokenTimeMy') : sessionStorage.getItem('OssTokenTime')
    const timeDiff = (new Date() - new Date(OssTokenTime))/1000/60
    if (timeDiff > 15 || !OssTokenTime) {
      const getTokenPromise = isMy ? getOssTokenMy() : getOssToken();
      getTokenPromise.then(res => {
        if (res.data.code == 0) {
          const ossConfig = res.data.data.body.credentials;
          sessionStorage.setItem(isMy ? 'OssTokenTimeMy' : 'OssTokenTime', new Date())
          sessionStorage.setItem(isMy ? 'wtOssTokenMy' : 'wtOssToken', JSON.stringify(ossConfig))
          this.client = new OSS({
            region: "oss-cn-hangzhou",
            accessKeyId: ossConfig.accessKeyId,
            accessKeySecret: ossConfig.accessKeySecret,
            stsToken: ossConfig.securityToken,
            bucket: "wotao-doc",
          });
        } else {
          console.error(`获取 OSS Token 失败：${res.data.msg}`);
          this.client = null;
        }
      }).catch(error => {
        console.error(`请求 OSS Token 失败：${error}`);
        this.client = null;
      });
    } else {
      const ossConfig = isMy ? JSON.parse(sessionStorage.getItem('wtOssTokenMy')) : JSON.parse(sessionStorage.getItem('wtOssToken'))
      this.client = new OSS({
        region: "oss-cn-hangzhou",
        accessKeyId: ossConfig.accessKeyId,
        accessKeySecret: ossConfig.accessKeySecret,
        stsToken: ossConfig.securityToken,
        bucket: "wotao-doc",
      });
    }
  }

  async upload(file, fileName) {
    try {
      return new Promise(async (resolve, reject) => {
        // 等待client属性正确初始化
        while (this.client == null) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        // 读取文件
        const reader = await new FileReader();
        await reader.readAsArrayBuffer(file);
        reader.onload = async () => {
          // 将 ArrayBuffer 转换为 Buffer 对象
          const buffer = Buffer.from(reader.result);
          const headers = {
            'Content-Disposition': 'attachment'
          };
          const result = await this.client.put(fileName, buffer, {headers});
          console.log("upload success: ", result.url);
          resolve(result.url);
        }
      })
    } catch (e) {
      console.log("upload failed: ", e);
      throw new Error('上传失败');
    }
  }
}
