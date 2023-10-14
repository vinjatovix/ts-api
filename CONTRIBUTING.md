# Contributing to this repository

First off, thanks for taking the time to contribute! The following is a set of guidelines for contributing to our project.
We encourage everyone to follow them with their best judgement.

## Table of Contents

1. [How to Prepare a PR](#how-to-prepare-a-pr)
   * [The Essentials of a Code Contribution](#the-essentials-of-a-code-contribution)
   * [Creating a Pull Request](#creating-a-pull-request)
2. [Branching Strategy](#branching-strategy)
3. [Merging a Pull Request](#merging-a-pull-request)
4. [Coding Conventions](CODING-CONVENTIONS.md)

## How to Prepare a PR
Pull requests let you tell others about changes you have pushed to a branch in our repository. They are a dedicated forum for discussing the implementation of the proposed feature or bugfix between committer and reviewer(s).
This is an essential mechanism to maintain or improve the quality of our codebase, so let's see what we look for in a pull request. The following are all formal requirements to be met before considering the content of the proposed changes.

### The Essentials of a Code Contribution

Here we cover the configuration of the tools that will help you write code that complies with our standards and also the good practices that will make your contribution as useful as it can be!

#### Git Client Configuration

First things first, Git is the base from which everything is built upon, so we want to make it as solid as possible.

- Start off by configuring your `user.name` and `user.email` as seen in [Customizing Git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration). For your convenience, here is a good resource on [Maintaining Different Git Identities](https://gist.github.com/bgauduch/06a8c4ec2fec8fef6354afe94358c89e).
- Next, we want to be able to verify that commits actually come from a trusted source, so we are going to sign and verify our work with GPG.  There's a guide at GitHub on how to [setup signed commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits). Signing commits is **mandatory**.
- Finally, we want to publish our work and *only* our work. There is one thing that might bother us and the people we work with: line endings. Checkout Githubs's guide on [Configuring Git to handle line endings](https://docs.github.com/en/github/using-git/configuring-git-to-handle-line-endings) for Mac, Windows and Linux.

#### Making your Changes Clear and Traceable

There's a **Golden Rule** when addressing code changes: **Modify only what is related to the task**.

When developing the next feature or bugfix we should also strive for small, atomic commits or, in other words, commits that group changes focused on one context and one context only.
They are easier to read, understand, review, track and revert.

Next, the best way to communicate to others the context of the change is a well-crafted Git commit message. Here is a good resource on [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) (or you can skip to the [guidelines](https://chris.beams.io/posts/git-commit/#seven-rules)). We follow the **Conventional Commits** specification because it provides an easy set of rules for creating an explicit commit history, check out its [Quick Summary](https://www.conventionalcommits.org/en/v1.0.0/#summary).

Finally, we keep a [CHANGELOG](https://github.com/vinjatovix/ts-api/releases) to make it easier for users and contributors to see precisely what notable changes have been made between each release (or version) of the project.
We use a [script](README.md#prepare-release) to prepare and tag the different releases.

### Creating a Pull Request

There are five important parts in a pull request:
- **Title**. The pull request title should match its related Github issue.
- **Description**. Do your best to put only relevant information and use it to link the Github issue through [default keywords](https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword).
  - Adhoc keywords also can be useful to provide more context. Maybe you are planning multiple pull requests under the same issue, then they _relate_ to the issue; or maybe the pull request _depends_ on the closing of another.
- **Destination branch**. The destination branch is determined by the [Branching Strategy](#branching-strategy) section you can find below.
- **Labels**. Labels help classify similar pull requests. We recommend using at least a `kind/*` one (and `breaking` when a change is non-backward compatible), but you are free to create and use others as well: take into account the labels of the related issue.
- **Type**. If the proposed changes are ready to review then open a pull request. In case the work is still in progress or just experimental, create a draft pull request instead.

## Branching Strategy

[Git](https://git-scm.com/) is our version control system for tracking changes in our codebase. As you may know, in Git's implementation, branching is really cheap!
So we need an orderly, controlled way of dealing with them: Enter Branching Strategy. This is the set of rules in which we base our workflow.

### Key branches

**main**
- Always releasable: We consider `origin/main` to be the main branch where the source code of `HEAD` always reflects a *production-ready state*.
- Prevent changes without a pull request (see [Merging a Pull Request](#merging-a-pull-request))
- Changes come from the `develop` branch, `release` or `hotfix`
- Merge strategy to use:
  - `--no-ff` for `develop` and `release` branches
  - `--squash` for `hotfix` branches **except for [multi-hotfix](#multi-hotfix)**, which must use `--no-ff`.
- Releases are created from this branch

**develop**
- Changes come from `feature` and `bugfix` branches.
- Prevent changes without a pull request (see [Merging a Pull Request](#merging-a-pull-request))
- Merge strategy is `--squash` for `feature` and `bugfix` branches.

### Supporting branches

**release branches**
- One branch per *release*
- May branch off from `develop`
- Naming convention is `release/GH-ISSUEID`

**feature branches**
- One branch per *feature*
- May branch off from `develop`
- Naming convention is `feature/GH-ISSUEID`

**bugfix branches**
- One branch per *bugfix*
- May branch off from `develop`
- Naming convention is `bugfix/GH-ISSUEID`

**revert branches**
- One branch per *revert*
- May branch off from `develop`
- Naming convention is `revert/GH-ISSUEID`

**hotfix branches**
- One branch per *hotfix*
- May branch off from `main` or from a hotfix integration branch in a multi-hotfix scenario. See [Multi Hotfix](#multi-hotfix).
- Naming convention is `hotfix/GH-ISSUEID`

For instance, `feature/GH-1` but you can also add context to the branch name like `feature/GH-1-add-unit-test`.

#### Multi Hotfix
`multi-hotfix` are a special case of hotfix, where multiple patches (from different hotfix PRs) are included against a hotfix integration branch, which is the one that finally merges to `main`.

In this case, the hotfix branches are merged against this integration branch with `--squash`, and to get the release, this integration branch would merge against `main` with `--no-ff` strategy.

## Merging a Pull Request

Here there's one **Golden Rule**:
- **Who pushes the changes, merges the changes**. The author of the changes is the one who knows if the acceptance criteria of the related Github issue are completely met.
  - There may be exceptions to this rule. For instance, automated pull requests.

There is also a set of requirements to fulfill before merging a pull request:
- **Wait for the PR-verify to be successful**. PR-verify lets everyone know if your commits meet the conditions set for our repository.
- **Gather at least one approval from the required reviewers**. Code review by your peers is essential to keep the quality of the codebase.
- **The acceptance criteria of the related Github issue are completely met**.
- **All comments have been addressed and all reviews resolved**.
- **Sync before merge**. So you verify that everything works as expected with the latest revision of the destination branch.
