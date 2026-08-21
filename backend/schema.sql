CREATE TABLE wars (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year_start INT NOT NULL,
  year_end INT,
  description TEXT
);

CREATE TABLE awards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tier INT
);

CREATE TABLE soldiers (
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

CREATE TABLE sources (
  id SERIAL PRIMARY KEY,
  soldier_id INT REFERENCES soldiers(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  label TEXT
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  soldier_id INT REFERENCES soldiers(id),
  message TEXT NOT NULL,
  submitted_by TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending_review'
);