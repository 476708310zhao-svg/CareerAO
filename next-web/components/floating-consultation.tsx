"use client";

import Image from "next/image";
import { Check, MessageCircle, QrCode, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { publicAsset } from "@/lib/base-path";

type DialogType = "wechat" | "mini" | null;

const dialogContent = {
  wechat: {
    title: "微信咨询",
    description: "扫码添加职引客服，获取产品使用与求职工具相关帮助。",
    image: "/wechat-qr.jpg",
    imageAlt: "职引微信客服二维码",
    benefits: ["产品功能与使用答疑", "求职工具使用建议"],
    footnote: "人工服务 · 工作日 09:00–18:00",
  },
  mini: {
    title: "打开职引小程序",
    description: "微信扫码进入职引小程序，查看校招机会、面经题库与求职工具。",
    image: "/mini-program-qr.jpg",
    imageAlt: "职引小程序码",
    benefits: ["校招机会与求职资讯", "面经题库与求职工具"],
    footnote: "使用微信扫码即可打开",
  },
} as const;

function ConsultationCard({ type, onClose }: { type: Exclude<DialogType, null>; onClose: () => void }) {
  const content = dialogContent[type];

  return (
    <div className="zy-consultation-card">
      <button className="zy-consultation-close" type="button" onClick={onClose} aria-label={`关闭${content.title}`}>
        <X size={18} aria-hidden="true" />
      </button>
      <header className="zy-consultation-heading">
        <span className={`zy-consultation-mark ${type}`} aria-hidden="true">
          {type === "wechat" ? <MessageCircle size={24} /> : <QrCode size={24} />}
        </span>
        <div>
          <h2 id={`consultation-${type}-title`}>{content.title}</h2>
          <p id={`consultation-${type}-description`}>{content.description}</p>
        </div>
      </header>
      <div className="zy-consultation-body">
        <div className="zy-consultation-qr">
          <Image src={publicAsset(content.image)} alt={content.imageAlt} width={176} height={176} priority={false} />
        </div>
        <div className="zy-consultation-details">
          <strong>你可以获得</strong>
          <ul>
            {content.benefits.map((benefit) => (
              <li key={benefit}><Check size={14} aria-hidden="true" />{benefit}</li>
            ))}
          </ul>
          <small>{content.footnote}</small>
        </div>
      </div>
    </div>
  );
}

export function FloatingConsultation() {
  const [dialog, setDialog] = useState<DialogType>(null);
  const [usesDesktopPopover, setUsesDesktopPopover] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    cancelClose();
    setDialog(null);
  }, [cancelClose]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setDialog(null), 140);
  }, [cancelClose]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 821px)");
    const updateMode = () => setUsesDesktopPopover(query.matches);
    updateMode();
    query.addEventListener("change", updateMode);
    return () => query.removeEventListener("change", updateMode);
  }, []);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    if (!dialog) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onEscape);

    if (usesDesktopPopover) {
      return () => document.removeEventListener("keydown", onEscape);
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("button")?.focus());
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const controls = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]),a[href]"));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [close, dialog, usesDesktopPopover]);

  const open = (type: Exclude<DialogType, null>) => {
    cancelClose();
    setDialog(type);
  };

  return (
    <>
      <div
        className="zy-floating-consultation"
        onMouseEnter={cancelClose}
        onMouseLeave={() => usesDesktopPopover && scheduleClose()}
        onBlur={(event) => {
          if (usesDesktopPopover && !event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleClose();
        }}
      >
        <aside className="zy-floating-tools" aria-label="快捷咨询">
          <button
            type="button"
            onMouseEnter={() => usesDesktopPopover && open("wechat")}
            onMouseMove={() => usesDesktopPopover && open("wechat")}
            onPointerEnter={(event) => event.pointerType !== "touch" && usesDesktopPopover && open("wechat")}
            onFocus={() => open("wechat")}
            onClick={() => open("wechat")}
            aria-label="打开微信咨询"
            aria-haspopup="dialog"
            aria-expanded={dialog === "wechat"}
            aria-controls="consultation-wechat"
          >
            <span className="zy-floating-icon"><MessageCircle size={21} aria-hidden="true" /></span>
            <b>微信咨询</b>
          </button>
          <button
            type="button"
            onMouseEnter={() => usesDesktopPopover && open("mini")}
            onMouseMove={() => usesDesktopPopover && open("mini")}
            onPointerEnter={(event) => event.pointerType !== "touch" && usesDesktopPopover && open("mini")}
            onFocus={() => open("mini")}
            onClick={() => open("mini")}
            aria-label="打开职引小程序码"
            aria-haspopup="dialog"
            aria-expanded={dialog === "mini"}
            aria-controls="consultation-mini"
          >
            <span className="zy-floating-icon"><QrCode size={21} aria-hidden="true" /></span>
            <b>小程序</b>
          </button>
        </aside>

        {usesDesktopPopover && dialog && (
          <div
            id={`consultation-${dialog}`}
            className="zy-consultation-popover"
            role="dialog"
            aria-modal="false"
            aria-labelledby={`consultation-${dialog}-title`}
            aria-describedby={`consultation-${dialog}-description`}
          >
            <ConsultationCard type={dialog} onClose={close} />
          </div>
        )}
      </div>

      {!usesDesktopPopover && dialog && (
        <div className="zy-consultation-overlay">
          <button className="zy-consultation-backdrop" type="button" onClick={close} aria-label={`关闭${dialogContent[dialog].title}弹窗`} />
          <div
            ref={dialogRef}
            id={`consultation-${dialog}`}
            className="zy-consultation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`consultation-${dialog}-title`}
            aria-describedby={`consultation-${dialog}-description`}
          >
            <ConsultationCard type={dialog} onClose={close} />
          </div>
        </div>
      )}
    </>
  );
}
