import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Building2, Briefcase, FileText, ChevronRight } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'companies' | 'experiences'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>({ jobs: [], companies: [], experiences: [] });

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would hit a global search endpoint
        // For now, we mock the global search results based on the query
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setResults({
          jobs: [
            { id: 1, title: `${query} Engineer`, company: 'Google', location: 'Mountain View, CA' },
            { id: 2, title: `Senior ${query} Developer`, company: 'Meta', location: 'Menlo Park, CA' }
          ],
          companies: [
            { id: 1, name: `${query} Tech`, industry: 'Technology', location: 'San Francisco, CA' }
          ],
          experiences: [
            { id: 1, title: `${query} 面试经验分享`, author: 'User123', date: '2024-10-15' }
          ]
        });
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('q') as string;
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  const renderJobs = () => (
    <div className="space-y-4">
      {results.jobs.map((job: any) => (
        <Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 shrink-0">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{job.company} • {job.location}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );

  const renderCompanies = () => (
    <div className="space-y-4">
      {results.companies.map((company: any) => (
        <Link key={company.id} to={`/companies/${company.id}`} className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{company.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{company.industry} • {company.location}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );

  const renderExperiences = () => (
    <div className="space-y-4">
      {results.experiences.map((exp: any) => (
        <Link key={exp.id} to={`/interview-prep/${exp.id}`} className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{exp.title}</h3>
              <p className="text-sm text-gray-500 mt-1">作者: {exp.author} • {exp.date}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
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
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
              >
                全部结果
              </button>
              <button 
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'jobs' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
              >
                职位 ({results.jobs.length})
              </button>
              <button 
                onClick={() => setActiveTab('companies')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'companies' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
              >
                公司 ({results.companies.length})
              </button>
              <button 
                onClick={() => setActiveTab('experiences')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'experiences' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
              >
                面经 ({results.experiences.length})
              </button>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

                {results.jobs.length === 0 && results.companies.length === 0 && results.experiences.length === 0 && (
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
