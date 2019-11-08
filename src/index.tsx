import React, { ReactNode, useState, useEffect } from 'react';
import { Divider, Icon, message, Tooltip, Modal, Radio } from 'antd';
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import finaliseCSB from './codesandboxer/finaliseCSB';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import './style.less';

require('prismjs/components/prism-jsx');

interface JackBoxPlayGroudProps {
  children: ReactNode | ReactNode[];
  tsCode?: string;
  jsCode?: string;
  demoName: React.ReactNode;
  description: React.ReactNode;
  locale: 'zh-CN' | 'en-US';
}

const handleImport = (file: string) => {
  const deps: { [key: string]: string } = {};

  const importRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*;?$/gm;

  const finalContent = (file || '').replace(importRegex, matchedImport => {
    if (matchedImport.includes('.')) {
      // relative import;
      if (matchedImport.includes('{')) {
        return matchedImport.replace(/['|"].*['|"]/, "'@umijs/hooks'");
      }
      return matchedImport
        .replace('import ', 'import { ')
        .replace(' from', ' } from')
        .replace(/['|"].*['|"]/, "'@umijs/hooks'");
    }
    // absolute import
    const pkgNameRegex = /['|"](.*)['|"]/;
    const pkgName = (matchedImport.match(pkgNameRegex) || [])[1];
    if (pkgName) {
      const name = pkgName[0].trim();
      const version = (name.startsWith('@') ? name.split('@')[2] : name.split('@')[1]) || 'latest';
      if (name.includes('/')) {
        const nameList = name.split('/');
        if (name.startsWith('@')) {
          deps[`${nameList[0]}/${nameList[1]}`] = version;
        } else {
          deps[nameList[0]] = version;
        }
      } else {
        deps[name] = version;
      }
    }
    return matchedImport;
  });
  return [finalContent, deps] as const;
};

const event = (lan: 'js' | 'ts') => new CustomEvent('languageChange', { detail: lan });

export default (props: JackBoxPlayGroudProps) => {
  const [expand, setExpand] = useState(false);
  const [param, setParam] = useState('');
  const [showModel, setShowModel] = useState(false);
  const tsRet = handleImport(props.tsCode || '');
  const jsRet = handleImport(props.jsCode || '');
  const currentLanguage = localStorage.getItem('umijs-hooks-code-language');
  const [language, setLanguage] = useState(currentLanguage || 'js');
  const { locale = 'zh-CN' } = props;
  const isChinese = locale === 'zh-CN';
  const code = language === 'ts' ? tsRet[0] : jsRet[0];
  const dep = language === 'ts' ? tsRet[1] : jsRet[1];

  interface LanguageChangeEvent extends Partial<Event> {
    detail?: string;
  }

  useEffect(() => {
    message.config({
      top: 40,
      duration: 2,
      maxCount: 1,
    });
    const callback = (e: LanguageChangeEvent) => {
      if (e.detail) {
        setLanguage(e.detail);
        localStorage.setItem('umijs-hooks-code-language', e.detail);
      }
    };
    document.addEventListener('languageChange', callback);
    return () => {
      document.removeEventListener('languageChange', callback);
    };
  }, []);

  useEffect(() => {
    let tsData = {};
    let jsData = {};
    if (props.tsCode) {
      tsData = {
        files: {
          'index.html': {
            content: '<div style="margin: 16px;" id="root"></div>',
          },
          'demo.tsx': {
            content: code,
          },
          'index.tsx': {
            content: `import React from 'react';
import ReactDOM from 'react-dom';
${dep.antd ? "import 'antd/dist/antd.css';" : ''}
import App from './demo';

/** This is an auto-generated demo from @umijs/hooks
 * if you think it is not working as expected,
 * please report the issue at 
 * https://github.com/umijs/hooks/issues
**/
ReactDOM.render(
  <App />,
  document.getElementById('root')
);`,
          },
        },
        deps: {
          ...dep,
          react: '^16.8.0',
          '@babel/runtime': '^7.6.3',
          '@umijs/hooks': 'latest',
        },
        devDependencies: {
          typescript: '3.3.3',
        },
        template: 'create-react-app-typescript',
        fileName: 'demo.tsx',
      };
    }
    if (props.jsCode) {
      jsData = {
        files: {
          'index.html': {
            content: '<div style="margin: 16px;" id="root"></div>',
          },
          'demo.jsx': {
            content: code,
          },
          'index.js': {
            content: `import React from 'react';
import ReactDOM from 'react-dom';
${dep.antd ? "import 'antd/dist/antd.css';" : ''}
import App from './demo';

/** This is an auto-generated demo from @umijs/hooks
 * if you think it is not working as expected,
 * please report the issue at 
 * https://github.com/umijs/hooks/issues
**/
ReactDOM.render(
  <App />,
  document.getElementById('root')
);`,
          },
        },
        deps: {
          ...dep,
          react: '^16.8.0',
          '@babel/runtime': '^7.6.3',
          '@umijs/hooks': 'latest',
        },
        devDependencies: {
          typescript: '3.3.3',
        },
        template: 'create-react-app',
        fileName: 'demo.jsx',
      };
    }
    setParam(finaliseCSB(language === 'ts' ? tsData : jsData, { name: 'hooks-demo' }).parameters);
  }, [props.tsCode, props.jsCode, language, code, dep]);

  return (
    <div className="jackbox-container">
      <div style={{ border: '1px solid #e8e8e8', borderRadius: 5 }}>
        <div style={{ padding: 16 }}>
          <Modal
            bodyStyle={{ padding: 48 }}
            destroyOnClose
            zIndex={1002}
            style={{ top: '10vh' }}
            visible={showModel}
            onCancel={() => setShowModel(v => !v)}
            width="90vw"
            footer={null}
            getContainer={document.body}
          >
            <div style={{ overflow: 'auto', width: '100%', height: 'calc(80vh - 48px)' }}>
              {typeof props.children === 'function' ? props.children() : props.children}
            </div>
          </Modal>
          <div style={{ padding: 16 }}>
            {typeof props.children === 'function' ? props.children() : props.children}
          </div>
          <div style={{ borderBottom: '1px solid #e8e8e8', margin: '16px 0' }}>
            <span
              style={{
                position: 'relative',
                top: '10px',
                padding: '4px',
                left: '10px',
                background: 'white',
              }}
            >
              {props.demoName || '示例'}
            </span>
          </div>
          <div>{props.description || '暂无描述'}</div>
          <Divider dashed />
          <div style={{ float: 'right', marginTop: -16 }}>
            <span style={{ marginRight: 16 }}>
              <span style={{ width: 'fit-content', marginRight: 16 }}>
                <Radio.Group
                  value={language}
                  size="small"
                  buttonStyle="solid"
                  onChange={e => {
                    document.dispatchEvent(event(e.target.value));
                  }}
                >
                  <Radio.Button value="js">
                    <Tooltip title="查看 JavaScript 代码">JS</Tooltip>
                  </Radio.Button>
                  <Radio.Button value="ts">
                    <Tooltip title="查看 TypeScript 代码">TS</Tooltip>
                  </Radio.Button>
                </Radio.Group>
              </span>
              <CopyToClipboard
                text={code}
                onCopy={() => message.success(isChinese ? '复制成功' : 'Code Copied')}
              >
                <span>
                  <Tooltip title={isChinese ? '复制代码' : 'copy code'}>
                    <Icon type="copy" />
                  </Tooltip>
                </span>
              </CopyToClipboard>
            </span>

            <span style={{ marginRight: 16 }}>
              <Tooltip title={isChinese ? '全屏查看' : 'fullscreen'}>
                <Icon onClick={() => setShowModel(v => !v)} type="fullscreen" />
              </Tooltip>
            </span>
            <form
              style={{ display: 'inline' }}
              method="POST"
              action={`https://codesandbox.io/api/v1/sandboxes/define?query=module=/demo.${
                language === 'ts' ? 'tsx' : 'jsx'
              }`}
              target="_blank"
            >
              <input type="hidden" value={param} name="parameters" />
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  marginRight: 16,
                }}
                type="submit"
              >
                <Tooltip title={isChinese ? '在 codesandbox 中打开' : 'open in codesandbox'}>
                  <Icon type="code-sandbox" />
                </Tooltip>
              </button>
            </form>
            <Tooltip title={isChinese ? '查看代码' : 'view code'}>
              <Icon
                onClick={() => {
                  setExpand(e => !e);
                }}
                style={{ marginRight: 16 }}
                type="code"
              />
            </Tooltip>
          </div>
        </div>
        {expand && (
          <div style={{ borderTop: '1px solid #e8e8e8', padding: 16 }}>
            <Editor
              readOnly
              value={code}
              onValueChange={() => {}}
              highlight={c => highlight(c, languages.jsx)}
              padding={10}
              className="jackbox-editor"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
