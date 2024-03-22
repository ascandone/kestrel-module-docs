"use client";

import { FC } from "react";
import Link from "next/link";

const linkCls =
  "text-pink-800 font-semibold text-mono hover:underline active:bg-red-500";

export const ModulesSideBar: FC<{
  username: string;
  package_: string;
  modules: string[];
  version: string;
  onClickedLink: VoidFunction;
}> = ({ modules, username, package_, version, onClickedLink }) => (
  <div className="py-3 px-4 overflow-y-auto h-screen bg-white shadow border-r-gray-200 z-50">
    <h3>
      <Link
        href={`/${username}/${package_}`}
        className="text-pink-800 font-semibold text-mono"
      >
        {package_}
      </Link>{" "}
      <span className="text-sm text-gray-600">{version}</span>
    </h3>
    <div className="h-4"></div>

    <ul className="pb-4 pt-2">
      <li>
        <Link
          onClick={onClickedLink}
          href={`/${username}/${package_}`}
          className={linkCls}
        >
          README
        </Link>
      </li>
      <li>
        <a
          target="_blank"
          href={`https://github.com/${username}/${package_}`}
          className={linkCls}
        >
          Source
        </a>
      </li>
    </ul>

    <h2 className="font-bold text-gray-900 text-lg">Modules</h2>
    <ul>
      {modules.map((module) => (
        <li key={module}>
          <Link
            onClick={onClickedLink}
            href={`/${username}/${package_}/${module}`}
            className={linkCls}
          >
            {module}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
