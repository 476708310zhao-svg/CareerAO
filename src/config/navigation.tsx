import React from 'react';
import { BookOpen, Bot, Briefcase, Compass, Edit3, FileText, Globe, Info, Rocket, ShieldCheck } from 'lucide-react';

export const navCategories = [
    {
      title: '找工作',
      sections: [
        {
          title: '核心求职模块',
          icon: <Briefcase className="w-5 h-5 text-primary" />,
          links: [
            { name: '职位搜索', href: '/jobs', desc: '海量全职/实习机会快速触达', badge: 'HOT' },
            { name: '求职地图', href: '/job-map', desc: '基于LBS的周边全职机会一网打尽' },
          ]
        },
        {
          title: '信息与规划',
          icon: <Compass className="w-5 h-5 text-primary" />,
          links: [
            { name: '薪资查询', href: '/salary-insights', desc: '全网高薪Offer薪水大揭秘' },
            { name: '校招日历', href: '/campus-calendar', desc: '第一时间掌握大厂秋招网申时间', badge: 'NEW' },
          ]
        }
      ]
    },
    {
      title: '面试备考',
      sections: [
        {
          title: '经验与交流',
          icon: <Edit3 className="w-5 h-5 text-primary" />,
          links: [
            { name: '笔经面经', href: '/interview-prep', desc: '大量还原真实的面试场景及笔试回顾' },
            { name: '机构测评', href: '/agency-evaluation', desc: '红黑榜中介防坑指南与真实评价' },
          ]
        },
        {
          title: '实战模拟',
          icon: <Bot className="w-5 h-5 text-primary" />,
          links: [
            { name: 'AI 面试', href: '/ai-interview', desc: '智能AI导师一对一还原真实面试', badge: 'NEW' },
          ]
        }
      ]
    },
    {
      title: '求职工具',
      sections: [
        {
          title: '效率提升',
          icon: <Rocket className="w-5 h-5 text-primary" />,
          links: [
            { name: '网申助手', href: '/application-assistant', desc: '化繁为简，一键自动填写海量网申表' },
            { name: '我的简历', href: '/my-resume', desc: '从小白到高阶全覆盖的简历生成神器', badge: 'HOT' },
          ]
        },
        {
          title: '职场与规划导师',
          icon: <Globe className="w-5 h-5 text-primary" />,
          links: [
            { name: '求职规划', href: '/career-planning', desc: '利用AI为你定制求职时间线规划' },
          ]
        }
      ]
    },
    {
      title: '资源中心',
      sections: [
        {
          title: '行业大咖建议',
          icon: <BookOpen className="w-5 h-5 text-primary" />,
          links: [
            { name: '求职干货博客', href: '/blog', desc: '资深HR分享如何脱颖而出' },
            { name: '求职资讯', href: '/news', desc: '订阅最新前沿职场和雇主新闻动态' },
            { name: '大厂面经库', href: '/interview-experiences', desc: '各类公司全岗位的面经汇总' },
          ]
        },
        {
          title: '留学生政策与帮扶',
          icon: <ShieldCheck className="w-5 h-5 text-primary" />,
          links: [
            { name: '签证政策解读', href: '/visa-policies', desc: '深度解读H1B/OPT最新政策风向' },
            { name: '帮助中心', href: '/help-center', desc: '关于职引你必须知道的常见问题回答' },
          ]
        }
      ]
    },
    {
      title: '关于我们',
      sections: [
        {
          title: '了解平台',
          icon: <Info className="w-5 h-5 text-primary" />,
          links: [
            { name: '团队介绍', href: '/team', desc: '由湾区资深工程师研发运营' },
            { name: '联系我们', href: '/contact', desc: '提供商务合作与求职指导反馈' },
          ]
        },
        {
          title: '服务条款',
          icon: <FileText className="w-5 h-5 text-primary" />,
          links: [
            { name: '隐私政策', href: '/privacy', desc: '您的个人隐私受到绝对保密与保护' },
            { name: '服务条款', href: '/terms', desc: '用户社区礼仪与内容发布协议和规范' },
            { name: '会员权益', href: '/membership', desc: '成为高级会员解锁全部高级服务与内推', badge: 'PRO' },
          ]
        }
      ]
    }
];
