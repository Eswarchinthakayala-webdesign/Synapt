const fs = require('fs');
const logFile = require('path').join(__dirname, 'startup.log');

// Redirect console to file
const origLog = console.log;
const origErr = console.error;
const origWarn = console.warn;
const write = (prefix, ...args) => {
    const msg = `[${prefix}] ${args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')}\n`;
    fs.appendFileSync(logFile, msg);
};

console.log = (...args) => write('LOG', ...args);
console.error = (...args) => write('ERR', ...args);
console.warn = (...args) => write('WARN', ...args);

// Clear log
fs.writeFileSync(logFile, `=== Startup ${new Date().toISOString()} ===\n`);

try {
    write('LOG', 'Loading dependencies...');
    
    const path = require('path');
    write('LOG', 'path OK');
    
    require('dotenv').config({ path: path.join(__dirname, '.env') });
    write('LOG', 'dotenv OK');
    
    const express = require('express');
    write('LOG', 'express OK');
    
    const mongoose = require('mongoose');
    write('LOG', 'mongoose OK');
    
    const jwt = require('jsonwebtoken');
    write('LOG', 'jwt OK');
    
    const bcrypt = require('bcryptjs');
    write('LOG', 'bcryptjs OK, type:', typeof bcrypt.hash);
    
    const cors = require('cors');
    write('LOG', 'cors OK');
    
    const { Server } = require('socket.io');
    write('LOG', 'socket.io OK');

    // Try loading routes
    write('LOG', 'Loading auth route...');
    const authRoute = require('./routes/auth');
    write('LOG', 'auth route OK');
    
    write('LOG', 'Loading streams route...');
    const streamsRoute = require('./routes/streams');
    write('LOG', 'streams route OK');
    
    write('LOG', 'Loading moderation route...');
    const modRoute = require('./routes/moderation');
    write('LOG', 'moderation route OK');
    
    write('LOG', 'Loading socket handler...');
    const socketHandler = require('./sockets');
    write('LOG', 'socket handler OK');

    write('LOG', 'All modules loaded successfully!');
} catch (err) {
    write('ERR', `FAILED: ${err.message}`);
    write('ERR', `STACK: ${err.stack}`);
}

process.exit(0);
