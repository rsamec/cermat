# Cermat tests

[Demo](https://rsamec.github.io/cermat)

There are 2 main bottlenecks to use cermat offical tests.

- the content is not open and any public usage is strictly limited to the writen approval by the director of the CERMAT
  - the approval is limited to the usage for only non-comercial purposes  
  - the approval is time limited only for 10 month
  - getting the approval may take one month
- the content format available is typically the pdf document - this is not much appropriate for use by a program or an application

This repository shows
- example how to store cermat's materials to be reusable
- example applications and usage of cermat's materials

See more examples

- test application - PWA with offline support with ChatGTP button
  - [czech](https://rsamec.github.io/cermat/wizard/c5a-2023)
  - [math](https://rsamec.github.io/cermat/wizard/m9a-2023)
  - [english](https://rsamec.github.io/cermat/wizard/aja-2023)
  - [german](https://rsamec.github.io/cermat/wizard/dea-2023)
- game application - kahoot alternative - multiplayer
  - [demo](https://kahoot-alternative-xi.vercel.app)
  - [source](https://github.com/rsamec/kahoot-alternative)
- examples of print media
  - [czech](https://rsamec.github.io/cermat/paper/c5a-2023)
  - [math](https://rsamec.github.io/cermat/paper/m9a-2023)
  - [english](https://rsamec.github.io/cermat/paper/aja-2023)
  - [german](https://rsamec.github.io/cermat/paper/dea-2023)
- reusable test specification - [see quiz specification](#cermat-quiz)
  - [czech](public/cz/8/C5A-2023/index.md)
  - [math](public/math/4/M9A-2023/index.md)
  - [english](public/en/diploma/AJA-2023/index.md)
  - [german](public/de/diploma/DEA-2023/index.md)




## License

The files that are created based on CERMAT materials (mainly the content of the public directory) has ['CERMAT' license](https://prijimacky.cermat.cz/files/files/CZVV_pravidla-vyuziti-webstrankyn.pdf).

Everything else is open sourced and has [MIT license](LICENSE.md)


## Quiz specification

Quiz is defined with 2 files
- **quiz content** - markdown file that represents quiz main content with questions
- **quiz meta data** - json file with meta data - quiz additional content, typically the content that is not visible to the user of the quiz e.g the right answers to the questions, the category of questions, etc.

### Quiz content

The quiz content is defined in markdown format [Github flavored markdown](https://github.github.com/gfm). There are simple rules how to structure the content and markdown is extended with option list extension.


#### Quiz structure rules

Quiz main structure forms a tree that is defined by headings
- Setext headings - **top level** - represents some shared content that is valid to multiple questions in sequence, but this heading is not intended to define the question itself
- ATXHeadings - **question levels** - enable to define the question tree
-- the parent nodes represent the **grouping of questions**
-- the leaves in the ATXHeadings tree represent **questions itself**

See quiz example with total 5 questions that share some definition valid for the question 1 and all 2's questions.


```md
**Shared Text for Question 1-2**
A programming language is a set of instructions written by a programmer to deliver instructions to the computer to perform and accomplish a task.
===
# 1 What is your favorite programming language?

# 2 Answer yes or no for the following questions.
## 2.1 Is java a programming language?
## 2.2 Is C# a programming language?
## 2.3 Is vscode a programming language?

# 3 Write your favorite code editor?
```

#### Option list extensions
Markdown is extended with option list, where an additional processing step is performed on list items. The syntax follows the syntax [task list] (https://github.github.com/gfm/#task-list-items-extension-), but inside square brackets it accepts option key.

Example showing two options with A,B keys

```md
- [A] Option A
- [B] Option B
```

### Quiz meta data

Json format that represents the tree of key value items, where
- the key is the unique id of the question
- the value is the meta data for the question, meta data can differ based on the type of the quiz. Typical meta data contains information
  - how to verify the right answer
  - how to compute the points for the right answer
  - how to categorize the questions e.g. using tags
  - hints how to render inputs
  - hints for user how to input the answer
  - etc

Example of quiz meta data to total 5 questions. Meta data is represented here as an empty object {}.

```json
{
  "children": {
    "1": {},
    "2": {
      "children": {
        "2.1": {},
        "2.2": {},
        "2.3": {}
      },
      "metadata": {}
    },
    "3": {}
  }
}
```
**Optional metadata key**

The tree nodes can contain meta data itself to share some information for multiple questions. See the metadata key at the node 2. 


## Cermat quiz

Quiz specification is generic and can be used for cermat tests.

### Cermat quiz content
Cermat quiz content is created semi-automatically. The text content from pdf is extracted + some information about bold and italic font variants (the bold information is not used, because it is mixed with bold headings, the underline is not captured, because it is not part of the font). Then some regular expressions are applied to find the patterns using question numbers that prepare the basic headings structure. The rest is done manually.


Example of the cermat quiz (showing only some questions)

```md

VÝCHOZÍ TEXT K ÚLOZE 4
===
> Petr se Janě před celou třídou posmíval, že má nemoderní mobil a nosí hnusné oblečení,
> a pak se divil, když mu řekla, že se chová jako blbec. Zkrátka *****.

# 4 Která z následujících možností obsahuje ustálené slovní spojení vystihující situaci ve výchozím textu, a patří tedy na vynechané místo (*****) v textu?
- [A] na děravý pytel nová záplata
- [B] na hrubý pytel hrubá záplata
- [C] na hrubý pytel jemná záplata
- [D] na děravý pytel děravá záplata


# 5 Rozhodněte o každé z následujících vět, zda je zapsána pravopisně správně (A), nebo ne (N).
## 5.1 Spoluviníka toho zločinného spiknutí zřejmě nikdo neodhalí. 
## 5.2 Vjezd do areálu výstaviště se nachází hned za kameným mostem. 
## 5.3 V tomto patře jsou kanceláře s výhledem do ulice a nezbitné zázemí. 
## 5.4 Své úspory vynaložil na vybudování záchranné stanice pro zvířata v nouzi. 


# 6 Přiřaďte k jednotlivým souvětím (6.1–6.3) odpovídající tvrzení (A–E).
(Žádnou možnost z nabídky A–E nelze přiřadit víckrát než jednou. Dvě možnosti zbudou a nebudou použity.)
## 6.1 Jeho bývalí spolužáci, který pozval na oslavu, dorazej až za hodinu. 
## 6.2 Měli byste přijet k nám na chalupu, s rodičema se na vás moc těšíme. 
## 6.3 Žádný vozidlo se k nim nedostalo, cesta totiž byla v obouch směrech zavřená. 
- [A] V nespisovném tvaru je užito pouze první podtržené slovo.
- [B] V nespisovném tvaru je užito pouze třetí podtržené slovo.
- [C] V nespisovném tvaru jsou užita celkem dvě podtržená slova, a to první a druhé.
- [D] V nespisovném tvaru jsou užita celkem dvě podtržená slova, a to první a třetí
- [E] V nespisovném tvaru jsou užita celkem dvě podtržená slova, a to druhé a třetí.


# 7 Vypište z každé z následujících vět (7.1 a 7.2) základní skladební dvojici.
(Základní skladební dvojice musí být zapsány pravopisně správně.)
## 7.1 Mezi zdánlivě obyčejnými předměty se při troše štěstí objeví i vzácné kousky.
## 7.2 Loňské silné deště a s nimi související záplavy zničily většinu zemědělské úrody.

```
### Cermat quiz meta data
Cermat quiz meta data contains these information
- verifyBy - function that verify the question`s answers
- computeBy - function that returns the number of points based on question`s answers
- renderBy - function that renders the user input for answer

Json is not writen manually, but generated by json builder utility class.

Example of the cermat json meta data builder utility class.

```ts
  group({
    1: option("B"),
    2: option("D"),
    3: option("D"),
    4: option("B"),
    5: group({
      5.1: optionBool(true),
      5.2: optionBool(false),
      5.3: optionBool(false),
      5.4: optionBool(true),
    }, tasks4Max2Points),
    6: group({
      6.1: option("E"),
      6.2: option("B"),
      6.3: option("D"),
    }),
    7: group({
      7.1: wordsGroup({ podmět: 'kousky', přísudek: 'se objeví' }),
      7.2: wordsGroup({ podmět: 'deště (a) záplavy', přísudek: 'zničily' }),
    }),
  })
```

## Cermat test application example

TODO: add description


## Cermat game - kahoot alternative example

TODO: add description

## Cermat print media example

TODO: add description



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
