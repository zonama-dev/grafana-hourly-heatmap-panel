/*
 * In order to extend the configuration follow the steps in
 * https://grafana.com/developers/plugin-tools/get-started/set-up-development-environment#extend-the-eslint-config
 */
const eslintConfig = require("./.config/eslint.config");

/**
 * @type {Array<import('eslint').Linter.Config>}
 */
module.exports = eslintConfig