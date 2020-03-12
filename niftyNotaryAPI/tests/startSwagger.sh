#!/bin/bash
docker run -p 80:8080 -e SWAGGER_JSON=/tmp/swagger.yml -v $PWD:/tmp swaggerapi/swagger-ui
