import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Icon from "@/components/icon";

function Nav() {
  return (
    <nav className="flex justify-between items-center py-7">
      <Icon />
      <a
        href="https://github.com/nishchay17/npmcounter"
        target="_blank"
        className="flex items-center gap-2 font-medium"
      >
        View source <GitHubLogoIcon height={24} width={24} />
      </a>
    </nav>
  );
}

export default Nav;
