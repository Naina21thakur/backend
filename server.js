const express = require('express');
const bodyParser = require('body-parser');
const isPrime = require('is-prime');

const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());


function validateFile(file_b64) {
    try {
        const fileBuffer = Buffer.from(file_b64, 'base64');
        const fileSizeKb = fileBuffer.length / 1024; 
        let mimeType = 'unknown';

      
        if (fileBuffer.slice(0, 4).equals(Buffer.from([137, 80, 78, 71]))) {
            mimeType = 'image/png'; 
        } else if (fileBuffer.slice(0, 4).equals(Buffer.from([37, 80, 68, 70]))) {
            mimeType = 'application/pdf'; 
        }

        return { valid: true, mimeType, fileSizeKb: Math.round(fileSizeKb) };
    } catch (err) {
        return { valid: false, mimeType: null, fileSizeKb: 0 };
    }
}


app.get('/', (req, res) => {
    res.send('Server is running!');
});


app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

     
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: 'Invalid input!' });
        }

   
        const userId = 'Soumya Singh';
        const email = 'nainasingh8545@gmail.com';
        const rollNumber = '0101EC211121';

      
        let numbers = [];
        let alphabets = [];
        let highestLowercaseAlphabet = [];
        let primeFound = false;

      
        data.forEach(item => {
            if (/^\d+$/.test(item)) {
               
                const num = parseInt(item, 10);
                numbers.push(item);
                if (isPrime(num)) primeFound = true;
            } else if (/^[a-zA-Z]$/.test(item)) {
                
                alphabets.push(item);
                if (item === item.toLowerCase()) {
                    highestLowercaseAlphabet.push(item);
                }
            }
        });

        if (highestLowercaseAlphabet.length > 0) {
            highestLowercaseAlphabet = [highestLowercaseAlphabet.sort().pop()];
        }

    
        let fileValid = false;
        let fileMimeType = null;
        let fileSizeKb = 0;
        if (file_b64) {
            const fileValidation = validateFile(file_b64);
            fileValid = fileValidation.valid;
            fileMimeType = fileValidation.mimeType;
            fileSizeKb = fileValidation.fileSizeKb;
        }

     
        return res.status(200).json({
            is_success: true,
            user_id: userId,
            email: email,
            roll_number: rollNumber,
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet,
            is_prime_found: primeFound,
            file_valid: fileValid,
            file_mime_type: fileMimeType,
            file_size_kb: fileSizeKb,
        });
    } catch (error) {
        return res.status(500).json({ is_success: false, message: error.message });
    }
});


app.get('/bfhl', (req, res) => {
    return res.status(200).json({ operation_code: 1 });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
