import { ModulesSideBar } from "@/components/ModulesSidebar";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

type Params = {
  username: string;
  package: string;
};

const TopMenu: FC<{ params: Params }> = ({
  params: { username, package: package_ },
}) => (
  <div className="md:hidden px-4 py-3 border shadow-sm flex gap-x-4 items-center justify-between">
    <h3>
      <Link
        href={`/${username}/${package_}`}
        className="text-pink-800 font-semibold text-mono"
      >
        {package_}
      </Link>
    </h3>

    <Bars3Icon className="h-6" />
  </div>
);
export default async function Layout({
  params: { package: package_, username },
  children,
}: {
  params: Params;
  children: ReactNode;
}) {
  const json = await fetch(
    `https://raw.githubusercontent.com/${username}/${package_}/main/docs.json`
  ).then((r) => r.json());

  const modules = Object.keys(json.modules).sort();

  return (
    <>
      <TopMenu params={{ username, package: package_ }} />

      <div className="fixed w-60 transition-transform duration-200 ease-in-out -translate-x-full md:-translate-x-0">
        <ModulesSideBar
          modules={modules}
          package_={package_}
          username={username}
        />
      </div>
      <main className="col-span-8 md:ml-64 px-4 py-4 max-w-screen-md mx-auto">
        {children}
      </main>
    </>
  );
}
