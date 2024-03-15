import { FC } from "react";
import { ProjectDoc } from "@/documentation";
import Markdown from "react-markdown";
import { ModulesSideBar } from "@/components/ModulesSidebar";

const Index: FC<{ packageDocs: ProjectDoc; readme: string }> = ({
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

type Params = {
  username: string;
  package: string;
};

export default async function Home(props: { params: Params }) {
  const { username, package: package_ } = props.params;

  const [readme, json] = await Promise.all([
    fetch(
      `https://raw.githubusercontent.com/${username}/${package_}/main/README.md`
    ).then((r) => r.text()),
    fetch(
      `https://raw.githubusercontent.com/${username}/${package_}/main/docs.json`
    ).then((r) => r.json()),
  ]);

  return <Index packageDocs={json} readme={readme} />;
}
