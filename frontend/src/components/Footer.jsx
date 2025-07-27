import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Informasi Aplikasi */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pengaduan Masyarakat</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform digital untuk menyampaikan keluhan dan aspirasi masyarakat 
              kepada pemerintah daerah. Kami berkomitmen untuk memberikan pelayanan 
              yang transparan dan responsif.
            </p>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">pengaduan@pemkot.go.id</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">(021) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300 text-sm">
                  Jl. Pemkot No. 123, Jakarta Pusat
                </span>
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Jam Operasional</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Senin - Jumat</span>
                <span>08:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sabtu</span>
                <span>08:00 - 12:00</span>
              </div>
              <div className="flex justify-between">
                <span>Minggu</span>
                <span>Tutup</span>
              </div>
              <div className="mt-3 p-2 bg-blue-600 rounded text-center">
                <span className="text-xs font-medium">
                  Pengaduan online 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Pemerintah Kota. Semua hak cipta dilindungi.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Dibuat dengan ❤️ untuk melayani masyarakat
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}