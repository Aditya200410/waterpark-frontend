import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, RefreshCw, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Policies = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const response = await fetch('https://api.rikocraft.com/api/api/data-page');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const policiesMap = {};
          data.forEach(policy => {
            if (policy.type) policiesMap[policy.type] = policy;
          });
          setPolicies(policiesMap);
        } else setPolicies({});
      } else {
        setPolicies({});
        toast.error('Failed to load policies from server');
      }
    } catch (error) {
      setPolicies({});
      toast.error('Failed to load policies from server');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions', icon: <FileText size={20} /> },
    { id: 'refund', label: 'Refund Policy', icon: <RefreshCw size={20} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock size={20} /> }
  ];

  const renderContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.endsWith(':') && trimmedLine.length < 100 && trimmedLine.length > 3) {
        if (currentSection) sections.push(currentSection);
        currentSection = { header: trimmedLine, content: [] };
      } else if (currentSection && trimmedLine !== '') {
        currentSection.content.push(trimmedLine);
      } else if (!currentSection && trimmedLine !== '') {
        currentSection = { header: 'Content', content: [trimmedLine] };
      }
    });
    if (currentSection) sections.push(currentSection);

    if (sections.length === 0) {
      return content.split('\n').filter(l => l.trim() !== '').map((line, i) => (
        <p key={i} className="text-blue-900 leading-relaxed mb-3">{line}</p>
      ));
    }

    return sections.map((section, index) => {
      const sectionId = `${activeTab}-${index}`;
      const isExpanded = expandedSections[sectionId];

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="mb-6"
        >
          <button
            onClick={() => toggleSection(sectionId)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200"
          >
            <h3 className="text-lg font-semibold text-blue-800">{section.header}</h3>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-white border border-t-0 border-blue-200 rounded-b-xl">
                  {section.content.map((line, idx) => (
                    <p key={idx} className="text-blue-900 leading-relaxed mb-3">{line}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-400 rounded-full"
        />
      </div>
    );
  }

  const hasPolicies = Object.keys(policies).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-700 py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm border-4 border-blue-200 shadow-lg">
            <Shield size={40} className="text-blue-100" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Legal & Policies
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Transparent information about our terms, refunds, and privacy practices
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {!hasPolicies ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-200">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={48} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                No Policies Available
              </h2>
              <p className="text-blue-700 mb-6 max-w-md mx-auto">
                Policy content has not been set up yet. Please contact the administrator to add the required policy information.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className="flex items-center gap-3 px-6 py-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-600"
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border border-blue-200'
                      : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                {policies[activeTab] ? (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-12"
                    >
                      <h2 className="text-3xl font-bold text-blue-900 mb-4">
                        {policies[activeTab].heading}
                      </h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
                    </motion.div>
                    
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
                      {renderContent(policies[activeTab].content)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-12 border border-blue-200">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-blue-900 mb-2">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                      </h3>
                      <p className="text-blue-700">
                        This policy content has not been set up yet.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default Policies;
