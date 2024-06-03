#!/bin/bash
host=ubuntu@n7tzu.org
path=/x/N7TZUManufacturer
npm run build
cd build
tar -zcvf ../N7TZUManufacturer.tgz *
cd ..
scp N7TZUManufacturer.tgz $host:$path
ssh $host tar zxvf $path/N7TZUManufacturer.tgz -C $path/build