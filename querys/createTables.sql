CREATE TABLE IF NOT EXISTS Registerations 
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    seatingGroup TEXT,
    alcohol INTEGER DEFAULT 1,
    text TEXT
);