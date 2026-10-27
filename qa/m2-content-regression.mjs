import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import ts from 'typescript'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const [references, articles, customerArticles, articleTypes, detail, figureModel, sourceMatrix, assetManifest] = await Promise.all([
  read('src/content/therapyReferences.ts'),
  read('src/content/therapyArticles.ts'),
  read('src/content/customerRevisionArticles.ts'),
  read('src/content/therapyContent.types.ts'),
  read('src/components/therapy/TherapyDetailPage.tsx'),
  read('src/content/therapyArticleFigures.ts').catch(() => ''),
  read('docs/content-research/THERAPY-CLAIM-SOURCE-MATRIX.md'),
  read('assets/ASSET-LICENSE-MANIFEST.md'),
])
const maternityGuides = await read('src/content/maternityGuides.ts')
const sourcesPage = await read('src/pages/InformationPages.tsx')
const sourceDisclosure = await read('src/components/ui/SourceDisclosure.tsx')

const expectedArticleIds = ['A01', 'A04', 'A05', 'A06', 'B01', 'B05', 'B06', 'T01', 'T02', 'T03', 'T04']
const requiredTopics = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'B01', 'B02', 'B03', 'B04', 'B05', 'B06']
const sourceBlocks = new Map([...references.matchAll(/^\s*((?:S\d+)|(?:C\d+)):\s*\{([\s\S]*?)^\s*\},/gm)].map((match) => [match[1], match[2]]))
const m1ReferenceBaseline = execFileSync('git', ['show', '344085c0a2795157c88def760d2c3ac2139d61e1:src/content/therapyReferences.ts'], { encoding: 'utf8' })
const baselineSourceBlocks = new Map([...m1ReferenceBaseline.matchAll(/^\s*((?:S\d+)|(?:C\d+)):\s*\{([\s\S]*?)^\s*\},/gm)].map((match) => [match[1], match[2]]))
const allArticleData = `${articles}\n${customerArticles}`

assert.equal(expectedArticleIds.length, 11)
for (const id of expectedArticleIds) {
  assert.ok(allArticleData.includes(`'${id}'`), `${id} remains represented in article data`)
  assert.ok(new RegExp(`\\| ${id} \\|`).test(sourceMatrix), `${id} has an evidence-to-claim row`)
  assert.ok(new RegExp(`^\\s*${id}:\\s*\\{`, 'm').test(figureModel), `${id} has a figure record keyed by its stable article ID`)
}
for (const topic of requiredTopics) assert.ok(new RegExp(`topicId: '${topic}'`).test(maternityGuides), `${topic} remains mapped to a guide`)

for (const id of ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08']) {
  assert.ok(sourceBlocks.has(id), `${id} remains in the central source register`)
  const baseline = baselineSourceBlocks.get(id)
  const current = sourceBlocks.get(id)
  assert.ok(baseline, `${id} exists in the M1 reference baseline`)
  for (const field of ['url', 'doi']) {
    assert.equal(current.match(new RegExp(`${field}:\\s*'([^']+)'`))?.[1], baseline.match(new RegExp(`${field}:\\s*'([^']+)'`))?.[1], `${id} customer ${field.toUpperCase()} remains unchanged`)
  }
}
for (const [, ids] of allArticleData.matchAll(/referenceIds:\s*\[([^\]]*)\]/g)) {
  for (const [, id] of ids.matchAll(/'((?:S|C)\d+)'/g)) assert.ok(sourceBlocks.has(id), `Article reference ${id} is in the source register`)
}
assert.doesNotMatch(`${allArticleData}\n${maternityGuides}`, /(?:referenceIds|sourceIds):\s*\[[^\]]*'(?:S3|S4|S28)'/, 'Historical reviews are not attached to current public article or guide claims')
assert.match(sourcesPage, /filter\(\(source\) => source\.sourceType !== 'historical_source'\)/, 'The public source directory excludes internal historical sources')
assert.match(sourcesPage, /getTherapySourceTypeLabel\(source\.sourceType\)/, 'Public sources show their type category')
assert.match(sourceDisclosure, /source\.category/, 'Article source lists can display source categories')
assert.match(await read('src/components/guides/MaternityGuidePage.tsx'), /category:\s*getTherapySourceTypeLabel\(source\.sourceType\)/, 'Pregnancy and birth guides display source categories')
assert.match(sourceBlocks.get('S1'), /sourceType:\s*'clinical_guideline'/, 'WHO 2018 is classified as a guideline')
assert.match(sourceBlocks.get('S27'), /sourceType:\s*'official_health_information'/, 'ACOG 2020 is classified as official health information')
for (const [id, block] of sourceBlocks) {
  assert.match(block, /sourceType:/, `${id} has a source category`)
  if (/sourceType:\s*'(original_research|systematic_review|overview_of_reviews)'/.test(block)) {
    const year = Number(block.match(/publicationYear:\s*(\d{4})/)?.[1])
    assert.ok(year >= 2022 && year <= 2026, `${id} public research evidence is from 2022–2026`)
  }
}

const newResearchIds = ['S31', 'S32', 'S33', 'S34', 'S35', 'S36', 'S37', 'S38', 'S39', 'S40']
for (const id of newResearchIds) {
  const block = sourceBlocks.get(id)
  assert.ok(block, `${id} is recorded in therapyReferences`)
  assert.match(block, /sourceType:\s*'(original_research|systematic_review|overview_of_reviews)'/, `${id} has a research source category`)
  assert.match(block, /publicationYear:\s*202[3-6]/, `${id} is dated 2023–2026`)
  assert.match(block, /authors:\s*\[/, `${id} records its authors`)
  assert.match(block, /doi:\s*'/, `${id} records its DOI`)
  assert.match(block, /studyDesign:\s*'/, `${id} records its design`)
  assert.match(block, /population:\s*'/, `${id} records its population`)
  assert.match(block, /evidenceLimitations:\s*\[/, `${id} records its limitations`)
}

assert.match(articleTypes, /sourceType\??:.*'official_health_information'/, 'Source types distinguish official health information from research')
assert.match(articleTypes, /interface TherapyArticleFigure/, 'Article figure metadata has a shared type')
assert.match(articleTypes, /figure:\s*TherapyArticleFigure/, 'Every fully composed therapy article requires a figure')
const figureComponent = await read('src/components/therapy/TherapyArticleFigure.tsx')
assert.match(figureComponent, /<figure[^>]*className="therapy-article-figure"/, 'Article artwork uses a semantic figure')
assert.match(figureComponent, /<figcaption/, 'Article artwork includes a visible caption')
assert.match(figureComponent, /\{figure\.caption\}/, 'Article figure displays its descriptive caption')
assert.doesNotMatch(figureComponent, /figure\.attribution|Foto oleh/, 'Photographer attribution metadata is not appended to the visible caption')
assert.match(figureComponent, /loading="lazy"/, 'Article artwork loads lazily')
assert.match(figureModel, /attribution:\s*\{/, 'Photographer and source-page metadata remain in the article figure data')
const practiceGuide = detail.match(/function PracticeGuide\([\s\S]*?(?=\nfunction AudioCompanion)/)?.[0]
assert.ok(practiceGuide, 'Practice guide renderer is present')
assert.doesNotMatch(practiceGuide, /Sumber:|referenceIds/, 'Practice guide renderer does not print internal reference IDs')
assert.match(detail, /<ReferenceList ids=\{article\.referenceIds\}/, 'Article reference IDs still populate the Sources disclosure')
assert.match(detail, /Yang Bisa Ibu Lakukan/, 'The practical guidance section uses the requested label')
assert.doesNotMatch(detail, /Panduan untuk Ibu/, 'The previous overlapping section label is removed')
assert.match(detail, /Informasi ini bersifat edukasi dan tidak menggantikan penilaian bidan atau dokter/, 'The public article uses a plain education disclaimer')
assert.doesNotMatch(allArticleData, /clinicalReview:\s*\{\s*status:\s*'approved'/, 'Article data does not claim clinical approval')

const sourceFiles = ['src/content/therapyArticles.ts', 'src/content/customerRevisionArticles.ts']
const guideInstructions = []
for (const path of sourceFiles) {
  const sourceText = await read(path)
  const sourceFile = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = new Map(node.properties.filter(ts.isPropertyAssignment).map((property) => [property.name.getText(sourceFile).replaceAll(/['"`]/g, ''), property.initializer]))
      const status = properties.get('status')
      const instructions = properties.get('instructions')
      if (status && ts.isStringLiteral(status) && status.text === 'source_based' && instructions && ts.isArrayLiteralExpression(instructions)) {
        for (const instruction of instructions.elements) {
          assert.ok(ts.isObjectLiteralExpression(instruction), `${path} has an object-shaped guidance step`)
          const step = new Map(instruction.properties.filter(ts.isPropertyAssignment).map((property) => [property.name.getText(sourceFile).replaceAll(/['"`]/g, ''), property.initializer]))
          assert.ok(step.get('text') && ts.isStringLiteral(step.get('text')), `${path} guidance step has patient-facing text`)
          const sourceIds = step.get('referenceIds')
          assert.ok(sourceIds && ts.isArrayLiteralExpression(sourceIds) && sourceIds.elements.length > 0, `${path} every guidance step has source mapping`)
          for (const sourceId of sourceIds.elements) {
            assert.ok(ts.isStringLiteral(sourceId) && sourceBlocks.has(sourceId.text), `${path} guidance source ID exists`)
          }
          guideInstructions.push({ path, text: step.get('text').text, sourceIds: sourceIds.elements.map((id) => id.text) })
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
}
assert.equal((allArticleData.match(/status:\s*'source_based'/g) ?? []).length, 11, 'All 11 articles have source-based practical guidance')
assert.ok(guideInstructions.length >= 33, 'Each article has at least three source-mapped practical choices')

const figureEntries = [...figureModel.matchAll(/^\s*(A\d\d|B\d\d|T\d\d):\s*\{([\s\S]*?)^\s*\},?$/gm)]
assert.equal(figureEntries.length, 11, 'There is exactly one detail figure for each article')
assert.equal(new Set(figureEntries.map((match) => match[1])).size, 11, 'Article figure IDs are unique')
const figureSources = figureEntries.map((match) => match[2].match(/src:\s*'([^']+)'/)?.[1])
assert.equal(new Set(figureSources).size, 11, 'Each article uses a distinct photograph file')
for (const [, id, block] of figureEntries) {
  const src = block.match(/src:\s*'([^']+)'/)?.[1]
  const alt = block.match(/alt:\s*'([^']+)'/)?.[1]
  const caption = block.match(/caption:\s*'([^']+)'/)?.[1]
  const width = Number(block.match(/width:\s*(\d+)/)?.[1])
  const height = Number(block.match(/height:\s*(\d+)/)?.[1])
  assert.ok(src && alt && caption, `${id} has a source, informative alt text, and caption`)
  assert.ok(src.endsWith('.webp'), `${id} uses an optimized local photographic WebP, not an illustration or external hotlink`)
  assert.match(block, /attribution:\s*\{\s*label:\s*'[^']+Pexels'/, `${id} credits its photographer and provider`)
  assert.doesNotMatch(alt, /abstrak|simbolis/, `${id} alt text identifies the depicted subject`)
  assert.doesNotMatch(caption, /ilustrasi editorial|ilustrasi simbolis|perhatian pada kenyamanan tubuh/i, `${id} caption is specific to the article`)
  assert.ok(!figureEntries.some((other) => other[1] !== id && other[2].match(/caption:\s*'([^']+)'/)?.[1] === caption), `${id} caption is unique`)
  assert.ok(width >= 480 && height >= 300, `${id} has intrinsic dimensions suitable for an article viewport`)
  assert.ok(assetManifest.includes(src.split('/').at(-1)), `${id} figure asset is documented in the license manifest`)
  for (const [, referenceId] of block.matchAll(/'((?:S|C)\d+)'/g)) assert.ok(sourceBlocks.has(referenceId), `${id} caption reference ${referenceId} exists`)
  const assetUrl = new URL(`../public${src}`, import.meta.url)
  await access(assetUrl)
  if (src.endsWith('.svg')) {
    const svg = await readFile(assetUrl, 'utf8')
    assert.match(svg, /<svg\b[^>]*(?:viewBox|width=)/, `${id} SVG has a scalable viewport`)
    assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\son[a-z]+\s*=|(?:href|src)=["']https?:\/\//i, `${id} SVG has no executable or remote content`)
  } else if (src.endsWith('.webp')) {
    const webp = await readFile(assetUrl)
    assert.equal(webp.toString('ascii', 0, 4), 'RIFF', `${id} WebP has a RIFF signature`)
    assert.equal(webp.toString('ascii', 8, 12), 'WEBP', `${id} WebP has a WEBP signature`)
  } else {
    assert.fail(`${id} uses an unsupported article image format`)
  }
}

assert.match(sourceMatrix, /## Matriks evidence-to-claim/i, 'The evidence matrix identifies its purpose')
assert.match(sourceMatrix, /VERIFIED|NEEDS REVISION|INSUFFICIENT EVIDENCE/, 'The evidence matrix defines editorial evidence statuses')
console.log(`M2 content regression passed: ${expectedArticleIds.length} articles, ${requiredTopics.length} topics, C01–C08, ${newResearchIds.length} audited research sources, source-mapped practice, and licensed article figures.`)
