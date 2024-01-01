import { SyntaxNodeRef, Tree } from "@lezer/common";

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
    enter({type, from, to}: SyntaxNodeRef) {
      lists += `<ul><li>${type.name} (${from},${to})`
    },
    leave({type, from, to}: SyntaxNodeRef) {

      lists += '</ul>'
    }
  })
return lists;
}

export function chunkByAbbreviationType(tree: Tree, input:string, abbr: Abbreviation) {
  const chunks:string[] = [];
  let lastPosition = 0;
  tree.iterate({
    enter({type, from, to}:SyntaxNodeRef) {
      if (type.name == Abbreviations[abbr]){                
        chunks.push(input.substring(lastPosition,from))
        lastPosition = to;
      }
    },
    leave({type, from, to}:SyntaxNodeRef) {     
    }
  })
  return chunks.length > 0 ? chunks: [input];
}






