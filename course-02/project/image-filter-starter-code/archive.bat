@echo off

copy  package.json www\package.json
mkdir www/tmp/

cd www
7z a -r Archive.zip . 
cd ..