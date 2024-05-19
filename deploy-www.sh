#!/bin/bash
host=n7tzu.org
path=/x/srv/www
npm run build
cd build
tar -zcvf ../www.tar.gz *
cd ..
scp www.tar.gz $host:$path
ssh $host tar zxvf $path/www.tar.gz -C $path/html