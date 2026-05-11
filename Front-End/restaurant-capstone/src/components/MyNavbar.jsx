import { useEffect, useState } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

import LogoMonkey from "../assets/img/Logo/LogoMonkey.jpg";
import TextMonkeyFamily from "./TextMokeyFamily";

const MyNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading } = useSelector((state) => state.auth);

  const [selectedVenue, setSelectedVenue] = useState(() => {
    const venue = localStorage.getItem("selectedVenue");
    return venue ? { slug: venue } : null;
  });

  useEffect(() => {
    const loadVenue = () => {
      const venueSlug = localStorage.getItem("selectedVenue");
      setSelectedVenue(venueSlug ? { slug: venueSlug } : null);
    };
    loadVenue();
    window.addEventListener("venueChanged", loadVenue);
    return () => window.removeEventListener("venueChanged", loadVenue);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setSelectedVenue(null);
    localStorage.removeItem("selectedVenue");
    navigate("/");
  };

  const isLoggedIn = !!profile;
  const userAlias = profile?.alias || "";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Prenota", path: "/booking/form" },
    ...(selectedVenue ? [{ name: "Menu", path: `/menu/${selectedVenue.slug}` }] : []),
    ...(selectedVenue ? [{ name: "Eventi", path: `/events/${selectedVenue.slug}` }] : []),
  ];

  if (loading) {
    return <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#320842]/80 backdrop-blur-xl border-b border-[#DABFFF]/20 animate-pulse" />;
  }

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50 bg-[#320842]/80 backdrop-blur-xl border-b border-[#DABFFF]/20 shadow-lg py-2">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile hamburger */}
              <DisclosureButton className="md:hidden p-2 rounded-lg text-[#DABFFF] hover:bg-[#A06CD5]/30 focus:outline-none">
                <span className="sr-only">Apri menu</span>
                {open ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
              </DisclosureButton>

              {/* Logo */}
              <NavLink to="/" className="shrink-0 flex items-center">
                <img src={LogoMonkey} alt="Monkey Family" className="h-15 w-auto rounded-4xl ring-1 ring-[#DABFFF]/30 me-4" />
                <TextMonkeyFamily className="text-4xl font-black tracking-tight" />
              </NavLink>

              {/* Desktop */}
              <div className="hidden md:flex items-center gap-8">
                {/* Nav links */}
                <div className="flex gap-8">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-white font-semibold underline underline-offset-8 decoration-[#A06CD5]"
                          : "text-[#DABFFF] hover:text-white transition-colors duration-200"
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>

                {/* Sedi dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[#DABFFF] hover:bg-[#A06CD5]/20 transition-all">
                    <span className="font-medium">Sedi</span>
                    <ChevronDownIcon className="h-5 w-5 transition-transform data-[open]:rotate-180" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-3 w-72 bg-[#1C0127]/95 backdrop-blur-lg rounded-2xl py-3 shadow-2xl ring-1 ring-[#DABFFF]/20 overflow-hidden">
                    <MenuItem>
                      {({ active }) => (
                        <NavLink
                          to="/venue/cocktail-lab"
                          className={`block px-6 py-4 text-base transition-colors hover:bg-[#A06CD5]/20 ${active ? "bg-[#A06CD5]/30 text-white" : "text-[#DABFFF]"}`}
                        >
                          Monkey Cocktail Lab
                        </NavLink>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <NavLink
                          to="/venue/factory"
                          className={`block px-6 py-4 text-base transition-colors hover:bg-[#A06CD5]/20 ${active ? "bg-[#A06CD5]/30 text-white" : "text-[#DABFFF]"}`}
                        >
                          Monkey Factory
                        </NavLink>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>

                {/* Auth */}
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    {/* Bottone pannello admin */}
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive
                          ? "bg-[#A06CD5] text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-[#A06CD5]/30"
                          : "bg-[#A06CD5]/20 border border-[#A06CD5]/40 text-[#DABFFF] hover:bg-[#A06CD5]/40 px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-200"
                      }
                    >
                      {userAlias}
                    </NavLink>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="text-[#DABFFF]/50 hover:text-[#DABFFF] text-xs font-black px-3 py-2.5 rounded-xl border border-[#DABFFF]/10 hover:border-[#DABFFF]/30 transition-all duration-200"
                    >
                      Esci
                    </button>
                  </div>
                ) : (
                  <NavLink to="/login" className="bg-[#A06CD5] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#A06CD5]/90 transition shadow-md">
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>

          {/* Mobile panel */}
          <DisclosurePanel className="md:hidden bg-[#320842]/95 backdrop-blur-lg border-t border-[#DABFFF]/20">
            {({ close }) => (
              <div className="px-4 pt-5 pb-6 space-y-1">
                {/* Nav links */}
                {navLinks.map((link) => (
                  <DisclosureButton
                    key={link.name}
                    as={NavLink}
                    to={link.path}
                    className={({ isActive }) =>
                      isActive
                        ? "block bg-[#1C0127]/70 text-white px-5 py-4 rounded-xl font-medium"
                        : "block text-[#DABFFF] hover:text-white px-5 py-4 rounded-xl transition-colors"
                    }
                  >
                    {link.name}
                  </DisclosureButton>
                ))}

                {/* Sedi */}
                <div className="pt-2 border-t border-[#DABFFF]/10">
                  <p className="pt-3 pb-2 text-[#DABFFF]/50 text-xs font-black uppercase tracking-widest">Sedi</p>
                  <NavLink to="/venue/cocktail-lab" onClick={() => close()} className="block px-5 py-3.5 text-[#DABFFF] hover:text-white transition-colors">
                    Monkey Cocktail Lab
                  </NavLink>
                  <NavLink to="/venue/factory" onClick={() => close()} className="block px-5 py-3.5 text-[#DABFFF] hover:text-white transition-colors">
                    Monkey Factory
                  </NavLink>
                </div>

                {/* Auth mobile */}
                <div className="pt-2 border-t border-[#DABFFF]/10">
                  {isLoggedIn ? (
                    <>
                      {/* Pannello admin */}
                      <NavLink
                        to="/admin"
                        onClick={() => close()}
                        className="flex items-center justify-between px-5 py-4 text-[#DABFFF] hover:text-white transition-colors"
                      >
                        <span className="font-black">{userAlias}</span>
                        <span className="text-xs text-[#A06CD5] font-black">Pannello Admin →</span>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          close();
                          handleLogout();
                        }}
                        className="w-full text-left px-5 py-4 text-[#DABFFF]/50 hover:text-[#DABFFF] transition-colors text-sm"
                      >
                        Esci
                      </button>
                    </>
                  ) : (
                    <NavLink to="/login" onClick={() => close()} className="block px-5 py-4 text-[#DABFFF] hover:text-white transition-colors">
                      Login
                    </NavLink>
                  )}
                </div>
              </div>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default MyNavbar;
