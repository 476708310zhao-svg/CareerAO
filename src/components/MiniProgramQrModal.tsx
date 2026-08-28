import React, { useEffect, useRef } from 'react';
import { QrCode, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const MINI_PROGRAM_QR_SRC = '/mini-program-qr.jpg';

type MiniProgramQrModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MiniProgramQrModal({ isOpen, onClose }: MiniProgramQrModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>('button')?.focus());
    const handleDialogKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', handleDialogKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleDialogKey);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="关闭小程序码弹窗"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mini-program-dialog-title"
            aria-describedby="mini-program-dialog-description"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <QrCode className="h-8 w-8 text-primary" />
            </div>

            <h3 id="mini-program-dialog-title" className="mb-2 text-xl font-bold text-gray-900">职引小程序</h3>
            <p id="mini-program-dialog-description" className="mb-6 text-sm leading-relaxed text-gray-500">
              微信扫码打开小程序，查看校招机会、面经题库和求职工具。
            </p>

            <div className="mx-auto mb-6 flex h-52 w-52 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
              <img
                src={MINI_PROGRAM_QR_SRC}
                alt="职引小程序码"
                width={208}
                height={208}
                decoding="async"
                className="h-full w-full object-cover"
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-xs text-gray-400">小程序码暂不可用</span>
            </div>

            <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
              微信扫码立即体验
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
