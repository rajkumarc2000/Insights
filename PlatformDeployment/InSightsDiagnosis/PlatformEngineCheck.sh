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
INSIGHTSENGINE_HOME="/opt/insightsengine"
if [ $(ps aux | grep '[P]latformEngine.jar')]; then
      echo "InSightsEngine is running" >> PlatformEngine.log
else
     if [ -f "$INSIGHTSENGINE_HOME/PlatformEngine.jar" ]
      then
         echo "PlatformEngine.jar found" >> PlatformEngine.log
      else
         echo "PlatformEngine.jar not found" >> PlatformEngine.log
     fi
     error=$(grep 'ERROR' /usr/INSIGHTS_HOME/logs/PlatformEngine/PlatformEngine.log |tail -10)
     if [[ -z "$error" ]]; then
        echo "No error found" >> PlatformEngine.log
     else
        echo -e "Error found:\n$error" >> PlatformEngine.log
     fi
fi