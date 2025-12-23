module.exports = {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/sections/**/*.stories.@(js|jsx|ts|tsx)'
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // 'storybook-addon-next'
    '@storybook/addon-interactions'
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  core: {
    builder: '@storybook/builder-webpack5'
  },
  staticDirs: ['../public']
};
