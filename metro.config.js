const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = [
  path.resolve(__dirname, 'assets'),
  path.resolve(__dirname, 'app')
];

config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'jpg',
  'jpeg',
  'png'
];

module.exports = config;