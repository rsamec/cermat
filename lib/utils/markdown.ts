import { remark } from 'remark';
//import html from 'remark-html';

import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import supersub from 'remark-supersub';
import remarkGfm from 'remark-gfm';
// import {fromMarkdown} from 'mdast-util-from-markdown';
// import {mathFromMarkdown} from 'mdast-util-math';
// import {math} from 'micromark-extension-math';


import { visit } from 'unist-util-visit';
import { imageUrl } from './utils';

//const imgDirInsidePublic = 'images';
function concatPaths(...segments: string[]): string {
  let resultPath = segments[0] ?? '';

  for (let i = 1; i != segments.length; i++) {
    const segment = segments[i];

    if (segment.startsWith('./')) {
      // Handle relative path "./"
      resultPath = `${resultPath}/${segment.slice(2)}`;
    } else {
      resultPath = `${resultPath}/${segment}`;
    }
  }
  // Ensure the result path has the correct format
  return resultPath.startsWith('/') || resultPath.startsWith("http") ? resultPath : `/${resultPath}`;
}

function transformImgSrc() {
  return (tree: any, file: any, ...args: []) => {
    visit(tree, node => node.type === 'heading' || node.type === 'paragraph', node => {
      const image = node.children?.find((child: { type: string }) => child.type === 'image' || child.type === 'link');

      if (image) {
        const pathes = file.data?.path;
        image.url = imageUrl(pathes?.length > 0 ? `${concatPaths(...pathes.concat(image.url))}` : image.url);
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

function rehypeAudio(options: { [index: string]: Object }) {
  const settings = options || {}

  return function (tree: any) {
    visit(tree, 'element', function (node, index, parent) {
      if (
        !parent ||
        typeof index !== 'number' ||
        node.tagName !== 'a' ||
        !node.properties.href
      ) {
        return
      }

      const src = String(node.properties.href)
      const extension = src.split(".").pop() ?? '';

      if (!Object.hasOwn(settings, extension)) {
        return
      }

      /** @type {Array<Element>} */
      const sources = []
      const map = settings[extension] ?? {}
      /** @type {string} */
      let key

      for (key in map) {
        if (Object.hasOwn(map, key)) {
          sources.push({
            type: 'element',
            tagName: 'source',
            properties: { src, ...map },
            children: [
              //@todo - add text node 
              //- Your browser does not support the audio element.
            ]
          })
        }
      }

      parent.children[index] = {
        type: 'element',
        tagName: 'audio',
        properties: {
          controls: true
        },
        children: [...sources, node]
      }
    })
  }
}

export default async function markdownToHtml(markdown: string, data?: { path: string[] }) {
  const result = await remark()
    .use(extendData(data))
    .use(remarkParse)
    .use(underlinePlugin)
    .use(firstWordPlugin)
    .use(transformImgSrc)
    .use(remarkMath)
    .use(remarkGfm)
    .use(supersub)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeKatex)
    .use(rehypeAudio, {
      mp3: {
        preload: 'auto',
        type: 'audio/mpeg'
      }
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

const firstWordPlugin = () => {
  function transformer(tree: any, { value }: { value: any }) {
    visit(tree, 'heading', (node, index?: any) => {

      if ((index > 0) ||
        (!('children' in node)) ||
        (node.children.length <= 0) ||
        (!('value' in node.children[0]))) {
        return
      }


      var para = node.children[0].value
      var word = para.split(' ')[0]
      var text = para.substr(word.length)

      // remove first word from text
      node.children[0].value = text

      // replace what was first word with accessible dropcapped markup
      node.children.unshift(
        {
          type: 'emphasis',
          children: [{
            type: 'text',
            value: word
          }],
          data: {
            hName: 'span',
            hProperties: {}
          }
        }
      )
    }
    );
  }

  return transformer;
};


// export function fromMarkdownTo(markdown: string) {
//   const tree = fromMarkdown(markdown, {
//     extensions: [math()],
//     mdastExtensions: [mathFromMarkdown()]
//   })
//   return tree;
// }