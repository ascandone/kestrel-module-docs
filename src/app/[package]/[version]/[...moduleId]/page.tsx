"use client";

import { FC, ReactNode } from "react";
import type { Item, ModuleDoc, Variant } from "kestrel-lang";
import useSWR from "swr";
import { Markdown } from "@/components/Markdown";

const ItemCard: FC<{
  id: string;
  children: ReactNode;
  docComment?: string;
}> = ({ children, docComment, id }) => {
  return (
    <div id={id}>
      <h2
        className={`
        text-pink-800 font-sans font-medium
          pl-2 py-2 md:rounded-sm md:border-l-4 border-pink-800
          bg-pink-200

          -mx-3 md:mx-0
        `}
      >
        <pre className="whitespace-pre-wrap">{children}</pre>
      </h2>

      <div className="h-3" />

      {docComment === undefined ? null : (
        <div
          className={`
        px-3 border-l
        prose
        prose-code:before:hidden prose-code:after:hidden
        prose-h1:text-xl prose-h2:text-xl prose-h1:leading-3 prose-h2:leading-3 prose-h3:leading-3
        prose-pre:bg-zinc-900
        max-w-screen-lg mx-auto
        rounded-none
        prose-pre:transparent prose-pre:m-0 prose-pre:p-0
        `}
        >
          <Markdown>{docComment}</Markdown>
        </div>
      )}
    </div>
  );
};

const showVariants = (variants: Variant[]) => {
  if (variants.length === 0) {
    return "{ }";
  }

  return variants
    .map((variant) => {
      if (variant.args.length === 0) {
        return `${variant.name}`;
      }
      const args = variant.args.map((arg) => arg).join(", ");
      return `${variant.name}(${args})`;
    })
    .map((v) => `  ${v},`)
    .join("\n");
};

const Name: FC<{ name: string }> = ({ name }) => (
  <a href={`#${name}`} className="font-bold text-pink-950 hover:underline">
    {name}
  </a>
);

const TypeDoc: FC<{ item: Item & { type: "adt" } }> = ({ item }) => {
  const hasParams = item.params.length !== 0;
  const params = hasParams ? `<${item.params.join(", ")}>` : null;

  const contructors =
    item.variants === undefined
      ? null
      : ` {\n${showVariants(item.variants)}\n}`;

  return (
    <ItemCard docComment={item.docComment} id={item.name}>
      type <Name name={item.name} />
      {params}
      {contructors}
    </ItemCard>
  );
};

const ValueDoc: FC<{ item: Item & { type: "value" } }> = ({ item }) => {
  const needsParens = !/[a-z]/.test(item.name[0]);
  const name = needsParens ? `(${item.name})` : item.name;

  return (
    <ItemCard docComment={item.docComment} id={item.name}>
      <Name name={name} /> : {item.signature}
    </ItemCard>
  );
};

function viewItem(item: Item): JSX.Element {
  switch (item.type) {
    case "adt":
      return <TypeDoc key={`adt-${item.name}`} item={item} />;
    case "value":
      return <ValueDoc key={`value-${item.name}`} item={item} />;
  }
}

const ModuleInfo: FC<{
  moduleDoc: ModuleDoc;
}> = ({ moduleDoc }) => {
  return (
    <div>
      <h1 className="text-4xl text-pink-800 font-bold font-mono">
        {moduleDoc.moduleName}
      </h1>

      {moduleDoc.moduleDoc === undefined ? null : (
        <div className="mt-3 prose">
          <Markdown>{moduleDoc.moduleDoc}</Markdown>
        </div>
      )}

      <div className="h-10" />
      <div className="flex flex-col gap-y-8">
        {moduleDoc.items.map((item) => viewItem(item))}
      </div>
    </div>
  );
};

type Params = {
  package: string;
  moduleId: string[];
};

const fetcher = (...args: any[]) =>
  // @ts-ignore
  fetch(...args).then((x) => x.json());

export default function Page({ params }: { params: Params }) {
  const { moduleId, package: package_ } = params;

  const { isLoading, error, data } = useSWR<any>(
    // `https://raw.githubusercontent.com/${username}/${package_}/main/docs.json`,
    `https://raw.githubusercontent.com/ascandone/kestrel-packages/refs/heads/main/kestrel_core/0.0.1/docs.json`,
    fetcher
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    console.log(error);
    return <div className="p-4">Error</div>;
  }

  const ns = moduleId.join("/");
  const module = data.modules[ns];

  if (module === undefined) {
    return <div>Not found</div>;
  }

  return <ModuleInfo moduleDoc={module} />;
}
