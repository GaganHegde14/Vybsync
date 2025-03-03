import React, { useState } from "react";

function SidebarController() {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.setProperty(
        "--SideNavigation-slideIn",
        "1"
      );
      setIsOpen(true);
    }
  };

  const closeSidebar = () => {
    if (typeof window !== "undefined") {
      document.documentElement.style.removeProperty("--SideNavigation-slideIn");
      document.body.style.removeProperty("overflow");
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const slideIn = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--SideNavigation-slideIn");
      if (slideIn) {
        closeSidebar();
      } else {
        openSidebar();
      }
    }
  };

  return (
    <div>
      <button onClick={toggleSidebar}>
        {isOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>
      {/* You could add more JSX here to render the actual sidebar */}
      <div
        style={{
          position: "fixed",
          left: isOpen ? "0" : "-250px",
          width: "250px",
          height: "100%",
          background: "#f0f0f0",
          transition: "left 0.3s ease-in-out",
        }}
      >
        Sidebar Content
      </div>
    </div>
  );
}

export default SidebarController;
