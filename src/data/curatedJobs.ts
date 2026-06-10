export type CuratedJob = {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  region: string;
  salary: string;
  jobType: string;
  industry: string;
  description: string;
  requirements: string[];
  visaSponsored: boolean;
  postedAt: string;
  viewCount: number;
  applyCount: number;
  applyUrl: string;
  source: string;
  sourceLabel: string;
};

export const curatedJobs: CuratedJob[] = [
  {
    id: 'fallback-google-swe-2026',
    title: 'Software Engineer, New Grad 2026',
    company: 'Google',
    companyLogo: 'https://cdn.brandfetch.io/google.com/w/128/h/128/theme/light/icon',
    location: 'Mountain View, CA',
    region: '美国',
    salary: '$130k - $180k',
    jobType: '全职',
    industry: '互联网',
    description: '参与核心产品和基础设施研发，面向大规模用户构建高可靠系统。适合具备扎实算法、系统设计和工程实践能力的 New Grad 候选人。',
    requirements: ['Computer Science 相关背景', '熟悉数据结构与算法', '有大型项目或实习经历', '英文沟通能力良好'],
    visaSponsored: true,
    postedAt: '2026-06-01',
    viewCount: 2380,
    applyCount: 168,
    applyUrl: 'https://careers.google.com/',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-amazon-data-2026',
    title: 'Data Scientist, University Graduate',
    company: 'Amazon',
    companyLogo: 'https://cdn.brandfetch.io/amazon.com/w/128/h/128/theme/light/icon',
    location: 'Seattle, WA',
    region: '美国',
    salary: '$125k - $170k',
    jobType: '全职',
    industry: '互联网',
    description: '负责业务实验、预测模型和数据产品建设，和产品、工程团队共同提升用户体验与运营效率。',
    requirements: ['统计、计算机或数据科学背景', '熟悉 SQL 和 Python', '了解 A/B Test', '有机器学习项目经验'],
    visaSponsored: true,
    postedAt: '2026-05-31',
    viewCount: 1810,
    applyCount: 121,
    applyUrl: 'https://www.amazon.jobs/',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-msft-pm-2026',
    title: 'Product Manager Intern',
    company: 'Microsoft',
    companyLogo: 'https://cdn.brandfetch.io/microsoft.com/w/128/h/128/theme/light/icon',
    location: 'Redmond, WA',
    region: '美国',
    salary: '$45 - $65/hr',
    jobType: '实习',
    industry: '互联网',
    description: '参与 AI 产品功能规划、用户研究和指标分析，推动跨团队协作和产品落地。',
    requirements: ['产品 Sense 强', '能拆解用户需求和指标', '有数据分析能力', '可进行英文产品沟通'],
    visaSponsored: true,
    postedAt: '2026-05-30',
    viewCount: 1436,
    applyCount: 92,
    applyUrl: 'https://careers.microsoft.com/',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-goldman-analyst-2026',
    title: 'Investment Banking Analyst',
    company: 'Goldman Sachs',
    companyLogo: 'https://cdn.brandfetch.io/goldmansachs.com/w/128/h/128/theme/light/icon',
    location: 'New York, NY',
    region: '美国',
    salary: '$110k - $140k',
    jobType: '全职',
    industry: '金融',
    description: '参与 M&A、IPO 和资本市场项目，负责行业研究、财务建模、估值分析和客户材料准备。',
    requirements: ['金融或经济相关背景', '熟悉三张表和估值模型', 'Excel / PowerPoint 熟练', '抗压能力强'],
    visaSponsored: false,
    postedAt: '2026-05-29',
    viewCount: 1675,
    applyCount: 134,
    applyUrl: 'https://www.goldmansachs.com/careers/',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-mckinsey-ba-2026',
    title: 'Business Analyst',
    company: 'McKinsey & Company',
    companyLogo: 'https://cdn.brandfetch.io/mckinsey.com/w/128/h/128/theme/light/icon',
    location: 'New York, NY',
    region: '美国',
    salary: '$110k - $135k',
    jobType: '全职',
    industry: '咨询',
    description: '为客户提供战略咨询服务，参与市场研究、数据分析、方案设计和高层汇报。',
    requirements: ['优秀的结构化思维', '强数据分析能力', '沟通表达清晰', '有咨询或商业分析经历优先'],
    visaSponsored: false,
    postedAt: '2026-05-28',
    viewCount: 1295,
    applyCount: 88,
    applyUrl: 'https://www.mckinsey.com/careers',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-bytedance-frontend-2026',
    title: 'Frontend Engineer',
    company: 'ByteDance',
    companyLogo: 'https://cdn.brandfetch.io/bytedance.com/w/128/h/128/theme/light/icon',
    location: 'San Jose, CA',
    region: '美国',
    salary: '$140k - $190k',
    jobType: '全职',
    industry: '互联网',
    description: '负责全球化产品 Web 体验建设，优化性能、组件体系和前端工程效率。',
    requirements: ['熟悉 React / TypeScript', '了解前端性能优化', '有复杂业务项目经验', '能跨时区协作'],
    visaSponsored: true,
    postedAt: '2026-05-27',
    viewCount: 2120,
    applyCount: 147,
    applyUrl: 'https://jobs.bytedance.com/',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-tesla-me-2026',
    title: 'Mechanical Design Engineer',
    company: 'Tesla',
    companyLogo: 'https://cdn.brandfetch.io/tesla.com/w/128/h/128/theme/light/icon',
    location: 'Fremont, CA',
    region: '美国',
    salary: '$105k - $150k',
    jobType: '全职',
    industry: '新能源',
    description: '参与电动车与能源产品结构设计、验证和量产问题解决，推动设计从概念到制造落地。',
    requirements: ['机械工程相关背景', '熟悉 CAD 和 DFM', '有硬件项目经验', '能快速迭代解决问题'],
    visaSponsored: false,
    postedAt: '2026-05-26',
    viewCount: 1168,
    applyCount: 73,
    applyUrl: 'https://www.tesla.com/careers',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-jpm-risk-2026',
    title: 'Risk Analyst',
    company: 'JPMorgan Chase',
    companyLogo: 'https://cdn.brandfetch.io/jpmorganchase.com/w/128/h/128/theme/light/icon',
    location: 'London, UK',
    region: '英国',
    salary: '£55k - £75k',
    jobType: '全职',
    industry: '金融',
    description: '参与市场风险、信用风险和组合数据分析，为业务团队提供风险监控和策略建议。',
    requirements: ['金融工程或量化背景', '熟悉 Python / SQL', '理解风险指标', '英文写作能力好'],
    visaSponsored: true,
    postedAt: '2026-05-25',
    viewCount: 940,
    applyCount: 58,
    applyUrl: 'https://careers.jpmorgan.com/',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-tencent-pm-2026',
    title: '产品经理培训生',
    company: 'Tencent',
    companyLogo: 'https://cdn.brandfetch.io/tencent.com/w/128/h/128/theme/light/icon',
    location: '深圳',
    region: '中国',
    salary: '25k - 40k',
    jobType: '全职',
    industry: '互联网',
    description: '参与内容、社交或企业服务产品规划，负责需求分析、版本推进和用户增长策略。',
    requirements: ['有产品实习经历', '逻辑和表达清晰', '熟悉国内互联网产品', '能进行数据分析'],
    visaSponsored: false,
    postedAt: '2026-05-24',
    viewCount: 1520,
    applyCount: 102,
    applyUrl: 'https://join.qq.com/',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
  {
    id: 'fallback-sea-backend-2026',
    title: 'Backend Engineer',
    company: 'Sea',
    companyLogo: 'https://cdn.brandfetch.io/sea.com/w/128/h/128/theme/light/icon',
    location: 'Singapore',
    region: '新加坡',
    salary: 'SGD 90k - 130k',
    jobType: '全职',
    industry: '互联网',
    description: '负责交易、支付或增长系统后端研发，建设高可用服务和数据链路。',
    requirements: ['熟悉 Java / Go / Python', '了解分布式系统', '数据库基础扎实', '有高并发项目经验'],
    visaSponsored: true,
    postedAt: '2026-05-23',
    viewCount: 1086,
    applyCount: 81,
    applyUrl: 'https://www.sea.com/careers',
    source: 'client_fallback',
    sourceLabel: '精选职位',
  },
];

export function filterCuratedJobs(query: {
  keyword?: string;
  region?: string;
  industry?: string;
  jobType?: string;
}) {
  const keyword = (query.keyword || '').trim().toLowerCase();
  return curatedJobs.filter((job) => {
    const matchesKeyword =
      !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword) ||
      job.requirements.join(' ').toLowerCase().includes(keyword);
    const matchesRegion = !query.region || query.region === '全部' || job.region === query.region;
    const matchesIndustry = !query.industry || query.industry === '全部' || job.industry === query.industry;
    const matchesType = !query.jobType || query.jobType === '全部' || job.jobType === query.jobType;
    return matchesKeyword && matchesRegion && matchesIndustry && matchesType;
  });
}

export function findCuratedJob(id?: string) {
  return curatedJobs.find((job) => job.id === id);
}
