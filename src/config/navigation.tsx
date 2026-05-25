import React from 'react';
import {
  BookOpen,
  Bot,
  Briefcase,
  Compass,
  Edit3,
  FileText,
  Globe,
  Info,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

export const navCategories = [
  {
    title: '找工作',
    sections: [
      {
        title: '核心求职模块',
        icon: <Briefcase className="w-5 h-5 text-primary" />,
        links: [
          { name: '职位搜索', href: '/jobs', desc: '海量全职、实习机会快速筛选', badge: 'HOT' },
          { name: '求职地图', href: '/job-map', desc: '按地区查看岗位分布和机会密度' },
        ],
      },
      {
        title: '信息与规划',
        icon: <Compass className="w-5 h-5 text-primary" />,
        links: [
          { name: '薪资查询', href: '/salary-insights', desc: '按岗位、地区和经验查看薪资参考' },
          { name: '校招日历', href: '/campus-calendar', desc: '追踪大厂秋招、春招和网申节点', badge: 'NEW' },
        ],
      },
    ],
  },
  {
    title: '面试备考',
    sections: [
      {
        title: '经验与复盘',
        icon: <Edit3 className="w-5 h-5 text-primary" />,
        links: [
          { name: '笔经面经', href: '/interview-prep', desc: '沉淀真实笔试、面试经验和高频题' },
          { name: '机构测评', href: '/agency-evaluation', desc: '查看求职机构评价、风险提示和避坑建议' },
        ],
      },
      {
        title: '实战模拟',
        icon: <Bot className="w-5 h-5 text-primary" />,
        links: [
          { name: 'AI 面试', href: '/ai-interview', desc: '按目标岗位生成模拟面试和改进建议', badge: 'NEW' },
        ],
      },
    ],
  },
  {
    title: '求职工具',
    sections: [
      {
        title: '效率提升',
        icon: <Rocket className="w-5 h-5 text-primary" />,
        links: [
          { name: '网申助手', href: '/application-assistant', desc: '根据 JD 生成网申回答和投递建议' },
          { name: '我的简历', href: '/my-resume', desc: '管理简历版本，按岗位优化表达', badge: 'HOT' },
        ],
      },
      {
        title: '职业规划',
        icon: <Globe className="w-5 h-5 text-primary" />,
        links: [
          { name: '求职规划', href: '/career-planning', desc: '生成 3 / 6 / 12 个月求职路线图' },
        ],
      },
    ],
  },
  {
    title: '资源中心',
    sections: [
      {
        title: '内容与资讯',
        icon: <BookOpen className="w-5 h-5 text-primary" />,
        links: [
          { name: '求职干货博客', href: '/blog', desc: '系统化整理简历、投递和面试方法' },
          { name: '求职资讯', href: '/news', desc: '关注雇主动态、招聘趋势和行业变化' },
          { name: '大厂面经库', href: '/interview-experiences', desc: '按公司和岗位查看面经复盘' },
        ],
      },
      {
        title: '政策与帮助',
        icon: <ShieldCheck className="w-5 h-5 text-primary" />,
        links: [
          { name: '签证政策解读', href: '/visa-policies', desc: '梳理 OPT、CPT、H1B 等常见问题' },
          { name: '帮助中心', href: '/help-center', desc: '查看产品使用、账号和服务说明' },
        ],
      },
    ],
  },
  {
    title: '关于我们',
    sections: [
      {
        title: '了解平台',
        icon: <Info className="w-5 h-5 text-primary" />,
        links: [
          { name: '团队介绍', href: '/team', desc: '了解职引团队和产品理念' },
          { name: '联系我们', href: '/contact', desc: '提交商务合作、求职咨询和反馈' },
        ],
      },
      {
        title: '服务说明',
        icon: <FileText className="w-5 h-5 text-primary" />,
        links: [
          { name: '隐私政策', href: '/privacy', desc: '了解个人信息收集、使用和保护方式' },
          { name: '服务条款', href: '/terms', desc: '查看账号、内容和服务使用规则' },
          { name: '会员权益', href: '/membership', desc: '解锁高级求职工具和会员服务', badge: 'PRO' },
        ],
      },
    ],
  },
];
