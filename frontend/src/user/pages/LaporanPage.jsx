import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import BuatLaporanModal from "../components/BuatLaporanModal";
import LaporanDetailModal from "../components/LaporanDetailModal";
import EditLaporanModal from "../components/EditLaporanModal";

const LaporanPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/laporan",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReports(response.data.data || []);
      } catch (apiError) {
        console.log("API not available, using dummy data");
        // Use dummy data for demonstration
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.isi.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      selesai: { color: "bg-green-100 text-green-800", icon: CheckCircleIcon },
      diproses: { color: "bg-yellow-100 text-yellow-800", icon: ClockIcon },
      ditolak: { color: "bg-red-100 text-red-800", icon: XCircleIcon },
      diverifikasi: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircleIcon,
      },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: ClockIcon,
    };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCreateReport = () => {
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Refresh reports list after successful creation
    fetchReports();
  };

  const handleViewDetail = (reportId) => {
    setSelectedReportId(reportId);
    setIsDetailModalOpen(true);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  const handleUpdateReport = (updatedReport) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      )
    );
    setIsEditModalOpen(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/user/laporan/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from local state
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting report:", error);
      alert(
        "Gagal menghapus laporan. " +
          (error.response?.data?.message || "Silakan coba lagi.")
      );
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Saya</h1>
          <p className="text-gray-600">
            Kelola dan pantau laporan pengaduan Anda
          </p>
        </div>
        <button
          onClick={handleCreateReport}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Buat Laporan Baru
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="diproses">Diproses</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.judul}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {report.isi}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(report.id)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Detail
                        </button>
                        {report.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleEditReport(report)}
                              className="text-green-600 hover:text-green-900 inline-flex items-center"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(report.id)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {searchTerm || statusFilter !== "all"
                        ? "Tidak ada laporan yang sesuai"
                        : "Belum ada laporan"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || statusFilter !== "all"
                        ? "Coba ubah filter pencarian"
                        : "Mulai dengan membuat laporan pertama Anda"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {filteredReports.length > 0 && (
        <div className="text-sm text-gray-500">
          Menampilkan {filteredReports.length} dari {reports.length} laporan
        </div>
      )}

      {/* Buat Laporan Modal */}
      <BuatLaporanModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Detail Laporan Modal */}
      <LaporanDetailModal
        isOpen={isDetailModalOpen}
        closeModal={() => setIsDetailModalOpen(false)}
        reportId={selectedReportId}
      />

      {/* Edit Laporan Modal */}
      <EditLaporanModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        report={selectedReport}
        onSuccess={handleUpdateReport}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Transition appear show={true} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50"
            onClose={() => setDeleteConfirm(null)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-3">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Hapus Laporan
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Apakah Anda yakin ingin menghapus laporan ini?
                            Tindakan ini tidak dapat dibatalkan.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteReport(deleteConfirm)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Hapus
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  );
};

export default LaporanPage;
