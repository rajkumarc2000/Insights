pushd %INSIGHTS_AGENT_HOME%\PlatformAgents\git
python -c "from __AGENT_KEY__.com.cognizant.devops.platformagents.agents.scm.git.GitAgent import GitAgent; GitAgent()"