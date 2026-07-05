<div align="center">

<img width="1915" height="821" alt="ContractIQ Banner" src="https://github.com/user-attachments/assets/e8bec99b-88e9-442d-bfec-8473b3b620bf" />

<br />

<img src="https://img.shields.io/badge/STATUS-LIVE-00FF88?style=for-the-badge&labelColor=0A0A0A" alt="Live" />
&nbsp;
<img src="https://img.shields.io/badge/VERSION-1.0.0-7B5EA7?style=for-the-badge&labelColor=0A0A0A" alt="Version" />
&nbsp;
<img src="https://img.shields.io/badge/PRs-WELCOME-7B5EA7?style=for-the-badge&labelColor=0A0A0A" alt="PRs Welcome" />

<br /><br />

# CONTRACTIQ\_

### *The AI that reads your contracts so you don't have to.*

**Upload. Analyse. Ask. Understand — in seconds.**

<br />

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-►-C8FF00?style=for-the-badge&labelColor=0A0A0A)](https://contractiq.vercel.app)
&nbsp;&nbsp;
[![Report Bug](https://img.shields.io/badge/REPORT_BUG-◆-FF3333?style=for-the-badge&labelColor=0A0A0A)](../../issues)
&nbsp;&nbsp;
[![Request Feature](https://img.shields.io/badge/REQUEST_FEATURE-◈-7B5EA7?style=for-the-badge&labelColor=0A0A0A)](../../issues)

</div>

---

<br />

## ◈ The Problem

Legal contracts are designed to be read by lawyers, not people. A standard vendor agreement runs 40+ pages. A non-compete clause buried on page 32 can cost you years. An auto-renewal trap in paragraph 7 can cost you thousands.

**ContractIQ changes that.**

Upload any PDF contract. In under 60 seconds, our AI extracts every clause, scores risk levels, flags dangerous terms, and opens a natural language interface — so you can ask *"What happens if I terminate early?"* and get the exact answer, cited from the exact line.

```
  UPLOAD PDF  ──►  EXTRACT & CHUNK  ──►  EMBED VECTORS
                                               ↓
  CITED ANSWER  ◄──  GEMINI LLM  ◄──  SIMILARITY SEARCH
```

<br />

---

<br />

## ◈ Interface

<div align="center">

### Light Mode &nbsp;·&nbsp; Dark Mode

<table>
  <tr>
    <td align="center"><b>☀️ &nbsp; Light</b></td>
    <td align="center"><b>🌑 &nbsp; Dark</b></td>
  </tr>
  <tr>
    <td><img width="853" height="1844" alt="ContractIQ Light Mode" src="https://github.com/user-attachments/assets/81efb8f8-b27b-4325-aa2e-4d5e78597eb5" /></td>
    <td><img width="853" height="1844" alt="ContractIQ Dark Mode" src="https://github.com/user-attachments/assets/ff17a8ce-cf64-448c-baa2-37592552ed15" /></td>
  </tr>
</table>

*Both themes engineered for high contrast, maximum readability, and zero eye strain.*

</div>

<br />

---

<br />

## ◈ Features

<br />

<table>
<tr>
<td width="50%">

**📄 &nbsp; PDF Ingestion**
Upload any contract PDF. Text is extracted, semantically chunked, and indexed. Every clause becomes searchable in seconds.

</td>
<td width="50%">

**⚠️ &nbsp; Automated Risk Flagging**
AI scans every clause for auto-renewal traps, uncapped liability, one-sided termination, IP ownership transfers, and non-compete overreach.

</td>
</tr>
<tr>
<td width="50%">

**💬 &nbsp; Natural Language Chat**
Ask plain-English questions. *"What is the notice period?"* Get precise answers drawn directly from contract text — not hallucinated.

</td>
<td width="50%">

**📌 &nbsp; Source Citations**
Every answer shows the exact clause it came from. Verifiable. Trustworthy. No black-box answers.

</td>
</tr>
<tr>
<td width="50%">

**🔐 &nbsp; OTP Authentication**
Email-verified registration with JWT stateless sessions. Secure from day one.

</td>
<td width="50%">

**📊 &nbsp; Risk Dashboard**
Organisation-wide risk overview. See your riskiest contracts ranked, flagged clauses broken down by severity, at a glance.

</td>
</tr>
<tr>
<td width="50%">

**🌓 &nbsp; Dark / Light Mode**
Precision-engineered Cyber Brutalism themes. Switch with `Ctrl + Shift + L`. Your eyes, your choice.

</td>
<td width="50%">

**📱 &nbsp; Fully Responsive**
Built mobile-first. Optimised from ultrawide monitors to a 375px phone screen. Every pixel intentional.

</td>
</tr>
</table>

<br />

---

<br />

## ◈ Tech Stack

<br />

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Lenis |
| **Backend** | Spring Boot 3.2 · Java 21 · Spring Security · JPA / Hibernate |
| **AI Service** | Python 3.11 · FastAPI · PyMuPDF · Google Gemini Embeddings |
| **Database** | PostgreSQL 17 · pgvector (768-dim vector search) |
| **Auth** | JWT (stateless) · BCrypt · OTP via SMTP |
| **Infrastructure** | Docker · Docker Compose · Railway · Vercel · Neon DB |

</div>

<br />

---

<br />

## ◈ Architecture

<br />

```
┌──────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                            │
│              Cyber Brutalism · Dark/Light Mode                   │
└────────────────────────────┬─────────────────────────────────────┘
                             │  HTTPS + JWT Bearer Token
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Spring Boot Monolith                           │
│                      localhost:8080                              │
│                                                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│   │ Auth Module  │  │Contract Mod  │  │    Chat Module       │  │
│   │ OTP · JWT    │  │Upload · CRUD │  │  RAG Pipeline        │  │
│   └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                              │                    │              │
│                    ┌─────────────────┐            │              │
│                    │  Risk Module    │            │              │
│                    │  AI Analysis    │            │              │
│                    └─────────────────┘            │              │
└──────────────────────────┬───────────────────────┬──────────────┘
                           │                       │
              HTTP REST    │                       │  JPA / pgvector
                           ▼                       ▼
          ┌─────────────────────┐   ┌──────────────────────────────┐
          │  Python FastAPI      │   │   PostgreSQL 17 + pgvector   │
          │  Embedding Service  │   │                              │
          │  localhost:8000     │   │  users · contracts · clauses │
          │                     │   │  vector(768) · chat_messages │
          │  PyMuPDF → chunks   │──►│                              │
          │  Gemini Embeddings  │   │  <=> cosine similarity ops   │
          └─────────────────────┘   └──────────────────────────────┘
```

<br />

---

<br />

## ◈ Getting Started

<br />

### Prerequisites

```bash
java --version    # JDK 21+
docker --version  # Docker Desktop
node --version    # Node.js 20+
python --version  # Python 3.11+
```

<br />

### 1 · Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/contractiq.git
cd contractiq
```

<br />

### 2 · Set environment variables

Create `.env` at project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Create `backend/src/main/resources/application.properties`:

```properties
server.port=8080
spring.application.name=contractiq-backend

spring.datasource.url=jdbc:postgresql://localhost:5432/contractiq_db
spring.datasource.username=dev
spring.datasource.password=dev123
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

jwt.secret=your-jwt-secret-min-32-chars
jwt.expiration=86400000

embedding.service.url=http://localhost:8000
gemini.api.key=your_gemini_api_key_here
gemini.model=gemini-2.0-flash
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_gmail@gmail.com
spring.mail.password=your_gmail_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

otp.expiry.minutes=10
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

<br />

### 3 · Start infrastructure

```bash
# start PostgreSQL + Python embedding service
docker compose up -d

# verify both are healthy
docker compose ps
```

> **First run only** — connect to `contractiq_db` and enable pgvector:
> ```sql
> CREATE EXTENSION IF NOT EXISTS vector;
> ```

<br />

### 4 · Start the backend

```bash
cd backend
./mvnw spring-boot:run
# starts at http://localhost:8080
```

<br />

### 5 · Start the frontend

```bash
cd frontend
npm install
npm run dev
# starts at http://localhost:3000
```

<br />

### 6 · Verify everything is running

```bash
curl http://localhost:8000/health    # embedding service
curl http://localhost:8080/actuator/health  # spring boot
```

Open `http://localhost:3000` — register, verify OTP, upload a contract.

<br />

---

<br />

## ◈ Deployment

<br />

| Service | Platform | Notes |
|---------|----------|-------|
| Spring Boot | [Railway](https://railway.app) | Set env vars in Railway dashboard · auto-detects Maven |
| Embedding Service | [Railway](https://railway.app) | Deploy from `embedding-service/` directory |
| Frontend | [Vercel](https://vercel.com) | Connect GitHub · set `NEXT_PUBLIC_API_URL` |
| Database | [Neon DB](https://neon.tech) | Enable pgvector extension post-creation |

> **Pro tip** — Use [UptimeRobot](https://uptimerobot.com) to ping `/actuator/health` every 5 minutes on Railway free tier. Eliminates cold start delays during demos.

<br />

---

<br />

## ◈ Project Structure

<br />

```
contractiq/
│
├── backend/                           # Spring Boot monolith
│   └── src/main/java/com/contractiq/
│       ├── model/                     # JPA entities
│       ├── dto/                       # Request / response objects
│       ├── repository/                # Data access layer
│       ├── service/
│       │   ├── AuthService.java       # OTP + JWT auth
│       │   ├── ContractService.java   # Upload + CRUD
│       │   ├── ChatService.java       # RAG pipeline
│       │   ├── RiskFlagService.java   # AI clause analysis
│       │   ├── OtpService.java
│       │   └── EmailService.java
│       ├── controller/                # REST endpoints
│       ├── client/
│       │   ├── EmbeddingClient.java   # → Python service
│       │   └── GeminiClient.java      # → Gemini LLM
│       └── config/                    # Security · JWT · CORS
│
├── embedding-service/                 # Python FastAPI microservice
│   ├── main.py                        # PDF extract + chunk + embed
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                          # Next.js 14 application
│   └── src/
│       ├── app/                       # App Router pages
│       ├── components/                # UI component library
│       ├── lib/                       # Axios + utilities
│       ├── hooks/                     # Custom React hooks
│       ├── context/                   # Auth context
│       └── types/                     # TypeScript interfaces
│
├── docker-compose.yml                 # DB + embedding service
└── .env                               # Root env (gitignored)
```

<br />

---

<br />

## ◈ Roadmap

<br />

- [x] OTP email verification flow
- [x] PDF ingestion + vector pipeline
- [x] pgvector semantic similarity search
- [x] RAG chat with source citations
- [x] AI risk clause detection + scoring
- [x] Cyber Brutalism UI with dark/light mode
- [x] Fully responsive across all devices
- [ ] Multi-language contract support
- [ ] Batch upload processing
- [ ] Redis caching for analytics results
- [ ] API Gateway with rate limiting
- [ ] Webhook alerts on high-risk detection
- [ ] Mobile application (React Native)

<br />

---

<br />




<div align="center">

```
● CONNECTION SECURE  ·  > ENCRYPTION: AES-256  ·  NODE: CONTRACTIQ_01  ·  ACCESS GRANTED_
```

<br />

**ContractIQ** — *Built with precision. Designed to protect.*

<br />

⭐ &nbsp; **If ContractIQ saved you from a bad clause, star this repo.**

</div>