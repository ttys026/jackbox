import { ReactNode } from 'react';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import './style.less';
interface HookPlayGroudProps {
    children: ReactNode | ReactNode[];
    file?: string;
    demoName: string;
}
declare const _default: (props: HookPlayGroudProps) => JSX.Element;
export default _default;
