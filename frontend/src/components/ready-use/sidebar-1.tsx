"use client";
import { useState } from "react";
import { Sidebar as SidebarComponent, Menu, MenuItem } from "react-pro-sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GripVertical,
  Warehouse,
  GanttChartSquare,
  Power,
  Milk,
  List,
  RefreshCcw,
  User,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { axiosInstance, rgbToHex } from "~/lib/utils";

interface SidebarProps {
  toggled: boolean;
  setToggled: (toggled: boolean) => void;
  setBroken: (broken: boolean) => void;
}

function Sidebar({ toggled, setToggled, setBroken }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // const [toggled, setToggled] = useState(false);

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => {
      return axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      router.replace("/login");
    },
  });

  return (
    <SidebarComponent
      backgroundColor="#1f2937"
      className="md:hidden"
      toggled={toggled}
      onBackdropClick={() => setToggled(false)}
      breakPoint="md"
      onBreakPoint={setBroken}
      rootStyles={{
        color: "#8A8C91",
        // height: '100%'
      }}
    >
      <div className="p-6 bg-zinc-600 flex justify-between">
        <h1
          className={'font-bold text-xl text-nowrap text-stone-300'}
        >
          Sidebar
        </h1>
      </div>
      <Menu
        menuItemStyles={{
          button: {
            ":hover": {
              backgroundColor: "#1f2937",
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: rgbToHex("214,211,209"),
              },
            },
            ["&.ps-active"]: {
              ["& > .ps-menu-icon, & > .ps-menu-label"]: {
                color: rgbToHex("214,211,209"),
              },
            },
          },
          label: {
            marginTop: "3px",
          },
        }}
      >
        <MenuItem
          component={<Link href="/" />}
          icon={<Warehouse size={20} />}
          active={pathname === "/"}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          component={<Link href="/transaksi" />}
          icon={<GanttChartSquare size={20} />}
          active={pathname === "/transaksi"}
        >
          Transaksi
        </MenuItem>
        <MenuItem icon={<Power />} onClick={() => logoutMutation.mutate()}>
          Logout
        </MenuItem>
      </Menu>
    </SidebarComponent>
  );
}

export default Sidebar;
