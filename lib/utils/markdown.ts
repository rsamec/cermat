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
function concatPaths(...segments: string[]): string {
  let resultPath = '';

  for (const segment of segments) {
    if (segment.startsWith('./')) {
      // Handle relative path "./"
      resultPath = `${resultPath}/${segment.slice(2)}`;
    } else {
      resultPath = `${resultPath}/${segment}`;
    }
  }

  // Ensure the result path has the correct format
  return resultPath.startsWith('/') ? resultPath : `/${resultPath}`;
}

function transformImgSrc() {
  return (tree: any, file: any, ...args: []) => {

    visit(tree, 'paragraph', node => {

      const image = node.children.find((child: { type: string }) => child.type === 'image');
      if (image) {
        const pathes = file.data?.path;
        image.url = absoluteUrl(pathes?.length > 0 ? `${concatPaths(...pathes.concat(image.url))}` : image.url);
      }
    });
  };
}

function extendData(data?: { path: string[] }) {
  return () => {
    return (tree: any, vfile: any) => {
      Object.assign(vfile.data, data)
    }
  }
}


export default async function markdownToHtml(markdown: string, data?: { path: string[] }) {
  const result = await remark()
    .use(extendData(data))
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