package com.cognizant.devops.platformengine.modules.aggregator;

import java.util.HashMap;
import java.util.Map;

public class BusinessMappingData {
	public String toolName; 
	public String businessMappingLabel;
	Map<String,String> propertyMap=new HashMap<String,String>(0);
	
	public String getToolName() {
		return toolName;
	}
	public void setToolName(String toolName) {
		this.toolName = toolName;
	}
	public String getBusinessMappingLabel() {
		return businessMappingLabel;
	}
	public void setBusinessMappingLabel(String businessMappingLabel) {
		this.businessMappingLabel = businessMappingLabel;
	}
	public Map<String, String> getPropertyMap() {
		return propertyMap;
	}
	public void setPropertyMap(Map<String, String> propertyMap) {
		this.propertyMap = propertyMap;
	}
	
	@Override
	public String toString() {
		return "BusinessMappingData [toolName=" + toolName + ", businessMappingLabel=" + businessMappingLabel
				+ ", propertyMap=" + propertyMap + "]";
	}
	
	

}
