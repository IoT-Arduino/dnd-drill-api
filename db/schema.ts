import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const drills = sqliteTable("drills", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  columnId: text("column_id").notNull(),
  content: text("content").notNull(),
  status: integer("status", { mode: "boolean" }).default(false),
  createAt: text("create_at").default(sql`CURRENT_TIMESTAMP`),
});