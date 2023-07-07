import OSS from 'ali-oss'
import { getFileRepositorySts } from "@/api/oss/upload"

let credentials = null; // STS凭证
let ossClient = null; // oss客户端实例
const ossUrl = '/user-file/' // 服务器存储地址
const bucket = 'wotao-com'; // bucket名称
const region = 'oss-cn-hangzhou'; // oss服务区域名称
const partSize = 100 * 1024 * 1024; // 每个分片大小(byte) 10M
const parallel = 9999; // 同时上传的分片数
const checkpoints = {}; // 所有分片上传文件的检查点
const headers = {
  "Content-Disposition": "inline",
};

// 1、获取 STS 凭证，创建 OSS Client
function getCredential() {
  return getFileRepositorySts().then(res => {
    credentials = res.data.data.body.credentials
  }).catch(err => {
    console.error(err);
  });
}

// 2、创建OSS Client
async function initOSSClient() {
  const { accessKeyId, accessKeySecret, securityToken } = credentials;
  ossClient = new OSS({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    stsToken: securityToken,
    bucket,
    region
  });
}

// 3、点击上传按钮事件
async function upload(file) {
  try {
    return new Promise(async (resolve, reject) => {
      // 获取STS Token
      await getCredential();
      // 如果文件大学小于分片大小，使用普通上传，否则使用分片上传
      if (file.size < partSize) {
        resolve(commonUpload(file))
      } else {
      resolve(multipartUpload(file))
      }
    })
  } catch (e) {
    throw new Error('上传失败');
  }
}

// 4、普通上传
async function commonUpload(file) {
  if (!ossClient) {
    await initOSSClient();
  }
  const fileName = ossUrl + file.name;
  return ossClient.put(fileName, file.raw, { headers })
}
// 5、分片上传
async function multipartUpload(file) {
  if (!ossClient) {
    await initOSSClient();
  }
  const fileName = ossUrl + file.name;
  return ossClient.multipartUpload(
    fileName,
    file.raw,
    {
      parallel,
      partSize,
      progress: onMultipartUploadProgress,
      headers
    },
  );
}

// 6、断点续传
async function resumeMultipartUpload() {
  Object.values(checkpoints).forEach((checkpoint) => {
    const { uploadId, file, name } = checkpoint;
    ossClient.multipartUpload(uploadId, file, {
      parallel,
      partSize,
      progress: onMultipartUploadProgress,
      headers,
      checkpoint
    }).then(result => {
      console.log('before delete checkpoints === ', checkpoints);
      delete checkpoints[checkpoint.uploadId];
      console.log('after delete checkpoints === ', checkpoints);
      const url = `http://${bucket}.${region}.aliyuncs.com/${name}`;
      console.log(`Resume multipart upload ${file.name} succeeded, url === `, url)
    }).catch(err => {
      console.log('Resume multipart upload failed === ', err);
    });
  });
}

// 7、分片上传进度改变回调
// 在 progress 回调中我们可以判断 STS Token 是否快过期了，如果快过期了则先取消上传获取新 Token 后在从之前的断点开始续传。
async function onMultipartUploadProgress(progress, checkpoint) {
  console.log(`${checkpoint.file.name} 上传进度 ${progress}`);
  checkpoints[checkpoint.uploadId] = checkpoint;
  // 判断STS Token是否将要过期，过期则重新获取
  const { Expiration } = credentials;
  const timegap = 1;
  if (Expiration && moment(Expiration).subtract(timegap, 'minute').isBefore(moment())) {
    console.log(`STS token will expire in ${timegap} minutes，uploading will pause and resume after getting new STS token`);
    if (ossClient) {
      ossClient.cancel();
    }
    await getCredential();
    await resumeMultipartUpload();
  }
}

// 8、暂停上传
function stop() {
  if (ossClient) ossClient.cancel();
}

// 9、续传
function resume() {
  if (ossClient) resumeMultipartUpload();
}

export {
  upload,
  OSS
}
