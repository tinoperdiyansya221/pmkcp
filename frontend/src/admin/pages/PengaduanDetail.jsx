import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CheckCircleIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { pengaduanAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';

export default function PengaduanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pengaduan, setPengaduan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPengaduanDetail();
  }, [id]);

  const fetchPengaduanDetail = async () => {
    try {
      setLoading(true);
      const response = await pengaduanAPI.getById(id);
      if (response.data.success) {
        setPengaduan(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pengaduan detail:', error);
      setError('Gagal memuat detail pengaduan');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading(true);
      
      const response = await pengaduanAPI.updateStatus(id, { status: newStatus });
      
      if (response.data.success) {
        setPengaduan(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Gagal mengupdate status pengaduan');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'Pending',
        icon: ExclamationTriangleIcon
      },
      diproses: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'Diproses',
        icon: ClockIcon
      },
      selesai: {
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'Selesai',
        icon: CheckCircleIcon
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
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

  if (error || !pengaduan) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error || 'Pengaduan tidak ditemukan'}
          </p>
          <div className="mt-6">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </div>
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
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <Link to="/admin/dashboard" className="text-gray-400 hover:text-gray-500">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-sm font-medium text-gray-500">Detail Pengaduan</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Detail Pengaduan #{pengaduan.id}
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Informasi Pengaduan
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Detail lengkap laporan pengaduan dari masyarakat
                </p>
              </div>
              <div>
                {getStatusBadge(pengaduan.status)}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              {/* Pelapor */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Pelapor
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div>
                    <p className="font-medium">{pengaduan.user?.nama || 'N/A'}</p>
                    <p className="text-gray-500">{pengaduan.user?.email || 'N/A'}</p>
                  </div>
                </dd>
              </div>
              
              {/* Kategori */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <TagIcon className="h-4 w-4 mr-2" />
                  Kategori
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {pengaduan.kategori}
                  </span>
                </dd>
              </div>
              
              {/* Tanggal */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Tanggal Laporan
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(pengaduan.createdAt)}
                </dd>
              </div>
              
              {/* Isi Laporan */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Isi Laporan
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{pengaduan.isi}</p>
                  </div>
                </dd>
              </div>
              
              {/* Foto (jika ada) */}
              {pengaduan.foto && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Foto Pendukung
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <img 
                      src={pengaduan.foto} 
                      alt="Foto pengaduan" 
                      className="max-w-md h-auto rounded-lg shadow-md"
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Aksi Pengaduan
            </h3>
            <div className="flex space-x-3">
              {pengaduan.status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('diproses')}
                  disabled={actionLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Memproses...' : 'Verifikasi & Proses'}
                </button>
              )}
              
              {pengaduan.status === 'diproses' && (
                <button
                  onClick={() => handleStatusUpdate('selesai')}
                  disabled={actionLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Memproses...' : 'Tandai Selesai'}
                </button>
              )}
              
              {pengaduan.status === 'selesai' && (
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Pengaduan telah selesai ditangani</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}