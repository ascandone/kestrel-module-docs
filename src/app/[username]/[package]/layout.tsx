import { ModulesSideBar } from "@/components/ModulesSidebar";
import { ReactNode } from "react";

type Params = {
  username: string;
  package: string;
};

export default function Layout({
  params: { package: package_, username },
  children,
}: {
  params: Params;
  children: ReactNode;
}) {
  return (
    <div className="px-4">
      <div className="grid grid-cols-12 gap-x-4">
        <div className="col-span-3">
          <ModulesSideBar package_={package_} username={username} />
        </div>
        <main className="col-span-8">{children}</main>
      </div>
    </div>
  );
}
