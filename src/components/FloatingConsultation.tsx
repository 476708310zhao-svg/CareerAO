import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function FloatingConsultation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 overflow-hidden rounded-l-2xl border border-r-0 border-gray-100 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.1)] md:block">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex min-w-[80px] flex-col items-center justify-center space-y-3 px-4 py-6 transition-all hover:bg-gray-50"
          aria-label="打开微信咨询"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
            <MessageCircle className="h-6 w-6 text-gray-800" strokeWidth={1.5} />
          </div>
          <span className="whitespace-nowrap text-[15px] font-medium text-gray-600">
            微信咨询
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-black md:hidden"
        aria-label="打开微信咨询"
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              aria-label="关闭微信咨询弹窗"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#07C160]/10">
                <MessageCircle className="h-8 w-8 text-[#07C160]" />
              </div>

              <h3 className="mb-2 text-xl font-bold text-gray-900">添加人工客服</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-500">
                扫码添加微信客服助手，获取一对一求职答疑、内推机会与简历精修建议。
              </p>

              <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                <img
                  src="/wechat-qr.jpg"
                  alt="客服微信二维码"
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    const target = event.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-xs text-gray-400">二维码暂不可用</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span className="text-gray-600">服务时间</span>
                <span className="font-medium text-gray-900">工作日 09:00 - 18:00</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
