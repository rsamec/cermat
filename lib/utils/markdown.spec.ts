import { expect, test } from 'vitest'
import { OptionList, ShortCodeMarker, chunkByAbbreviationType, chunkHeadingsList, renderHtmlTree } from './parser.utils'
import { parser, GFM, Subscript, Superscript } from '@lezer/markdown';
import markdownToHtml from './markdown';

const markdownParser = parser.configure([[ShortCodeMarker, OptionList], GFM, Subscript, Superscript]);

test('markdown superscript and subscript', async () => {

  const input = `x^2^`

  const parsedTree = markdownParser.parse(input);

  console.log(renderHtmlTree(parsedTree));
  const html = await markdownToHtml(input);
  //expect(html).toBe('<p>x2</p>')
  expect(html).toBe('<p>x<sup>2</sup></p>')
  
  

})

