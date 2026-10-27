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

  constructor() {
    this.database.exec(readFileSync(new URL('../../migrations/0001_questions.sql', import.meta.url), 'utf8'))
  }

  prepare(sql: string) {
    return new SqliteD1Statement(this.database, sql)
  }

  async batch(statements: SqliteD1Statement[]) {
    this.database.exec('BEGIN IMMEDIATE')
    try {
      const results = []
      for (const statement of statements) results.push(await statement.run())
      this.database.exec('COMMIT')
      return results
    } catch (error) {
      this.database.exec('ROLLBACK')
      throw error
    }
  }

  close() {
    this.database.close()
  }
}
