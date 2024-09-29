-- drillsテーブルにダミーデータを挿入
INSERT INTO drills (user_id, column_id, content, url, status) VALUES
('user1', 'column1', 'パッティング練習', 'https://example.com/putting', 0),
('user1', 'column2', 'ドライバー練習', 'https://example.com/driver', 0),
('user2', 'column1', 'バンカー練習', 'https://example.com/bunker', 0),
('user3', 'column2', 'アプローチショット練習', 'https://example.com/approach', 0),
('user2', 'column3', 'アイアンショット練習', 'https://example.com/iron', 0);

INSERT INTO history (user_id, memo, drills, created_at) VALUES
('user1', '今日も練習頑張った！', '["パッティング練習を実施", "バンカー練習を開始", "アプローチショットの練習を実施"]', '2024-09-26 14:35'),
('user2', '調子が良かった日', '["ドライバーの練習を開始", "アイアンショットの練習を完了"]', '2024-09-24 14:35');