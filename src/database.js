import sql from 'mssql';
import crypto from 'crypto'; // Built-in Node.js
import pool from './databasePool.js';

const SALT_SIZE = 128;
export const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

class Result {
    constructor(info, error=false, http=200) {
        this.info = info
        this.error = error;
        this.http = http;

        if (error) {
            console.error(info);
        }
    }
}

async function executeSQL(query, errMsg, params) {
    try {
        const request = pool.request();

        // Adding parameters with specific types
        for (const paramName in params) {
            const [value, type] = params[paramName];
            request.input(paramName, type, value);
        }

        const result = await request.query(query);
        return new Result(result.recordset);
    } catch (err) {
        console.error(errMsg, err);
        return new Result(err, true, 500);
    }
} 

/* Users */
async function createTableUsers() {
    const query = `
        CREATE TABLE  users (
            username VARCHAR(255) PRIMARY KEY,
            password VARCHAR(255) NOT NULL,
            salt VARCHAR(${SALT_SIZE}) NOT NULL,
            passwordLess BIT NOT NULL DEFAULT 0
        );
    `;

    await executeSQL(query, "Error creating 'users' table");
}

function validateNewUser(username, password, passwordLess) {
    // Type
    if (typeof username !== 'string' || typeof password !== 'string' || typeof passwordLess !== 'boolean') {
        return new Result("Invalid type", true, 400);
    }

    // Length
    if (username.length < 3 || username.length > 255 || password.length < 3 || password.length > 255) {
        return new Result("Invalid length", true, 400);
    }

    return new Result("Valid", false, 200);
}

async function createUser(username, password, passwordLess=false) {
    // Passwordless is for other 'OAuth' type logins
    if (validateNewUser(username, password, passwordLess).error) {
        return new Result("Invalid details", true, 400);
    }

    let hash = "null";
    let salt = "null";
    let passwordHash = "null";
    if (!passwordLess) {
        hash = crypto.createHash('sha512');
        salt = crypto.randomBytes(SALT_SIZE / 2).toString('hex');
        hash.update(password + salt);
        passwordHash = hash.digest('hex');
    }

    const query = `
        INSERT INTO users (username, password, salt, passwordLess)
        VALUES (@username, @password, @salt, @passwordLess);
    `;

    const params = {
        username: [username, sql.VarChar(255)],
        password: [passwordHash, sql.VarChar(255)],
        salt: [salt, sql.VarChar(SALT_SIZE)],
        passwordLess: [passwordLess, sql.Bit]
    }
    const result = await executeSQL(query, `Error creating user ${username}`, params);
    if (result.error) {
        if (result.info.errcode === 1062) {
            // This is not always an error and can be handled
            return new Result("Username already exists", false, 409);
        }
        return new Result("Error creating user", true, 500);
    }

    return new Result("User created", false, 201);
}

async function authUser(username, password) {
    const user = await retrieveUserByUsername(username);
    if (user.error) {
        return user;
    }

    if (user.info.passwordLess) {
        return new Result("Sign-in with your Auth platform please.", true, 401);
    }

    let hash = crypto.createHash('sha512');
    hash.update(password + user.info.salt);
    const passwordHash = hash.digest('hex');

    if (passwordHash !== user.info.password) {
        return new Result("Invalid password", true, 401);
    }

    return new Result(user.info.username); // Return all user info
}

async function retrieveUserByUsername(username) {
    const query = `
        SELECT * FROM users
        WHERE username = @username;
    `;

    const params = {
        username: [username, sql.VarChar(255)]
    }
    const result = await executeSQL(query, `Error retrieving user ${username}`, params);
    if (result.error) {
        return new Result("Error retrieving user", true, 500);
    }

    if (result.info.length === 0) {
        return new Result("User not found", true, 404);
    }

    return new Result(result.info[0]);
}

async function updateUser(username, password) {
    // Check user exists
    const user = await retrieveUserByUsername(username);
    if (user.error) {
        return user;
    }

    let hash = crypto.createHash('sha512');
    const salt = crypto.randomBytes(SALT_SIZE / 2).toString('hex');
    hash.update(password + salt);
    const passwordHash = hash.digest('hex');

    const query = `
        UPDATE users
        SET password = @password, salt = @salt
        WHERE username = @username;
    `;

    const params = {
        password: [passwordHash, sql.VarChar(255)],
        salt: [salt, sql.VarChar(SALT_SIZE)],
        username: [username, sql.VarChar(255)]
    }
    const result = await executeSQL(query, `Error updating user ${username}`, params);
    if (result.error) {
        return new Result("Error updating user", true, 500);
    }
}

async function deleteUser(username) {
    const query = `
        DELETE FROM users
        WHERE username = @username;
    `;

    const params = {
        username: [username, sql.VarChar(255)]
    }
    const result = await executeSQL(query, `Error deleting user ${username}`, params);
    if (result.error) {
        return new Result("Error deleting user", true, 500);
    }
}

/* Sessions */
async function createTableSessions() {
    const query = `
        CREATE TABLE sessions (
            hash NVARCHAR(128) PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            expiry TIMESTAMP NOT NULL,
            ip VARCHAR(64) NOT NULL,
            userAgent VARCHAR(255) NOT NULL
            FOREIGN KEY (username) REFERENCES users(username)
        );
    `;

    await executeSQL(query, "Error creating 'sessions' table");
}

async function createSession(username, ip, userAgent) {
    const id = crypto.randomBytes(128).toString("hex");
    const hash = crypto.createHash('sha512');
    hash.update(id);
    const hashString = hash.digest('hex');

    const expiry = new Date(Date.now() + SESSION_COOKIE_MAX_AGE);
    const query = `
        INSERT INTO sessions (hash, username, expiry, ip, userAgent)
        VALUES (@hash, @username, @expiry, @ip, @userAgent);
    `;

    const params = {
        hash: [hashString, sql.Char(128)],
        username: [username, sql.VarChar(255)],
        expiry: [expiry, sql.DateTime],
        ip: [ip, sql.VarChar(64)],
        userAgent: [userAgent, sql.VarChar(255)]
    }
    const result = await executeSQL(query, `Error creating session for ${username}`, params);
    if (result.error) {
        return new Result("Error creating session", true, 500);
    }

    return new Result(id);
}

async function authSession(id, ip, userAgent) {
    const hash = crypto.createHash('sha512');
    hash.update(id);
    const hashString = hash.digest('hex');

    const query = `
        SELECT * FROM sessions
        WHERE hash = @hash;
    `;

    const params = {
        hash: [hashString, sql.Char(128)]
    }
    const result = await executeSQL(query, `Error authenticating session ${id}`, params);
    if (result.error) {
        return new Result("Error authenticating session", true, 500);
    }

    if (result.info.length === 0) {
        return new Result("Session not found", true, 404);
    }

    if (result.info[0].expiry < new Date()) {
        return new Result("Session expired", true, 401);
    }

    if (result.info[0].ip !== ip || result.info[0].userAgent !== userAgent) {
        // Delete session
        const deleteResult = await deleteSession(id);
        return new Result("Login again please", true, 401);
    }

    const user = await retrieveUserByUsername(result.info[0].username);
    if (user.error) {
        return user;
    }

    return new Result(user.info.username); // Return all user info
}

async function deleteSession(id) {
    const hash = crypto.createHash('sha512');
    hash.update(id);
    const hashString = hash.digest('hex');

    const query = `
        DELETE FROM sessions
        WHERE hash = @hash;
    `;

    const params = {
        hash: [hashString, sql.Char(128)]
    }
    const result = await executeSQL(query, `Error deleting session ${id}`, params);
    if (result.error) {
        return new Result("Error deleting session", true, 500);
    }
}

export { createUser, authUser, createSession, authSession };