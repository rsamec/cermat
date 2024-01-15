let basePath = ''

const hasRepoSlug = process.env.NEXT_PUBLIC_REPO_SLUG || false
if (hasRepoSlug) {
  const repo = process.env.NEXT_PUBLIC_REPO_SLUG.replace(/.*?\//, '')
  basePath = `/${repo}`
}
console.log(basePath);
/**
 * @type {import('next-export-optimize-images').Config}
 */
const config = {
  // your configuration values.
  basePath
}

module.exports = config
