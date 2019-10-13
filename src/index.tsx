import React, { ReactNode, useState, useEffect } from 'react';
import { Divider, Icon, message, Tooltip, Modal } from 'antd';
import { finaliseCSB } from 'codesandboxer';
import CopyToClipboard from 'react-copy-to-clipboard';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
require('prismjs/components/prism-jsx');
import './style.less';

interface HookPlayGroudProps {
  children: ReactNode | ReactNode[],
  file?: string;
  demoName: string;
}

const handleImport = (file: string) => {
  const deps: {[key: string]: string} = {};

  const importRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*;?$/gm;

  const finalContent = file.replace(importRegex, (matchedImport) => {
    if(matchedImport.includes('.')){
      // relative import;
      if(matchedImport.includes('{')){
        return matchedImport.replace(/['|"].*['|"]/, "'@umijs/hooks'");
      }
      return matchedImport.replace("import ", 'import { ').replace(" from", ' } from').replace(/['|"].*['|"]/, "'@umijs/hooks'");
    } else {
      // absolute import
      const pkgNameRegex = /(?<=["|'])(?:\\.|[^"'\\])*(?=["|'])/g;
      const pkgName = matchedImport.match(pkgNameRegex);
      if(pkgName){
        deps[pkgName[0]] = 'latest';
      }
      return matchedImport;
    }
  })
  return [finalContent, deps] as const;
}



export default (props: HookPlayGroudProps) => {
  const [ expand, setExpand ] = useState(false);
  const [ param, setParam ] = useState('');
  const [ showModel, setShowModel ] = useState(false);
  const ret = handleImport(props.file!);

  useEffect(()=>{
    message.config({
      top: 40,
      duration: 2,
      maxCount: 1,
    });
  }, []);

  useEffect(()=>{
    if(props.file){
      const finalData = {
        files: {
          'index.html': {
            content: '<div id="root"></div>',
          },
          'demo.tsx': {
            content : ret[0],
          },
          'index.tsx': {
            content: `import React from 'react';
import ReactDOM from 'react-dom';
${ret[1].antd ? "import 'antd/dist/antd.css';" : ''}
import App from './demo';

/** This is an auto-generated demo from @umijs/hooks
 * if you think it is not working as expected,
 * please report the issue at 
 * https://github.com/umijs/hooks/issues
**/
ReactDOM.render(
  <App />,
  document.getElementById('root')
);`
          }
        },
        deps: {
          ...ret[1],
          'react': "^16.8.0",
          '@babel/runtime': '^7.6.3',
          '@umijs/hooks': 'latest',
        },
        template: 'create-react-app-typescript',
        fileName: 'demo.tsx',
      }
      setParam(finaliseCSB(finalData, { name: 'hooks-demo' }).parameters);
    }
  }, [props.file])

  return (
    <div className={'jackbox-container'}>
      <div style={{border: '1px solid #e8e8e8', borderRadius: 5}}>
        <div style={{ padding: 16 }}>
          {<Modal 
            // title="Basic Modal"
            zIndex={1002}
            style={{ top: '10vh' }}
            visible={showModel}
            onCancel={()=>setShowModel(v=>!v)}
            width={'90vw'}
            footer={null}
            getContainer={document.body}
          >
            <div style={{overflow: 'auto', width: '100%', height: 'calc(80vh - 48px)'}}>{typeof props.children === 'function' ? props.children() : props.children}</div>
          </Modal>}
          {typeof props.children === 'function' ? props.children() : props.children}
          <div style={{ borderBottom: '1px solid #e8e8e8', margin: '16px 0' }}>
            <span style={{ position: 'relative', top: '10px', padding: '4px', left: '10px', background: 'white'}}>{props.demoName}</span>
          </div>
          some description here
          <Divider dashed />
          <div style={{float: 'right', marginTop: -16}}>
            <span style={{marginRight: 16}}>
            <CopyToClipboard text={props.file} options={{debug: true, message: '22'}}
              onCopy={() => message.success('复制成功')}>
              <span><Tooltip title='复制代码'><Icon type="copy" /></Tooltip></span>
            </CopyToClipboard>
            </span>

            <span style={{marginRight: 16}}>
              <Tooltip title='全屏查看'><Icon onClick={()=>setShowModel(v=>!v)} type="fullscreen" /></Tooltip>
            </span>
            <form style={{display: 'inline' }} method="POST" action='https://codesandbox.io/api/v1/sandboxes/define'  target='_blank'>
              <input type='hidden' value={param} name='parameters' />
              <button style={{ background: 'transparent', border: 'none', outline: 'none', marginRight: 16 }} type="submit">
                <Tooltip title='在 codesandbox 中打开'>
                  <Icon type="code-sandbox" />
                </Tooltip>
              </button>
            </form>
            <Tooltip title='查看代码'><Icon onClick={()=>{setExpand(e=>!e)}} style={{marginRight: 16}} type="code" /></Tooltip>
          </div>
        </div>
        {expand && <div style={{ borderTop: '1px solid #e8e8e8', padding: 16}}>
          <Editor
            readOnly
            value={ret[0]}
            onValueChange={()=>{}}
            highlight={code => highlight(code, languages.jsx)}
            padding={10}
            className={'jackbox-editor'}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
            }}
        />
        </div>}
      </div>
    </div>
  )
}