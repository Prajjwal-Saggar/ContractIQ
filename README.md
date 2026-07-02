<div align="center">
  <!-- Place your banner image here -->
 <img width="1915" height="821" alt="Image" src="https://github.com/user-attachments/assets/e8bec99b-88e9-442d-bfec-8473b3b620bf" />
  <h1>ContractIQ_</h1>
  <p><strong>AI-powered legal document analysis. Upload. Analyse. Ask.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#screenshots">Screenshots</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>
</div>

---

**ContractIQ** is a next-generation, AI-driven legal technology platform built with a striking Cyber Brutalism design language. It allows legal professionals, businesses, and individuals to instantly analyze complex contracts, automatically detect high-risk clauses, and engage in a natural language chat to uncover hidden liabilities.

Built with performance and security in mind, ContractIQ leverages state-of-the-art embedding models and LLMs to bring unparalleled intelligence to your legal workflow.

## 🚀 Key Features

*   **Intelligent Contract Analysis:** Upload PDF contracts and receive an instant breakdown of clauses, key terms, and obligations.
*   **Automated Risk Flagging:** Our AI scans for non-standard, aggressive, or high-risk clauses and highlights them with detailed explanations.
*   **Context-Aware Legal Chat:** Chat directly with your contract. Ask questions like *"What are the termination conditions?"* and get precise answers backed by exact source clauses.
*   **Semantic Search & RAG:** Built on `pgvector` and Gemini embeddings for lightning-fast, highly accurate retrieval-augmented generation.
*   **Cyber Brutalism UI:** A stunning, high-contrast interface designed for maximum readability, speed, and aesthetic impact.
*   **Full Dark/Light Mode Support:** Seamlessly switch between a clean light mode and a striking dark mode interface.
*   **Fully Responsive:** Optimized for everything from ultrawide monitors to mobile devices.
*   **Secure Authentication:** Enterprise-grade security with JWT and OTP verification.

---

## 📸 Interface & Screenshots <a name="screenshots"></a>

### System Overview (Light Mode vs. Dark Mode)
Experience ContractIQ in your preferred aesthetic. Our themes are precision-engineered to maintain high contrast and readability across all lighting conditions.

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Light Mode</b></td>
      <td align="center"><b>Dark Mode</b></td>
    </tr>
    <tr>
      <td><img width="853" height="1844" alt="Image" src="https://github.com/user-attachments/assets/81efb8f8-b27b-4325-aa2e-4d5e78597eb5" /></td>
      <td><img width="853" height="1844" alt="Image" src="https://github.com/user-attachments/assets/ff17a8ce-cf64-448c-baa2-37592552ed15" /></td>
    </tr>
  </table>
</div>

### Mobile View (Responsive Design)
Full power, zero compromises. Manage your contracts and chat with the AI on the go.

<div align="center">
  <!-- <img src="./docs/assets/mobile-view.png" alt="Mobile View" width="250"/> --> 
  <br/>
  <i>[Insert Mobile View Screenshot]</i>
</div>

### Major Features in Action

#### 1. Contract Analysis & Risk Flagging
Instantly identify severe liabilities before you sign.
<div align="center">
  <!-- <img src="./docs/assets/risk-analysis.png" alt="Risk Analysis" width="800"/> -->
  <br/>
  <i>[Insert Screenshot of the Risk Summary/Flags view]</i>
</div>

#### 2. Interactive Document Chat (RAG)
Get answers cited directly from the text.
<div align="center">
  <!-- <img src="./docs/assets/chat-interface.png" alt="Chat Interface" width="800"/> -->
  <br/>
  <i>[Insert Screenshot of the Chat Interface with Source Clauses visible]</i>
</div>

#### 3. Secure File Upload & Processing
Drag, drop, and process complex legal PDFs in seconds.
<div align="center">
  <!-- <img src="./docs/assets/upload.png" alt="Upload Interface" width="800"/> -->
  <br/>
  <i>[Insert Screenshot of the Upload/Drag-and-Drop view]</i>
</div>

---

## 🛠 Architecture & Tech Stack <a name="architecture"></a>

ContractIQ is built using a modern, scalable microservices architecture:

*   **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
*   **Backend API:** Spring Boot (Java 17), Spring Security (JWT).
*   **Database:** PostgreSQL with `pgvector` for vector similarity search.
*   **AI/Embedding Service:** Python (FastAPI), PyPDF2, Gemini API for Embeddings.
*   **LLM Provider:** Google Gemini Pro for advanced reasoning and chat generation.
*   **Infrastructure:** Docker & Docker Compose for seamless local orchestration.

---

## 🏁 Getting Started <a name="getting-started"></a>

### Prerequisites
*   Node.js 18+
*   Java 17+
*   Docker Desktop
*   Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/contractiq.git
    cd contractiq
    ```

2.  **Start the Database and Embedding Service:**
    Provide your Gemini API key in the environment or `.env` file, then run:
    ```bash
    docker compose up -d
    ```

3.  **Start the Spring Boot Backend:**
    Update your `application.properties` with database and mail credentials, then run:
    ```bash
    cd backend/backend
    ./mvnw spring-boot:run
    ```

4.  **Start the Next.js Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

5.  **Access the Application:**
    Navigate to `http://localhost:3000` in your browser.

---

<div align="center">
  <p>Built with precision by the ContractIQ Team.</p>
</div>
