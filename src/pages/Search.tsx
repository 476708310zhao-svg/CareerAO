import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, Briefcase, ChevronRight, FileText, Search as SearchIcon } from 'lucide-react';

import SEO from '../components/SEO';
import { apiFetch } from '../lib/api';

type SearchResults = {
  jobs: Array<{ id: string | number; title: string; company: string; location: string }>;
  companies: Array<{ id: string | number; name: string; industry: string; location: string }>;
  experiences: Array<{ id: string | number; title: string; author: string; date: string }>;
};

const emptyResults: SearchResults = { jobs: [], companies: [], experiences: [] };

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'companies' | 'experiences'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>(emptyResults);

  useEffect(() => {
    if (!query.trim()) {
      setResults(emptyResults);
      return;
    }

    let cancelled = false;
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const keyword = encodeURIComponent(query.trim());
        const [jobsResponse, companiesResponse, experiencesResponse] = await Promise.allSettled([
          apiFetch(`/api/proxy/jobs?keyword=${keyword}&page=1&pageSize=5`),
          apiFetch(`/api/proxy/companies?keyword=${keyword}&page=1&pageSize=5`),
          apiFetch(`/api/proxy/experiences?keyword=${keyword}&page=1&pageSize=5`),
        ]);

        if (cancelled) return;

        const jobsData = jobsResponse.status === 'fulfilled' ? jobsResponse.value.data?.list || [] : [];
        const companiesData = companiesResponse.status === 'fulfilled' ? companiesResponse.value.data?.list || [] : [];
        const experiencesData = experiencesResponse.status === 'fulfilled' ? experiencesResponse.value.data?.list || [] : [];

        setResults({
          jobs: jobsData.map((job: any) => ({
            id: job.id || job.job_id,
            title: job.title || job.job_title || '职位',
            company: job.company || job.employer_name || '公司',
            location: job.location || job.job_city || job.region || '远程/待定',
          })),
          companies: companiesData.map((company: any) => ({
            id: company.id,
            name: company.displayName || company.name || company.nameEn || '公司',
            industry: company.industry || company.industryL1 || '行业待补充',
            location: company.headquarters || company.hqCity || company.hqCountry || '地点待补充',
          })),
          experiences: experiencesData.map((exp: any) => ({
            id: exp.id,
            title: exp.title || `${exp.company || ''} 面经分享`,
            author: exp.userName || exp.author || '匿名用户',
            date: exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : '近期',
          })),
        });
      } catch (error) {
        console.error('Search failed:', error);
        if (!cancelled) setResults(emptyResults);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchResults();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newQuery = String(formData.get('q') || '').trim();
    if (newQuery) setSearchParams({ q: newQuery });
  };

  const renderJobs = () => (
    <div className="space-y-4">
      {results.jobs.map((job) => (
        <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{job.company} · {job.location}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-4">
      {results.companies.map((company) => (
        <Link key={company.id} to={`/companies/${company.id}`} className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{company.industry} · {company.location}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );

  const renderExperiences = () => (
    <div className="space-y-4">
      {results.experiences.map((exp) => (
        <Link key={exp.id} to="/interview-experiences" className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{exp.title}</h3>
              <p className="text-sm text-gray-500 mt-1">作者 {exp.author} · {exp.date}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );

  const hasResults = results.jobs.length > 0 || results.companies.length > 0 || results.experiences.length > 0;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <SEO
        title={query ? `${query} 搜索结果` : '站内搜索'}
        description="搜索职引官网职位、公司和面经内容。"
        canonical="https://www.zhiyincareer.com/search"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="搜索职位、公司、面经..."
              className="w-full h-14 pl-14 pr-4 bg-white border border-gray-200 rounded-2xl text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">
              搜索
            </button>
          </form>
        </div>

        {query && (
          <>
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {[
                ['all', '全部结果', hasResults ? results.jobs.length + results.companies.length + results.experiences.length : 0],
                ['jobs', '职位', results.jobs.length],
                ['companies', '公司', results.companies.length],
                ['experiences', '面经', results.experiences.length],
              ].map(([id, label, count]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="space-y-8">
                {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-primary" /> 职位
                    </h2>
                    {renderJobs()}
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'companies') && results.companies.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-blue-600" /> 公司
                    </h2>
                    {renderCompanies()}
                  </div>
                )}

                {(activeTab === 'all' || activeTab === 'experiences') && results.experiences.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" /> 面经
                    </h2>
                    {renderExperiences()}
                  </div>
                )}

                {!hasResults && (
                  <div className="text-center py-12 text-gray-500">
                    未找到与 "{query}" 相关的结果
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
