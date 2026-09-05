"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import MegaMenuItem from "./MegaMenuItem";
import { megaMenuStyles } from "./MegaMenu.styles";
import type { MegaMenuConfig, MegaMenuGroup, MegaMenuItem as MegaMenuItemData } from "./MegaMenu.types";

const CLOSE_ANIMATION_MS = 220;

function MobileServiceItem({ item }: { item: MegaMenuItemData }) {
  if (item.children?.length) {
    return (
      <div className={megaMenuStyles.mobileService}>
        <div className={megaMenuStyles.mobileServiceParent}>{item.title}</div>
        <div className={megaMenuStyles.mobileNestedBox}>
          {item.children.map((child) => <MobileServiceItem key={`${child.title}-${child.href ?? "group"}`} item={child} />)}
        </div>
      </div>
    );
  }

  if (!item.href) return null;

  return (
    <Link href={item.href} onClick={(event) => event.stopPropagation()} className={megaMenuStyles.mobileItem}>
      {item.icon && <span className="text-[var(--fm-lime)]">{item.icon}</span>}
      <span>
        <span className="block text-sm font-semibold text-[var(--fm-text-primary)]">{item.title}</span>
        {item.description && <span className="block text-xs leading-relaxed text-[var(--fm-text-secondary)]">{item.description}</span>}
      </span>
    </Link>
  );
}

function MobileCountry({ group }: { group: MegaMenuGroup }) {
  return (
    <section className={megaMenuStyles.mobileCountry}>
      <h3 className={megaMenuStyles.mobileCountryTitle}>{group.title}</h3>
      <div className="space-y-1">
        {group.items.map((item) => <MobileServiceItem key={`${item.title}-${item.href ?? "group"}`} item={item} />)}
      </div>
    </section>
  );
}

export default function MegaMenu({ config }: { config: MegaMenuConfig }) {
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [menuTop, setMenuTop] = useState(0);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const updateMenuPosition = () => {
    const header = triggerRef.current?.closest("header");
    if (header) setMenuTop(header.getBoundingClientRect().bottom + 8);
  };

  const openMenu = () => {
    clearCloseTimer();
    updateMenuPosition();
    setRendered(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeMenu = () => {
    clearCloseTimer();
    setOpen(false);
    closeTimerRef.current = setTimeout(() => setRendered(false), CLOSE_ANIMATION_MS);
  };

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    if (!rendered) return;
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, { passive: true });
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition);
    };
  }, [rendered]);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      closeMenu();
    };
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, []);

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openMenu();
      requestAnimationFrame(() => document.getElementById(menuId)?.querySelector<HTMLElement>("[role='menuitem']")?.focus());
    }
    if (event.key === "Escape") closeMenu();
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("[role='menuitem']"));
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      items.at(-1)?.focus();
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("[role='menuitem']")) closeMenu();
  };

  const panel = rendered ? (
    <div ref={panelRef} id={menuId} role="menu" aria-label={`${config.label} menu`} onKeyDown={handleMenuKeyDown} onClick={handleMenuClick} className={`${megaMenuStyles.panel} ${open ? megaMenuStyles.panelOpen : megaMenuStyles.panelClosed}`} style={{ top: menuTop }}>
      <div className={megaMenuStyles.header}>
        <div>
          <div className={megaMenuStyles.headerEyebrow}>Service</div>
          <h2 className={megaMenuStyles.headerTitle}>{config.label}</h2>
        </div>
        <p className={megaMenuStyles.headerDescription}>Business registration, taxation, compliance and operational support across key markets.</p>
      </div>
      <div className={megaMenuStyles.content}>
        {config.groups.map((group) => (
          <section key={group.title} className={megaMenuStyles.country}>
            <h3 className={megaMenuStyles.countryTitle}><span aria-hidden="true" className={megaMenuStyles.countryMarker} />{group.title}</h3>
            <div className={megaMenuStyles.serviceList}>
              {group.items.map((item) => <MegaMenuItem key={`${item.title}-${item.href ?? "group"}`} item={item} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <div ref={wrapperRef} className={`${megaMenuStyles.wrapper} hidden lg:block`}>
      <button ref={triggerRef} type="button" className={megaMenuStyles.trigger} aria-expanded={open} aria-controls={menuId} onClick={() => (open ? closeMenu() : openMenu())} onKeyDown={handleTriggerKeyDown}>
        {config.label}<ChevronDown className={`h-3.5 w-3.5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {typeof document !== "undefined" && panel ? createPortal(panel, document.body) : null}
    </div>
  );
}

export function MegaMenuMobile({ config }: { config: MegaMenuConfig }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="border-b border-[var(--fm-border)] lg:hidden">
      <button type="button" className="flex w-full items-center justify-between px-1 py-[15px] text-left font-sans text-[17px] font-semibold text-[var(--fm-text-primary)]" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {config.label}<ChevronDown className={`h-4 w-4 text-[var(--fm-text-tertiary)] transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="pb-2">
          {config.groups.map((group) => <MobileCountry key={group.title} group={group} />)}
        </div>
      )}
    </li>
  );
}
