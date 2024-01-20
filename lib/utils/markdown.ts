import { remark } from 'remark';
//import html from 'remark-html';

import rehypeMathjax from 'rehype-mathjax';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import supersub from 'remark-supersub';
import remarkGfm from 'remark-gfm'

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(supersub)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeMathjax)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString()
}

// export default async function markdownToHtml(markdown: string) {
//   const result = await remark().use(html).process(markdown)
//   return result.toString()
// }