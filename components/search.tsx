import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Search() {
  return (
    <div className="flex w-full mx-auto max-w-md items-center space-x-2">
      <Input type="text" placeholder="React" className="bg-white" />
      <Button type="submit">Search</Button>
    </div>
  );
}
