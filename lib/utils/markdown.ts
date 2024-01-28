import { remark } from 'remark';
//import html from 'remark-html';

import rehypeMathjax from 'rehype-mathjax';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import supersub from 'remark-supersub';
import remarkGfm from 'remark-gfm';

import { visit } from 'unist-util-visit';
import { absoluteUrl } from './utils';

//const imgDirInsidePublic = 'images';

function transformImgSrc() {
  return (tree: any) => {
    visit(tree, 'paragraph', node => {
      const image = node.children.find((child: { type: string }) => child.type === 'image');
      if (image) {
        image.url = absoluteUrl(image.url);
      }
    });
  };
}

export default async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkParse)
    .use(underlinePlugin)
    .use(transformImgSrc)
    .use(remarkMath)
    .use(remarkGfm)
    .use(supersub)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeMathjax, {
      svg: {
        scale: 2,
      },
    })
    .use(rehypeStringify)
    .process(markdown);

  return result.toString()
}

// export default async function markdownToHtml(markdown: string) {
//   const result = await remark().use(html).process(markdown)
//   return result.toString()
// }


/**
 * Underline plugin for Remark.
 */
const underlinePlugin = () => {
  function transformer(tree: any, { value }: { value: any }) {
    // Convert strong nodes created by "__" to a different unist node type.
    visit(tree, 'strong', (node, position, parent) => {

      const startOg = node.position.start.offset;
      const endOg = node.position.end.offset;

      const strToOperateOn = value.substring(startOg, endOg);
      const wasUnderscores =
        strToOperateOn.startsWith("__") && strToOperateOn.endsWith("__");

      if (wasUnderscores) {
        node.type = "underline";
        node.data = {
          hName: "ins",
          hProperties: {}
        };
      }
    });
  }

  return transformer;
};