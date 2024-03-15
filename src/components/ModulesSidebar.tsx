"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const ModulesSideBar: FC<{
  modules: string[];
}> = ({ modules }) => {
  const pathname = usePathname();

  return (
    <div>
      <h2 className="text-black font-bold text-lg">Modules:</h2>

      <ul className="list-disc list-inside">
        {modules.map((module) => (
          <li key={module}>
            <Link
              href={`${pathname}/${module}`}
              className="text-pink-800 font-semibold text-mono"
            >
              {module}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
