import bcrypt from 'bcrypt';
const password="careershepherds";
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
console.log(hashedPassword);