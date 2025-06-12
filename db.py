import sqlite3

# Initialize the database and create the table if it doesn't exist
def init_db():
    conn = sqlite3.connect("portfolio.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            photo TEXT,
            portfolio TEXT,
            skills TEXT,
            role TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Add a verified profile to the database
def add_profile(profile):
    conn = sqlite3.connect("portfolio.db")
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO profiles (name, email, phone, photo, portfolio, skills, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        profile['name'],
        profile['email'],
        profile.get('phone'),
        profile.get('photo'),
        profile['portfolio'],
        ",".join(profile['skills']),
        profile['role']
    ))
    conn.commit()
    conn.close()

# Optional: Fetch all profiles (for testing or frontend rendering)
def get_all_profiles():
    conn = sqlite3.connect("portfolio.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM profiles")
    rows = cursor.fetchall()
    conn.close()
    return rows
