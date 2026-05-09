import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = 'https://www.zhiyincareer.com/og-image.svg',
  canonical,
}) => {
  const siteTitle = '职引';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - 留学生一站式求职平台`;
  const defaultDescription = '职引为留学生提供一站式求职服务，涵盖8000+校招日历、AI模拟面试、薪资查询、笔经面经、网申助手、机构测评、求职规划等核心功能，助力留学生高效应对求职全流程。';
  const finalDescription = description || defaultDescription;

  const defaultKeywords = '留学生求职,校招日历,AI面试,薪资查询,笔经面经,网申助手,机构测评,求职规划,留学生找工作,秋招春招,暑期实习';
  const finalKeywords = keywords ? `${keywords},${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
