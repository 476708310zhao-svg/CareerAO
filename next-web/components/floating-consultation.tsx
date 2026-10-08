"use client";

import Image from "next/image";
import { MessageCircle, QrCode, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { publicAsset } from "@/lib/base-path";

type DialogType = "wechat" | "mini" | null;

const dialogContent = {
  wechat: {
    title: "添加人工客服",
    description: "扫码添加微信客服助手，获取求职答疑与产品使用帮助。",
    image: "/wechat-qr.jpg",
    imageAlt: "职引微信客服二维码",
    footnote: "服务时间：工作日 09:00–18:00",
  },
  mini: {
    title: "职引小程序",
    description: "微信扫码打开小程序，查看校招机会、面经题库和求职工具。",
    image: "/mini-program-qr.jpg",
    imageAlt: "职引小程序码",
    footnote: "微信扫码立即体验",
  },
} as const;

export function FloatingConsultation() {
  const [dialog, setDialog] = useState<DialogType>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!dialog) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("button")?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDialog(null);
        return;
      }
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
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [dialog]);

  const content = dialog ? dialogContent[dialog] : null;

  return (
    <>
      <aside className="zy-floating-tools" aria-label="快捷咨询">
        <button type="button" onClick={() => setDialog("wechat")} aria-label="打开微信咨询">
          <span className="zy-floating-icon"><MessageCircle size={21} aria-hidden="true" /></span>
          <b>微信咨询</b>
        </button>
        <button type="button" onClick={() => setDialog("mini")} aria-label="打开职引小程序码">
          <span className="zy-floating-icon"><QrCode size={21} aria-hidden="true" /></span>
          <b>小程序</b>
        </button>
      </aside>

      {content && (
        <div className="zy-consultation-overlay">
          <button className="zy-consultation-backdrop" type="button" onClick={() => setDialog(null)} aria-label={`关闭${content.title}弹窗`} />
          <div ref={dialogRef} className="zy-consultation-dialog" role="dialog" aria-modal="true" aria-labelledby="consultation-title" aria-describedby="consultation-description">
            <button className="zy-consultation-close" type="button" onClick={() => setDialog(null)} aria-label="关闭弹窗"><X size={19} /></button>
            <span className={`zy-consultation-mark ${dialog === "wechat" ? "wechat" : "mini"}`} aria-hidden="true">
              {dialog === "wechat" ? <MessageCircle size={30} /> : <QrCode size={30} />}
            </span>
            <h2 id="consultation-title">{content.title}</h2>
            <p id="consultation-description">{content.description}</p>
            <div className="zy-consultation-qr">
              <Image src={publicAsset(content.image)} alt={content.imageAlt} width={208} height={208} priority={false} />
            </div>
            <small>{content.footnote}</small>
          </div>
        </div>
      )}
    </>
  );
}
