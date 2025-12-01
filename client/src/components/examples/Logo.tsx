import { Logo } from "../Logo";

export default function LogoExample() {
  return (
    <div className="flex flex-col gap-4">
      <Logo />
      <Logo collapsed />
    </div>
  );
}
