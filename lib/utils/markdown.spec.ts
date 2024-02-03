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
  expect(html).toBe('<p><img src="/math/2013/6.jpeg" alt=""></p>')
})


test('hello underline', async () => {
  const input = `__hello__`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><ins>hello</ins></p>')
})

test('hello underline bold', async () => {
  const input = `__**hello**__`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><ins><strong>hello</strong></ins></p>')
})
test('hello bold underline', async () => {
  const input = `**__hello__**`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><strong><ins>hello</ins></strong></p>')
})


test('hello underline italic', async () => {
  const input = `__*hello*__`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><ins><em>hello</em></ins></p>')
})
test('hello italic underline', async () => {
  const input = `*__hello__*`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><em><ins>hello</ins></em></p>')
})


test('hello italic', async () => {
  const input = `*hello*`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><em>hello</em></p>')
})

test('hello strong', async () => {
  const input = `**hello**`

  const html = await markdownToHtml(input);
  expect(html).toBe('<p><strong>hello</strong></p>')
})



