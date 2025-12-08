"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import DesktopSidebar from "./DesktopSiderbar";
import MobileSidebar from "./MobileSidebar";

export default function AppSidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="sm:hidden fixed z-50 left-1 top-4 inline-flex items-center justify-center h-10 w-10 rounded-md bg-white/90 shadow-md backdrop-blur-md border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop */}
      <DesktopSidebar />

      {/* Mobile */}
      <MobileSidebar open={open} setOpen={setOpen} />
    </>
  );
}