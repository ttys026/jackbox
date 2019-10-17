export const newpkgJSON = (
  dependencies: any = {},
  name = 'codesandboxer-example',
  main = 'index.js',
  devDependencies: any = {},
) => `{
  "name": "${name}",
  "version": "0.0.0",
  "description": "An auto generated demo of @umijs/hooks",
  "main": "${main}",
  "dependencies": {
    ${Object.keys(dependencies)
      .map(k => `"${k}": "${dependencies[k]}"`)
      .join(',\n    ')}
  },
  "devDependencies": {
    ${Object.keys(devDependencies)
      .map(k => `"${k}": "${devDependencies[k]}"`)
      .join(',\n    ')}
  }
}`;
