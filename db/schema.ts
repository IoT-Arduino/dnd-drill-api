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
  createAt: text("create_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updateAt: text("update_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// historyテーブル
export const history = sqliteTable("history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: integer("date").notNull(),
  memo: text("memo"),
  createAt: text("create_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// history_itemsテーブル
export const historyItems = sqliteTable("history_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  historyId: integer("history_id").notNull(),
  contentText: text("content_text").notNull(),
  contentUrl: text("content_url").notNull(),
  contentId: text("content_id").notNull(),
});

// リレーション
import { relations } from 'drizzle-orm';

export const historyRelations = relations(history, ({ many }) => ({
  items: many(historyItems),
}));

export const historyItemsRelations = relations(historyItems, ({ one }) => ({
  history: one(history, { fields: [historyItems.historyId], references: [history.id] }),
}));