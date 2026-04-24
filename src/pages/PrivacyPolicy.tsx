import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-8">隐私政策</h1>
        <p className="text-gray-500 mb-10 pb-6 border-b border-gray-100">最后更新日期：2024 年 03 月 20 日</p>

        <div className="prose prose-blue max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-primary">
          <p>
            欢迎您使用职引前程 (CareerAI)（以下简称“本平台”）。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。本《隐私政策》旨在向您说明我们在您使用本平台服务时如何收集、使用、保存、共享和转让这些信息，以及我们为您提供的访问、更新、删除和保护这些信息的方式。
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">1. 我们如何收集您的个人信息</h2>
          <p>我们会出于本政策所述的以下目的，收集和使用您的个人信息：</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>注册与登录：</strong> 当您注册本平台账户时，您需要提供手机号码/邮箱地址。您还可以选择填写昵称、头像等其他信息。</li>
            <li><strong>完善简历与求职：</strong> 当您使用在线简历制作或导入简历功能时，您可能需要提供姓名、性别、出生日期、教育背景、工作经历、项目经验、联系方式等内容，以便为您生成求职简历并推荐岗位。</li>
            <li><strong>AI 面试与诊断：</strong> 在使用AI面评或诊断时，我们会收集您的语音、视频片段（仅在您授权通过设备麦克风/摄像头时）以及您的文本作答内容，用于AI模型分析以生成反馈报告。视频及音频在处理完成后不会在未经授权的情况下公开。</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">2. 我们如何使用您的个人信息</h2>
          <p>我们收集您的个人信息主要是为了向您提供更优质、更个性化的求职服务，具体包括：</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>向您提供智能匹配的职业机会。</li>
            <li>通过AI技术对您的简历进行结构化分析，提供优化建议。</li>
            <li>安全风控审核，防止欺诈及不良信息的传播。</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">3. 第三方平台与数据共享</h2>
          <p>
            未经您的明确同意，我们不会向任何第三方平台或企业出售、出租或分享您的个人可识别信息，除以下情况外：
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>当您主动通过本平台向入驻的招聘企业/HR投递简历时，该企业/HR将获得您的个人简历信息。</li>
            <li>根据法律法规的要求、强制性的行政或司法要求所必须提供您个人信息的情况下。</li>
          </ul>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">4. 如何管理您的信息</h2>
          <p>
            您可以随时登录本平台，在“账号设置”或“我的简历”模块访问、更新您的个人信息。如有需要注销账户，可在“安全中心”提交注销申请。
          </p>

          <h2 className="text-xl font-bold mt-10 mb-4 text-gray-900">5. 联系我们</h2>
          <p>
            当您对本隐私政策有任何疑问、意见或建议，请通过发送邮件至 <a href="mailto:privacy@careerai.com">privacy@careerai.com</a> 与我们联系。
          </p>
        </div>
      </div>
    </div>
  );
}
