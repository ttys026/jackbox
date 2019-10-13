import 'antd/es/icon/style';
import _Icon from 'antd/es/icon';
import 'antd/es/tooltip/style';
import _Tooltip from 'antd/es/tooltip';
import 'antd/es/divider/style';
import _Divider from 'antd/es/divider';
import 'antd/es/modal/style';
import _Modal from 'antd/es/modal';
import 'antd/es/message/style';
import _message from 'antd/es/message';
import React, { useState, useEffect } from 'react';
import { finaliseCSB } from 'codesandboxer';
import CopyToClipboard from 'react-copy-to-clipboard';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".jackbox-editor textarea {\n  outline: none;\n}\n.jackbox-container i {\n  cursor: pointer;\n}\n.jackbox-container i:hover {\n  color: #18f;\n}\n/* Syntax highlighting */\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: #90a4ae;\n}\n.token.punctuation {\n  color: #9e9e9e;\n}\n.namespace {\n  opacity: 0.7;\n}\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #e91e63;\n}\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n  color: #4caf50;\n}\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n  color: #795548;\n}\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #3f51b5;\n}\n.token.function {\n  color: #f44336;\n}\n.token.regex,\n.token.important,\n.token.variable {\n  color: #ff9800;\n}\n.token.important,\n.token.bold {\n  font-weight: bold;\n}\n.token.italic {\n  font-style: italic;\n}\n.token.entity {\n  cursor: help;\n}\n";
styleInject(css);

require('prismjs/components/prism-jsx');

var handleImport = function handleImport(file) {
  var deps = {};
  var importRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*;?$/gm;
  var finalContent = file.replace(importRegex, function (matchedImport) {
    if (matchedImport.includes('.')) {
      // relative import;
      if (matchedImport.includes('{')) {
        return matchedImport.replace(/['|"].*['|"]/, "'@umijs/hooks'");
      }

      return matchedImport.replace("import ", 'import { ').replace(" from", ' } from').replace(/['|"].*['|"]/, "'@umijs/hooks'");
    } else {
      // absolute import
      var pkgNameRegex = /(?<=["|'])(?:\\.|[^"'\\])*(?=["|'])/g;
      var pkgName = matchedImport.match(pkgNameRegex);

      if (pkgName) {
        deps[pkgName[0]] = 'latest';
      }

      return matchedImport;
    }
  });
  return [finalContent, deps];
};

var index = (function (props) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      expand = _useState2[0],
      setExpand = _useState2[1];

  var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      param = _useState4[0],
      setParam = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      showModel = _useState6[0],
      setShowModel = _useState6[1];

  var ret = handleImport(props.file);
  useEffect(function () {
    _message.config({
      top: 40,
      duration: 2,
      maxCount: 1
    });
  }, []);
  useEffect(function () {
    if (props.file) {
      var finalData = {
        files: {
          'index.html': {
            content: '<div id="root"></div>'
          },
          'demo.tsx': {
            content: ret[0]
          },
          'index.tsx': {
            content: "import React from 'react';\nimport ReactDOM from 'react-dom';\n".concat(ret[1].antd ? "import 'antd/dist/antd.css';" : '', "\nimport App from './demo';\n\n/** This is an auto-generated demo from @umijs/hooks\n * if you think it is not working as expected,\n * please report the issue at \n * https://github.com/umijs/hooks/issues\n**/\nReactDOM.render(\n  <App />,\n  document.getElementById('root')\n);")
          }
        },
        deps: _objectSpread2({}, ret[1], {
          'react': "^16.8.0",
          '@babel/runtime': '^7.6.3',
          '@umijs/hooks': 'latest'
        }),
        template: 'create-react-app-typescript',
        fileName: 'demo.tsx'
      };
      setParam(finaliseCSB(finalData, {
        name: 'hooks-demo'
      }).parameters);
    }
  }, [props.file]);
  return React.createElement("div", {
    className: 'jackbox-container'
  }, React.createElement("div", {
    style: {
      border: '1px solid #e8e8e8',
      borderRadius: 5
    }
  }, React.createElement("div", {
    style: {
      padding: 16
    }
  }, React.createElement(_Modal, // title="Basic Modal"
  {
    // title="Basic Modal"
    zIndex: 1002,
    style: {
      top: '10vh'
    },
    visible: showModel,
    onCancel: function onCancel() {
      return setShowModel(function (v) {
        return !v;
      });
    },
    width: '90vw',
    footer: null,
    getContainer: document.body
  }, React.createElement("div", {
    style: {
      overflow: 'auto',
      width: '100%',
      height: 'calc(80vh - 48px)'
    }
  }, typeof props.children === 'function' ? props.children() : props.children)), typeof props.children === 'function' ? props.children() : props.children, React.createElement("div", {
    style: {
      borderBottom: '1px solid #e8e8e8',
      margin: '16px 0'
    }
  }, React.createElement("span", {
    style: {
      position: 'relative',
      top: '10px',
      padding: '4px',
      left: '10px',
      background: 'white'
    }
  }, props.demoName)), "some description here", React.createElement(_Divider, {
    dashed: true
  }), React.createElement("div", {
    style: {
      float: 'right',
      marginTop: -16
    }
  }, React.createElement("span", {
    style: {
      marginRight: 16
    }
  }, React.createElement(CopyToClipboard, {
    text: props.file,
    options: {
      debug: true,
      message: '22'
    },
    onCopy: function onCopy() {
      return _message.success('复制成功');
    }
  }, React.createElement("span", null, React.createElement(_Tooltip, {
    title: "\u590D\u5236\u4EE3\u7801"
  }, React.createElement(_Icon, {
    type: "copy"
  }))))), React.createElement("span", {
    style: {
      marginRight: 16
    }
  }, React.createElement(_Tooltip, {
    title: "\u5168\u5C4F\u67E5\u770B"
  }, React.createElement(_Icon, {
    onClick: function onClick() {
      return setShowModel(function (v) {
        return !v;
      });
    },
    type: "fullscreen"
  }))), React.createElement("form", {
    style: {
      display: 'inline'
    },
    method: "POST",
    action: 'https://codesandbox.io/api/v1/sandboxes/define',
    target: '_blank'
  }, React.createElement("input", {
    type: 'hidden',
    value: param,
    name: 'parameters'
  }), React.createElement("button", {
    style: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      marginRight: 16
    },
    type: "submit"
  }, React.createElement(_Tooltip, {
    title: "\u5728 codesandbox \u4E2D\u6253\u5F00"
  }, React.createElement(_Icon, {
    type: "code-sandbox"
  })))), React.createElement(_Tooltip, {
    title: "\u67E5\u770B\u4EE3\u7801"
  }, React.createElement(_Icon, {
    onClick: function onClick() {
      setExpand(function (e) {
        return !e;
      });
    },
    style: {
      marginRight: 16
    },
    type: "code"
  })))), expand && React.createElement("div", {
    style: {
      borderTop: '1px solid #e8e8e8',
      padding: 16
    }
  }, React.createElement(Editor, {
    readOnly: true,
    value: ret[0],
    onValueChange: function onValueChange() {},
    highlight: function highlight$1(code) {
      return highlight(code, languages.jsx);
    },
    padding: 10,
    className: 'jackbox-editor',
    style: {
      fontFamily: '"Fira code", "Fira Mono", monospace',
      fontSize: 14
    }
  }))));
});

export default index;
