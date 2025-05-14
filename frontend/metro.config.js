const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Destructure after getting the base config
const { transformer, resolver } = config;

// Add support for SVG files
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg', 'cjs'], // Include 'cjs' here
  unstable_enablePackageExports: false, // Firebase compatibility
};

// Optional: Add more asset types (you probably don't need to re-push .png etc. if already included)
config.watchFolders = [...(config.watchFolders || []), './assets'];

// Wrap config with NativeWind
module.exports = withNativeWind(config, { input: './global.css' });
