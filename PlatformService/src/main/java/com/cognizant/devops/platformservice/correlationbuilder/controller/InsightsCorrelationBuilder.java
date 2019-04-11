package com.cognizant.devops.platformservice.correlationbuilder.controller;

import java.io.IOException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.cognizant.devops.platformcommons.exception.InsightsCustomException;
import com.cognizant.devops.platformservice.correlationbuilder.service.CorrelationBuilderService;
import com.cognizant.devops.platformservice.rest.util.PlatformServiceUtil;
import com.google.gson.JsonObject;

@RestController
@RequestMapping("/admin/correlationbuilder")
public class InsightsCorrelationBuilder {
	static Logger log = LogManager.getLogger(InsightsCorrelationBuilder.class.getName());
	@Autowired
	CorrelationBuilderService correlationBuilderService;
	
	@RequestMapping(value = "/getCorrelationJson", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public @ResponseBody JsonObject getCorrelationJson() throws IOException, InsightsCustomException {
		String details = null;
		try {
			details = correlationBuilderService.getCorrelationJson();
		}catch (InsightsCustomException e) {
			return PlatformServiceUtil.buildFailureResponse(e.toString());
		}
		log.error(PlatformServiceUtil.buildSuccessResponseWithData(details));
		return PlatformServiceUtil.buildSuccessResponseWithData(details);
		//return PlatformServiceUtil.buildSuccessResponseWithData(details);
	}
	@RequestMapping(value = "/saveConfig", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public @ResponseBody JsonObject saveConfig(@RequestParam String configDetails) {
		String message = null;
		log.error("input"+configDetails);
		try {
			message = correlationBuilderService.saveConfig(configDetails);
		} catch (InsightsCustomException e) {
			return PlatformServiceUtil.buildFailureResponse(e.toString());
		}
		return PlatformServiceUtil.buildSuccessResponseWithData(message);
	}
}
