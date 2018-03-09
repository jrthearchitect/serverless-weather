#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo -e "Usage: $0 [zip]"
    exit
fi

WEATHER_API_URL=`bx wsk api list | tail -1 | awk '{print $5}'`

curl ${WEATHER_API_URL}?zip=${1}
