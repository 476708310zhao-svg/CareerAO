import React, { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const ApplicationAssistant = lazy(() => import('../pages/ApplicationAssistant'));
const InterviewPrep = lazy(() => import('../pages/InterviewPrep'));
const AIInterview = lazy(() => import('../pages/AIInterview'));
const SalaryInsights = lazy(() => import('../pages/SalaryInsights'));
const MyResume = lazy(() => import('../pages/MyResume'));
const ResumeEditor = lazy(() => import('../pages/ResumeEditor'));
const JobDetail = lazy(() => import('../pages/JobDetail'));
const CareerPlanning = lazy(() => import('../pages/CareerPlanning'));
const AgencyEvaluation = lazy(() => import('../pages/AgencyEvaluation'));
const CampusCalendar = lazy(() => import('../pages/CampusCalendar'));
const CampusCalendarTable = lazy(() => import('../pages/CampusCalendarTable'));
const Membership = lazy(() => import('../pages/Membership'));
const Blog = lazy(() => import('../pages/Blog'));
const JobNews = lazy(() => import('../pages/JobNews'));
const InterviewExperiences = lazy(() => import('../pages/InterviewExperiences'));
const VisaPolicies = lazy(() => import('../pages/VisaPolicies'));
const HelpCenter = lazy(() => import('../pages/HelpCenter'));
const AboutTeam = lazy(() => import('../pages/AboutTeam'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Jobs = lazy(() => import('../pages/Jobs'));
const CompanyDetail = lazy(() => import('../pages/CompanyDetail'));
const Search = lazy(() => import('../pages/Search'));
const JobMap = lazy(() => import('../pages/JobMap'));
const Favorites = lazy(() => import('../pages/Favorites'));
const Messages = lazy(() => import('../pages/Messages'));
const Applications = lazy(() => import('../pages/Applications'));

export const appRoutes = [
  { path: '/', element: <Home /> },
  { path: '/jobs', element: <Jobs /> },
  { path: '/jobs/:id', element: <JobDetail /> },
  { path: '/job-map', element: <JobMap /> },
  { path: '/companies/:id', element: <CompanyDetail /> },
  { path: '/search', element: <Search /> },
  { path: '/application-assistant', element: <ApplicationAssistant /> },
  { path: '/interview-prep', element: <InterviewPrep /> },
  { path: '/ai-interview', element: <AIInterview /> },
  { path: '/salary-insights', element: <SalaryInsights /> },
  { path: '/my-resume', element: <MyResume /> },
  { path: '/my-resume/:id', element: <ResumeEditor /> },
  { path: '/career-planning', element: <CareerPlanning /> },
  { path: '/agency-evaluation', element: <AgencyEvaluation /> },
  { path: '/campus-calendar', element: <CampusCalendar /> },
  { path: '/campus-calendar/table', element: <CampusCalendarTable /> },
  { path: '/membership', element: <Membership /> },
  { path: '/favorites', element: <Favorites /> },
  { path: '/messages', element: <Messages /> },
  { path: '/applications', element: <Applications /> },
  { path: '/blog', element: <Blog /> },
  { path: '/news', element: <JobNews /> },
  { path: '/interview-experiences', element: <InterviewExperiences /> },
  { path: '/visa-policies', element: <VisaPolicies /> },
  { path: '/help-center', element: <HelpCenter /> },
  { path: '/team', element: <AboutTeam /> },
  { path: '/contact', element: <ContactUs /> },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/terms', element: <TermsOfService /> },
  { path: '*', element: <NotFound /> },
];
