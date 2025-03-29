// Babel configuration for Expo projects
module.exports = function(api) {
  // Cache configuration for performance
  api.cache(true);

  return {
    // Base Expo presets
    presets: ['babel-preset-expo'],
    
    // Plugin configuration
    plugins: [
      // Environment variables loader
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',         // Import namespace
          path: '.env',               // Environment file location
          safe: false,                // Disable safe mode for flexibility
          allowUndefined: true,      // Allow missing variables
        }
      ]
    ]
  };
};