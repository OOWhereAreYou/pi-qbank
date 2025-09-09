import { listQuestions } from "./actions";
import { ViewComponent } from "./view";

export default async function Page() {
  const result = await listQuestions();
  return <ViewComponent defaultValue={result.data} />;
}
