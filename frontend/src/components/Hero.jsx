import { Link } from "react-router-dom";
import {
  MegaphoneIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  const features = [
    {
      icon: MegaphoneIcon,
      title: "Suara Anda Didengar",
      description:
        "Sampaikan keluhan dan aspirasi Anda langsung kepada pemerintah",
    },
    {
      icon: ClockIcon,
      title: "Respon Cepat",
      description: "Pengaduan Anda akan ditindaklanjuti dalam waktu 24 jam",
    },
    {
      icon: ShieldCheckIcon,
      title: "Transparan & Aman",
      description: "Proses yang transparan dengan keamanan data terjamin",
    },
    {
      icon: UserGroupIcon,
      title: "Untuk Semua",
      description:
        "Platform terbuka untuk seluruh masyarakat tanpa diskriminasi",
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse" />
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40 animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-60 animate-pulse delay-500" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          {/* Main Hero Content */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Suara Masyarakat Puuwatu</span>
            <span className="block text-blue-600">Untuk Perubahan</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Platform digital untuk menyampaikan pengaduan, keluhan, dan aspirasi
            Anda kepada pemerintah. Bersama-sama kita wujudkan pelayanan publik
            yang lebih baik.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              Laporkan Sekarang
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>

          {/* Statistics */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-600">Pengaduan Selesai</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">24 Jam</div>
              <div className="text-sm text-gray-600">Waktu Respon</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-orange-600">5,678</div>
              <div className="text-sm text-gray-600">Pengguna Aktif</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
            Mengapa Memilih Platform Kami?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
