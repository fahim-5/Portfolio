const mysql = require('mysql2/promise');
const connectDB = require('../config/db');

// Store the connection instance
let connection = null;

/**
 * Get or create database connection
 * @returns {Promise<Connection>} - MySQL connection
 */
const getConnection = async () => {
  if (!connection) {
    connection = await connectDB();
  }
  return connection;
};

/**
 * Execute a database query
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} - Query results
 */
const query = async (sql, params = []) => {
  const conn = await getConnection();
  try {
    const [results] = await conn.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a single record by ID
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<Object>} - Record object
 */
const getById = async (table, id) => {
  const sql = `SELECT * FROM ${table} WHERE id = ?`;
  const results = await query(sql, [id]);
  return results[0] || null;
};

/**
 * Get all records from a table
 * @param {string} table - Table name
 * @param {Object} options - Query options (where, orderBy, limit)
 * @returns {Promise<Array>} - Array of records
 */
const getAll = async (table, options = {}) => {
  let sql = `SELECT * FROM ${table}`;
  const params = [];

  // Add WHERE clause if specified
  if (options.where) {
    const whereConditions = [];
    Object.entries(options.where).forEach(([key, value]) => {
      whereConditions.push(`${key} = ?`);
      params.push(value);
    });
    
    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }
  }

  // Add ORDER BY clause if specified
  if (options.orderBy) {
    sql += ` ORDER BY ${options.orderBy}`;
  }

  // Add LIMIT clause if specified
  if (options.limit) {
    sql += ` LIMIT ?`;
    params.push(options.limit);
  }

  return await query(sql, params);
};

/**
 * Insert a new record
 * @param {string} table - Table name
 * @param {Object} data - Record data
 * @returns {Promise<Object>} - Insert result with ID
 */
const insert = async (table, data) => {
  const columns = Object.keys(data).join(', ');
  const placeholders = Object.keys(data).map(() => '?').join(', ');
  const values = Object.values(data);

  const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  const result = await query(sql, values);
  
  return {
    id: result.insertId,
    ...data
  };
};

/**
 * Update an existing record
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @param {Object} data - Record data to update
 * @returns {Promise<Object>} - Update result
 */
const update = async (table, id, data) => {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), id];

  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
  const result = await query(sql, values);
  
  return {
    id,
    affected: result.affectedRows,
    ...data
  };
};

/**
 * Delete a record
 * @param {string} table - Table name
 * @param {number} id - Record ID
 * @returns {Promise<Object>} - Delete result
 */
const remove = async (table, id) => {
  const sql = `DELETE FROM ${table} WHERE id = ?`;
  const result = await query(sql, [id]);
  
  return {
    id,
    affected: result.affectedRows
  };
};

/**
 * Execute a custom SQL query
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} - Query results
 */
const customQuery = async (sql, params = []) => {
  return await query(sql, params);
};

module.exports = {
  query,
  getById,
  getAll,
  insert,
  update,
  remove,
  customQuery
}; 