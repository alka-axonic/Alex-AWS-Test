#!/bin/bash

# 1. set path vars
source ~/.bash_profile

# 2. switch to project directory
cd /home/ec2-user/zenkit

# 2. install packages
pm2 start /home/ec2-user/zenkit