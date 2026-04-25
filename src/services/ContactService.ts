import { Database } from "bun:sqlite";

// --- Types ---
export interface Contact {
    id?: number;
    name: string;
    email: string;
    phone: string;
    created_at?: string;
    updated_at?: string;
}

// --- Database setup ---
const db = new Database("contacts.sqlite", {
    create: true,
    strict: true,
});

db.run("PRAGMA journal_mode = WAL;");

db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// --- Prepared statements (cached via db.query) ---
const insertStmt = db.query("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)");
const selectAllStmt = db.query("SELECT * FROM contacts");
const selectByIdStmt = db.query("SELECT * FROM contacts WHERE id = ?");
const updateStmt = db.query("UPDATE contacts SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
const deleteStmt = db.query("DELETE FROM contacts WHERE id = ?");

// --- Seed (only if table is empty) ---
const { count } = db.query("SELECT COUNT(*) as count FROM contacts").get() as { count: number };
if (count === 0) {
    const seedContacts = db.transaction(() => {
        insertStmt.run("John Doe", "john@example.com", "1234567890");
        insertStmt.run("Jane Doe", "jane@example.com", "1234567890");
        insertStmt.run("Bob Smith", "bob@example.com", "1234567890");
    });
    seedContacts();
}

// --- CRUD operations ---
export function save(contact: Contact) {
    return insertStmt.run(contact.name, contact.email, contact.phone);
}

export function getAll(): Contact[] {
    return selectAllStmt.all() as Contact[];
}

export function getById(id: number): Contact | null {
    return selectByIdStmt.get(id) as Contact | null;
}

export function update(id: number, contact: Contact) {
    return updateStmt.run(contact.name, contact.email, contact.phone, id);
}

export function remove(id: number) {
    return deleteStmt.run(id);
}