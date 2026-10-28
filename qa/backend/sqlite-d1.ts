import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

type SqlValue = string | number | bigint | null | Uint8Array

class SqliteD1Statement {
  constructor(private readonly database: DatabaseSync, private readonly sql: string, private readonly values: SqlValue[] = []) {}

  bind(...values: SqlValue[]) {
    return new SqliteD1Statement(this.database, this.sql, values)
  }

  async first<T = Record<string, unknown>>(columnName?: string): Promise<T | null> {
    const row = this.database.prepare(this.sql).get(...this.values) as Record<string, unknown> | undefined
    if (!row) return null
    return (columnName ? row[columnName] : row) as T
  }

  async all<T = Record<string, unknown>>() {
    const results = this.database.prepare(this.sql).all(...this.values) as T[]
    return { results, success: true, meta: { changes: 0 } }
  }

  async run() {
    const result = this.database.prepare(this.sql).run(...this.values)
    return { success: true, meta: { changes: Number(result.changes) } }
  }
}

export class SqliteD1Database {
  readonly database = new DatabaseSync(':memory:')
  private batchQueue: Promise<void> = Promise.resolve()

  constructor() {
    for (const file of ['0001_questions.sql', '0002_admin_auth.sql', '0003_moderator_pre_authorization.sql']) {
      this.database.exec(readFileSync(new URL(`../../migrations/${file}`, import.meta.url), 'utf8'))
    }
  }

  prepare(sql: string) {
    return new SqliteD1Statement(this.database, sql)
  }

  async batch(statements: SqliteD1Statement[]) {
    const previousBatch = this.batchQueue
    let releaseBatch!: () => void
    this.batchQueue = new Promise<void>((resolve) => { releaseBatch = resolve })
    await previousBatch
    let transactionStarted = false
    try {
      this.database.exec('BEGIN IMMEDIATE')
      transactionStarted = true
      const results = []
      for (const statement of statements) results.push(await statement.run())
      this.database.exec('COMMIT')
      transactionStarted = false
      return results
    } catch (error) {
      if (transactionStarted) this.database.exec('ROLLBACK')
      throw error
    } finally {
      releaseBatch()
    }
  }

  close() {
    this.database.close()
  }
}
