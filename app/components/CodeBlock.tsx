import React, { FC, ReactNode } from 'react';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
    children: ReactNode;
}

const CodeBlock: FC<CodeBlockProps> = ({ children }) => {
    return (
        <pre className={styles.pre}>
      <code className={styles.code}>
        {children}
      </code>
    </pre>
    );
};

export default CodeBlock;
