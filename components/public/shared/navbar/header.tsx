import { NavMobile } from "./mobileNav";
import { Navbar } from "./nav";

export const Header = () => {
  return (
    <>
      <NavMobile /> {/* Muncul di mobile */}
      <Navbar /> {/* Muncul di desktop */}
    </>
  );
};
