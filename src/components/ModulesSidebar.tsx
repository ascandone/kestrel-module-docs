"use client";

import { FC } from "react";
import Link from "next/link";

const linkCls = "text-pink-800 font-semibold text-mono hover:underline";

export const ModulesSideBar: FC<{
  package_: string;
  version: string;
  modules: string[];
  onClickedLink: VoidFunction;
}> = ({ modules, package_, version, onClickedLink }) => (
  <div className="py-3 px-4 overflow-y-auto h-screen bg-white shadow border-r-gray-200 z-50">
    <h3>
      <Link
        href={`/${package_}/${version}`}
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
          href={`/${package_}/${version}`}
          className={linkCls}
        >
          README
        </Link>
      </li>
      {/* <li>
        <a
          target="_blank"
          href={`https://github.com/${package_}/${version}`}
          className={linkCls}
        >
          Source
        </a>
      </li> */}
    </ul>

    <h2 className="font-bold text-gray-900 text-lg">Modules</h2>
    <ul>
      {modules.map((module) => (
        <li key={module}>
          <Link
            onClick={onClickedLink}
            href={`/${package_}/${version}/${module}`}
            className={linkCls}
          >
            {module}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
