import { FC, ReactNode } from "react";
import { Item, ModuleDoc, Variant } from "@/documentation";
import Markdown from "react-markdown";

const ItemCard: FC<{
  children: ReactNode;
  docComment?: string;
}> = ({ children, docComment }) => {
  return (
    <div>
      <h2
        className={`
        text-pink-950 font-sans font-semibold
          pl-2 py-1 rounded-sm border-l-4 border-pink-800 bg-gradient-to-r from-pink-200 to-pink-50/50
        `}
      >
        <pre className="whitespace-pre-wrap">{children}</pre>
      </h2>

      <div className="h-3" />

      {docComment === undefined ? null : (
        <div className="px-1 prose prose-h1:text-xl prose-h2:text-xl prose-h1:leading-3  prose-h2:leading-3 prose-h3:leading-3">
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
    .map((v) => `  ${v}`)
    .join(",\n");
};

const TypeDoc: FC<{ item: Item & { type: "adt" } }> = ({ item }) => {
  const hasParams = item.params.length !== 0;
  const params = hasParams ? `<${item.params.join(", ")}>` : null;

  const contructors =
    item.variants === undefined
      ? null
      : ` {\n${showVariants(item.variants)}\n}`;

  return (
    <ItemCard docComment={item.docComment}>
      type {item.name}
      {params}
      {contructors}
    </ItemCard>
  );
};

const ValueDoc: FC<{ item: Item & { type: "value" } }> = ({ item }) => {
  const needsParens = !/[a-z]/.test(item.name[0]);
  const name = needsParens ? `(${item.name})` : item.name;

  return (
    <ItemCard docComment={item.docComment}>
      let {name}: {item.signature}
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
      <div className="h-8" />
      <div className="flex flex-col gap-y-6">
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
