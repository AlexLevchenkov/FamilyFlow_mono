module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@common": "../../common",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
      ],
    ],
  };
};
