import getParameters from './getParameters';
import { newpkgJSON } from '../constants';

const ensureReact = (deps: any) => {
  if (!deps.react && !deps['react-dom']) {
    deps.react = 'latest';
    deps['react-dom'] = 'latest';
  } else if (!deps.react) {
    deps.react = deps['react-dom'];
  } else if (!deps['react-dom']) {
    deps['react-dom'] = deps.react;
  }
};

export default ({ files, deps, devDependencies }: any, config: any) => {
  if (!config) config = {};
  const { extraFiles, extraDependencies, name, template = 'create-react-app' } = config;
  let { main } = config;
  const dependencies = {
    ...deps,
    ...extraDependencies,
  };

  main = !main && template === 'create-react-app-typescript' ? 'index.tsx' : 'index.js';

  ensureReact(dependencies);

  const finalFiles = {
    ...files,
    'package.json': {
      content: newpkgJSON(dependencies, name, main, devDependencies || {}),
    },
    'sandbox.config.json': {
      content: JSON.stringify({
        template,
      }),
    },
    ...extraFiles,
  };
  const parameters = getParameters({
    files: finalFiles,
  });
  return {
    files: finalFiles,
    dependencies,
    parameters,
  } as any;
};
