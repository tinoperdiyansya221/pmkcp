import { useState, useEffect } from 'react';
import { pengaduanAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import {
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    diproses: 0,
    selesai: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await pengaduanAPI.getAll();
      const data = response.data.success ? response.data.data.pengaduan || [] : [];
      
      // Calculate statistics
      const totalReports = data.length;
      const pendingReports = data.filter(item => item.status === 'pending').length;
      const diprosesReports = data.filter(item => item.status === 'diproses').length;
      const selesaiReports = data.filter(item => item.status === 'selesai').length;
      
      setStats({
        total: totalReports,
        pending: pendingReports,
        diproses: diprosesReports,
        selesai: selesaiReports
      });
      
      // Get recent reports (last 5)
      const recent = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentReports(recent);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };



  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Pending'
      },
      diproses: {
        color: 'bg-blue-100 text-blue-800',
        text: 'Diproses'
      },
      selesai: {
        color: 'bg-green-100 text-green-800',
        text: 'Selesai'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const statsCards = [
    {
      name: 'Total Laporan',
      value: stats.total,
      icon: DocumentTextIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending',
      value: stats.pending,
      icon: ClockIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Diproses',
      value: stats.diproses,
      icon: ChartBarIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Selesai',
      value: stats.selesai,
      icon: UsersIcon,
      color: 'bg-green-500'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard Admin
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={fetchDashboardData}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-3 rounded-md ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Reports */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Laporan Terbaru
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              5 laporan pengaduan terbaru yang masuk
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentReports.length === 0 ? (
              <li className="px-4 py-4 text-center text-gray-500">
                Tidak ada laporan terbaru
              </li>
            ) : (
              recentReports.map((item) => (
                <li key={item.id} className="px-4 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.user?.nama || 'N/A'} - {item.kategori}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {item.isi.length > 100 ? `${item.isi.substring(0, 100)}...` : item.isi}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
       </div>
     </AdminLayout>
   );
 }