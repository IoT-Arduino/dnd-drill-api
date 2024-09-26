CREATE TABLE `drills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`column_id` text NOT NULL,
	`content` text NOT NULL,
	`url` text NOT NULL,
	`status` integer DEFAULT 0 NOT NULL,
	`create_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`update_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`date` integer NOT NULL,
	`memo` text,
	`create_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `history_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`history_id` integer NOT NULL,
	`content_text` text NOT NULL,
	`content_url` text NOT NULL,
	`content_id` text NOT NULL
);
