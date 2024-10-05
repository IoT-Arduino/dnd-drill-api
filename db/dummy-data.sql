-- drillsテーブルにダミーデータを挿入
INSERT INTO drills (user_id, column_id, content, url, status) VALUES
('user1', 'stock', 'パッティング練習', 'https://example.com/putting', 0),
('user1', 'stock', 'ドライバー練習', 'https://example.com/driver', 0),
('user2', 'stock', 'バンカー練習', 'https://example.com/bunker', 0),
('user3', 'stock', 'アプローチショット練習', 'https://example.com/approach', 0),
('user3', 'stock', 'アイアンショット練習', 'https://example.com/iron', 0);

INSERT INTO history (user_id, memo, drills, created_at) VALUES
('user1', '今日も練習頑張った！', '[{"url":"http://yahoo.co.jp","text":"パッティング練習を実施"},{"url":"http://yahoo.co.jp","text":"バンカー練習を開始"},{"url":"http://yahoo.co.jp","text":"アプローチショットの練習を実施"}]', '2024-09-26 14:35'),
('user2', '調子が良かった日', '[{"url":"http://yahoo.co.jp","text":"ドライバーの練習を開始"},{"url":"http://yahoo.co.jp","text":"アイアンショットの練習を完了"}]', '2024-09-24 14:35');