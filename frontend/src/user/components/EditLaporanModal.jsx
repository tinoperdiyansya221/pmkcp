import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import axios from 'axios';
import {
  XMarkIcon,
  PhotoIcon,
  MapPinIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const EditLaporanModal = ({ isOpen, closeModal, report, onSuccess }) => {
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    lokasi: '',
    kategori: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const categories = [
    'Infrastruktur',
    'Kebersihan',
    'Keamanan',
    'Pelayanan Publik',
    'Lingkungan',
    'Transportasi',
    'Lainnya',
  ];

  useEffect(() => {
    if (report && isOpen) {
      setFormData({
        judul: report.judul || '',
        deskripsi: report.deskripsi || '',
        lokasi: report.lokasi || '',
        kategori: report.kategori || '',
      });
    }
  }, [report, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'Ukuran file maksimal 5MB',
        });
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: 'error',
          text: 'Format file harus JPG, JPEG, atau PNG',
        });
        return;
      }
      
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul laporan harus diisi';
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi laporan harus diisi';
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi kejadian harus diisi';
    }

    if (!formData.kategori) {
      newErrors.kategori = 'Kategori harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };
      
      const formDataToSend = new FormData();
      formDataToSend.append('judul', formData.judul);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('lokasi', formData.lokasi);
      formDataToSend.append('kategori', formData.kategori);
      
      if (selectedFile) {
        formDataToSend.append('foto', selectedFile);
      }
      
      const response = await axios.put(`http://localhost:5000/api/user/laporan/${report.id}`, formDataToSend, { headers });
      
      setMessage({
        type: 'success',
        text: 'Laporan berhasil diperbarui!',
      });
      
      // Call success callback and close modal after delay
      setTimeout(() => {
        onSuccess && onSuccess(response.data.data);
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating report:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Gagal memperbarui laporan. Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        judul: '',
        deskripsi: '',
        lokasi: '',
        kategori: '',
      });
      setSelectedFile(null);
      setMessage({ type: '', text: '' });
      setErrors({});
      closeModal();
    }
  };

  if (!report) return null;

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Edit Laporan
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Message */}
                {message.text && (
                  <div className={`rounded-md p-4 mb-6 ${
                    message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {message.type === 'success' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        ) : (
                          <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${
                          message.type === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Judul */}
                  <div>
                    <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Laporan *
                    </label>
                    <input
                      type="text"
                      id="judul"
                      name="judul"
                      value={formData.judul}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.judul ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan judul laporan"
                    />
                    {errors.judul && (
                      <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
                    )}
                  </div>

                  {/* Kategori */}
                  <div>
                    <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      id="kategori"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.kategori ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.kategori && (
                      <p className="mt-1 text-sm text-red-600">{errors.kategori}</p>
                    )}
                  </div>

                  {/* Lokasi */}
                  <div>
                    <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Kejadian *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="lokasi"
                        name="lokasi"
                        value={formData.lokasi}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.lokasi ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan lokasi kejadian"
                      />
                    </div>
                    {errors.lokasi && (
                      <p className="mt-1 text-sm text-red-600">{errors.lokasi}</p>
                    )}
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Laporan *
                    </label>
                    <textarea
                      id="deskripsi"
                      name="deskripsi"
                      rows={4}
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.deskripsi ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Jelaskan detail laporan Anda"
                    />
                    {errors.deskripsi && (
                      <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
                    )}
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foto Pendukung (Opsional)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Upload foto baru</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">atau drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG hingga 5MB</p>
                        {selectedFile && (
                          <p className="text-sm text-green-600 font-medium">
                            File terpilih: {selectedFile.name}
                          </p>
                        )}
                        {report.foto && !selectedFile && (
                          <p className="text-sm text-blue-600">
                            Foto saat ini: {report.foto}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <DocumentTextIcon className="-ml-1 mr-2 h-4 w-4" />
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditLaporanModal;