import React from 'react';
import { Search, ThumbsUp, MessageSquare, Eye, Bookmark, Share2, Filter, TrendingUp, Bot } from 'lucide-react';

const ExperienceMockup = () => (
  <div className="flex flex-col h-full bg-gray-50 w-full">
    <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
      <div className="relative w-1/2">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
        <input type="text" disabled placeholder="搜索公司、岗位、面试题..." className="w-full h-9 pl-9 pr-3 bg-gray-100 border-transparent rounded-md text-sm focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all" />
      </div>
      <div className="flex space-x-3">
        <button className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200">
          <Filter className="w-4 h-4 mr-1" /> 筛选
        </button>
        <button className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md font-medium hover:bg-indigo-700 shadow-sm">发布面经</button>
      </div>
    </div>
    
    <div className="flex flex-1 overflow-hidden">
      {/* Left List */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
        <div className="p-2 flex space-x-2 overflow-x-auto border-b border-gray-100 scrollbar-hide shrink-0">
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] rounded-full whitespace-nowrap font-medium border border-indigo-100">推荐</span>
          <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded-full whitespace-nowrap hover:bg-gray-100 cursor-pointer border border-gray-200">最新</span>
          <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded-full whitespace-nowrap hover:bg-gray-100 cursor-pointer border border-gray-200 flex items-center"><TrendingUp className="w-2.5 h-2.5 mr-1"/> 热榜</span>
          <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] rounded-full whitespace-nowrap hover:bg-gray-100 cursor-pointer border border-gray-200">前端开发</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {[
            { title: "2025 Google SWE L3 北美面经 (已拿 Offer)", tags: ["Google", "System Design", "Offer"], likes: 342, comments: 56, views: "12k", active: true },
            { title: "Meta 前端 E3 连环 BQ 拷问总结，附标准回答模板", tags: ["Meta", "Frontend", "BQ"], likes: 892, comments: 124, views: "45k", active: false },
            { title: "TikTok 暑期实习 OA 笔试真题回忆版 (附代码实现)", tags: ["TikTok", "Intern", "OA"], likes: 567, comments: 89, views: "23k", active: false },
            { title: "Amazon SDE1 VO 凉经，系统设计被问麻了", tags: ["Amazon", "SDE", "System Design"], likes: 128, comments: 45, views: "8k", active: false },
          ].map((post, i) => (
            <div key={i} className={`p-3 rounded-xl border transition-all cursor-pointer ${post.active ? 'border-indigo-300 bg-indigo-50/30 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
              <h3 className={`font-bold mb-1.5 text-xs line-clamp-2 ${post.active ? 'text-indigo-900' : 'text-gray-800'}`}>{post.title}</h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map(tag => (
                  <span key={tag} className={`px-1.5 py-0.5 text-[9px] rounded font-medium ${post.active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center"><ThumbsUp className="w-2.5 h-2.5 mr-1" /> {post.likes}</span>
                  <span className="flex items-center"><MessageSquare className="w-2.5 h-2.5 mr-1" /> {post.comments}</span>
                </div>
                <span className="flex items-center"><Eye className="w-2.5 h-2.5 mr-1" /> {post.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right Detail */}
      <div className="w-1/2 bg-white flex flex-col h-full overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-1 leading-tight">2025 Google SWE L3 北美面经 (已拿 Offer)</h2>
            <div className="flex items-center text-[10px] text-gray-500 space-x-3">
              <div className="flex items-center"><div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-1.5">A</div> Alex_C</div>
              <span>Published 2 days ago</span>
            </div>
          </div>
          <div className="flex space-x-2 shrink-0">
            <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Bookmark className="w-4 h-4" /></button>
            <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden p-4 flex flex-col">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 shrink-0">
            <div className="text-[10px] font-bold text-indigo-800 mb-1.5 flex items-center">
              <Bot className="w-3.5 h-3.5 mr-1" /> AI 核心考点总结
            </div>
            <ul className="text-[10px] text-indigo-700 space-y-1 pl-4 list-disc">
              <li><strong>算法:</strong> 重点考察 Graph (BFS/DFS) 和 Dynamic Programming。</li>
              <li><strong>系统设计:</strong> 侧重于高并发下的 Rate Limiter 设计及分布式缓存机制。</li>
              <li><strong>BQ:</strong> 强调 "Googleyness"，特别是面对模糊需求时的沟通与推进能力。</li>
            </ul>
          </div>
          
          <div className="prose prose-sm max-w-none text-gray-700 space-y-2.5 flex-1 overflow-hidden flex flex-col">
            <p className="text-[11px] shrink-0">背景：Top 50 CS Master，一段大厂实习。10月初内推，11月中旬 VO，上周收到 Offer。</p>
            
            <h4 className="font-bold text-gray-900 text-xs border-b pb-1 mt-2 shrink-0">Round 1: Coding (45 mins)</h4>
            <p className="text-[11px] shrink-0">国人小哥，人非常 nice。题目是 LeetCode Hard 变种（Word Ladder II）。</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] shrink-0">
              <li>先给出了 BFS 找最短路径的思路。</li>
              <li>Follow up: 要求输出所有最短路径。引入了 DFS + 回溯。</li>
              <li>时间复杂度分析被问得很细。</li>
            </ul>
            <div className="bg-gray-800 text-gray-200 p-2 rounded-md font-mono text-[9px] overflow-hidden shrink-0 mt-2">
              <code>
                // 核心代码片段<br/>
                Map&lt;String, List&lt;String&gt;&gt; graph = new HashMap&lt;&gt;();<br/>
                Map&lt;String, Integer&gt; distance = new HashMap&lt;&gt;();<br/>
                bfs(beginWord, endWord, wordSet, graph, distance);<br/>
                dfs(beginWord, endWord, graph, distance, path, result);
              </code>
            </div>

            <h4 className="font-bold text-gray-900 text-xs border-b pb-1 mt-2 shrink-0">Round 2: System Design (45 mins)</h4>
            <p className="text-[11px] shrink-0">设计一个分布式的 Rate Limiter (API 网关限流器)。</p>
            <p className="text-[11px] shrink-0">讨论了 Token Bucket 和 Leaky Bucket 算法的优缺点。重点考察了如何在多台服务器之间同步限流状态（Redis + Lua 脚本）。</p>
            
            <h4 className="font-bold text-gray-900 text-xs border-b pb-1 mt-2 shrink-0">Round 3: Behavioral (45 mins)</h4>
            <p className="text-[11px] shrink-0">Manager 面，主要围绕过往项目经历。</p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] shrink-0">
              <li>Tell me about a time you disagreed with your teammate.</li>
              <li>How do you handle ambiguous requirements?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ExperienceMockup;
