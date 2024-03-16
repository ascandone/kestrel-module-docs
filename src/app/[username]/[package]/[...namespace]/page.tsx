import { FC, ReactNode } from "react";
import Markdown from "react-markdown";
import type { Item, ModuleDoc, Variant } from "kestrel-lang";

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
          pl-2 py-1 rounded-sm border-l-4 border-pink-800
          bg-gradient-to-r from-pink-200 to-pink-50/50
          shadow shadow-pink-400/20
        `}
      >
        <pre className="whitespace-pre-wrap">{children}</pre>
      </h2>

      <div className="h-3" />

      {docComment === undefined ? null : (
        <div
          className={`
        px-1 prose
        prose-h1:text-xl prose-h2:text-xl prose-h1:leading-3 prose-h2:leading-3 prose-h3:leading-3
        prose-pre:bg-zinc-900
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
  username: string;
  package: string;
  namespace: string[];
};

export default async function Page({ params }: { params: Params }) {
  const { namespace, username, package: package_ } = params;

  const project = await fetch(
    `https://raw.githubusercontent.com/${username}/${package_}/main/docs.json`
  ).then((r) => r.json());

  const ns = namespace.join("/");
  const module = project.modules[ns];
  if (module === undefined) {
    return <div>Not found</div>;
  }

  return <ModuleInfo moduleDoc={module} />;
}
