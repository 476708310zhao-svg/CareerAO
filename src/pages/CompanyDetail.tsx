import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Star, Briefcase, ChevronRight, MessageSquare } from 'lucide-react';
import { apiFetch } from '../lib/api';

const MOCK_COMPANY = {
  id: 1,
  name: 'Google',
  logo: 'G',
  industry: '科技/互联网',
  location: 'Mountain View, CA',
  website: 'careers.google.com',
  size: '10000+ 人',
  rating: 4.8,
  description: 'Google is a multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.',
  jobs: [
    { id: 1, title: 'Software Engineer, New Grad 2026', location: 'Mountain View, CA', type: '全职', postedAt: '2天前' },
    { id: 2, title: 'Product Manager', location: 'San Francisco, CA', type: '全职', postedAt: '1周前' }
  ],
  experiences: [
    { id: 1, title: '2025 NG SWE 面经 (Offer)', author: 'Alice', date: '2024-10-01', tags: ['算法', 'System Design'] },
    { id: 2, title: 'PM Intern 连环面记录', author: 'Bob', date: '2024-09-15', tags: ['Behavioral', 'Product Sense'] }
  ]
};

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'experiences'>('about');

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          setCompany(MOCK_COMPANY);
          setIsLoading(false);
          return;
        }

        const { db } = await import('../lib/firebase');
        const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore');
        const companyDoc = await getDoc(doc(db, 'companies', id));

        if (companyDoc.exists()) {
          const compData = companyDoc.data();
          
          // Try fetching jobs for this company
          const jobsQuery = query(collection(db, 'jobs'), where('companyId', '==', id));
          const jobsSnap = await getDocs(jobsQuery);
          let relatedJobs = jobsSnap.docs.map(jd => ({
             id: jd.id,
             title: jd.data().title || '',
             location: jd.data().location || '',
             type: jd.data().type || '全职',
             postedAt: '刚发布'
          }));

          // Try fetching experiences for this company
          const expQuery = query(collection(db, 'interview_experiences'), where('company', '==', compData.name));
          const expSnap = await getDocs(expQuery);
          let relatedExps = expSnap.docs.map(ed => ({
             id: ed.id,
             title: `${ed.data().round} - ${ed.data().role}`,
             author: ed.data().userId || 'Anonymous',
             date: '刚刚',
             tags: [ed.data().role, ed.data().round]
          }));

          setCompany({
            id: companyDoc.id,
            name: compData.name || '',
            logo: compData.name?.charAt(0) || 'C',
            industry: '科技/互联网', // Default if not provided
            location: compData.location || 'Unknown',
            website: compData.website || '#',
            size: '10000+ 人', // Default mock info
            rating: 4.8,
            description: compData.description || '',
            jobs: relatedJobs.length > 0 ? relatedJobs : MOCK_COMPANY.jobs,
            experiences: relatedExps.length > 0 ? relatedExps : MOCK_COMPANY.experiences
          });
        } else {
          setCompany(MOCK_COMPANY);
        }
      } catch (error) {
        console.error('Failed to fetch company details:', error);
        setCompany(MOCK_COMPANY); // Fallback to mock
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return <div className="min-h-screen pt-24 text-center">Company not found</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <span className="text-4xl font-bold text-primary">{company.logo || company.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" /> {company.industry}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {company.location}</span>
                <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {company.size}</span>
                <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400" /> {company.rating}</span>
              </div>
              <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-primary-hover text-sm font-medium">
                <Globe className="w-4 h-4 mr-1" /> 访问官网
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              公司介绍
            </button>
            <button 
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'jobs' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              在招职位 ({company.jobs?.length || 0})
            </button>
            <button 
              onClick={() => setActiveTab('experiences')}
              className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'experiences' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
            >
              笔经面经 ({company.experiences?.length || 0})
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'about' && (
              <div className="prose max-w-none text-gray-600">
                <h3 className="text-lg font-bold text-gray-900 mb-4">关于我们</h3>
                <p className="leading-relaxed">{company.description}</p>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {company.jobs?.map((job: any) => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{job.title}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {job.location}</span>
                          <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1" /> {job.type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">{job.postedAt}</span>
                        <div className="mt-2 text-primary flex items-center text-sm font-medium">
                          查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {(!company.jobs || company.jobs.length === 0) && (
                  <div className="text-center text-gray-500 py-8">暂无在招职位</div>
                )}
              </div>
            )}

            {activeTab === 'experiences' && (
              <div className="space-y-4">
                {company.experiences?.map((exp: any) => (
                  <Link key={exp.id} to={`/interview-prep/${exp.id}`} className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">{exp.title}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {exp.tags?.map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-600 border border-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>作者: {exp.author}</span>
                        <span>{exp.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {(!company.experiences || company.experiences.length === 0) && (
                  <div className="text-center text-gray-500 py-8">暂无面经分享</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
