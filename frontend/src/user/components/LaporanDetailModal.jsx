import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";
import {
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  TagIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const LaporanDetailModal = ({ isOpen, closeModal, reportId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && reportId) {
      fetchReportDetail();
    }
  }, [isOpen, reportId]);

  const fetchReportDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        `http://localhost:5000/api/pengaduan/${reportId}`,
        { headers }
      );
      setReport(response.data.data);
    } catch (error) {
      console.error("Error fetching report detail:", error);

      let errorMessage = "Gagal memuat detail laporan";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "ECONNABORTED") {
        errorMessage =
          "Koneksi timeout. Pastikan server backend berjalan dan coba lagi.";
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage =
          "Gagal terhubung ke server. Periksa koneksi jaringan Anda.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      selesai: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircleIcon,
        text: "Selesai",
      },
      diproses: {
        color: "bg-yellow-100 text-yellow-800",
        icon: ClockIcon,
        text: "Diproses",
      },
      ditolak: {
        color: "bg-red-100 text-red-800",
        icon: XCircleIcon,
        text: "Ditolak",
      },
      diverifikasi: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircleIcon,
        text: "Diverifikasi",
      },
      pending: {
        color: "bg-gray-100 text-gray-800",
        icon: ClockIcon,
        text: "Menunggu",
      },
    };

    const config = statusConfig[status] || statusConfig["pending"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClose = () => {
    setReport(null);
    setError("");
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Detail Laporan
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Error
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{error}</p>
                    </div>
                  ) : report ? (
                    <div className="space-y-6">
                      {/* Status and Basic Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">
                            {report.judul}
                          </h1>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {report.id}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                          {getStatusBadge(report.status)}
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-5 w-5 mr-2" />
                            <span>Tanggal: {formatDate(report.createdAt)}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            <span>Lokasi: {report.alamat}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <TagIcon className="h-5 w-5 mr-2" />
                            <span>Kategori: {report.kategori}</span>
                          </div>

                          {report.user && (
                            <div className="flex items-center text-sm text-gray-600">
                              <UserIcon className="h-5 w-5 mr-2" />
                              <span>Pelapor: {report.user.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Photo */}
                        {report.foto && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Foto Pendukung
                            </h4>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={`http://localhost:5000/uploads/${report.foto}`}
                                alt="Foto laporan"
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div className="hidden h-48 bg-gray-100 items-center justify-center">
                                <div className="text-center">
                                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                  <p className="mt-2 text-sm text-gray-500">
                                    Foto tidak dapat dimuat
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Deskripsi Laporan
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {report.isi}
                          </p>
                        </div>
                      </div>

                      {/* Response/Feedback */}
                      {report.tanggapan && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Tanggapan
                          </h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                              {report.tanggapan}
                            </p>
                            {report.tanggal_tanggapan && (
                              <p className="text-xs text-blue-600 mt-2">
                                Ditanggapi pada:{" "}
                                {formatDate(report.tanggal_tanggapan)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Timeline
                        </h4>
                        <div className="flow-root">
                          <ul className="-mb-8">
                            <li>
                              <div className="relative pb-8">
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                      <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Laporan dibuat
                                      </p>
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                      {formatDate(report.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                            {report.status !== "pending" && (
                              <li>
                                <div className="relative pb-8">
                                  <div className="relative flex space-x-3">
                                    <div>
                                      <span
                                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                          report.status === "selesai"
                                            ? "bg-green-500"
                                            : report.status === "diproses"
                                            ? "bg-yellow-500"
                                            : report.status === "ditolak"
                                            ? "bg-red-500"
                                            : "bg-blue-500"
                                        }`}
                                      >
                                        {report.status === "selesai" ? (
                                          <CheckCircleIcon className="h-5 w-5 text-white" />
                                        ) : report.status === "ditolak" ? (
                                          <XCircleIcon className="h-5 w-5 text-white" />
                                        ) : (
                                          <ClockIcon className="h-5 w-5 text-white" />
                                        )}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                      <div>
                                        <p className="text-sm text-gray-500">
                                          Status diubah menjadi {report.status}
                                        </p>
                                      </div>
                                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                        {report.tanggal_tanggapan
                                          ? formatDate(report.tanggal_tanggapan)
                                          : "-"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Tutup
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LaporanDetailModal;
