const options = {
  entry: 'src/index.tsx',
  esm: 'rollup',
  cjs: 'rollup',
  preCommit: {
    eslint: true,
    prettier: true,
  },
  extraBabelPlugins: [[
    'babel-plugin-import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    },
  ]],
};

export default options;
