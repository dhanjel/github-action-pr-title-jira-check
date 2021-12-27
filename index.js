const core = require('@actions/core');
const github = require('@actions/github');
const jiraClient = require('jira-client');

async function run() {
    try {

        // Read input parameters
        const jiraHost = core.getInput('jira-host', {required: true});
        const jiraUsername = core.getInput('jira-username', {required: true});
        const jiraPassword = core.getInput('jira-password', {required: true});
        const jiraProjectKey = core.getInput('jira-project-key', {required: true});
        const githubToken = core.getInput('github_token', {required: true});

        // Verify invocation from pull request
        const eventName = github.context.eventName;
        if (eventName.indexOf('pull_request') < 0) {
            core.setFailed('This action can only be used on pull requests.');
            return;
        }

        // Get pull request title
        const client = new github.GitHub(githubToken);
        const {data: pullRequest} = await client.pulls.get({
            owner,
            repo,
            pull_number: github.context.payload.pull_request.number
        });
        const pullRequestTitle = pullRequest.title;
        core.setOutput("Pull Request title", pullRequestTitle);

        // Verify that title contains a valid Jira key
        var issueNumber = new RegExp("${jiraProjectKey}\-(\d+)", "g").exec(pullRequestTitle) || [""];
        if (issueNumber[0].length === 0) {
            core.setFailed('Could not find a valid Jira Issue number on the pull request title.');
            return;
        }

        var issueKey = jiraProjectKey + "-" + issueNumber[0];
        core.setOutput("Jira Issue key", issueKey);

        // Search for the issue in Jira
        var jira = new jiraClient({
            protocol: 'https',
            host: jiraHost,
            username: jiraUsername,
            password: jiraPassword,
            apiVersion: '2',
            strictSSL: true
        });

        var jiraIssueDetails = await jira.findIssue(issueKey);

        var jiraTitle = jiraIssueDetails.fields.summary;
        var jiraCompleteTitle = issueKey + " " + jiraTitle;

        core.setOutput("Jira Issue title", jiraCompleteTitle);

        if (pullRequestTitle != jiraCompleteTitle) {
            core.setFailed('Expected the pull request title to be "' + jiraCompleteTitle + '", but it was "' + pullRequestTitle + '"');
            return;
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();