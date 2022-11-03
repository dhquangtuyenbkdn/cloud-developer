@echo off

copy  .env  www\.env
copy  .profile  www\.profileeb

copy  src\config\* www\config\
copy  .npmrc www\.npmrc
copy  package.json www\package.json
cd www
7z a -r Archive.zip . 
cd ..