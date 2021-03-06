const simpleGit = require('simple-git/promise')

/**
 * This resolves to an array of available branches for the specified remote.
 * @param {string} remoteNameIdentifier
 * @returns {Promise}
 */
exports.branchesAvailableForRemoval = async (remoteNameIdentifier) => {
  const remoteBranches = await simpleGit().branch(['--remote']).then(remoteBranches => remoteBranches.all)

  return remoteBranches
    .filter(remoteBranch => remoteBranch.startsWith(remoteNameIdentifier))
    .map(remoteBranch => remoteBranch.replace(remoteNameIdentifier, ''))
}
