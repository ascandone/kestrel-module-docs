import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const ModulesSideBar: FC<{
  username: string;
  package_: string;
}> = async ({ username, package_ }) => {
  const json = await fetch(
    `https://raw.githubusercontent.com/${username}/${package_}/main/docs.json`
  ).then((r) => r.json());

  const modules = Object.keys(json.modules).sort();

  return (
    <div className="py-4">
      <h3>
        <Link
          href={`/${username}/${package_}`}
          className="text-pink-800 font-semibold text-mono"
        >
          {package_}
        </Link>
      </h3>

      <div className="h-4"></div>

      <h2 className="text-black font-bold">Modules:</h2>

      <ul className="list-disc list-inside">
        {modules.map((module) => (
          <li key={module}>
            <Link
              href={`/${username}/${package_}/${module}`}
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
