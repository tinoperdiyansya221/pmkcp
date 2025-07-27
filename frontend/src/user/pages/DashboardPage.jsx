import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    diverifikasi: 0,
    ditolak: 0,
    diproses: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Try to fetch real data, fallback to dummy data if API not available
      try {
        // Fetch user reports statistics
        const statsResponse = await axios.get('http://localhost:5000/api/user/laporan/stats', { headers });
        setStats(statsResponse.data);

        // Fetch recent reports
        const reportsResponse = await axios.get('http://localhost:5000/api/user/laporan?limit=5', { headers });
        setRecentReports(reportsResponse.data.data || []);
      } catch (apiError) {
        console.log('API not available, using dummy data');
        // Use dummy data for demonstration
        setStats({
          total: 12,
          diverifikasi: 8,
          ditolak: 1,
          diproses: 3,
        });
        
        setRecentReports([
          {
            id: 1,
            judul: 'Jalan Rusak di Jl. Merdeka',
            tanggal: '2024-01-15T10:30:00Z',
            status: 'diproses',
          },
          {
            id: 2,
            judul: 'Lampu Jalan Mati',
            tanggal: '2024-01-14T14:20:00Z',
            status: 'selesai',
          },
          {
            id: 3,
            judul: 'Sampah Menumpuk di TPS',
            tanggal: '2024-01-13T09:15:00Z',
            status: 'diverifikasi',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'selesai': { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      'diproses': { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
      'ditolak': { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      'diverifikasi': { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: ClockIcon };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang di dashboard pengaduan Anda</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Laporan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Diverifikasi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.diverifikasi}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Diproses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.diproses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ditolak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Laporan Terbaru</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentReports.length > 0 ? (
            recentReports.map((report) => (
              <div key={report.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{report.judul}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formatDate(report.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(report.status)}
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada laporan</h3>
              <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat laporan pertama Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;