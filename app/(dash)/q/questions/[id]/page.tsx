import { getQuestion } from "../actions";
import { ViewCOmponent } from "./view";
type IProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: IProps) {
  const { id } = await params;
  if (id == "new" || id == "create") {
    return <ViewCOmponent />;
  }
  const result = await getQuestion(id);
  return <ViewCOmponent defaultValue={result.data} />;
}
