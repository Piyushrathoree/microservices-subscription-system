import { v4 as uuidv4 } from 'uuid';

export const generateVerificationCode = () => 
    Math.floor(100000 + Math.random() * 900000).toString();

export const generateHash = () => 
    uuidv4().replace(/-/g, '').substring(0, 16);
