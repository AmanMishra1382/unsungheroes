-- ============================================
-- TABLES (safe to re-run on every deploy)
-- ============================================

CREATE TABLE IF NOT EXISTS wars (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year_start INT NOT NULL,
  year_end INT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS awards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tier INT
);

CREATE TABLE IF NOT EXISTS soldiers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  rank TEXT,
  regiment TEXT,
  status TEXT NOT NULL,
  war_id INT REFERENCES wars(id),
  award_id INT REFERENCES awards(id),
  operation TEXT,
  date_of_action DATE,
  citation TEXT,
  full_story TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sources (
  id SERIAL PRIMARY KEY,
  soldier_id INT REFERENCES soldiers(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  soldier_id INT REFERENCES soldiers(id),
  message TEXT NOT NULL,
  submitted_by TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending_review'
);

-- ============================================
-- WARS
-- ============================================

INSERT INTO wars (name, year_start, year_end, description) VALUES
('Indo-Pakistani War', 1947, 1948, 'First Kashmir War, fought shortly after Independence'),
('Indo-Pakistani War', 1971, 1971, 'Liberation of Bangladesh'),
('Kargil War', 1999, 1999, 'Operation Vijay, fought in the Kargil district of Jammu and Kashmir')
ON CONFLICT DO NOTHING;

-- ============================================
-- AWARDS
-- ============================================

INSERT INTO awards (name, tier) VALUES
('Param Vir Chakra', 1),
('Maha Vir Chakra', 2)
ON CONFLICT DO NOTHING;

-- ============================================
-- SOLDIERS (subqueries used instead of hardcoded IDs,
-- so this stays correct no matter the insert order)
-- ============================================

INSERT INTO soldiers (name, rank, regiment, status, war_id, award_id, operation, date_of_action, citation, full_story)
SELECT
  'Major Somnath Sharma', 'Major', '4th Battalion, Kumaon Regiment', 'martyr',
  (SELECT id FROM wars WHERE name = 'Indo-Pakistani War' AND year_start = 1947),
  (SELECT id FROM awards WHERE name = 'Param Vir Chakra'),
  'Battle of Badgam', '1947-11-03',
  'Held his position against a vastly larger enemy force near Srinagar airfield, becoming independent India''s first Param Vir Chakra recipient.',
  'On 3 November 1947, Major Somnath Sharma''s company of the Kumaon Regiment faced an enemy force several times their number near Srinagar airfield, during the earliest fighting of the Kashmir conflict.

Despite being hopelessly outnumbered, he held the position and continued directing his men and radioing headquarters until he was killed. His stand delayed the enemy long enough for reinforcements to arrive and secure the airfield, a position considered critical to the defence of Srinagar. He became the first recipient of the Param Vir Chakra, India''s highest gallantry award, instituted the same year.'
WHERE NOT EXISTS (SELECT 1 FROM soldiers WHERE name = 'Major Somnath Sharma');

INSERT INTO soldiers (name, rank, regiment, status, war_id, award_id, operation, date_of_action, citation, full_story)
SELECT
  'Second Lieutenant Arun Khetarpal', '2nd Lieutenant', '17 Poona Horse', 'martyr',
  (SELECT id FROM wars WHERE name = 'Indo-Pakistani War' AND year_start = 1971),
  (SELECT id FROM awards WHERE name = 'Param Vir Chakra'),
  'Battle of Basantar', '1971-12-16',
  'Destroyed several enemy tanks and refused to abandon his own damaged tank, continuing to fight until he was killed on the final day of the war.',
  'During the Battle of Basantar on 16 December 1971, Second Lieutenant Arun Khetarpal''s tank troop came under heavy counter-attack from enemy armour.

Despite his own tank being hit and set ablaze, and being ordered by his commanding officer to abandon it and withdraw, he chose to stay and continue directing fire, destroying further enemy tanks before he was killed. He was 21 years old, and his actions that day were credited with breaking the enemy''s armoured counter-attack on the war''s last day.'
WHERE NOT EXISTS (SELECT 1 FROM soldiers WHERE name = 'Second Lieutenant Arun Khetarpal');

INSERT INTO soldiers (name, rank, regiment, status, war_id, award_id, operation, date_of_action, citation, full_story)
SELECT
  'Captain Vikram Batra', 'Captain', '13 Jammu and Kashmir Rifles', 'martyr',
  (SELECT id FROM wars WHERE name = 'Kargil War'),
  (SELECT id FROM awards WHERE name = 'Param Vir Chakra'),
  'Battle of Point 4875, Operation Vijay', '1999-07-07',
  'Led the recapture of Point 5140 and later Point 4875, continuing to lead his men in close combat even after being critically wounded.',
  'Captain Vikram Batra of 13 JAK Rifles first led a daring assault to recapture Point 5140 in June 1999, fighting the enemy in close combat during Operation Vijay.

On 7 July 1999, his company was tasked with capturing a position on Point 4875. In fierce hand-to-hand fighting, he continued to lead his men forward despite sustaining serious wounds, before he was killed. His troops went on to capture the position. He is remembered by his call sign "Sher Shah" and his motto before the final assault, "Yeh Dil Maange More."'
WHERE NOT EXISTS (SELECT 1 FROM soldiers WHERE name = 'Captain Vikram Batra');

INSERT INTO soldiers (name, rank, regiment, status, war_id, award_id, operation, date_of_action, citation, full_story)
SELECT
  'Subedar Major Yogendra Singh Yadav', 'Grenadier (at time of action)', '18 Grenadiers', 'awardee',
  (SELECT id FROM wars WHERE name = 'Kargil War'),
  (SELECT id FROM awards WHERE name = 'Param Vir Chakra'),
  'Battle of Tiger Hill, Operation Vijay', '1999-07-04',
  'Scaled a sheer cliff under enemy fire to help capture Tiger Hill, continuing the assault despite being critically wounded.',
  'During the assault on Tiger Hill in July 1999, Grenadier Yogendra Singh Yadav volunteered to lead a party climbing a near-vertical cliff face to clear enemy bunkers ahead of the main assault.

He was hit multiple times while climbing but continued forward, engaging and clearing several enemy positions at close quarters, which allowed his company to press the assault and capture Tiger Hill. He survived his wounds and was awarded the Param Vir Chakra — one of a small number of living recipients of the honour.'
WHERE NOT EXISTS (SELECT 1 FROM soldiers WHERE name = 'Subedar Major Yogendra Singh Yadav');

-- ============================================
-- SOURCES
-- ============================================

INSERT INTO sources (soldier_id, url)
SELECT id, 'https://nationalwarmemorial.gov.in/param-yoddhas' FROM soldiers WHERE name = 'Major Somnath Sharma'
UNION ALL
SELECT id, 'https://gallantryawards.gov.in/' FROM soldiers WHERE name = 'Major Somnath Sharma'
UNION ALL
SELECT id, 'https://nationalwarmemorial.gov.in/param-yoddhas' FROM soldiers WHERE name = 'Second Lieutenant Arun Khetarpal'
UNION ALL
SELECT id, 'https://rsb.delhi.gov.in/rsb/list-gallantry-awardees' FROM soldiers WHERE name = 'Second Lieutenant Arun Khetarpal'
UNION ALL
SELECT id, 'https://nationalwarmemorial.gov.in/param-yoddhas/details/24' FROM soldiers WHERE name = 'Captain Vikram Batra'
UNION ALL
SELECT id, 'https://www.gallantryawards.gov.in/awardee/1065' FROM soldiers WHERE name = 'Captain Vikram Batra'
UNION ALL
SELECT id, 'https://nationalwarmemorial.gov.in/param-yoddhas' FROM soldiers WHERE name = 'Subedar Major Yogendra Singh Yadav'
UNION ALL
SELECT id, 'https://gallantryawards.gov.in/' FROM soldiers WHERE name = 'Subedar Major Yogendra Singh Yadav'
ON CONFLICT DO NOTHING;