import * as SQLite from 'expo-sqlite';
import { Snippet } from '../types';

// Open or create the database
const db = SQLite.openDatabase('snippets.db');

// Initialize the database and create the snippets table if it doesn't exist
export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS snippets (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            code TEXT NOT NULL,
            language TEXT NOT NULL,
            tags TEXT, -- JSON string of tags array
            isFavorite INTEGER DEFAULT 0,
            createdAt INTEGER NOT NULL,
            updatedAt INTEGER NOT NULL
          );`,
          [],
          () => {
            console.log('Snippets table created or already exists');
            resolve();
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
};

// Insert a new snippet
export const createSnippet = (snippet: Omit<Snippet, 'id'>) => {
  return new Promise<string>((resolve, reject) => {
    const id = Date.now().toString();
    const now = Date.now();
    const snippetToInsert = {
      ...snippet,
      id,
      createdAt: now,
      updatedAt: now,
    };

    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO snippets (id, title, code, language, tags, isFavorite, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            snippetToInsert.id,
            snippetToInsert.title,
            snippetToInsert.code,
            snippetToInsert.language,
            JSON.stringify(snippetToInsert.tags),
            snippetToInsert.isFavorite ? 1 : 0,
            snippetToInsert.createdAt,
            snippetToInsert.updatedAt,
          ],
          (_, result) => {
            if (result.rowsAffected > 0) {
              resolve(id);
            } else {
              reject(new Error('Failed to insert snippet'));
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Get all snippets
export const getAllSnippets = () => {
  return new Promise<Snippet[]>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM snippets ORDER BY updatedAt DESC;`,
          [],
          (_, { rows }) => {
            const snippets: Snippet[] = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              snippets.push({
                id: row.id,
                title: row.title,
                code: row.code,
                language: row.language,
                tags: JSON.parse(row.tags),
                isFavorite: row.isFavorite === 1,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
              });
            }
            resolve(snippets);
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Get a snippet by ID
export const getSnippetById = (id: string) => {
  return new Promise<Snippet | null>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM snippets WHERE id = ?;`,
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              const row = rows.item(0);
              const snippet: Snippet = {
                id: row.id,
                title: row.title,
                code: row.code,
                language: row.language,
                tags: JSON.parse(row.tags),
                isFavorite: row.isFavorite === 1,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
              };
              resolve(snippet);
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Update a snippet
export const updateSnippet = (snippet: Snippet) => {
  return new Promise<void>((resolve, reject) => {
    const now = Date.now();
    const updatedSnippet = {
      ...snippet,
      updatedAt: now,
    };

    db.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE snippets SET
            title = ?,
            code = ?,
            language = ?,
            tags = ?,
            isFavorite = ?,
            updatedAt = ?
          WHERE id = ?;`,
          [
            updatedSnippet.title,
            updatedSnippet.code,
            updatedSnippet.language,
            JSON.stringify(updatedSnippet.tags),
            updatedSnippet.isFavorite ? 1 : 0,
            updatedSnippet.updatedAt,
            updatedSnippet.id,
          ],
          (_, result) => {
            if (result.rowsAffected > 0) {
              resolve();
            } else {
              reject(new Error('Failed to update snippet'));
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Delete a snippet by ID
export const deleteSnippet = (id: string) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `DELETE FROM snippets WHERE id = ?;`,
          [id],
          (_, result) => {
            if (result.rowsAffected > 0) {
              resolve();
            } else {
              reject(new Error('Failed to delete snippet'));
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Get favorite snippets
export const getFavoriteSnippets = () => {
  return new Promise<Snippet[]>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM snippets WHERE isFavorite = 1 ORDER BY updatedAt DESC;`,
          [],
          (_, { rows }) => {
            const snippets: Snippet[] = [];
            for (let i = 0; i < rows.length; i++) {
              const row = rows.item(i);
              snippets.push({
                id: row.id,
                title: row.title,
                code: row.code,
                language: row.language,
                tags: JSON.parse(row.tags),
                isFavorite: row.isFavorite === 1,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
              });
            }
            resolve(snippets);
          },
          (_, error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};