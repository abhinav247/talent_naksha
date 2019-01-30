#!/bin/bash

npm run build


cp -r ./build/. /usr/share/nginx/html/


nginx -g "daemon off;"

