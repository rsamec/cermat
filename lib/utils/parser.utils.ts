import { NodeType, SyntaxNodeRef, Tree } from "@lezer/common";
import { BlockContext, LeafBlock, LeafBlockParser, MarkdownConfig } from "@lezer/markdown";
import { tags as t } from "@lezer/highlight";

export const Abbreviations = {
  H1: "ATXHeading1",
  H2: "ATXHeading2",
  H3: "ATXHeading3",
  H4: "ATXHeading4",
  H5: "ATXHeading5",
  H6: "ATXHeading6",
  CB: "CodeBlock",
  FC: "FencedCode",
  Q: "Blockquote",
  HR: "HorizontalRule",
  BL: "BulletList",
  OL: "OrderedList",
  LI: "ListItem",
  HB: "HTMLBlock",
  P: "Paragraph",
  BR: "HardBreak",
  Em: "Emphasis",
  St: "StrongEmphasis",
  Im: "Image",
  C: "InlineCode",
  HT: "HTMLTag",
  CM: "Comment",
  q: "QuoteMark",
  l: "ListMark",
  L: "LinkMark",
} as const

export type Abbreviation = keyof typeof Abbreviations;



export function renderHtmlTree(tree: Tree) {
  let lists = ''
  tree.iterate({
    enter({ type, from, to }: SyntaxNodeRef) {
      lists += `<ul><li>${type.name} (${from},${to})`
    },
    leave({ type, from, to }: SyntaxNodeRef) {

      lists += '</ul>'
    }
  })
  return lists;
}

export function chunkByAbbreviationType(tree: Tree, input: string, abbr: Abbreviation) {
  const chunks: string[] = [];
  let lastPosition = 0;
  tree.iterate({
    enter({ type, from, to }: SyntaxNodeRef) {
      if (type.name == Abbreviations[abbr]) {
        chunks.push(input.substring(lastPosition, from))
        lastPosition = to;
      }
    },
    leave({ type, from, to }: SyntaxNodeRef) {
    }
  })
  return chunks.length > 0 ? chunks : [input];
}
export type Question = { type?: { name: string }, header: string, content: string, nextHeader: string, options: string[] };
export type QuestionHtml = Question & { contentHtml: string }
export type State = { position: number, node?: { type: NodeType, from: number, to: number }, options: string[] }
export function generateHeadingsList(tree: Tree, input: string) {

  const children: Question[] = [];
  const isHeading = (type: NodeType) => type.name == Abbreviations.H1 || type.name == Abbreviations.H2;
  let lastState: State = { position: 0, options: [] }

  tree.iterate({
    enter({ type, from, to }: SyntaxNodeRef) {
      if (isHeading(type) || (type.name == Abbreviations.HR)) {

        children.push({
          nextHeader: input.substring(from, to),
          type: lastState.node != null ? lastState.node?.type : { name: "HorizontalRule" },
          header: lastState.node != null && lastState.node.type.name != Abbreviations.HR ? input.substring(lastState.node.from, lastState.node.to) : '',
          content: input.substring(lastState.position, from),
          options: lastState.options
        })
        lastState = { position: to, node: { type, from, to }, options: [] };
      }

      if (type.name == "Option") {
        lastState.options?.push(input.substring(from, to))
      }

    },
    leave({ type, from, to }: SyntaxNodeRef) {

    }
  })
  return children;
}


export const OptionList: MarkdownConfig = {
  defineNodes: [
    { name: "Option", block: true, style: t.list },
    { name: "OptionMarker", style: t.atom }
  ],
  parseBlock: [{
    name: "OptionList",
    leaf(cx, leaf) {
      return /^\[[\w\d]*\][ \t]/.test(leaf.content) && cx.parentType().name == "ListItem" ? new OptionParser : null
    },
    after: "SetextHeading"
  }]
}
class OptionParser implements LeafBlockParser {
  nextLine() { return false }

  finish(cx: BlockContext, leaf: LeafBlock) {
    cx.addLeafElement(leaf, cx.elt("Option", leaf.start, leaf.start + leaf.content.length, [
      cx.elt("OptionMarker", leaf.start, leaf.start + 3),
      ...cx.parser.parseInline(leaf.content.slice(3), leaf.start + 3)
    ]))
    return true
  }
}

export const ShortCodeMarker: MarkdownConfig = {
  defineNodes: [{
    name: "ShortCodeMarker",
    style: t.atom
  }],
  parseInline: [{
    name: "ShortCodeMarker",
    parse(cx, next, pos) {
      let match: RegExpMatchArray | null
      if (next != 123 /* '{' */ || !(match = /^[a-zA-Z_0-9\.]+\}/.exec(cx.slice(pos + 1, cx.end)))) return -1
      return cx.addElement(cx.elt("ShortCodeMarker", pos, pos + 1 + match[0].length))
    },
  }]
}