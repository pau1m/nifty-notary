#!/bin/bash

kill -9 $(lsof -ti tcp:3600) &> /dev/null & #kill app