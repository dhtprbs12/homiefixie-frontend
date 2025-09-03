import { useState, useEffect } from 'react';
import { Ticket, Feedback } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Admin() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'helpful' | 'not-helpful'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketsResponse, feedbackResponse] = await Promise.all([
        fetch(`${API_URL}/api/tickets`),
        fetch(`${API_URL}/api/feedback`)
      ]);

      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json();
        setTickets(ticketsData);
      } else {
        console.error('Failed to fetch tickets');
      }

      if (feedbackResponse.ok) {
        const feedbackData = await feedbackResponse.json();
        setFeedback(feedbackData);
      } else {
        console.error('Failed to fetch feedback');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedback = feedback.filter(item => {
    if (feedbackFilter === 'all') return true;
    return item.feedback_type === feedbackFilter;
  });

  const getTicketFeedback = (ticketId: number) => {
    return feedback.filter(item => item.ticket_id === ticketId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFeedbackStats = () => {
    const helpful = feedback.filter(item => item.feedback_type === 'helpful').length;
    const notHelpful = feedback.filter(item => item.feedback_type === 'not-helpful').length;
    const total = feedback.length;
    return { helpful, notHelpful, total, helpfulRate: total > 0 ? (helpful / total * 100).toFixed(1) : 0 };
  };

  const stats = getFeedbackStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage tickets and feedback</p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to App
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Helpful Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.helpful}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Not Helpful</p>
                <p className="text-2xl font-bold text-gray-900">{stats.notHelpful}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.helpfulRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Tickets
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by description or email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="feedback-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter Feedback
              </label>
              <select
                id="feedback-filter"
                value={feedbackFilter}
                onChange={(e) => setFeedbackFilter(e.target.value as 'all' | 'helpful' | 'not-helpful')}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Feedback</option>
                <option value="helpful">Helpful Only</option>
                <option value="not-helpful">Not Helpful Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tickets Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Tickets ({filteredTickets.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No tickets found
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const ticketFeedback = getTicketFeedback(ticket.id);
                  const isSelected = selectedTicket?.id === ticket.id;
                  
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Ticket #{ticket.id}
                        </span>
                        <div className="flex items-center space-x-2">
                          {ticketFeedback.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {ticketFeedback.length} feedback
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            ticket.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {ticket.user_email && (
                          <span className="mr-4">{ticket.user_email}</span>
                        )}
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedTicket ? `Feedback for Ticket #${selectedTicket.id}` : `All Feedback (${filteredFeedback.length})`}
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {(() => {
                const feedbackToShow = selectedTicket 
                  ? getTicketFeedback(selectedTicket.id)
                  : filteredFeedback;
                
                if (feedbackToShow.length === 0) {
                  return (
                    <div className="p-6 text-center text-gray-500">
                      {selectedTicket ? 'No feedback for this ticket' : 'No feedback found'}
                    </div>
                  );
                }
                
                return feedbackToShow.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.feedback_type === 'helpful'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.feedback_type === 'helpful' ? (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                            </svg>
                          )}
                          {item.feedback_type}
                        </span>
                        {!selectedTicket && (
                          <span className="text-xs text-gray-500">
                            Ticket #{item.ticket_id}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    {item.feedback_text && (
                      <p className="text-sm text-gray-600 mb-2">
                        "{item.feedback_text}"
                      </p>
                    )}
                    {item.user_email && (
                      <p className="text-xs text-gray-500">
                        From: {item.user_email}
                      </p>
                    )}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Selected Ticket Details */}
        {selectedTicket && (
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Ticket #{selectedTicket.id} Details
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 mb-4">{selectedTicket.description}</p>
                  
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
                  <dl className="text-sm space-y-1">
                    <div>
                      <dt className="inline font-medium text-gray-500">Status:</dt>
                      <dd className="inline ml-2 text-gray-900">{selectedTicket.status}</dd>
                    </div>
                    <div>
                      <dt className="inline font-medium text-gray-500">Created:</dt>
                      <dd className="inline ml-2 text-gray-900">{formatDate(selectedTicket.created_at)}</dd>
                    </div>
                    {selectedTicket.user_email && (
                      <div>
                        <dt className="inline font-medium text-gray-500">Email:</dt>
                        <dd className="inline ml-2 text-gray-900">{selectedTicket.user_email}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {selectedTicket.latest_analysis && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Analysis Summary</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      {selectedTicket.latest_analysis.materials.length > 0 && (
                        <div>
                          <span className="font-medium">Materials:</span> {selectedTicket.latest_analysis.materials.map(m => m.name).join(', ')}
                        </div>
                      )}
                      {selectedTicket.latest_analysis.tools.length > 0 && (
                        <div>
                          <span className="font-medium">Tools:</span> {selectedTicket.latest_analysis.tools.map(t => t.name).join(', ')}
                        </div>
                      )}
                      {selectedTicket.latest_analysis.steps.length > 0 && (
                        <div>
                          <span className="font-medium">Steps:</span> {selectedTicket.latest_analysis.steps.length} step(s)
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}