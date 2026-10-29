import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { therapyReferences } from '../src/content/therapyReferences.ts'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const [registry, articleTs, customerTs, guidesTs, typesTs] = await Promise.all([
  read('src/content/therapyReferences.ts'),
  read('src/content/therapyArticles.ts'),
  read('src/content/customerRevisionArticles.ts'),
  read('src/content/maternityGuides.ts'),
  read('src/content/therapyContent.types.ts'),
])
const references = new Map(Object.entries(therapyReferences).map(([id, source]) => [id, source]))

assert.ok(references.size >= 43, 'The source register retains the audited literature and official resources')
for (const [id, source] of references) {
  assert.ok(source.referenceStatus === 'active' || source.referenceStatus === 'archived', `${id} has an explicit active/archive state`)
  if (source.sourceType === 'original_research' || source.sourceType === 'systematic_review' || source.sourceType === 'overview_of_reviews') {
    assert.ok(source.referenceStatus === 'archived' || (source.publicationYear >= 2022 && source.publicationYear <= 2026), `${id} active research is dated 2022–2026`)
  }
  if (source.sourceType === 'official_health_information' && !source.publicationYear) {
    assert.match(source.sourceDateLabel ?? '', /(?:tanggal|diakses|ditinjau|diperbarui)/i, `${id} does not present an unverified publication year as known`)
  }
}

const currentContent = `${articleTs}\n${customerTs}\n${guidesTs}`
for (const [, list] of currentContent.matchAll(/(?:referenceIds|sourceIds):\s*\[([^\]]*)\]/g)) {
  for (const [, id] of list.matchAll(/'((?:S|C)\d+)'/g)) {
    assert.ok(references.has(id), `Content mapping ${id} exists`)
    assert.equal(references.get(id).referenceStatus, 'active', `Archived source ${id} is not actively mapped to current content`)
  }
}

const articleIds = ['A01', 'A04', 'A05', 'A06', 'B01', 'B05', 'B06', 'T01', 'T02', 'T03', 'T04']
for (const id of articleIds) assert.ok(currentContent.includes(`'${id}'`), `${id} remains in the content catalog`)
assert.doesNotMatch(currentContent, /clinicalReview:\s*\{\s*status:\s*'approved'/, 'No article claims clinical approval')
assert.match(guidesTs, /clinicalReview:\s*'draft'/, 'Guides retain their draft clinical-review state')
assert.match(typesTs, /referenceStatus\??:\s*'active'\s*\|\s*'archived'/, 'The source type declares archival status')

const articleTextKeys = new Set(['title', 'heading', 'text', 'summaryHeading', 'note', 'message'])
function countArticleWords(sourceText, path, isCustomer) {
  const file = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const counts = new Map()
  const visit = (node) => {
    if (isCustomer && ts.isCallExpression(node) && node.expression.getText(file) === 'customerArticle') {
      const id = node.arguments[0]
      if (id && ts.isStringLiteral(id)) counts.set(id.text, countStrings(node))
    } else if (!isCustomer && ts.isObjectLiteralExpression(node)) {
      const idProperty = node.properties.find((property) => ts.isPropertyAssignment(property) && property.name.getText(file).replaceAll(/["'`]/g, '') === 'id')
      if (idProperty && ts.isPropertyAssignment(idProperty) && ts.isStringLiteral(idProperty.initializer) && /^T0[1-4]$/.test(idProperty.initializer.text)) {
        counts.set(idProperty.initializer.text, countStrings(node))
      }
    }
    ts.forEachChild(node, visit)
  }
  function countStrings(root) {
    let count = 0
    const walk = (node) => {
      if (ts.isPropertyAssignment(node) && articleTextKeys.has(node.name.getText(file).replaceAll(/["'`]/g, '')) && ts.isStringLiteral(node.initializer)) {
        count += node.initializer.text.trim().split(/\s+/).filter(Boolean).length
      }
      ts.forEachChild(node, walk)
    }
    walk(root)
    return count
  }
  visit(file)
  return counts
}
const baselineArticles = execFileSync('git', ['show', 'HEAD:src/content/therapyArticles.ts'], { encoding: 'utf8' })
const baselineCustomer = execFileSync('git', ['show', 'HEAD:src/content/customerRevisionArticles.ts'], { encoding: 'utf8' })
const before = new Map([...countArticleWords(baselineArticles, 'baseline-therapyArticles.ts', false), ...countArticleWords(baselineCustomer, 'baseline-customerRevisionArticles.ts', true)])
const after = new Map([...countArticleWords(articleTs, 'therapyArticles.ts', false), ...countArticleWords(customerTs, 'customerRevisionArticles.ts', true)])
assert.equal(after.size, 11, 'Word-count audit finds exactly 11 articles')
for (const id of articleIds) assert.ok((after.get(id) ?? 0) > 0, `${id} has readable copy to audit`)
console.log(`Editorial source audit passed (${references.size} references; 11 articles; guides remain draft).`)
const pre2022 = [...references].filter(([, source]) => source.publicationYear && source.publicationYear < 2022).map(([id, source]) => `${id} ${source.publicationYear}`)
const undatedOfficial = [...references].filter(([, source]) => source.sourceType === 'official_health_information' && !source.publicationYear && /tanggal publikasi\/pembaruan tidak terverifikasi/i.test(source.sourceDateLabel ?? '')).map(([id]) => id)
const activeResearch = [...references].filter(([, source]) => source.referenceStatus === 'active' && ['original_research', 'systematic_review', 'overview_of_reviews'].includes(source.sourceType ?? '')).map(([id, source]) => `${id} ${source.publicationYear}`)
console.log(`Pre-2022 dated sources: ${pre2022.length} (${pre2022.join(', ')}). Undated official resources: ${undatedOfficial.length} (${undatedOfficial.join(', ')}).`)
console.log(`Active 2022–2026 research: ${activeResearch.join(', ')}.`)
for (const id of articleIds) console.log(`${id}: ${before.get(id) ?? 0} -> ${after.get(id)} words (${Math.round(((after.get(id) - (before.get(id) ?? 0)) / Math.max(1, before.get(id) ?? 0)) * 100)}%)`)
