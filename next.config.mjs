/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // The in-browser embedder is only ever loaded on the client; keep the Node-only runtimes out of the server build.
  serverExternalPackages: ['@huggingface/transformers', 'onnxruntime-node', 'sharp'],
  env: {
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString(),
  },
};

export default nextConfig;
