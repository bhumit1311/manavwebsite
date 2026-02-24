# 🚀 Portfolio — Production Setup Guide

## Step 1 — Set Up Formspree (Email System + Database)

> **5 minutes, 100% free, no credit card**

1. Go to **[formspree.io](https://formspree.io)** → click **"Get Started"** → Sign up with Google
2. Click **"+ New Form"** → name it **"Portfolio Inquiries"** → click **Create**
3. Copy your **Form ID** (looks like `xpzgkdlv` shown in the endpoint URL)
4. Open `index.html`, find line:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   Replace `YOUR_FORM_ID` with your actual ID, e.g.:
   ```html
   action="https://formspree.io/f/xpzgkdlv"
   ```
5. In Formspree Dashboard → **Settings** tab:
   - ✅ Enable **"Email Notifications"** → enter your real email
   - ✅ Enable **"Auto-Reply"** → paste this greeting template:

```
Subject: Thanks for reaching out, {{name}}! 🎬

Hi {{name}},

Thank you for getting in touch! I've received your enquiry about {{project}} and will get back to you within 24 hours.

Here's a summary of what you shared:
- Project: {{project}}
- Budget: {{budget}}
- Deadline: {{deadline}}

In the meantime, feel free to browse more of my work at your portfolio URL.

Looking forward to bringing your vision to life! 🎬

Warm regards,
Manav
Professional Video Editor & Visual Storyteller
📧 manav@example.com
💬 WhatsApp: +91 99999 99999
```

6. In Formspree → **Integrations** tab → connect **Google Sheets**
   - This gives you a live spreadsheet with every lead's name, email, project, budget, deadline, and device info!

---

## Step 2 — Replace Placeholders

Search and replace these in `index.html` and `script.js`:

| Placeholder | Replace with |
|---|---|
| `manav@example.com` | Your real email address |
| `919999999999` | Your WhatsApp number with country code (no +) |
| `https://manavfilms.netlify.app/` | Your actual live URL |
| `dQw4w9WgXcQ` (YouTube ID) | Your actual showreel / project video IDs |
| Social `href="#"` links | Your Instagram, YouTube, LinkedIn, Vimeo URLs |

---

## Step 3 — Deploy to Netlify (30 seconds, free)

1. Go to **[netlify.com](https://netlify.com)** → Sign up with Google (free)
2. On the dashboard → drag and drop your entire **`manav port`** folder
3. Your site is live! You'll get a URL like `https://random-name.netlify.app`
4. Click **"Site Settings"** → **"Change site name"** → set it to `manavfilms`
   - Your URL becomes: `https://manavfilms.netlify.app` ✅

### Custom Domain (optional — ~₹800/year)
1. Buy `manavfilms.in` on Namecheap or GoDaddy
2. In Netlify → **Domain Settings** → **Add custom domain**
3. Follow DNS instructions (takes ~24 hours to propagate)

---

## Step 4 — Google Search Console (Get Found on Google)

1. Go to **[search.google.com/search-console](https://search.google.com/search-console)**
2. Click **"Add Property"** → enter your Netlify URL
3. Verify ownership (Netlify makes this easy — just download the HTML file they give you and upload it to your `manav port` folder, then re-deploy)
4. Click **"Request Indexing"** on your homepage URL
5. Google will index your site within **3–7 days** 🎉

---

## Step 5 — Google Analytics (Track Visitors)

1. Go to **[analytics.google.com](https://analytics.google.com)** → Create account → Create Property
2. Get your **Measurement ID** (looks like `G-XXXXXXXXXX`)
3. Add this to `index.html` just before `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
4. Replace `G-XXXXXXXXXX` with your actual ID

---

## What You'll Have After All Steps ✅

| Feature | Status |
|---|---|
| Auto-reply email to every visitor who enquires | ✅ Formspree |
| Email notification to you for every inquiry | ✅ Formspree |
| Live customer database (Google Sheets) | ✅ Formspree integration |
| Spam protection (honeypot field) | ✅ Built in |
| Advanced SEO (Schema.org, meta tags, canonical) | ✅ Built in |
| Google Search indexing | ✅ After Search Console |
| Visitor analytics | ✅ After Google Analytics |
| Live on the internet | ✅ Netlify |
| Custom domain | ✅ Optional (₹800/yr) |
| **Total cost** | **₹0 to ₹800/year** |
