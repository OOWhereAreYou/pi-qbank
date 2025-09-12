import { getPaper } from "../actions";

type IProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: IProps) {
  const { id } = await params;
  if (id == "new" || id == "create") {
    return <div></div>;
  }
  const result = await getPaper(id);
  return <div></div>;
}
