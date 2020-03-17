#!/bin/bash
docker run -p 80:8080 -e SWAGGER_JSON=/tmp/swagger.yml -v $PWD:/tmp swaggerapi/swagger-ui
#@todo restart existing instance if exists
#docker start  `docker ps -q -l` # restart it in the background
#docker attach `docker ps -q -l`