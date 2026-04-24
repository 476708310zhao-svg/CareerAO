import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Bell, 
  Clock, 
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Mock Data
const COUNTRIES = ['美国', '英国', '加拿大', '澳大利亚', '香港特别行政区'];

const VISA_DATA: Record<string, any[]> = {
  '美国': [
    {
      id: 'us-opt',
      name: 'F-1 OPT (Optional Practical Training)',
      type: '实习工作授权',
      description: '允许持有F-1签证的学生在完成学位后，获得最多一年（STEM专业可延长至3年）的在美工作许可，工作内容需与专业相关。',
      eligibility: '在美全职学习至少满一学年的F-1学生，且未曾使用过同等学位的OPT。',
      materials: [
        'I-765表格 (Application for Employment Authorization)',
        '新签发的I-20表格 (带DSO的OPT推荐批注)',
        '有效护照及F-1签证页扫描件',
        '最新的I-94入境记录',
        '两张彩色护照格式照片',
        '申请费支付凭证'
      ],
      steps: [
        { title: '联系学校申请', desc: '向所在学校的国际学生办公室 (ISSO) 提交OPT申请，获取带有OPT推荐的新I-20。' },
        { title: '准备申请材料', desc: '收集并核对所有必需材料，确保照片合规、表格填写无误。' },
        { title: '向USCIS递交申请', desc: '在拿到新I-20的30天内，向美国移民局 (USCIS) 在线或邮寄提交I-765申请。' },
        { title: '等待审批与EAD卡', desc: '取得收据号并等待审批（通常需要2-3个月，可申请加急），获批后收取EAD工卡。' }
      ],
      faqs: [
        { q: '最早可以什么时候申请OPT？', a: '最早可以在项目结束日期（Program End Date）前90天开始提交申请。' },
        { q: '如果不小心错过了申请期限怎么办？', a: '必须在项目结束后的60天宽限期（Grace Period）内提交，且USCIS必须在此期限内收到申请，否则将失去OPT资格。' },
        { q: 'OPT期间找不到工作怎么办？', a: 'OPT期间累计失业期（Unemployment Days）不能超过90天，STEM OPT延期可增加额外60天。超过则视为非法逗留。' }
      ]
    },
    {
      id: 'us-h1b',
      name: 'H-1B 特殊专业人员工作签证',
      type: '正式工作签证',
      description: '美国最主要的工作签证类别，发放给具备专业技能的外国人，通常要求申请人具有学士及以上学位。采用抽签制度。',
      eligibility: '获得美国雇主的Offer，职位要求学士或以上学位，且所学专业与职位对口。需要雇主提供Sponsorship。',
      materials: [
        'LCA (劳工情况申请) 获批文件',
        'I-129表格',
        '雇主支持信函',
        '学位证书及成绩单的评估报告',
        '简历与工作经历证明'
      ],
      steps: [
        { title: '电子注册抽签', desc: '每年3月份，雇主在USCIS系统为外籍员工进行H-1B电子抽签注册。' },
        { title: '中签并提交LCA', desc: '如幸运中签，雇主需向美国劳工部提交LCA申请。' },
        { title: '递交I-129申请包裹', desc: 'LCA获批后，雇主在90天内向USCIS正式递交H-1B申请包裹。' },
        { title: '审批与生效', desc: 'USCIS审核通过后发放I-797获批通知，H-1B身份将在当年的10月1日正式生效。' }
      ],
      faqs: [
        { q: 'H-1B一次有效几年？', a: '首次获批通常为3年，到期后可以再延期3年，总上限为6年。如果在第6年内已启动绿卡申请，则可以继续无限期延长。' }
      ]
    }
  ],
  '英国': [
    {
      id: 'uk-psw',
      name: 'Graduate Route (PSW毕业生签证)',
      type: '毕业生工作签证',
      description: '为在英国完成本科及以上学位的国际留学生提供的毕业后在英求职和工作的签证。本科/硕士可获得2年，博士可获得3年。',
      eligibility: '持有有效的Tier 4 (General) 或 Student 签证，并在合规的高校成功完成本科、硕士或博士学位。',
      materials: [
        '有效护照或旅行证件',
        'BRP (生物信息卡) 或签证页',
        '申请CAS时的确认号',
        '警察局注册信（若之前有开具）'
      ],
      steps: [
        { title: '学校上报完成学业', desc: '等待学校主动向UKVI通知你已经顺利完成学业。' },
        { title: '在线递交申请', desc: '在当前学生签证到期前，通过Gov.uk网站在线提交Graduate visa申请。' },
        { title: '身份认证', desc: '使用UK Immigration: ID Check App进行身份信息扫描和验证（部分需去签证中心录指纹）。' },
        { title: '等待下签', desc: '通常审核时间为8周左右，获批后将邮寄新的BRP卡（或获得数字凭证）。' }
      ],
      faqs: [
        { q: 'PSW可以续签吗？', a: 'Graduate visa具有不可续签性 (Non-extendable)，签证到期后必须转为其他类型签证（如Skilled Worker Worker visa）才能继续留英。' }
      ]
    }
  ]
};

export default function VisaPolicies() {
  const [activeCountry, setActiveCountry] = useState('美国');
  const [expandedVisaId, setExpandedVisaId] = useState<string | null>('us-opt');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [trackingNumber, setTrackingNumber] = useState('');
  const { showToast } = useToast();

  const handleSetReminder = () => {
    showToast('签证提醒已设置！将在截止日期前为您发送通知。', 'success');
  };

  const handleTrackStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) {
      showToast('请输入申请受理号 / Receipt Number', 'error');
      return;
    }
    showToast(`受理号 ${trackingNumber} 查询中... 当前状态：Case Is Being Actively Reviewed`, 'info');
  };

  const countryVisas = VISA_DATA[activeCountry] || [];
  
  const filteredVisas = countryVisas.filter(visa => 
    visa.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    visa.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-100 p-3 rounded-xl border border-emerald-200">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">签证政策解读</h1>
              <p className="text-gray-500 mt-1">留学生工作签证申请指南与进度追踪，助力丝滑入职</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索签证类型或关键词..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-6">
            
            {/* Country Filters */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex overflow-x-auto scrollbar-hide space-x-2">
              {COUNTRIES.map(country => (
                <button
                  key={country}
                  onClick={() => {
                    setActiveCountry(country);
                    setExpandedVisaId(VISA_DATA[country]?.[0]?.id || null);
                  }}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeCountry === country 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>

            {/* Visa List */}
            {filteredVisas.length > 0 ? (
              <div className="space-y-4">
                {filteredVisas.map(visa => (
                  <div key={visa.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:border-emerald-200">
                    {/* Accordion Header */}
                    <div 
                      className="p-6 cursor-pointer flex justify-between items-center bg-white"
                      onClick={() => setExpandedVisaId(expandedVisaId === visa.id ? null : visa.id)}
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h2 className="text-xl font-bold text-gray-900">{visa.name}</h2>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-xs font-semibold">
                            {visa.type}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-1">{visa.description}</p>
                      </div>
                      <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${expandedVisaId === visa.id ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Accordion Body */}
                    {expandedVisaId === visa.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/50">
                        
                        <div className="mb-6 mt-4">
                          <h3 className="text-sm font-bold text-gray-900 flex items-center mb-2">
                            <ShieldCheck className="w-5 h-5 mr-2 text-emerald-600" /> 申请资格
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                            {visa.eligibility}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          {/* Materials */}
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                              <FileText className="w-5 h-5 mr-2 text-emerald-600" /> 必备材料
                            </h3>
                            <ul className="space-y-2">
                              {visa.materials.map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start text-sm text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Steps */}
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                              <Clock className="w-5 h-5 mr-2 text-emerald-600" /> 申请流程
                            </h3>
                            <div className="space-y-4">
                              {visa.steps.map((step: any, idx: number) => (
                                <div key={idx} className="flex flex-col relative before:absolute before:left-[11px] before:top-6 before:w-px before:h-full before:bg-gray-200 last:before:hidden">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold border border-emerald-200 z-10">
                                      {idx + 1}
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm">{step.title}</h4>
                                  </div>
                                  <p className="text-xs text-gray-500 pl-9 mt-1 pb-2">{step.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* FAQs */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                            <HelpCircle className="w-5 h-5 mr-2 text-emerald-600" /> 常见问题解答
                          </h3>
                          <div className="space-y-3">
                            {visa.faqs.map((faq: any, idx: number) => (
                              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100">
                                <p className="font-semibold text-sm text-gray-900 mb-1 flex items-start">
                                  <span className="text-emerald-500 mr-2">Q:</span> {faq.q}
                                </p>
                                <p className="text-sm text-gray-600 flex items-start">
                                  <span className="text-gray-400 mr-2">A:</span> {faq.a}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">该地区签证政策完善中</h3>
                <p className="text-gray-500">我们将尽快更新或添加该地区的最新政策解读</p>
              </div>
            )}
          </div>

          {/* Sidebar Area: Tracker and Reminders */}
          <div className="lg:w-1/3 space-y-6">
            
            {/* Tracker Applet */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-bold">签证状态追踪</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">输入USCIS/UKVI/移民局官方提供的受理号码，一键查询最新状态。</p>
              
              <form onSubmit={handleTrackStatus}>
                <input 
                  type="text" 
                  placeholder="Receipt Number (例如: IOE091...)" 
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors mb-3"
                />
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                  立即查询
                </button>
              </form>
            </div>

            {/* Application Reminders */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-16 h-16 bg-blue-50 rounded-bl-full flex items-start justify-end p-3">
                <Bell className="w-5 h-5 text-blue-400 group-hover:animate-bounce" />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">设置签证提醒</h3>
              <p className="text-sm text-gray-500 mb-5 max-w-[85%]">
                错过宽限期或抽签登记窗口将导致严重后果。设置提醒，不错过任何重要Deadline。
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 flex items-center"><AlertCircle className="w-4 h-4 mr-1 text-orange-400" /> H-1B 抽签注册</span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">每年3月初</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 flex items-center"><AlertCircle className="w-4 h-4 mr-1 text-red-400" /> OPT 申请窗口</span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">毕业前90天</span>
                </div>
              </div>

              <button onClick={handleSetReminder} className="w-full text-blue-600 bg-blue-50 hover:bg-blue-100 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center">
                <Bell className="w-4 h-4 mr-2" /> 订阅官方节点提醒
              </button>
            </div>

            {/* Quick Links / Help */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wider">官方资源链接</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex justify-between items-center text-sm text-gray-700 hover:text-emerald-700 group transition-colors">
                    USCIS (美国移民局) 官网
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex justify-between items-center text-sm text-gray-700 hover:text-emerald-700 group transition-colors">
                    Gov.uk UKVI 官网
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex justify-between items-center text-sm text-gray-700 hover:text-emerald-700 group transition-colors">
                    寻找持牌移民律师
                    <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
