#!/bin/bash

#参考地址：http://www.jianshu.com/p/1903cd80223c
#Mac权限修改：chmod 777 start.sh
#Linux权限修改：chmod a+x start.sh

#0、删除原有的日志文件
rm -f ./nohup.log

#1、从 git 上拉取最新的代码
git pull

#2、后台运行新的 jar 文件
npm run build > nohup.log 2>&1 &

#3、休息 3 秒
sleep 3

#4、打印最新的日志
tail -f ./nohup.log