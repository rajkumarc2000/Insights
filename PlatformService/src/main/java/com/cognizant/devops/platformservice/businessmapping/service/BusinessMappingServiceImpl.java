/*********************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *******************************************************************************/
package com.cognizant.devops.platformservice.businessmapping.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.cognizant.devops.platformcommons.constants.ErrorMessage;
import com.cognizant.devops.platformcommons.dal.neo4j.GraphDBException;
import com.cognizant.devops.platformcommons.dal.neo4j.GraphResponse;
import com.cognizant.devops.platformcommons.dal.neo4j.Neo4jDBHandler;
import com.cognizant.devops.platformservice.businessmapping.constants.BusinessMappingConstants;
import com.cognizant.devops.platformservice.rest.datatagging.model.Node;
import com.cognizant.devops.platformservice.rest.util.PlatformServiceUtil;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

@Service("businessMappingService")
public class BusinessMappingServiceImpl implements BusinessMappingService {
	
	static Logger log = LogManager.getLogger(BusinessMappingServiceImpl.class.getName());
	
	@Override	
	public JsonObject getAllHierarchyDetails() {
		Neo4jDBHandler dbHandler = new Neo4jDBHandler();
		String query = "MATCH (n:METADATA:DATATAGGING) return n";
		GraphResponse response;
		JsonArray parentArray = new JsonArray();
		try {
			response = dbHandler.executeCypherQuery(query);
			JsonArray rows = response.getJson().get("results").getAsJsonArray().get(0).getAsJsonObject().get("data")
					.getAsJsonArray();
			JsonArray asJsonArray = rows.getAsJsonArray();
			JsonObject jsonObject = populateHierarchyDetails(asJsonArray);
			parentArray.add(jsonObject);
		} catch (GraphDBException e) {
			log.error(e);
			return PlatformServiceUtil.buildFailureResponse(ErrorMessage.DB_INSERTION_FAILED);
		}
		return PlatformServiceUtil.buildSuccessResponseWithData(parentArray);
	}
	
	/**
	 * @param array
	 * @return
	 */
	private JsonObject populateHierarchyDetails(JsonArray array) {
		int rowCount = 0;
		List<List<String>> valueStore = new ArrayList<>();
		for (JsonElement element : array) {
			JsonElement jsonElement = element.getAsJsonObject().get("row").getAsJsonArray().get(0);
			List<String> valueList = new ArrayList<>();
			JsonObject jsonObject = jsonElement.getAsJsonObject();
			if (jsonObject != null && jsonObject.get(BusinessMappingConstants.LEVEL1) != null) {
				String level1Value = jsonObject.get(BusinessMappingConstants.LEVEL1).getAsString();
				if (null != level1Value && !level1Value.isEmpty()) {
					valueList.add(level1Value);
				}
			}
			if (jsonObject != null && jsonObject.get(BusinessMappingConstants.LEVEL2) != null) {
				String level2Value = jsonObject.get(BusinessMappingConstants.LEVEL2).getAsString();
				if (null != level2Value && !level2Value.isEmpty()) {
					valueList.add(level2Value);
				}
			}
			if (jsonObject != null && jsonObject.get(BusinessMappingConstants.LEVEL3) != null) {
				String level3Value = jsonObject.get(BusinessMappingConstants.LEVEL3).getAsString();
				if (null != level3Value && !level3Value.isEmpty()) {
					valueList.add(level3Value);
				}
			}
			if (jsonObject != null && jsonObject.get(BusinessMappingConstants.LEVEL4) != null) {
				String level4Value = jsonObject.get(BusinessMappingConstants.LEVEL4).getAsString();
				if (null != level4Value && !level4Value.isEmpty()) {
					valueList.add(level4Value);
				}
			}
			valueStore.add(rowCount, valueList);
			rowCount++;
		}
		// Logic of converting data into tree structure
		// create special 'root' Node with id=0
		Node root = new Node(null, 0, "root");
		for (List<String> values : valueStore) {
			Node parent = root;
			for (int i = 0; i < values.size(); i++) {
				Node node = new Node(parent, i + 1, values.get(i));
				if (parent.getChild(node) == null) {
					parent.addChild(node);
					parent = node;
				} else {
					parent = parent.getChild(node);
				}
			}
		}
		return populateJsonTree(root);
	}

	/**
	 * Populates a json object with tree structure from Node object which is a tree
	 * representation
	 * 
	 * @param root
	 * @return
	 */
	private JsonObject populateJsonTree(Node root) {
		JsonObject jsonTree = new JsonObject();
		jsonTree.addProperty(BusinessMappingConstants.NAME, root.getName());
		createJsonObject(root, jsonTree);
		return jsonTree;
	}

	/**
	 * @param node
	 * @param parentJson
	 */
	private void createJsonObject(Node node, JsonObject parentJson) {
		JsonArray childArray = new JsonArray();
		// recurse
		for (Node childNode : node.getChildren()) {
			JsonObject childJson = new JsonObject();
			childJson.addProperty(BusinessMappingConstants.NAME, childNode.getName());
			childArray.add(childJson);
			createJsonObject(childNode, childJson);
		}
		if (childArray.size() != 0) {
			parentJson.add(BusinessMappingConstants.CHILDREN, childArray);
		}
	}

}
