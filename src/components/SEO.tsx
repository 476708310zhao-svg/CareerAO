import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  canonical?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const defaultDescription =
  '职引为留学生提供职位搜索、校招日历、AI 模拟面试、薪资查询、笔经面经、网申助手、机构测评和求职规划，覆盖从准备到投递的完整求职流程。';

const defaultKeywords =
  '留学生求职,校招日历,AI面试,薪资查询,笔经面经,网申助手,机构测评,求职规划,留学生找工作,秋招春招,暑期实习';

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = 'https://www.zhiyincareer.com/og-image.svg',
  canonical,
  jsonLd,
}) => {
  const siteTitle = '职引';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - 留学生一站式求职平台`;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords ? `${keywords},${defaultKeywords}` : defaultKeywords;
  const structuredData = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

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

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />

      {structuredData.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
