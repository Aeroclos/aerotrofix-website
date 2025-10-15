# Aerotrofix Website

A cinematic, responsive marketing site for Aerotrofix LLC that now forwards demo requests straight to the team inbox. The project combines a handcrafted front-end with a minimal Node.js mail relay so submissions land in `aerotrofixllc@gmail.com` automatically.

## ✨ Highlights

- Gradient-rich hero, narrative sections, and animated cards tailored for aviation decision makers
- Mobile-first navigation with sticky state and Intersection Observer animations
- JSON API at `/api/demo-request` that emails form submissions in the background
- Environment-driven configuration—no credentials committed to source control
- Single Node.js process that serves both the static site and the API

## 🧰 Stack

| Layer     | Technology                    | Notes |
|-----------|-------------------------------|-------|
| Front end | HTML5, CSS custom framework, Vanilla JS | No build tooling required |
| Back end  | Node.js 18+, Express 4, Nodemailer 6     | Handles submission relay |
| Tooling   | dotenv, cors, nodemon (dev)             | Local DX and security |

## 🚀 Getting Started

### 1. Requirements

- Node.js **18 or newer**
- npm (bundled with Node)
- Gmail account with [App Passwords](https://support.google.com/accounts/answer/185833) enabled (required for SMTP access)

### 2. Configure environment variables

1. Duplicate `.env.example` and rename to `.env`.
2. Fill in the values:
   - `PORT` – optional, defaults to `4000`.
   - `CORS_ORIGIN` – allowed origins (comma separated). `http://localhost:4000` works for local dev.
   - `GMAIL_USER` – Gmail address used to authenticate, e.g. `aerotrofixllc@gmail.com`.
   - `GMAIL_PASS` – Gmail **App Password** (16 character code). Regular passwords will be rejected by Google.
   - `DESTINATION_EMAIL` – where submissions should be delivered. Defaults to `GMAIL_USER` if omitted.

> `.gitignore` already excludes `.env`, so secrets stay out of version control.

### 3. Install and run

```powershell
cd E:\WEBSiteAerotrofix\aerotrofix-website
npm install
npm run start
```

The site becomes available at `http://localhost:4000/` with the API mounted at the same origin (`/api/demo-request`). For hot reload while developing the server use `npm run dev`.

## 📬 How the form works

1. The form in `index.html` posts JSON to `/api/demo-request`.
2. `server.js` validates required fields and formats an HTML email.
3. Nodemailer sends the message using the Gmail credentials from your `.env` file.
4. The requester’s email is set as the `reply-to`, so you can respond directly.
5. Success or failure is surfaced inline via the status banner beneath the submit button.

> Planning a production deployment? Swap Gmail for a dedicated provider (SendGrid, SES, Mailgun) and store secrets in managed vaults.

## 🛠 Customisation

- **Content & storytelling:** edit copy inside `index.html`.
- **Branding:** adjust CSS tokens inside the `:root` block of `styles.css`.
- **Hero imagery:** replace the background URL in `.hero` with an approved creative.
- **API endpoint:** change `data-endpoint` on the `<form>` element if you host the mailer elsewhere.
- **Email template:** tweak the HTML markup inside `server.js` to match desired formatting.

## 📦 Deployment

Deploy the entire `aerotrofix-website` directory to any Node-friendly platform (Azure App Service, Render, Heroku, Fly.io, etc.). Ensure outbound SMTP is allowed and replicate your `.env` values via the platform’s secret manager.

## 🤝 Support

Need a hand or want to extend the workflow? Reach out to the Aerotrofix digital team—or submit the live form once the server is running and we’ll follow up.
