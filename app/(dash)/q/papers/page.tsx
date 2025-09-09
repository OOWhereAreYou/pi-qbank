import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createQuestion } from "./actions";

export default function Page() {
  return (
    <form className="space-y-4" action={createQuestion}>
      <div>
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" />
      </div>
      <div>
        <Label htmlFor="optionA">Option A</Label>
        <Input id="optionA" name="optionA" />
      </div>
      <div>
        <Label htmlFor="optionB">Option B</Label>
        <Input id="optionB" name="optionB" />
      </div>
      <div>
        <Label htmlFor="optionC">Option C</Label>
        <Input id="optionC" name="optionC" />
      </div>
      <div>
        <Label htmlFor="optionD">Option D</Label>
        <Input id="optionD" name="optionD" />
      </div>
      <div>
        <Label htmlFor="answer">Answer</Label>
        <Input id="answer" name="answer" />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
