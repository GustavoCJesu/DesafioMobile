import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = abrirBanco();
  }

  return dbPromise;
}

async function abrirBanco() {
  const db = await SQLite.openDatabaseAsync("portal.db");

  await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS saldo_epi(
        matricula TEXT NOT NULL,
        id INTEGER NOT NULL,
        categoria TEXT NOT NULL,
        nome TEXT NOT NULL,
        ca TEXT NOT NULL,
        disponivel INTEGER NOT NULL,
        limite INTEGER NOT NULL,
        unidade TEXT NOT NULL,
        tamanhos TEXT NOT NULL,
        PRIMARY KEY (matricula, id)
        );

        CREATE TABLE IF NOT EXISTS saldo_sync (
        matricula TEXT PRIMARY KEY NOT NULL,
        atualizado_em INTEGER NOT NULL
        );
    `);
  return db;
}
