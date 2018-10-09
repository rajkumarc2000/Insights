#!/bin/bash
#-------------------------------------------------------------------------------
# Copyright 2017 Cognizant Technology Solutions
#   
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy
# of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.
#-------------------------------------------------------------------------------


SERVER_CONFIG_PATH=$INSIGHTS_HOME/.InSights/server-config.json

echo '{"foo":"bar"}' | python -m json.tool $SERVER_CONFIG_PATH >> /dev/null && echo $(date '+%F %T') "File server-config.json is in valid JSON format" >> ServerConfigReport.log || echo $(date '+%F %T') "File server-config.json is not in valid JSON format"  >> ServerConfigReport.log

ES_URL=$(cat $SERVER_CONFIG_PATH|jq -r '.endpointData.elasticSearchEndpoint')
NEO4J_URL=$(cat $SERVER_CONFIG_PATH|jq -r '.graph.endpoint')
NEO4J_AUTH_TOKEN=$(cat $SERVER_CONFIG_PATH|jq -r '.graph.authToken')
GRAFANA_URL=$(cat $SERVER_CONFIG_PATH|jq -r '.grafana.grafanaEndpoint')
GRAFANA_USER_NAME=$(cat $SERVER_CONFIG_PATH|jq -r '.grafana.adminUserName')
GRAFANA_PASSWORD=$(cat $SERVER_CONFIG_PATH|jq -r '.grafana.adminUserPassword')
INSIGHTS_USER=$(cat $SERVER_CONFIG_PATH|jq -r '.userId')
INSIGHTS_PASSWD=$(cat $SERVER_CONFIG_PATH|jq -r '.password')
DOCROOT_URL=$(cat $SERVER_CONFIG_PATH|jq -r '.agentDetails.docrootUrl')
AGENT_ONLINE_REGISTER=$(cat $SERVER_CONFIG_PATH|jq -r '.agentDetails.isOnlineRegistration')
AGENT_OFFLINEPATH=$(cat $SERVER_CONFIG_PATH|jq -r '.agentDetails.offlineAgentPath')
AGENT_UNZIPPATH=$(cat $SERVER_CONFIG_PATH|jq -r '.agentDetails.unzipPath')


for var in ES_URL NEO4J_URL NEO4J_AUTH_TOKEN GRAFANA_URL GRAFANA_USER_NAME GRAFANA_PASSWORD DOCROOT_URL AGENT_ONLINE_REGISTER INSIGHTS_USER INSIGHTS_PASSWD AGENT_OFFLINEPATH; do
    if [ -z "${!var}" ] ; then
        echo $(date '+%F %T') "$var parameter is not set in server-config.json" >> ServerConfigReport.log
    fi
done


echo $(date '+%F %T') "Trying to connect ELASTICSEARCH URL" $ES_URL >> ServerConfigReport.log
curl -s $ES_URL > /dev/null
res=$?
if test "$res" != "0";
then
   echo $(date '+%F %T') "Could not reach Elastic Search URL" >> ServerConfigReport.log
else
   echo $(date '+%F %T') "Able to connect Elastic Search URL and and this is valid URL" >> ServerConfigReport.log
fi


echo $(date '+%F %T') "Trying to connect NEO4J URL" $NEO4J_URL >> ServerConfigReport.log
curl -s $NEO4J_URL > /dev/null
res=$?
if test "$res" != "0";
then
   echo $(date '+%F %T') "Could not reach Neo4j URL" >> ServerConfigReport.log
else
   echo $(date '+%F %T') "Able to connect NEO4J_URL and this is valid URL" >> ServerConfigReport.log
fi


echo $(date '+%F %T') "Trying to connect GRAFANA URL" $GRAFANA_URL "with User:"$GRAFANA_USER_NAME "password:"$GRAFANA_PASSWORD>> ServerConfigReport.log
curl -s $GRAFANA_URL > /dev/null
res=$?
if test "$res" != "0";
then
   echo $(date '+%F %T') "Could not reach Grafana URL" >> ServerConfigReport.log
else
   grafana_password_check=$(curl -X GET -u ${GRAFANA_USER_NAME}:${GRAFANA_PASSWORD} ${GRAFANA_URL}/api/admin/settings)
   if [[ $grafana_password_check = *"Invalid"* ]]; then
       echo $(date '+%F %T') "This is incorrect user and password."  >> ServerConfigReport.log
   else
       echo $(date '+%F %T') "This is valid User and password"  >> ServerConfigReport.log
   fi
   echo $(date '+%F %T') "Able to connect GRAFANA_URL and this is valid URL"  >> ServerConfigReport.log
fi


echo $(date '+%F %T') "AGENT_ONLINE_REGISTER is set to "$AGENT_ONLINE_REGISTER >> ServerConfigReport.log
if [ "$AGENT_ONLINE_REGISTER" = "false" ] && [ -z $AGENT_OFFLINEPATH ] ; then
        echo $(date '+%F %T') "offlineAgentPath parameter is not set in server-config.json" >> ServerConfigReport.log
fi
if [ "$AGENT_ONLINE_REGISTER" = "true" ]; then
   echo $(date '+%F %T') "Trying to connect DOCROOT URL" $DOCROOT_URL   >> ServerConfigReport.log
   response=$(curl --write-out "%{http_code}\n" --silent --output /dev/null $DOCROOT_URL)
   if [ "$response" != "200" ] && [ "$response" != "301" ]
   then
      echo $(date '+%F %T') "Could not reach Docroot URL $DOCROOT_URL returned status $response" >> ServerConfigReport.log
   elif [ -z $AGENT_UNZIPPATH ] ; then
      echo $(date '+%F %T') "Agent unzippath parameter is not set in server-config.json" >> ServerConfigReport.log 
   else
      echo $(date '+%F %T') "Able to connect DOCROOT_URL and this is valid URL" >> ServerConfigReport.log
   fi
fi
