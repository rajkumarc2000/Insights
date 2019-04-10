package com.cognizant.devops.platformservice.correlationbuilder.service;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.cognizant.devops.platformcommons.config.ApplicationConfigProvider;
import com.cognizant.devops.platformcommons.exception.InsightsCustomException;
import com.cognizant.devops.platformservice.agentmanagement.service.AgentManagementServiceImpl;
import com.cognizant.devops.platformservice.agentmanagement.util.AgentManagementUtil;
import com.cognizant.devops.platformservice.businessmapping.service.BusinessMappingService;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service("correlationBuilderService")
public class CorrelationBuilderServiceImpl implements CorrelationBuilderService {
	private static Logger log = LogManager.getLogger(AgentManagementServiceImpl.class);
	
	@Override
	public Object getCorrelationJson() throws InsightsCustomException {
		// TODO Auto-generated method stub
		//Path dir = Paths.get(filePath);
		String agentPath = "C:\\Users\\593714\\Desktop\\downloads\\Server2\\INSIGHTS_HOME\\.InSights";
		Path dir = Paths.get(agentPath);
		Object config = null;
		try (Stream<Path> paths = Files.find(dir, Integer.MAX_VALUE,
				(path, attrs) -> attrs.isRegularFile() && path.toString().endsWith("correlation.json"));
				FileReader reader = new FileReader(paths.limit(1).findFirst().get().toFile())) {

			JsonParser parser = new JsonParser();
			Object obj = parser.parse(reader);
			//config = ((JsonArray) obj).toString();
			config=obj;
		} catch (IOException e) {
			log.error("Offline file reading issue", e);
			throw new InsightsCustomException("Offline file reading issue -" + e.getMessage());
		}
		log.error("config"+config); 
		return config;
	} 
	
	@Override
	public String saveConfig(String config) throws InsightsCustomException {
		String configFilePath = "C:\\Users\\593714\\Desktop\\downloads\\Server2\\INSIGHTS_HOME\\.InSights";
		File configFile = null;
		// Writing json to file
		log.error("saveconfig"+config);
		Path dir = Paths.get(configFilePath);
		try (Stream<Path> paths = Files.find(dir, Integer.MAX_VALUE,
				(path, attrs) -> attrs.isRegularFile() && path.toString().endsWith("correlation.json"))) {

			configFile = paths.limit(1).findFirst().get().toFile();
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		try (FileWriter file = new FileWriter(configFile)) {
			file.write(config.toString());
			file.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return "succcess";

	}

}
