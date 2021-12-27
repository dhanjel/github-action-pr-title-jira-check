# Pull Request Title verifiration against Jira Github Action

This action verifies that the pull request title is in the form `PROJECTKEY-XXX TITLE`, where `PROJECTKEY` is a valid Jira project key in your organization, `XXX` is the issue number, and `TITLE` is the summary of the Jira issue.

## Inputs

### `jira-host`

**Required** The host url for your JIRA instance

### `jira-username`

**Required** JIRA Username

### `jira-password`

**Required** JIRA Password

### `jira-project-key`

**Required** JIRA Project Key

### `github_token`

Personal access token (PAT) used to fetch the repository. The PAT is configured
with the local git config, which enables your scripts to run authenticated git
commands. The post-job step removes the PAT.
We recommend using a service account with the least permissions necessary.
Also when generating a new PAT, select the least scopes necessary.

## Outputs

No outputs

## Example usage

`uses: actions/github-action-pr-title-jira-check 
with:
  jira-host: ''
  jira-username: ''
  jira-password: ''
  jira-project-key: ''`