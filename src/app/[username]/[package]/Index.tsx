import { FC } from "react";
import { ProjectDoc } from "@/documentation";
import Markdown from "react-markdown";

export const Index: FC<{ packageDocs: ProjectDoc; readme: string }> = ({
  packageDocs,
  readme,
}) => {
  const modules = Object.keys(packageDocs.modules).sort();

  return (
    <div className="px-4">
      <div className="grid grid-cols-12">
        <div className="col-span-3 border">
          <ModulesSideBar modules={modules} />
        </div>
        <main className="col-span-8">
          <Markdown>{readme}</Markdown>
        </main>
      </div>
    </div>
  );
};
