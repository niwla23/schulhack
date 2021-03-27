#!/usr/bin/sh
read -p "SSH hostname: " SSH_HOST
read -p "versionCode (e.g. 10): " VERSION_CODE
ssh $SSH_HOST mkdir /home/alwin/apps/caddy/schulhack-updates/files/$VERSION_CODE
scp *.apk $SSH_HOST:/home/alwin/apps/caddy/schulhack-updates/files/$VERSION_CODE