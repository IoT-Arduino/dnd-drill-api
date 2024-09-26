-- drillsテーブルにゴルフ関連のダミーデータを挿入
INSERT INTO drills (user_id, column_id, content, url, status, create_at, update_at)
VALUES 
('user1', 'swing', 'ドライバーのスイング改善', 'https://golf-tips.com/driver-swing', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user1', 'putting', 'ショートパットの精度向上', 'https://golf-tips.com/short-putts', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user2', 'iron', 'アイアンショットの安定化', 'https://golf-tips.com/iron-shots', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user2', 'bunker', 'バンカーショットの技術向上', 'https://golf-tips.com/bunker-shots', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user3', 'approach', 'アプローチショットの精度向上', 'https://golf-tips.com/approach-shots', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- historyテーブルにゴルフ練習の履歴データを挿入
INSERT INTO history (user_id, date, memo, create_at)
VALUES 
('user1', unixepoch(), 'ドライバーの練習を開始', CURRENT_TIMESTAMP),
('user1', unixepoch(), 'パッティング練習を実施', CURRENT_TIMESTAMP),
('user2', unixepoch(), 'アイアンショットの練習を完了', CURRENT_TIMESTAMP),
('user2', unixepoch(), 'バンカー練習を開始', CURRENT_TIMESTAMP),
('user3', unixepoch(), 'アプローチショットの練習を実施', CURRENT_TIMESTAMP);

-- history_itemsテーブルにゴルフ練習の詳細項目を挿入
INSERT INTO history_items (history_id, content_text, content_url, content_id)
VALUES 
(1, 'ドライバーのグリップ改善', 'https://golf-tips.com/driver-grip', 'drill1'),
(1, 'ドライバーのフォロースルー', 'https://golf-tips.com/driver-follow-through', 'drill2'),
(2, '3フィートパットの練習', 'https://golf-tips.com/3-foot-putts', 'drill3'),
(2, 'パッティングのリズム改善', 'https://golf-tips.com/putting-rhythm', 'drill4'),
(3, '7番アイアンの打点確認', 'https://golf-tips.com/7-iron-contact', 'drill5'),
(4, 'バンカーでのスタンス', 'https://golf-tips.com/bunker-stance', 'drill6'),
(5, '50ヤードアプローチの練習', 'https://golf-tips.com/50-yard-approach', 'drill7');