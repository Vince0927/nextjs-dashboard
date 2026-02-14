const bcrypt = require('bcryptjs');

const plaintextPassword = '123456';
const hashFromLogs = '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u';

async function testBcrypt() {
    try {
        console.log('--- Testing bcryptjs functionality ---');

        // Test 1: Hash a password and compare it against itself
        const generatedHash = await bcrypt.hash(plaintextPassword, 10);
        console.log('Generated Hash for "123456":', generatedHash);
        const matchGenerated = await bcrypt.compare(plaintextPassword, generatedHash);
        console.log('Match (plaintext vs generated hash):', matchGenerated);

        // Test 2: Compare plaintext "123456" against the hash from user logs
        console.log('\n--- Testing against hash from logs ---');
        console.log('Plaintext:', plaintextPassword);
        console.log('DB Hash from logs:', hashFromLogs);
        const matchLogs = await bcrypt.compare(plaintextPassword, hashFromLogs);
        console.log('Match (plaintext vs hash from logs):', matchLogs);

    } catch (error) {
        console.error('An error occurred during bcrypt test:', error);
    }
}

testBcrypt();
