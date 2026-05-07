import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords,
  ogType = 'website',
  ogImage = '/favicon.svg'
}) => {
  const siteTitle = 'CareerAI - 留学生求职助手';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'CareerAI - 专为留学生打造的一站式求职助手，提供校招日历、薪资洞察、面经库、中介避雷等功能，助力全球留学生斩获高薪Offer。';
  const finalDescription = description || defaultDescription;
  
  const defaultKeywords = '留学生求职, 校招, 实习, 秋招, 春招, 薪资洞察, 面经, 留学中介评价, 职业规划, 海归求职, 留学生内推';
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
