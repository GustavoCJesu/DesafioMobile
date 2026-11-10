import { SaldoEpiCardData } from "@/portal/mocks/saldoEpis";
import { getDb } from "./db";

export async function saveSaldo(matricula: string, itens: SaldoEpiCardData[]) {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM saldo_epi WHERE matricula = ?", matricula);

    for (const item of itens) {
      await db.runAsync(
        `INSERT INTO saldo_epi (matricula, id, categoria, nome, ca, disponivel, limite, unidade, tamanhos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        matricula,
        item.id,
        item.categoria,
        item.nome,
        item.ca,
        item.disponivel,
        item.limite,
        item.unidade,
        JSON.stringify(item.tamanhos),
      );
    }

    await db.runAsync(
      "INSERT OR REPLACE INTO saldo_sync (matricula, atualizado_em) VALUES (?, ?)",
      matricula,
      Date.now(),
    );
  });
}

type LinhaSaldo = {
  id: number;
  categoria: string;
  nome: string;
  ca: string;
  disponivel: number;
  limite: number;
  unidade: string;
  tamanhos: string;
};

export type SaldoSalvo = {
  itens: SaldoEpiCardData[];
  atualizadoEm: number;
};

export async function lerSaldo(matricula: string): Promise<SaldoSalvo | null> {
  const db = await getDb();

  const sync = await db.getFirstAsync<{ atualizado_em: number }>(
    "SELECT atualizado_em FROM saldo_sync WHERE matricula = ?",
    matricula,
  );

  if (!sync) return null;

  const linhas = await db.getAllAsync<LinhaSaldo>(
    `SELECT id, categoria, nome, ca, disponivel, limite, unidade, tamanhos FROM saldo_epi WHERE matricula = ?`,
    matricula,
  );

  const itens: SaldoEpiCardData[] = linhas.map((linha) => ({
    ...linha,
    tamanhos: JSON.parse(linha.tamanhos),
  }));

  return { itens, atualizadoEm: sync.atualizado_em };
}
