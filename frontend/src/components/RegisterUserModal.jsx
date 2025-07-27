import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { authAPI } from "../services/api";

export default function RegisterUserModal({
  isOpen,
  closeModal,
  openLoginModal,
  openAdminModal,
}) {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    noHp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear register error
    if (registerError) {
      setRegisterError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validasi nama
    if (!formData.nama.trim()) {
      newErrors.nama = "Nama lengkap wajib diisi";
    } else if (formData.nama.trim().length < 2) {
      newErrors.nama = "Nama minimal 2 karakter";
    }

    // Validasi email
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validasi nomor HP
    if (!formData.noHp.trim()) {
      newErrors.noHp = "Nomor HP wajib diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.noHp)) {
      newErrors.noHp = "Format nomor HP tidak valid";
    } else if (formData.noHp.replace(/[^0-9]/g, "").length < 10) {
      newErrors.noHp = "Nomor HP minimal 10 digit";
    }

    // Validasi password
    if (!formData.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password =
        "Password harus mengandung huruf besar, huruf kecil, dan angka";
    }

    // Validasi konfirmasi password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setRegisterError("");
    setSuccessMessage("");

    try {
      const registerData = {
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        noHp: formData.noHp.trim(),
        password: formData.password,
      };

      const response = await authAPI.register(registerData);

      if (response.data.success) {
        setSuccessMessage(
          "Pendaftaran berhasil! Silakan login dengan akun Anda."
        );

        // Reset form
        setFormData({
          nama: "",
          email: "",
          noHp: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          handleOpenLogin();
        }, 2000);
      }
    } catch (error) {
      console.error("Register error:", error);

      if (error.response?.data?.message) {
        setRegisterError(error.response.data.message);
      } else if (error.code === "ECONNABORTED") {
        setRegisterError(
          "Koneksi timeout. Pastikan server backend berjalan dan coba lagi."
        );
      } else if (error.message && error.message.includes("Network Error")) {
        setRegisterError(
          "Gagal terhubung ke server. Periksa koneksi jaringan Anda."
        );
      } else {
        setRegisterError(
          "Terjadi kesalahan saat mendaftar. Silakan coba lagi."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthMap = {
      0: { text: "", color: "" },
      1: { text: "Sangat Lemah", color: "bg-red-500" },
      2: { text: "Lemah", color: "bg-orange-500" },
      3: { text: "Sedang", color: "bg-yellow-500" },
      4: { text: "Kuat", color: "bg-green-500" },
      5: { text: "Sangat Kuat", color: "bg-green-600" },
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength();

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      nama: "",
      email: "",
      noHp: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setRegisterError("");
    setSuccessMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    closeModal();
  };

  const handleOpenLogin = () => {
    handleClose();
    openLoginModal();
  };

  const handleOpenAdmin = () => {
    handleClose();
    openAdminModal();
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                      <UserPlusIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Daftar Akun Pengguna
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={handleClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nama Field */}
                  <div>
                    <label
                      htmlFor="nama"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      autoComplete="name"
                      value={formData.nama}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.nama ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Masukkan nama lengkap Anda"
                    />
                    {errors.nama && (
                      <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Masukkan email Anda"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Nomor HP Field */}
                  <div>
                    <label
                      htmlFor="noHp"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nomor HP
                    </label>
                    <input
                      id="noHp"
                      name="noHp"
                      type="tel"
                      autoComplete="tel"
                      value={formData.noHp}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.noHp ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Masukkan nomor HP Anda"
                    />
                    {errors.noHp && (
                      <p className="mt-1 text-sm text-red-600">{errors.noHp}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.password ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Masukkan password Anda"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{
                                width: `${
                                  (passwordStrength.strength / 5) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {passwordStrength.text}
                          </span>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Konfirmasi password Anda"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm text-green-600">{successMessage}</p>
                    </div>
                  )}

                  {/* Register Error */}
                  {registerError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{registerError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : (
                      "Daftar Sekarang"
                    )}
                  </button>
                </form>

                {/* Footer Links */}
                <div className="mt-6 space-y-3">
                  <div className="text-center">
                    <span className="text-sm text-gray-600">
                      Sudah punya akun?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenLogin}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Masuk sekarang
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleOpenAdmin}
                      className="text-sm text-gray-600 hover:text-gray-500"
                    >
                      Login sebagai Admin
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
