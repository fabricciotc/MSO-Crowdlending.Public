module.exports = function override(config, env) {
  config.module.rules = [
    ...config.module.rules,
    {
      resolve: {
        fallback: {
          stream: require.resolve("stream-browserify"),
          assert: require.resolve("assert"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          zlib: require.resolve("browserify-zlib"),
          url: require.resolve("url"),
        },
      },
    },
  ];

  // New config, e.g. config.plugins.push...
  return config;
};
