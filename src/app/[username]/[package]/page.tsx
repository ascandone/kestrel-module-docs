import Markdown from "react-markdown";

type Params = {
  username: string;
  package: string;
};

export default async function Home(props: { params: Params }) {
  const { username, package: package_ } = props.params;

  const readme = await fetch(
    `https://raw.githubusercontent.com/${username}/${package_}/main/README.md`
  ).then((r) => r.text());

  return (
    <div className="prose">
      <Markdown>{readme}</Markdown>
    </div>
  );
}
