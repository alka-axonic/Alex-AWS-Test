#!/bin/bash

# 1. set path vars
source ~/.bash_profile

# 2. delete old version
rm -rf /home/ec2-user/zenkit

# 3. install pm2
npm install pm2 -g