import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center border border-gray-100">
        <div className="mb-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary/5">
            <Compass className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">页面走丢了</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            抱歉，您访问的页面不存在或已被移除。您可以返回首页探索更多求职机会和干货内容。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="w-full flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/30"
          >
            <Home className="w-5 h-5 mr-2" />
            返回首页
          </Link>
          <Link 
            to="/jobs" 
            className="w-full flex items-center justify-center px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors border border-gray-200"
          >
            去看看热招职位
          </Link>
        </div>
      </div>
    </div>
  );
}
