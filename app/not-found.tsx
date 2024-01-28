import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

function NotFound() {
  return (
    <div className="px-3 md:px-4 md:container sm:space-y-3">
      <Nav />
      <Card className="text-center py-14">
        <h1 className="text-3xl font-medium mb-5">Page not found!</h1>
        <Link href="/" prefetch>
          <Button>Go back</Button>
        </Link>
      </Card>
    </div>
  );
}

export default NotFound;
