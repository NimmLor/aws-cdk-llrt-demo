const preset = require('@atws/prettier-config')

/** @type {import("prettier").Options} */
const config = {
  ...preset,
  overrides: [
    {
      files: ['tsconfig.json', 'tsconfig.node.json'],
      options: {
        parser: 'jsonc',
      },
    },
  ],
}

module.exports = config
