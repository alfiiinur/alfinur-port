/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! PENTING !!
    // Lewati pengecekan TS supaya hemat RAM saat build
    ignoreBuildErrors: true,
  },
  experimental: {
	workerThreads: false,
	cpus:1,
},
  // ... config kamu yang lain (misal images remotePatterns) ...
};

export default nextConfig;
