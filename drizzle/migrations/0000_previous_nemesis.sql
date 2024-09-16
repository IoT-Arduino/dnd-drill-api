CREATE TABLE `drills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`column_id` text NOT NULL,
	`content` text NOT NULL,
	`status` integer DEFAULT false,
	`create_at` text DEFAULT CURRENT_TIMESTAMP
);
