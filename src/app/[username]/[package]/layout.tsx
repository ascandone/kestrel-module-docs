"use client";

import { ModulesSideBar } from "@/components/ModulesSidebar";
import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import type { ProjectDoc } from "kestrel-lang";
import useSWR from "swr";

type Params = {
  username: string;
  package: string;
};

const TopMenu: FC<{
  params: Params;
  version: string;
  onToggleOpened: VoidFunction;
}> = ({ params: { username, package: package_ }, version, onToggleOpened }) => (
  <div className="z-10 md:hidden px-4 py-3 _border _shadow-sm flex gap-x-4 items-center justify-between">
    <h3>
      <Link
        href={`/${username}/${package_}`}
        className="text-pink-800 font-semibold text-mono"
      >
        {package_}
      </Link>{" "}
      <span className="text-sm text-gray-600">{version}</span>
    </h3>

    <button onClick={onToggleOpened}>
      <Bars3Icon className="h-6" />
    </button>
  </div>
);

const fetcher = (...args: any[]) =>
  // @ts-ignore
  fetch(...args).then((x) => x.json());

export default function Layout({
  params: { package: package_, username },
  children,
}: {
  params: Params;
  children: ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const { isLoading, error, data } = useSWR<ProjectDoc>(
    `https://raw.githubusercontent.com/${username}/${package_}/main/docs.json`,
    fetcher
  );
  if (isLoading) {
    return <div className="p-4">Loading..</div>;
  }

  if (error || !data) {
    return <div className="p-4">Error</div>;
  }

  const modules = Object.keys(data.modules).sort();

  return (
    <>
      <TopMenu
        params={{ username, package: package_ }}
        version={data.version}
        onToggleOpened={() => {
          setOpened(!opened);
        }}
      />

      <div
        className={`
          fixed top-0 w-60 transition-transform duration-300 ease-in-out
          ${opened ? "" : "-translate-x-full"}
          md:-translate-x-0
        `}
      >
        <ModulesSideBar
          modules={modules}
          package_={package_}
          username={username}
          version={data.version}
          onClickedLink={() => setOpened(false)}
        />
      </div>
      <main className="col-span-8 md:ml-64 px-3 py-4 max-w-screen-md mx-auto">
        {children}
      </main>
    </>
  );
}
