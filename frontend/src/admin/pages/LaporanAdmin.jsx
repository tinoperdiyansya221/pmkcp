import { useState, useEffect } from 'react';
import { pengaduanAPI } from '../../services/api';
import AdminLayout from '../components/AdminLayout';
import EditPengaduanModal from '../components/EditPengaduanModal';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function LaporanAdmin() {
  const [pengaduan, setPengaduan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [totalReports, setTotalReports] = useState(0);

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const fetchPengaduan = async () => {
    try {
      setLoading(true);
      const response = await pengaduanAPI.getAll();
      // Ensure response.data is an array
      const data = Array.isArray(response.data) ? response.data : [];
      setPengaduan(data);
      setTotalReports(data.length);
    } catch (error) {
      console.error('Error fetching pengaduan:', error);
      setError('Gagal memuat data pengaduan');
      setPengaduan([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await pengaduanAPI.updateStatus(id, status);
      fetchPengaduan();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Gagal mengupdate status');
    }
  };

  const handleDelete = async () => {
    try {
      await pengaduanAPI.delete(deleteId);
      fetchPengaduan();
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting pengaduan:', error);
      setError('Gagal menghapus pengaduan');
    }
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'diproses': { color: 'bg-blue-100 text-blue-800', text: 'Diproses' },
      'selesai': { color: 'bg-green-100 text-green-800', text: 'Selesai' }
    };
    
    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Kelola Laporan</h1>
            <p className="mt-2 text-sm text-gray-700">
              Daftar semua laporan pengaduan yang masuk ke sistem.
            </p>
          </div>
        </div>

        {/* Total Reports Card */}
        <div className="mt-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{totalReports}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Laporan
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalReports} laporan terdaftar
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Isi Laporan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(pengaduan) && pengaduan.length > 0 ? pengaduan.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.kategori}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {item.isi}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedPengaduan(item);
                                setShowEditModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            
                            {item.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(item.id, 'diproses')}
                                className="text-blue-600 hover:text-blue-900"
                                title="Verifikasi"
                              >
                                <CheckIcon className="h-5 w-5" />
                              </button>
                            )}
                            
                            {item.status === 'diproses' && (
                              <button
                                onClick={() => handleStatusUpdate(item.id, 'selesai')}
                                className="text-green-600 hover:text-green-900"
                                title="Selesaikan"
                              >
                                <ClockIcon className="h-5 w-5" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedPengaduan(item);
                                setShowEditModal(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            
                            <button
                              onClick={() => {
                                setDeleteId(item.id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          {loading ? 'Memuat data...' : 'Tidak ada data pengaduan'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedPengaduan && (
        <EditPengaduanModal
          pengaduan={selectedPengaduan}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPengaduan(null);
          }}
          onUpdate={fetchPengaduan}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Konfirmasi Hapus</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus pengaduan ini? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}