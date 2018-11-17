const { isGitSafeRepository } = require('../shared/isGitSafeRepository')
const { allLocalBranches } = require('../local-branches/allLocalBranches')
const { mainBranchPrompt } = require('./prompts/mainBranchPrompt')
const { branchesToRemovePrompt } = require('../shared/prompts/branchesToRemovePrompt')
const { removeSelectedBranchesPrompt } = require('../shared/prompts/removeSelectedBranchesPrompt')
const { keepSelectedBranchesPrompt } = require('../shared/prompts/keepSelectedBranchesPrompt')
const { removeSelectedBranches } = require('./removeSelectedBranches')
const {
  removeAllBranchesExceptMainBranchContent,
  removeSelectedBranchesContent,
  keepSelectedBranchesContent
} = require('../shared/branchRemovalOptionsContent')

/**
 * @param {object} previouslyRemovedBranches - This is intended to be used to provide an additional option
 *  for the branches to remove prompt. For instance, removing branches remotely that have already been
 * removed locally.
 * @returns {array}
 */
exports.runLocalBranchRemoval = async (previouslyRemovedBranches) => {
  if (isGitSafeRepository()) {
    let removedBranches = [];
    const localBranches = await allLocalBranches()

    if (localBranches.length === 0) {
      console.log('\nThere are no local branches available for removal.\n');
      return removedBranches;
    }

    const mainBranchAnswer = await mainBranchPrompt(localBranches)
    const branchesAvailableForRemoval = localBranches.filter(branch => branch !== mainBranchAnswer)
    const branchesToRemoveAnswer = await branchesToRemovePrompt(
      branchesAvailableForRemoval,
      [
        removeAllBranchesExceptMainBranchContent,
        removeSelectedBranchesContent,
        keepSelectedBranchesContent
      ]
    )
    let selectedBranchesToRemove = []

    if (branchesToRemoveAnswer === removeAllBranchesExceptMainBranchContent) {
      selectedBranchesToRemove = branchesAvailableForRemoval
    } else if (branchesToRemoveAnswer === removeSelectedBranchesContent) {
      selectedBranchesToRemove = await removeSelectedBranchesPrompt(branchesAvailableForRemoval)
    } else if (branchesToRemoveAnswer === keepSelectedBranchesContent) {
      selectedBranchesToRemove = await keepSelectedBranchesPrompt(branchesAvailableForRemoval)
    } else {
      console.log('Oops! Something went wrong.')
      process.exit(1)
    }

    // run method to remove branches
    removedBranches = await removeSelectedBranches(mainBranchAnswer, selectedBranchesToRemove)

    return removedBranches
  }
}
