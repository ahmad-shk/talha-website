"use client";

import { useState } from "react";
import Link from "next/link";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import { megaMenuStyles } from "./MegaMenu.styles";
import type { MegaMenuItem as MegaMenuItemData } from "./MegaMenu.types";

export default function MegaMenuItem({ item, nested = false, onNavigate }: { item: MegaMenuItemData; nested?: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);

  if (item.children?.length) {
    return (
      <div className={megaMenuStyles.service}>
        <button
          type="button"
          className={megaMenuStyles.serviceParent}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {item.icon && <span aria-hidden="true" className={megaMenuStyles.serviceParentIcon}>{item.icon}</span>}
          <span>{item.title}</span>
          <CaretDown
            weight="bold"
            className={`ml-auto h-3.5 w-3.5 flex-shrink-0 text-[var(--fm-text-tertiary)] transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div className={megaMenuStyles.nestedBox}>
            {item.children.map((child) => (
              <MegaMenuItem key={`${child.title}-${child.href ?? "group"}`} item={child} nested onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.href) return null;

  return (
    <Link href={item.href} role="menuitem" className={megaMenuStyles.item} onClick={onNavigate}>
      {item.icon && <span aria-hidden="true" className={megaMenuStyles.itemIcon}>{item.icon}</span>}
      <span className="min-w-0">
        <span className={megaMenuStyles.itemTitle}>{item.title}</span>
        {item.description && <span className={megaMenuStyles.itemDescription}>{item.description}</span>}
      </span>
      {nested && <CaretRight weight="bold" className="ml-auto mt-1 h-3 w-3 flex-shrink-0 text-[var(--fm-text-tertiary)] transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-0.5" aria-hidden="true" />}
    </Link>
  );
}
