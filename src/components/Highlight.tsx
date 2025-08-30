import { FC } from "react";
import { Light as SyntaxHighlighterBase } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

SyntaxHighlighterBase.registerLanguage("kestrel", (hljs: any) => {
  const KEYWORDS = {
    className: "keyword",
    beginKeywords: "match if else fn let pub type struct enum import",
  };
  const STRING = {
    className: "string",
    variants: [{ begin: /"/, end: /"/ }],
    contains: [hljs.BACKSLASH_ESCAPE],
    relevance: 0,
  };

  const DISCARD_NAME = {
    className: "comment",
    begin: "\\b_[a-z][a-z0-9_]*\\b",
    relevance: 0,
  };
  const NUMBER = {
    className: "number",
    variants: [
      {
        // binary
        begin: "\\b0[bB](?:_?[01]+)+",
      },
      {
        // octal
        begin: "\\b0[oO](?:_?[0-7]+)+",
      },
      {
        // hex
        begin: "\\b0[xX](?:_?[0-9a-fA-F]+)+",
      },
      {
        // dec, float
        begin: "\\b\\d(?:_?\\d+)*(?:\\.(?:\\d(?:_?\\d+)*)*)?",
      },
    ],
    relevance: 0,
  };

  return {
    name: "kestrel",
    aliases: ["kestrel"],
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      STRING,
      // {
      //   className: "attribute",
      //   begin: "@",
      //   end: "\\(",
      //   excludeEnd: true,
      // },
      KEYWORDS,
      {
        // Type names and constructors
        className: "title",
        begin: "\\b[A-Z][A-Za-z0-9]*\\b",
        relevance: 0,
      },
      {
        className: "operator",
        begin: "[+\\-*/%!=<>&|.]+",
        relevance: 0,
      },
      // {
      //   className: "variable",
      //   begin: "\\b[a-z][a-z0-9_]*\\b",
      //   relevance: 0,
      // },
      DISCARD_NAME,
      NUMBER,
    ],
  };
});

export const SyntaxHighlighter: FC<{ language: string; code: string }> = ({
  code,
}) => (
  <SyntaxHighlighterBase
    PreTag="div"
    style={atomOneDark}
    customStyle={{
      backgroundColor: "#1e1e1e",
    }}
  >
    {code}
  </SyntaxHighlighterBase>
);
