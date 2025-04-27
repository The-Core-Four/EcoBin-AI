const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

// Only add to watchFolders if directory exists
const mockPath = path.resolve(__dirname, 'app/mocks');
if (fs.existsSync(mockPath)) {
  config.watchFolders = [
    ...config.watchFolders,
    mockPath
  ];
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: path.resolve(__dirname, 'app/mocks/react-native-maps.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;