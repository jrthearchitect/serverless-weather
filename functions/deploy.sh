#!/bin/bash
#
# Copyright 2017 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#  https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Load configuration variables
source local.env

function usage() {
  echo -e "Usage: $0 [--install,--uninstall,--env]"
}

function install() {

  # Exit if any command fails
  set -e

  echo -e "Installing OpenWhisk actions, triggers, and rules for openwhisk-serverless-apis..."

  # echo -e "Setting Bluemix credentials and logging in to provision API Gateway"
  #
  # # Edit these to match your Bluemix credentials (needed to provision the API Gateway)
  # bx login \
  #   --user $BLUEMIX_USERNAME \
  #   --password $BLUEMIX_PASSWORD \
  #   --namespace $BLUEMIX_NAMESPACE

  echo -e "\n"

  echo "Creating a package (here used as a namespace for shared environment variables)"
  bx wsk package create weather \
    --param "SERVICE_PROVIDER_URL" $SERVICE_PROVIDER_URL

  echo "Installing GET Weather Action"
  cd weather/
  npm install
  zip -rq action.zip *
  bx wsk action create weather/weather-get \
    --kind nodejs:6 action.zip \
    --web true
  bx wsk api create -n "Weather API" /v1 /weather GET weather/weather-get
  cd ../

  echo -e "Install Complete"
}

function uninstall() {
  echo -e "Uninstalling..."

  echo "Removing API actions..."
  bx wsk api delete /v1

  echo "Removing actions..."
  bx wsk action delete weather/weather-get

  echo "Removing package..."
  bx wsk package delete weather

  echo -e "Uninstall Complete"
}

function showenv() {
  echo -e SERVICE_PROVIDER_URL="$SERVICE_PROVIDER_URL"
}

case "$1" in
"--install" )
install
;;
"--uninstall" )
uninstall
;;
"--env" )
showenv
;;
* )
usage
;;
esac
