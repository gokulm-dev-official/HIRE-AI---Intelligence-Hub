import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from './layouts/DashboardLayout';
import ATS_Dashboard from './pages/ATS_Dashboard';
import Job_Recommendation from './pages/Job_Recommendation';
import Applications from './pages/Applications';
import Candidates from './pages/Candidates';
import CandidateView from './pages/CandidateView';
import BulkUpload from './pages/BulkUpload';
import ResumeUpload from './components/ResumeUpload';
import ATS_Check from './pages/ATS_Check';
import About from './pages/About';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<ATS_Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:id" element={<CandidateView />} />
            <Route path="/bulk" element={<BulkUpload />} />
            <Route path="/upload" element={<div className="pt-10"><ResumeUpload onUploadSuccess={(data) => console.log(data)} /></div>} />
            <Route path="/jobs" element={<Job_Recommendation />} />
            <Route path="/ats-check" element={<ATS_Check />} />
            <Route path="/insights" element={<ATS_Check />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
