import path from 'path';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || `http://localhost:${PORT}`;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const DESTINATION_EMAIL = process.env.DESTINATION_EMAIL || GMAIL_USER;

if (!GMAIL_USER || !GMAIL_PASS) {
    console.warn('\n⚠️  Missing Gmail credentials. Set GMAIL_USER and GMAIL_PASS in your .env file.');
}

const allowedOrigins = CORS_ORIGIN.split(',').map((origin) => origin.trim());

app.use(cors({
    origin: allowedOrigins,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: GMAIL_USER && GMAIL_PASS ? { user: GMAIL_USER, pass: GMAIL_PASS } : undefined,
});

if (GMAIL_USER && GMAIL_PASS) {
    transporter.verify((error, success) => {
        if (error) {
            console.warn('⚠️  Mail transporter verification failed:', error.message);
        } else {
            console.log('✉️  Mail transporter ready');
        }
    });
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/demo-request', async (req, res) => {
    const { name, email, organization, message } = req.body;

    if (!name || !email || !organization) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    if (!DESTINATION_EMAIL) {
        return res
            .status(500)
            .json({ error: 'Email destination not configured. Set DESTINATION_EMAIL in your environment.' });
    }

    const html = `
        <h2>New Aerotrofix demo request</h2>
        <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Organization:</strong> ${organization}</li>
        </ul>
        <p><strong>Mission-critical details:</strong></p>
        <p>${message ? message.replace(/\n/g, '<br>') : 'None provided.'}</p>
    `;

    const mailOptions = {
        from: `Aerotrofix Demo Desk <${GMAIL_USER}>`,
        to: DESTINATION_EMAIL,
        subject: 'New Aerotrofix demo request',
        replyTo: email,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ ok: true });
    } catch (error) {
        console.error('Failed to send email', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

app.use(express.static(__dirname));

app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/') && req.accepts('html')) {
        return res.sendFile(path.join(__dirname, 'index.html'));
    }
    return next();
});

let server;

if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`🚀 Aerotrofix server running at http://localhost:${PORT}`);
    });
}

export default server;
