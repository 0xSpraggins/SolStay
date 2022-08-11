module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    
    resolver: {
      sourceExts: ['jsx','js','ts','tsx', "cjs"],
      extraNodeModules: {
        stream: require.resolve('readable-stream'),
        crypto: require.resolve('react-native-crypto-js'),
      }
     },
  };