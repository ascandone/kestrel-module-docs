import { FC, ReactNode } from "react";
import { Item, ModuleDoc, ProjectDoc } from "@/documentation";
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
        <div className="px-2 prose prose-h1:text-xl prose-h2:text-xl prose-h1:leading-3  prose-h2:leading-3 prose-h3:leading-3">
          <Markdown>{docComment}</Markdown>
        </div>
      )}
    </div>
  );
};

const TypeDoc: FC<{ type: Item & { type: "adt" } }> = ({ type }) => {
  return <ItemCard docComment={type.docComment}>type {type.name}</ItemCard>;
};

const ValueDoc: FC<{ type: Item & { type: "value" } }> = ({ type }) => {
  return (
    <ItemCard docComment={type.docComment}>
      let {type.name}: {type.signature}
    </ItemCard>
  );
};

function viewItem(item: Item): JSX.Element {
  switch (item.type) {
    case "adt":
      return <TypeDoc key={`adt-${item.name}`} type={item} />;
    case "value":
      return <ValueDoc key={`value-${item.name}`} type={item} />;
  }
}

const ModuleInfo: FC<{
  moduleDoc: ModuleDoc;
}> = ({ moduleDoc }) => {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-4">
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