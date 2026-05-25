import bcrypt from 'bcryptjs';

const hash = bcrypt.hashSync('password123', 10);
console.log('Real Hash:', hash);
