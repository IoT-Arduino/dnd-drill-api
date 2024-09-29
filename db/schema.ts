import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// drillsテーブル
export const drills = sqliteTable("drills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  columnId: text("column_id").notNull(),
  content: text("content").notNull(),
  url: text("url").notNull(),
  status: integer("status").notNull().default(sql`0`),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// historyテーブル
export const history = sqliteTable('history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  memo: text('memo').notNull(),
  drills: text('drills').notNull(), // JSON文字列として保存
  createdAt: text('created_at').notNull()
    .$defaultFn(() => {
      const now = new Date();
      return now.toISOString().slice(0, 16).replace('T', ' '); // 'YYYY-MM-DD HH:MM' 形式
    }),
});