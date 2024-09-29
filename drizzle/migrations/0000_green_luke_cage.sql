CREATE TABLE `drills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`column_id` text NOT NULL,
	`content` text NOT NULL,
	`url` text NOT NULL,
	`status` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`memo` text NOT NULL,
	`drills` text NOT NULL,
	`created_at` text NOT NULL
);
