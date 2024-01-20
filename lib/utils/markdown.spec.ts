import { expect, test } from 'vitest'
import markdownToHtml from './markdown';

test('markdown superscript and subscript', async () => {
  const input = `x^2^`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p>x<sup>2</sup></p>')
})

test('markdown image src transform', async () => {
  const input = `![](/math/2013/6.jpeg)`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><img src="/images/math/2013/6.jpeg" alt=""></p>')
})



