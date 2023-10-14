# Coding Conventions for JavaScript projects

Here's a list of useful resources that everyone should check before contributing to this project.

## Table of Contents

1. [Typescript Style guide](#javascript-style-guide)
   - [Style guide reference](#style-guide-reference)
   - [Exclusions](#exclusions)
2. [Managing dependencies with npm](#managing-dependencies-with-npm)
3. [Documentation style guide](#documentation-style-guide)

## Typescript Style guide

To maintain consistency in the format of our codebase, we provide an [ESLint](https://eslint.org/) configuration file with rules, `.eslintrc.json`.

### Style guide reference

> Note that ESLint will not apply any rule by default. Rules have to be explicitly enabled via configuration.

Our style guide consists of 3 sets of rules, divided according to their function:

- **Formatting rules**: (ex: `max-len`, `no-mixed-spaces-and-tabs`, `keyword-spacing`, etc.):
  These rules are intended to ensure consistency of formatting throughout the code. The formatting standard that we are imposing is defined by [Prettier](https://prettier.io/), which is an opinionated code formatter.
  Prettier is used as **standard** formatting. This means that ESLint has the Prettier plugin configured and will format the code according to the Prettier standard. Prettier is transparent to the developer.

  - The `printWidth` limit was extended to **80 characters** of maximum line length.

- **Naming-convention rules**: (ex: `camelcase`, `new-cap`, `id-length`, etc.):
  Naming rules allow us to point out those names that deviate from the standard; they are the only way to ensure a consistent naming pattern throughout the code base. Prettier standard does not set any naming rules.
  We provide the [Google Typescript Syntax Guide](https://google.github.io/styleguide/tsguide.html#syntax) as the reference for all naming conventions. In addition, we recommend using [snake_case](https://google.github.io/styleguide/tsguide.html#identifiers-imports) for naming `.ts` files.

- **Code-quality rules**: (ex: `no-unused-vars`, `no-extra-bind`, `prefer-promise-reject-errors`, etc.):
  Another job performed by modern linters is to ensure a minimum code quality. ESLint applies, in addition to the formatting and naming rules, a set of code quality rules.
  We follow the [unobtrusive configuration](https://github.com/suchipi/eslint-config-unobtrusive) to ensure that language-specific best practices are followed. The goal is to achieve a good balance between helping the developer and interfering with the developer's good judgment.

> Some style decisions may not be enforced by our ESLint rules. We strongly recommend following the **[Google Typescript Style](https://google.github.io/styleguide/tsguide.html)**, especially for the naming conventions.

### Exclusions

Although all style-guide rules should be followed, there may be particular cases where it is necessary to disable a specific rule, i.e. add an exclusion. The preferred way to deal with exclusions is to use [configuration comments](https://eslint.org/docs/latest/user-guide/configuring/rules#using-configuration-comments-1).
Thanks to _configuration comments_ you can disable a particular rule by placing a comment next to the code that would raise the error.

A configuration comment should be the way to go in most cases, but if you need to disable some rules for a **group** of test or config files, you can also define an [overrides](https://eslint.org/docs/latest/user-guide/configuring/configuration-files#how-do-overrides-work) section inside your `.eslintrc.json`.

## Managing dependencies with npm

Every time you install or update a dependency via `npm install`, `npm` will generate/update the `package-lock.json` file with the concrete versions installed. Remember that `package-lock.json` file **must be tracked** with `git` as it provides the ability to consistently reproduce the `node_modules` dependencies directory without having to commit the directory itself.

You must also make sure all non-runtime dependencies are installed as `devDependencies` with the `--save-dev` option.

## Documentation style guide

Check out GitHub's [Mastering Markdown](https://guides.github.com/features/mastering-markdown/) to learn about the basic syntax and _GitHub Flavored Markdown_.
