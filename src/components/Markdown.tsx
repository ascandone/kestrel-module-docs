import { FC, ReactNode } from "react";
import RawMarkdown from "react-markdown";
import { SyntaxHighlighter } from "@/components/Highlight";

export const Markdown: FC<{ children: string }> = ({ children }) => (
  <RawMarkdown
    className="prose prose-pre:p-0"
    components={{
      code(props) {
        const { children, className, node, ...rest } = props;
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
          <SyntaxHighlighter
            language={match[1]}
            code={String(children).replace(/\n$/, "")}
          />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        );
      },
    }}
  >
    {children}
  </RawMarkdown>
);
