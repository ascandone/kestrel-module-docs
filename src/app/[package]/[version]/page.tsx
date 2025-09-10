"use client";

import { Markdown } from "@/components/Markdown";
import useSWR from "swr";

const fetcher = (...args: any[]) =>
  // @ts-ignore
  fetch(...args).then((x) => x.text());

type Params = {
  username: string;
  package: string;
};

export default function Home(props: { params: Params }) {
  const { username, package: package_ } = props.params;

  const { isLoading, error, data } = useSWR<string>(
    // `https://raw.githubusercontent.com/${username}/${package_}/main/README.md`,
    `https://raw.githubusercontent.com/ascandone/kestrel-packages/refs/heads/main/kestrel_core/0.0.1/README.md`,
    fetcher
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error || !data) {
    return <div className="p-4">Error</div>;
  }

  return <Markdown>{data}</Markdown>;
}
