import { getQuestion } from "../actions";
import { ViewCOmponent } from "./view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getQuestion(id);
  return <ViewCOmponent defaultValue={result.data} />;
}
