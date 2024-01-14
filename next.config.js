const withExportImages = require('next-export-optimize-images')

let assetPrefix = ''
let basePath = ''

const hasRepoSlug = process.env.NEXT_PUBLIC_REPO_SLUG || false
if (hasRepoSlug) {
  const repo = process.env.NEXT_PUBLIC_REPO_SLUG.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}

const production = process.env.NODE_ENV === 'production' || false;

/** @type {import('next').NextConfig} */
const nextConfig = withExportImages({
  ...production && { output: 'export' },
  assetPrefix,
  basePath,
})

module.exports = nextConfig
