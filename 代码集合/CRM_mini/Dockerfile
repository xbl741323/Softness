FROM node:16.14.0
MAINTAINER xinghu
ENV NODE_ENV=production
ENV HOST 0.0.0.0
RUN mkdir -p /wt-plat
COPY . /wt-plat
WORKDIR /wt-plat
EXPOSE 3333


# RUN npm config set registry https://registry.npm.taobao.org
RUN npm cache clean --force
RUN npm install
RUN npm run build
CMD ["npm", "start"]
