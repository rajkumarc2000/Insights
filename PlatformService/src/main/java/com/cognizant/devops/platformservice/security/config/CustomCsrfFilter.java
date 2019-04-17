package com.cognizant.devops.platformservice.security.config;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import com.cognizant.devops.platformcommons.core.util.ValidationUtils;
import com.cognizant.devops.platformservice.customsettings.CustomAppSettings;

public class CustomCsrfFilter extends OncePerRequestFilter {

	public static final String CSRF_COOKIE_NAME = "XSRF-TOKEN";
	private static Logger LOG = LogManager.getLogger(CustomAppSettings.class);

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		LOG.debug("arg0 message " + request.getRequestURI() + "    " + request.toString());
		Enumeration<String> parameterNames = request.getParameterNames();
		while (parameterNames.hasMoreElements()) {
			String paramName = parameterNames.nextElement();
			String paramValues = request.getParameter(paramName);
			if (ValidationUtils.checkNewLineCarriage(paramValues)) {
				paramValues = paramValues.replace("\\n", "").replace("\\r", "");
			}
			//LOG.debug("arg0 ==== paramValues " + paramValues + "   " + paramName);
		}

		CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());

		//LOG.debug("  arg0  CsrfToken  " + CsrfToken.class.getName() + "   " + csrf);

		if (csrf != null) {

			Cookie cookie = WebUtils.getCookie(request, CSRF_COOKIE_NAME);
			String token = csrf.getToken();

			//LOG.debug("  arg0  CsrfToken  value " + token);

			if (cookie == null || token != null && !token.equals(cookie.getValue())) {
				cookie = new Cookie(CSRF_COOKIE_NAME, token);
				cookie.setPath("/");
				response.addCookie(cookie);
			}
		} else {
			LOG.debug(" csrf token is empty  ");
		}
		filterChain.doFilter(request, response);
	}
}