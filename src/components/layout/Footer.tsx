import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, QrCode } from 'lucide-react';

import { footerIntro, footerLinkGroups } from '../../config/footer';
import Logo from '../Logo';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-y-12 gap-x-8 mb-16 mt-4">
          <div className="w-full lg:w-[280px]">
            <div className="flex items-center space-x-2 mb-6">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl text-deep tracking-tight text-primary">职引</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">{footerIntro}</p>
          </div>

          <div className="w-full xl:ml-12 grid grid-cols-2 md:grid-cols-5 gap-8 flex-1">
            {footerLinkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="font-bold text-gray-900 mb-6 font-sans">{group.title}</h4>
                <ul className="space-y-4 text-[15px] text-gray-500">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-48 flex flex-col items-start lg:items-end lg:text-right">
            <div className="mb-3 bg-white p-2.5 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.08)] border border-gray-100 inline-block overflow-hidden relative group">
              <div className="w-[120px] h-[120px] bg-gray-50 flex flex-col items-center justify-center text-gray-400 group-hover:bg-primary/5 transition-colors">
                <img
                  src="/wechat-qr.jpg"
                  alt="职引微信二维码"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <QrCode className="w-12 h-12 hidden mb-1" />
                <span className="text-[10px] hidden text-gray-400">微信咨询</span>
              </div>
            </div>
            <p className="text-base font-bold text-gray-900 mb-1">扫码添加微信</p>
            <p className="text-sm text-primary font-medium">领取专属求职攻略</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0 mb-4 md:mb-0">
            <p>© 2026 职引. All rights reserved.</p>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              蜀ICP备2026003605号
            </a>
          </div>
          <div className="flex space-x-4">
            <Link to="/contact" aria-label="联系我们" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-colors">
              <Globe className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
