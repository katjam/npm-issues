'use strict';

var npmHelper = require('../helpers/npm-helper');
var githubHelper = require('../helpers/github-helper');
var issueLogger = require('../lib/issue-logger');
var chalk = require('chalk');

/**
 * Search for query in the issues pages for all repos locally installed, and log them
 * @param  {Object} options - Options specified from command line
 * @return {Promise} - A Promise which resolves when finished with logging issues
 */
function searchIssues (options) {
    var query = options._[0];
    var depth = options.depth;
    var limit = options.limit;
    var noLimit = options['nolimit'];
    var submodule = options.module;
    var noRecursive = options.norecursive;

    if (!query) {
        console.log([
            '',
            'Usage: npm-doctor [options] [query]',
            '',
            'Examples: npm-doctor "An issue that I need to search for"',
            '          npm-doctor --nolimit "An issue that I need to search for"',
            '          npm-doctor --depth 2 "An issue that I need to search for"',
            '          npm-doctor --depth 2 --limit 10 "An issue that I need to search for"',
            '          npm-doctor --module lodash --depth 0 "An issue that I need to search for"',
            '',
            'Options:',
            '--depth [int]      The maximum depth of your local node modules that should be included in the search',
            '--limit [int]      (defaults to 10) The maximum number of results you would like logged to console',
            '--nolimit          Removes the default limit of 10 issues for logging',
            '--module [module]  Restricts searching to a submodule',
            '--norecursive      Will not recursively search submodules'
        ].join('\n'));

        return;
    }

    // Default limit is 10
    if (!noLimit && !limit) {
        console.log(chalk.green('Using default limit of 10. To increase this, choose a limit or specify nolimit'));
        limit = 10;
    }

    return npmHelper.getRepos(depth, submodule, noRecursive)
        .then(function (repos) {
            return githubHelper.searchIssues(repos, query);
        })
        .then(function (issues) {
            issueLogger.log(issues, limit);
        })
        .catch(function (err) {
            console.error(err);
        });
}

module.exports = {
    searchIssues: searchIssues
};
