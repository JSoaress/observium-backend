import { Knex } from "knex";
import { Left, Right } from "ts-arch-kit/dist/core/helpers";
import { DbTransactionNotPreparedError, UnitOfWork } from "ts-arch-kit/dist/database";

import { knexConfig } from "./knexconfig";

export class KnexUnitOfWork extends UnitOfWork<Knex.Transaction> {
    private transaction: Knex.Transaction | null = null;

    async start(): Promise<void> {
        this.transaction = await knexConfig.transaction();
    }

    async commit(): Promise<void> {
        if (!this.transaction) return;
        await this.transaction.commit();
    }

    async rollback(): Promise<void> {
        if (!this.transaction) return;
        await this.transaction.rollback();
    }

    async dispose(): Promise<void> {
        this.transaction = null;
    }

    async execute<TResponse>(callback: () => Promise<TResponse>): Promise<TResponse> {
        try {
            await this.start();
            const r = await callback();
            if (r instanceof Right) await this.commit();
            if (r instanceof Left) await this.rollback();
            return r;
        } catch (error) {
            await this.rollback();
            throw error;
        } finally {
            await this.dispose();
        }
    }

    getTransaction(): Knex.Transaction {
        if (!this.transaction)
            throw new DbTransactionNotPreparedError("A transação com o banco de dados não foi corretamente iniciada.");
        return this.transaction;
    }
}
