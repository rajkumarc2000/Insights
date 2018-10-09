#-------------------------------------------------------------------------------
#  Copyright 2017 Cognizant Technology Solutions
#  
#  Licensed under the Apache License, Version 2.0 (the "License"); you may not
#  use this file except in compliance with the License.  You may obtain a copy
#  of the License at
#  
#    http://www.apache.org/licenses/LICENSE-2.0
#  
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
#  License for the specific language governing permissions and limitations under
#  the License.


#!/bin/sh

if [ $# -eq 0 ]; then
    echo "No arguments supplied. Please give server1 and server2 ip."
    exit
fi

#-----------------------------------Current User Permission
userPermission=`groups`
echo "TimeStamp -> " $(date '+%F %T')""   >> check.log
echo "Checking current user group." >> check.log
echo "	Group is: ${userPermission}" >> check.log
#-----------------------------------Docroot Connection Check
HTTP_STATUS="$(curl -IL --silent http://platform.cogdevops.com/insights_install/release/ | grep HTTP )"
RESPONSE=${HTTP_STATUS}
echo "TimeStamp -> " $(date '+%F %T')""   >> check.log
echo "Checking internet connectivity with cog-docroot server to proceed with online/offline installation method." >> check.log

if [[ $RESPONSE = *"200 OK"* ]]; then
  echo "	DocRoot has connection from this machine. Online installation is possible." >> check.log
else
  echo "	Not able to connect with DocRoot machine. Offline installation is possible." >> check.log
  exit 1
fi

#-----------------------------------OS Check
wget http://platform.cogdevops.com/insights_install/release/latest/InSightsUI.zip
unzip InSightsUI.zip
#In case of offline install please give the path for zip
sleep 5
value=`cat ./app/uiConfig.json`
osList=$(echo "$value" | jq -r '.agentsOsList')
os=$(echo "${osList}" | jq -c '.[]')
osCurrentMachine=$(cat /proc/version)
osCurrentMachine=$(echo "$osCurrentMachine" | tr '[:upper:]' '[:lower:]')
echo "TimeStamp -> " $(date '+%F %T')""   >> check.log
echo "Checking OS support for InSight Installation." >> check.log
echo "  Current os details -> ${osCurrentMachine}" >> check.log
flag="0"
for word in $os
do
    temp="${word%\"}"
    temp="${temp#\"}"
    if [[ $osCurrentMachine = *"${temp}"* ]]; then
        flag="1"
        echo "The os is ${word} and InSights has the scripts." >> check.log
        check=$(echo $word | sed 's/^.\(.*\).$/\1/')
        case "$check" in
            "linux")
                init_permission=$(ls -ld /etc/init.d)
                echo "	Permission of init.d folder -> "${init_permission} >> check.log
                opt_permission=$(ls -ld /opt/)
                echo "	Permission of opt folder -> "${opt_permission} >> check.log
                usr_permission=$(ls -ld /usr/)
                echo "	Permission of usr folder -> "${usr_permission} >> check.log
            ;;
            "ubuntu")
                systemd_permission=$(ls -ld /etc/systemd/system)
                echo "  Permission of systemd folder -> "${systemd_permission} >> check.log
                opt_permission=$(ls -ld /opt/)
                echo "  Permission of opt folder -> "${opt_permission} >> check.log
                usr_permission=$(ls -ld /usr/)
                echo "  Permission of usr folder -> "${usr_permission} >> check.log
            ;;
            *)
            echo "	The os is windows." >> check.log
            ;;
        esac
    fi
done
if [[ $flag == "0" ]]; then
    echo "InSight does not support os: ${osCurrentMachine}" >> check.log
fi
rm -rf InSightsUI.zip
rm -rf app

#-----------------------------------------------------------------Port Connection Check
echo "Port Connection check" >> check.log
server1_ip=$1
server2_ip=$2
echo "	Server1 : ${server1_ip}	Server2 : ${server2_ip}" >> check.log
#----ELASTICSEARCH
port_es=$(sudo netstat -plnt | grep 9200)
if [[ $port_es = *"9200"* ]]; then
    echo "	ElasticSearch :: Software is running on 9200." >> check.log
    echo "		"$port_es >> check.log
else
    port_es=$(sudo telnet ${server2_ip} 9200)
    sleep 2
    echo "	ElasticSearch :: For port 9200" >> check.log
    echo "		"$port_es >> check.log
    
    if [[ $port_es = *"Connected"* ]]; then
        echo "		Connected." >> check.log
    else
        echo "		Not connected." >> check.log
    fi
fi
#----GRAFANA
port_grafana=$(sudo netstat -plnt | grep 3000)
if [[ $port_grafana = *"3000"* ]]; then
    echo "	Grafana :: Software is running on 3000" >> check.log
    echo "		"$port_grafana >> check.log
else
    port=$(sudo telnet ${server2_ip} 3000)
    sleep 2
    echo "	Grafana :: For port 3000" >> check.log
    echo "		"$port >> check.log
    if [[ $port = *"Connected"* ]]; then
        echo "  	Connected." >> check.log
    else
        echo "  	Not connected." >> check.log
    fi

fi
#----NEO4J
port_neo=$(sudo netstat -plnt | grep 7474)
if [[ $port_neo = *"7474"* ]]; then
    echo "	Neo4j :: Software is running on 7474" >>check.log
    echo "		"$port_neo >> check.log
else
    port=$(sudo telnet ${server2_ip} 7474)
    echo "	Neo4j :: For port 7474" >> check.log
    echo "		"$port >> check.log
    sleep 2
    if [[ $port = *"Connected"* ]]; then
        echo "  	Connected." >> check.log
    else
        echo "  	Not connected." >> check.log
    fi

fi
#----RABBITMQ
port_mq=$(sudo netstat -plnt | grep 15672)
if [[ $port_mq = *"15672"* ]]; then
    echo "	RabbitMQ :: Software is running on 15672" >> check.log
    echo "		"$port_mq >> check.log
else
    port=$(sudo telnet ${server2_ip} 15672)
    sleep 2
    echo "	RabbitMQ :: For port 15672" >> check.log
    echo "		"$port >> check.log
    if [[ $port = *"Connected"* ]]; then
        echo "  	Connected." >> check.log
    else
        echo "  	Not connected." >> check.log
    fi
fi
#----TOMCAT
port_tomcat=$(sudo netstat -plnt | grep 8080)
if [[ $port_tomcat = *"8080"* ]]; then
    echo "	Tomcat :: Software is running on 8080" >> check.log
    echo "		"$port_tomcat >> check.log
else
    port=$(sudo telnet ${server2_ip} 8080)
    sleep 2
    echo "	Tomcat :: For port 8080" >> check.log
    echo "		"$port >> check.log
    if [[ $port = *"Connected"* ]]; then
        echo "  	Connected." >> check.log
    else
        echo "  	Not connected." >> check.log
    fi
fi
#----POSTGRES
port_db=$(sudo netstat -plnt | grep 5432)
if [[ $port_db = *"5432"* ]]; then
    echo "	Postgres :: Software is running on 5432" >> check.log
    echo "		"$port_db >> check.log
else
    port=$(sudo telnet ${server2_ip} 5432)
    sleep 2
    echo "	Postgres :: For port 5432" >> check.log
    echo "		"$port >> check.log
    if [[ $port = *"Connected"* ]]; then
        echo "  	Connected." >> check.log
    else
        echo "  	Not connected." >> check.log
    fi
fi

