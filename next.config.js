const withExportImages = require('next-export-optimize-images');
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  workboxOptions: {
    maximumFileSizeToCacheInBytes: 5_000_000 ,
  }
});

let assetPrefix = ''
let basePath = ''

const hasRepoSlug = process.env.NEXT_PUBLIC_REPO_SLUG || false
if (hasRepoSlug) {
  const repo = process.env.NEXT_PUBLIC_REPO_SLUG.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

const production = process.env.NODE_ENV === 'production' || false;
console.log("PROD", production)

/** @type {import('next').NextConfig} */
const nextConfig = withPWA(
  withExportImages({
    ...production && { output: 'export' },
    assetPrefix,
    basePath,
  })
)

module.exports = nextConfig
