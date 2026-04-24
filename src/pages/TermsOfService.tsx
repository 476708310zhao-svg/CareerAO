import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-8">服务条款</h1>
        <p className="text-gray-500 mb-10 pb-6 border-b border-gray-100">生效日期：2024 年 01 月 01 日</p>

        <div className="prose prose-blue max-w-none text-gray-600 prose-headings:text-gray-900">
          <p>
            欢迎使用 职引前程 (CareerAI)。本《服务条款》（以下简称“本条款”）是您与职引前程平台之间关于使用本平台各项服务所订立的协议。请您在注册、登录或使用本平台服务前，仔细阅读本条款的全部内容。
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">一、 账号注册与使用说明</h2>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>您承诺提供的注册资料真实、准确、完整、合法有效，注册资料如有变动的，应及时更新。</li>
            <li>您应对您的账号和密码的安全负责，不得将账号转让、出借、出租或售卖给他人使用。</li>
            <li>如发现任何人未经授权使用您的账号，您应及时通知本平台。</li>
          </ol>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">二、 平台服务与AI功能免责声明</h2>
          <ol className="list-decimal pl-6 space-y-2 mt-2">
            <li>本平台提供的AI简历优化、AI模拟面试、薪酬预测等均基于人工智能算法生成。<strong>AI生成的内容仅供参考，不代表本平台的立场或保证。您应自主判断其合理性及适用性。</strong></li>
            <li>平台不对您根据AI建议修改简历或面试表现所导致的直接或间接求职结果负责。</li>
            <li>本平台尽力审核企业招聘信息的真实性，但不保证所有信息的完全正确、及时或无误，求职者应自行鉴别并承担入职风险。</li>
          </ol>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">三、 用户行为规范</h2>
          <p>您在使用本平台服务时，必须遵守国家法律法规，不得利用本平台进行以下行为：</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>发布虚假、欺诈、诽谤、色情、暴力或违反法律、公序良俗的信息。</li>
            <li>侵犯他人的知识产权（如著作权、商标权等）或商业秘密。</li>
            <li>未经允许滥发商业广告或垃圾信息。</li>
            <li>利用爬虫、非法接口等手段抓取、窃取或破坏本平台的数据。</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">四、 知识产权声明</h2>
          <p>
            本平台所包含的任何软件、文本、图像、图表、视音频等内容的知识产权均归属本平台所有或已获合法授权。未经书面许可，您不得以任何方式进行复制、修改或商业使用。
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">五、 协议修改与终止</h2>
          <p>
            本平台保留随时修改本条款的权利，修改后的条款将在网页显著位置公布，并在发布时立即生效。如果您继续使用本平台服务，则视为接受修改后的条款。
          </p>
        </div>
      </div>
    </div>
  );
}
