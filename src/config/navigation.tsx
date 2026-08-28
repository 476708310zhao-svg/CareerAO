import React from 'react';
import {
  Bot,
  Briefcase,
  Calendar,
  Compass,
  Edit3,
  FileText,
  Gauge,
  Rocket,
  Target,
} from 'lucide-react';

export const navCategories = [
  {
    title: 'AI简历',
    sections: [
      {
        title: '匹配与优化',
        icon: <FileText className="w-5 h-5 text-primary" />,
        links: [
          { name: 'AI Resume Tailor', href: '/resume-tailor', desc: '上传简历 + 粘贴 JD，生成 ATS 分数和定制版简历', badge: 'HOT' },
          { name: 'ATS评分', href: '/resume-tailor', desc: '查看当前匹配分、预计提升分和评分维度' },
          { name: 'JD Analyzer', href: '/jd-analyzer', desc: '先拆解岗位类型、难度、隐藏要求和准备重点', badge: 'NEW' },
        ],
      },
      {
        title: '简历资产',
        icon: <Target className="w-5 h-5 text-primary" />,
        links: [
          { name: '我的简历', href: '/my-resume', desc: '管理简历版本，沉淀不同岗位的改写记录' },
          { name: '网申助手', href: '/application-assistant', desc: '基于 JD 生成网申回答和岗位匹配建议' },
        ],
      },
    ],
  },
  {
    title: 'AI面试',
    sections: [
      {
        title: '实战模拟',
        icon: <Bot className="w-5 h-5 text-primary" />,
        links: [
          { name: '模拟面试', href: '/ai-interview', desc: '按目标岗位生成追问、评分和改进建议', badge: 'NEW' },
          { name: 'STAR案例', href: '/interview-prep', desc: '整理行为面试案例和高频问题' },
        ],
      },
      {
        title: '复盘与题库',
        icon: <Edit3 className="w-5 h-5 text-primary" />,
        links: [
          { name: '面试复盘', href: '/interview-experiences', desc: '按公司、岗位和轮次查看真实面试复盘' },
          { name: '面试题库', href: '/interview-prep', desc: '沉淀笔试、技术面、行为面高频题' },
        ],
      },
    ],
  },
  {
    title: '求职工具',
    sections: [
      {
        title: '投递与信息',
        icon: <Rocket className="w-5 h-5 text-primary" />,
        links: [
          { name: '投递追踪', href: '/application-tracker', desc: '管理岗位收藏、投递状态和下一步动作' },
          { name: '职位搜索', href: '/jobs', desc: '聚合全职、实习和 New Grad 机会' },
          { name: '查薪资', href: '/salary-insights', desc: '按岗位、地区和经验查看薪资参考' },
          { name: 'AI 简历优化', href: '/resume-tailor', desc: '上传简历并根据目标 JD 生成 ATS 匹配报告', badge: 'NEW' },
          { name: '网申助手', href: '/application-assistant', desc: '根据 JD 生成网申回答、岗位匹配和投递建议' },
          { name: '我的简历', href: '/my-resume', desc: '管理简历版本，按目标岗位优化表达', badge: 'HOT' },
        ],
      },
      {
        title: '规划与校招',
        icon: <Compass className="w-5 h-5 text-primary" />,
        links: [
          { name: '校招日历', href: '/campus-calendar', desc: '追踪秋招、春招、暑期实习和截止时间' },
          { name: '求职规划', href: '/career-planning', desc: '生成 3 / 6 / 12 个月求职路线图' },
          { name: '求职地图', href: '/job-map', desc: '按地区查看岗位分布和机会密度' },
        ],
      },
    ],
  },
];

export const directNavLinks = [
  { name: '首页', href: '/' },
  { name: '校招日历', href: '/campus-calendar', icon: Calendar },
  { name: '岗位资讯', href: '/news', icon: Briefcase },
  { name: '面经题库', href: '/interview-experiences', icon: Gauge },
  { name: '会员', href: '/membership' },
];
