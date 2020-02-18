#!/bin/bash
docker run -p 80:8080 -e SWAGGER_JSON=/tmp/swagger2.yml -v $PWD:/tmp swaggerapi/swagger-ui
