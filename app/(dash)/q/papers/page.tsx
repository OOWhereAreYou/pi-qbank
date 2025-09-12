import { listPapers } from "./actions";
import { ViewComponent } from "./view";

export default async function Page() {
  const result = await listPapers();
  return <ViewComponent />;
}
