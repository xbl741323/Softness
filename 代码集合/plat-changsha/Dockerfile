FROM registry.cn-hangzhou.aliyuncs.com/wt-client/node-14.18.2:v1
MAINTAINER xubaole
ENV NODE_ENV=production
ENV HOST 0.0.0.0
RUN mkdir -p /changsha
COPY . /changsha
WORKDIR /changsha
EXPOSE 3353


RUN npm config set registry https://registry.npm.taobao.org
RUN npm cache clean --force
RUN npm install
# RUN npm run build
CMD ["npm", "start"]
