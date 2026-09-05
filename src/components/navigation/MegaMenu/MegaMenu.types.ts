import type { ReactNode } from "react";

export type MegaMenuItem = {
  title: string;
  description?: string;
  href?: string;
  icon?: ReactNode;
  children?: MegaMenuItem[];
};

export type MegaMenuGroup = {
  title: string;
  items: MegaMenuItem[];
};

export type MegaMenuLeftPanel = {
  title: string;
  description: string;
  icon: ReactNode;
  cta: {
    label: string;
    href: string;
  };
};

export type MegaMenuConfig = {
  label: string;
  href?: string;
  leftPanel?: MegaMenuLeftPanel;
  groups: MegaMenuGroup[];
  placement?: {
    offsetX?: number;
    offsetY?: number;
    width?: string;
  };
};
