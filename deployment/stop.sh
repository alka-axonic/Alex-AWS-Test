#!/bin/bash

# 1. set path vars
source ~/.bash_profile

# 2. stop app
pm2 stop /home/ec2-user/zenkit -s || true