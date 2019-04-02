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
'''
Created on Jun 16, 2016

@author: 146414
'''
from dateutil import parser
import datetime
from com.cognizant.devops.platformagents.core.BaseAgent import BaseAgent
import logging
import urllib


class GitAgent(BaseAgent):

    def process(self):
        print "process started"
        getRepos = self.config.get("getRepos", '')
        accessToken = self.config.get("accessToken", '')
        commitsBaseEndPoint = self.config.get("commitsBaseEndPoint", '')
        startFromStr = self.config.get("startFrom", '')
        startFrom = parser.parse(startFromStr, ignoretz=True)
        getReposUrl = getRepos+"?access_token="+accessToken
        enableBranches = self.config.get("enableBranches", False)
        isOptimalDataCollect = self.config.get("enableOptimizedDataRetrieval", False)
        enableBrancheDeletion = self.config.get("enableBrancheDeletion", False)
        repos = self.getResponse(getReposUrl+'&per_page=100&sort=created&page=1', 'GET', None, None, None)        responseTemplate = self.getResponseTemplate()
        dynamicTemplate = self.config.get('dynamicTemplate', {})
        metaData = dynamicTemplate.get('metaData', {})
        branchesMetaData = metaData.get('branches', {})
        commitsMetaData = metaData.get('commits', {})
        pullReqMetaData = metaData.get('pullRequest', {})
        orphanCommitsMetaData = metaData.get('orphanCommits', {})
        defPullReqResTemplate = {
            "number": "pullReqId", "state": "pullReqState",
            "head": {"ref": "originBranch", "repo": {"fork": "isForked"}},
            "base": {"ref": "baseBranch"}, "isMerged": "isMerged"
        }
        pullReqResponseTemplate = dynamicTemplate.get('pullReqResponseTemplate', defPullReqResTemplate)
        repoPageNum = 1
        fetchNextPage = True
        while fetchNextPage:
            if len(repos) == 0:
                fetchNextPage = False
                break
            for repo in repos:
                repoName = repo.get('name', None)
                repoDefaultBranch = repo.get('default_branch', None)
                orphanCommitInjectData = dict()
                orphanCommitInjectData['repoName'] = repoName
                orphanCommitInjectData['gitType'] = 'orphanCommit'
                commitDict = dict()
                trackingDetails = self.tracking.get(repoName, None)
                if trackingDetails is None:
                    trackingDetails = {}
                    self.tracking[repoName] = trackingDetails
                repoModificationTime = trackingDetails.get('repoModificationTime', None)
                if repoModificationTime is None:
                    repoModificationTime = startFrom
                repoUpdatedAt = repo.get('pushed_at', None)
                if repoUpdatedAt is None:
                    repoUpdatedAt = repo.get('updated_at')
                repoUpdatedAt = parser.parse(repoUpdatedAt, ignoretz=True)
                branch_from_tracking_json = []
                for key in trackingDetails:
                    if key != "repoModificationTime":
                        branch_from_tracking_json.append(key)
                if startFrom < repoUpdatedAt:
                    trackingDetails['repoModificationTime'] = repo.get('updated_at')
                    branches = ['master']
                    if repoDefaultBranch != 'master':
                        branches.append(repoDefaultBranch)
                    if repoName != None:
                        if enableBranches:
                            if isOptimalDataCollect:
                                self.retrievePullRequest(commitsBaseEndPoint, repoName, repoDefaultBranch, accessToken,
                                                         trackingDetails, startFromStr, pullReqMetaData,
                                                         pullReqResponseTemplate, commitsMetaData, responseTemplate,
                                                         orphanCommitsMetaData)
                                if 'commitDict' in trackingDetails:
                                    commitDict = trackingDetails['commitDict']
                            branches = []
                            allBranches = []
                            branchPage = 1
                            fetchNextBranchPage = True
                            while fetchNextBranchPage:
                                getBranchesRestUrl = commitsBaseEndPoint+repoName+'/branches?access_token='+accessToken+'&page='+str(branchPage)
                                branchDetails = self.getResponse(getBranchesRestUrl, 'GET', None, None, None)
                                for branch in branchDetails:
                                    branchName = branch['name']
                                    branchTrackingDetails = trackingDetails.get(branchName, {})
                                    branchTracking = branchTrackingDetails.get('latestCommitId', None)
                                    allBranches.append(branchName)
                                    if branchTracking is None or branchTracking != branch.get('commit', {}).get('sha', None):
                                        branches.append(branchName)
                                if len(branchDetails) == 30:
                                    branchPage = branchPage + 1
                                else:
                                    fetchNextBranchPage = False
                                    break
                            if len(branches) > 0 :
                                activeBranches = [{ 'repoName' : repoName, 'activeBranches' : allBranches, 'gitType' : 'metadata'}]
                                self.publishToolsData(activeBranches, branchesMetaData)
                        if enableBrancheDeletion:
                            for key in branch_from_tracking_json:
                                if key not in allBranches:
                                    tracking = self.tracking.get(repoName,None)
                                    if tracking:
                                        lastCommitDate = trackingDetails.get(key, {}).get('latestCommitDate', None)
                                        lastCommitId = trackingDetails.get(key, {}).get('latestCommitId', None)
                                        self.updateTrackingForBranchCreateDelete(trackingDetails, repoName, key, lastCommitDate, lastCommitId)
                                        tracking.pop(key)
                        self.updateTrackingJson(self.tracking)

                        branchesFound = list()
                        branchesNotFound = list()
                        if 'pullReqBranches' in trackingDetails:
                            pullReqBranches = trackingDetails['pullReqBranches']
                            for branch in branches:
                                if branch in pullReqBranches:
                                    branchesFound.append(branch)
                                else:
                                    branchesNotFound.append(branch)
                        orderedBranches = branchesFound + branchesNotFound

                        injectData = dict()
                        injectData['repoName'] = repoName
                        injectData['fromPullReq'] = True
                        if 'repoPullRequests' in trackingDetails:
                            repoPullReq = trackingDetails['repoPullRequests']
                            for branch in orderedBranches:
                                originBranchPullReq = repoPullReq.get(branch, dict())
                                sortedPullReqList = sorted(map(int, originBranchPullReq.keys()), reverse=True)
                                for pullReq in originBranchPullReq.values():
                                    data = list()
                                    commitIdList = list()
                                    if pullReq.get('commitCount', 0) == 250 and not pullReq.get('computedPullReq', False):
                                        since, until = [None] * 2
                                        if pullReq.get('mergedAt', None):
                                            until = pullReq['mergedAt']
                                        elif pullReq.get('closedAt', None):
                                            until = pullReq['closedAt']
                                        else:
                                            until = pullReq.get('updatedAt', None)
                                        pullReqId = pullReq.get('pullReqId')
                                        branchSHA = pullReq.get('headSHA', '')
                                        baseBranchSHA = pullReq.get('baseSHA', '')
                                        if branch == repoDefaultBranch:
                                            injectData['default'] = True
                                        else:
                                            injectData['default'] = False
                                        previousPullReq = sortedPullReqList[sortedPullReqList.index(pullReqId) + 1:]
                                        if previousPullReq:
                                            pullReqDetails = originBranchPullReq.get(str(previousPullReq[0]), None)
                                            if pullReqDetails.get('mergedAt', None):
                                                since = pullReqDetails['mergedAt']
                                                break
                                            elif pullReqDetails.get('closedAt', None):
                                                since = pullReqDetails['closedAt']
                                                break
                                        else:
                                            since = startFrom.strftime("%Y-%m-%dT%H:%M:%SZ")
                                        print "pullReqId = %d, Since = %s, Until = %s" % (pullReqId, since, until)
                                        fetchNextCommitsPage = True
                                        getCommitDetailsUrl = commitsBaseEndPoint + repoName + '/commits?sha=' + branchSHA + '&access_token=' + accessToken + '&per_page=100'
                                        getCommitDetailsUrl += '&since=' + since + '&until=' + until
                                        commitsPageNum = 1
                                        baseSHACommitDate = None
                                        while fetchNextCommitsPage:
                                            try:
                                                commits = self.getResponse(getCommitDetailsUrl + '&page='+str(commitsPageNum), 'GET', None, None, None)
                                                for commit in commits:
                                                    commitId = commit.get('sha', None)
                                                    if commitId == baseBranchSHA:
                                                        print "commitId == baseBranchSHA"
                                                        fetchNextCommitsPage = False
                                                        break
                                                    data += self.parseResponse(responseTemplate, commit, injectData)
                                                    commitDict[commitId] = False
                                                    commitIdList.append(commitId)
                                                if len(commits) == 0 or len(data) == 0 or len(commits) < 100:
                                                    break
                                            except Exception as ex:
                                                fetchNextCommitsPage = False
                                                logging.error(ex)
                                            commitsPageNum = commitsPageNum + 1
                                        if commitIdList:
                                            pullReq = {
                                                "repoName": repoName,
                                                "pullReqId": pullReqId,
                                                "computedCommitId": commitIdList
                                            }
                                            self.publishToolsData([pullReq, ], pullReqMetaData)
                                            self.publishToolsData(data, commitsMetaData)
                                            pullReq['computedPullReq'] = True
                                            print pullReq
                                            self.updateTrackingJson(self.tracking)

                        injectData['fromPullReq'] = True
                        for branch in orderedBranches:
                            hasLatestPullReq = False
                            data = []
                            orphanCommitsData = list()
                            orphanCommitInjectData['branchName'] = branch
                            if branch == repoDefaultBranch:
                                injectData['default'] = True
                            else:
                                injectData['default'] = False
                            parsedBranch = urllib.quote_plus(branch)
                            fetchNextCommitsPage = True
                            getCommitDetailsUrl = commitsBaseEndPoint+repoName+'/commits?sha='+parsedBranch+'&access_token='+accessToken+'&per_page=100'
                            branchTrackingDetails = trackingDetails.get(branch, {})
                            since = branchTrackingDetails.get('latestCommitDate', None)
                            sincePullReqStr = branchTrackingDetails.get('latestPullReqCommitTime', None)
                            if sincePullReqStr:
                                sincePullReq = parser.parse(sincePullReqStr, ignoretz=True)
                            if since is None and sincePullReqStr is not None:
                                since = sincePullReqStr
                                hasLatestPullReq = True
                            elif since and sincePullReqStr:
                                sinceDate = parser.parse(since, ignoretz=True)
                                if sinceDate < sincePullReq:
                                    since = sincePullReqStr
                                    hasLatestPullReq = True
                            print "branch = %s, Since = %s, SincePullReq = %s" % (branch, since, sincePullReq)
                            if since != None:
                                getCommitDetailsUrl += '&since='+since
                            commitsPageNum = 1
                            latestCommit = None
                            while fetchNextCommitsPage:
                                try:
                                    commits = self.getResponse(getCommitDetailsUrl + '&page='+str(commitsPageNum), 'GET', None, None, None)
                                    if latestCommit is None and len(commits) > 0:
                                        latestCommit = commits[0]
                                    for commit in commits:
                                        commitId = commit.get('sha', None)
                                        if since is not None or startFrom < parser.parse(commit["commit"]["author"]["date"], ignoretz=True):
                                            if commitId not in commitDict:
                                                data += self.parseResponse(responseTemplate, commit, injectData)
                                                commitDict[commitId] = False
                                                orphanCommit = {"commitId": commitId}
                                                orphanCommit.update(orphanCommitInjectData)
                                                orphanCommitsData.append(orphanCommit)
                                        else:
                                            fetchNextCommitsPage = False
                                            self.updateTrackingForBranch(trackingDetails, branch, latestCommit, repoDefaultBranch)
                                            break
                                    if len(commits) == 0 or len(data) == 0 or len(commits) < 100:
                                        fetchNextCommitsPage = False
                                        break
                                except Exception as ex:
                                    fetchNextCommitsPage = False
                                    logging.error(ex)
                                commitsPageNum = commitsPageNum + 1
                            if len(data) > 0:
                                self.updateTrackingForBranch(trackingDetails, branch, latestCommit, repoDefaultBranch,
                                                             isOptimalDataCollect, len(data), hasLatestPullReq)
                                self.publishToolsData(data, commitsMetaData)
                                self.publishToolsData(orphanCommitsData, orphanCommitsMetaData)
                            trackingDetails['commitDict'] = commitDict
                            self.updateTrackingJson(self.tracking)
            repoPageNum = repoPageNum + 1
            repos = self.getResponse(getReposUrl+'&per_page=100&sort=created&page='+str(repoPageNum), 'GET', None, None, None)

    def retrievePullRequest(self, repoEndPoint, repoName, defaultBranch, accessToken, trackingDetails,
                            startFrom, metaData, responseTemplate, commitMetaData,
                            commitsResponseTemplate, orphanCommitMetaData):
        print "retrievePullRequest started"
        injectData = dict()
        pullReqData = list()
        commitData = list()
        orphanCommitData = list()
        branchesDict = dict()
        injectData['repoName'] = repoName
        injectData['fromPullReq'] = True
        orphanCommitInjectData = {
            'repoName': repoName,
            'gitType': 'orphanCommit'
        }
        defaultParams = 'access_token=%s' % accessToken + '&per_page=100&page=%s'
        pullReqUrl = repoEndPoint + repoName + '/pulls?state=all&sort=updated&direction=desc&'
        pullReqUrl += defaultParams
        lastTrackedTimeStr = trackingDetails.get('pullReqModificationTime', startFrom)
        lastTrackedTime = parser.parse(lastTrackedTimeStr, ignoretz=True)
        if 'commitDict' not in trackingDetails:
            trackingDetails['commitDict'] = dict()
        commitDict = trackingDetails['commitDict']
        if 'pullReqBranches' not in trackingDetails:
            trackingDetails['pullReqBranches'] = list()
        branchesList = trackingDetails['pullReqBranches']
        if 'repoPullRequests' not in trackingDetails:
            trackingDetails['repoPullRequests'] = dict()
        repoPullReq = trackingDetails['repoPullRequests']
        pullReqPage = 1
        nextPullReqPage = True
        isLatestPullReqDateSet = False
        while nextPullReqPage:
            pullReqDetails = list()
            try:
                pullReqDetails = self.getResponse(pullReqUrl % pullReqPage, 'GET', None, None, None)
                if pullReqDetails and not isLatestPullReqDateSet:
                    pullReqLatestModifiedTime = pullReqDetails[0].get('updated_at', None)
                    trackingDetails['pullReqModificationTime'] = pullReqLatestModifiedTime
                    isLatestPullReqDateSet = True
            except Exception as err:
                logging.error(err)
            for pullReq in pullReqDetails:
                commitList = list()
                commitIdList = list()
                latestCommit = dict()
                pullReqNumber = pullReq.get('number', 0)
                updatedAtStr = pullReq.get('updated_at', None)
                updatedAt = parser.parse(updatedAtStr, ignoretz=True)
                if updatedAt <= lastTrackedTime:
                    nextPullReqPage = False
                    break
                pullReq['isMerged'] = True if pullReq.get('merged_at', None) else False
                basePullReqCommitUrl = pullReq.get('commits_url', '') + '?' + defaultParams
                baseBranchDetails = pullReq.get('base', dict())
                baseBranch = baseBranchDetails.get('ref', None)
                originBranchDetails = pullReq.get('head', dict())
                originRepo = originBranchDetails.get('repo', dict())
                if originRepo:
                    isForked = originRepo.get('fork', False)
                else:
                    isForked = True
                originBranch = originBranchDetails.get('ref', None)
                orphanCommitInjectData['branchName'] = originBranch
                commitPage = 1
                nextPullReqCommitPage = True
                while nextPullReqCommitPage:
                    getPullReqCommitUrl = basePullReqCommitUrl % commitPage
                    commitDetails = list()
                    try:
                        commitDetails = self.getResponse(getPullReqCommitUrl, 'GET', None, None, None)
                        if commitDetails:
                            latestCommit = commitDetails[-1]
                    except Exception as err:
                        logging.error(err)
                    for commit in commitDetails:
                        commitId = commit.get('sha', '')
                        commitList.append(commit)
                        commitIdList.append(commitId)
                        commitDict[commitId] = True
                        if not pullReq['isMerged'] and not isForked:
                            orphanCommit = {'commitId': commitId}
                            orphanCommit.update(orphanCommitInjectData)
                            orphanCommitData.append(orphanCommit)
                    if len(commitDetails) < 100:
                        nextPullReqCommitPage = False
                    else:
                        commitPage += 1
                pullReq['commit'] = commitIdList
                if originBranch not in repoPullReq:
                    repoPullReq[originBranch] = dict()
                originBranchPullReq = repoPullReq[originBranch]
                originBranchPullReq[str(pullReqNumber)] = {
                    "pullReqId": pullReqNumber,
                    "originBranch": originBranch,
                    "baseBranch": baseBranch,
                    "createdAt": pullReq.get('created_at', None),
                    "mergedAt": pullReq.get('merged_at', None),
                    "closedAt": pullReq.get('closed_at', None),
                    "updatedAt": pullReq.get('updated_at', None),
                    "headSHA": originBranchDetails.get('sha', ''),
                    "baseSHA": baseBranchDetails.get('sha', ''),
                    "commitCount": len(commitIdList),
                    "computedPullReq": False
                }
                branchesDict[pullReqNumber] = originBranch
                if not isForked:
                    if originBranch not in trackingDetails:
                        trackingDetails[originBranch] = dict()
                    originTrackingDetails = trackingDetails[originBranch]
                    try:
                        latestCommitTimeStr = latestCommit.get('commit', dict()).get('author', dict()).get('date', None)
                        if 'latestPullReqCommitTime' in originTrackingDetails:
                            latestCommitTime = parser.parse(latestCommitTimeStr, ignoretz=True)
                            lastCommitTimeStr = originTrackingDetails.get('latestPullReqCommitTime', None)
                            lastCommitTime = parser.parse(lastCommitTimeStr, ignoretz=True)
                            if lastCommitTime < latestCommitTime:
                                originTrackingDetails['latestPullReqCommitTime'] = latestCommitTimeStr
                                originTrackingDetails['latestPullReqCommit'] = originBranchDetails.get('sha', '')
                                originTrackingDetails['pullReqCommitCount'] = len(commitList)
                        else:
                            originTrackingDetails['latestPullReqCommitTime'] = latestCommitTimeStr
                            originTrackingDetails['latestPullReqCommit'] = originBranchDetails.get('sha', '')
                            originTrackingDetails['pullReqCommitCount'] = len(commitList)
                        baseBranches = set(originTrackingDetails.get('baseBranches', []))
                        baseBranches.add(baseBranch)
                        originTrackingDetails['baseBranches'] = list(baseBranches)
                        originTrackingDetails['totalPullReqCommits'] = originTrackingDetails.get('totalPullReqCommits', 0) + len(commitList)
                    except Exception as err:
                        logging.error(err)
                if baseBranch == defaultBranch:
                    injectData['default'] = True
                else:
                    injectData['default'] = False
                if commitList:
                    pullReqData += self.parseResponse(responseTemplate, pullReq, {'repoName': repoName})
                    commitData += self.parseResponse(commitsResponseTemplate, commitList, injectData)
            if len(pullReqDetails) < 100:
                nextPullReqPage = False
            else:
                pullReqPage += 1
        for branch in sorted(branchesDict.items(), key=lambda record: record[0]):
            if branch not in branchesList:
                branchesList.append(branch[1])

        if commitData:
            print self.tracking
            self.publishToolsData(pullReqData, metaData)
            self.publishToolsData(commitData, commitMetaData)
            self.publishToolsData(orphanCommitData, orphanCommitMetaData)
            self.updateTrackingJson(self.tracking)
        print "retrievePullRequest ended"

    def updateTrackingForBranch(self, trackingDetails, branchName, latestCommit, repoDefaultBranch, isOptimalDataCollect=False, totalCommit=0, hasLatestPullReq=False):
        updatetimestamp = latestCommit["commit"]["author"]["date"]
        dt = parser.parse(updatetimestamp)
        fromDateTime = dt + datetime.timedelta(seconds=01)
        fromDateTime = fromDateTime.strftime('%Y-%m-%dT%H:%M:%SZ')
        if branchName in trackingDetails:
            trackingDetails[branchName]['latestCommitDate'] = fromDateTime
            trackingDetails[branchName]['latestCommitId'] = latestCommit['sha']
        else:
            trackingDetails[branchName] = {'latestCommitDate': fromDateTime, 'latestCommitId': latestCommit["sha"]}
        branchTrackingDetails = trackingDetails[branchName]
        if branchName == repoDefaultBranch:
            branchTrackingDetails['default'] = True
        else:
            branchTrackingDetails['default'] = False
        if isOptimalDataCollect:
            branchTrackingDetails['totalCommit'] = branchTrackingDetails.get('totalCommit', 0) + totalCommit
            if not hasLatestPullReq:
                branchTrackingDetails['commitCount'] = branchTrackingDetails.get('commitCount', 0) + totalCommit
            elif hasLatestPullReq:
                branchTrackingDetails['commitCount'] = totalCommit

    def updateTrackingForBranchCreateDelete(self, trackingDetails, repoName, branchName, lastCommitDate, lastCommitId):
        trackingDetails = self.tracking.get(repoName,None)
        data_branch_delete=[]
        branch_delete = {}
        branch_delete['branchName'] = branchName
        branch_delete['repoName'] = repoName
        branch_delete['event'] = "branchDeletion"
        #branch_delete['lastCommitDate'] = lastCommitDate
        #branch_delete['lastCommitId'] = lastCommitId
        data_branch_delete.append(branch_delete)
        branchMetadata = {"labels" : ["METADATA"],"dataUpdateSupported" : True,"uniqueKey":["repoName","branchName"]}
        self.publishToolsData(data_branch_delete, branchMetadata)


if __name__ == "__main__":
    GitAgent()       
