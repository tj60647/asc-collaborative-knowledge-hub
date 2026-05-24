# ASC Second Brain & Collaborative Knowledge Hub Workspace

This repository houses the files, structural designs, audits, and strategic transition roadmaps compiled for the American Society for Cybernetics (ASC) digital workspace.

## 🌟 The Future of the ASC Website and Member Portal: The Collaborative Knowledge Hub (CKH)

The future of the ASC digital ecosystem lies in the realization of the **Collaborative Knowledge Hub (CKH)**. Moving beyond a static WordPress brochure site, the new platform is designed as an aspirational, living digital space where cyberneticians cross-pollinate ideas, coordinate global chapters, and co-create knowledge in real-time.

At its core, the portal bridges high-integrity **Member Management** with **Collaborative Scholasticism**:
*   **Aspirational Community Portal**: A responsive, accessible hub that unites the global cybernetics community—including the executive board, academic researchers, regional chapters (US, Brazil, Austria, and beyond), and the general public—into a single digital ecosystem.
*   **Frictionless Member Journeys**: A modern, native membership lifecycle (built securely with Stripe, discarding legacy off-site redirects). Active members can curate rich profiles, manage their privacy/discoverability levels, and link published articles and glossary entries directly to their profiles.
*   **Volunteer-Operable Administration**: Fully robust, simple-to-use dashboard tools designed specifically for non-expert volunteers to manage records, audit Stripe invoices, and handle data imports/exports with validation previews to prevent database corruption.

By introducing **Grounded Natural Language Processing (NLP) and Artificial Intelligence (AI)**, the portal unlocks state-of-the-art capabilities, strictly governed by a secure "human-in-the-loop" paradigm:
*   **Metadata Suggestion Agents**: Context-aware NLP systems that scan text uploads and bios to recommend semantic tags and keywords, helping members index concepts accurately without administrative overhead.
*   **Explainable Member Matching**: Relational, tag-based recommendation engines that suggest potential academic collaborators or study partners based on transparent, explainable proximity (e.g., *"You both list second-order cybernetics and organizational systems"*).
*   **Grounded Content Synthesis**: Secure, human-reviewed LLM assistants that help volunteers compile monthly newsletter drafts, summarize lengthy submission threads, or identify emergent research patterns across the platform's repositories.
*   **Graph-Ready Foundations**: A relational SQL database structure designed to capture rich, provenanced connections (declared, curated, and behavioral), preparing the platform for visual ego-networks and full-network knowledge graphs.

## 📂 Repository Layout & Deliverables

This workspace is organized to keep the active transition deliverables and planning documents immediately accessible at the root level, while archiving the background reference materials.

### 🌟 Active Planning & Transition Documents

*   📄 **[asc_digital_evolution_report.md](file:///c:/Users/tj/repos/ASC-SecondBrain/asc_digital_evolution_report.md)**: **Strategic Evolution Report**. Outlines the overall transition roadmap, cataloging legacy features to keep/discard, establishing the unified Next.js + PostgreSQL MVP specification, defining security/compliance boundaries, and laying out the prioritized future extensions backlog.
*   📄 **[asc_user_journeys_and_jtbd.md](file:///c:/Users/tj/repos/ASC-SecondBrain/asc_user_journeys_and_jtbd.md)**: **User Journeys & JTBD Catalog**. Establishes the human-centric behavioral blueprints. Details 5 system personas (with Laura's role specifically mapped to native print-ready treasury reports), outlines 16 Jobs to Be Done (JTBD), and defines 8 step-by-step user and operational journeys (including the Stripe onboarding, moderation pipeline, and conversational legacy migration).
*   📄 **[asc_website_audit_report.md](file:///c:/Users/tj/repos/ASC-SecondBrain/asc_website_audit_report.md)**: **Existing Conditions Website Audit**. A complete, highly descriptive technical audit cataloging the live site's legacy WordPress configurations, doctypes, CSS styles, jQuery-dependent libraries, and usability/accessibility structures as a baseline.
*   📂 **[screenshots/](file:///c:/Users/tj/repos/ASC-SecondBrain/screenshots/)**: Visual audit catalog folder containing high-resolution full-page browser screenshots of the live ASC pages (`home.png`, `about.png`, `definitions.png`, `join.png`, `contact.png`) to serve as a design refactoring reference.

### 🗄️ Archived Background Reference Materials

All legacy specifications, proposal documents, and raw source extractions have been consolidated into the **`[archive/](file:///c:/Users/tj/repos/ASC-SecondBrain/archive/)`** directory:

*   📄 **[Collaborative Source of Truth.pdf](file:///c:/Users/tj/repos/ASC-SecondBrain/archive/Collaborative%20Source%20of%20Truth.pdf)**: The primary client brief and specification for the Collaborative Knowledge Hub.
*   📄 **[Collaborative Source of Truth.txt](file:///c:/Users/tj/repos/ASC-SecondBrain/archive/Collaborative%20Source%20of%20Truth.txt)**: Ephemeral plain-text extraction of the primary spec for semantic analysis.
*   📄 **[Recommendations for Strengthening...pdf](file:///c:/Users/tj/repos/ASC-SecondBrain/archive/Recommendations%20for%20Strengthening%20the%20Collaborative%20Knowledge%20Hub%20Specification%20and%20Design.pdf)**: Thomas J. McLeish's structural audits, feedback, and architectural expansion recommendations.
*   📄 **[Recommendations for Strengthening...txt](file:///c:/Users/tj/repos/ASC-SecondBrain/archive/Recommendations%20for%20Strengthening%20the%20Collaborative%20Knowledge%20Hub%20Specification%20and%20Design.txt)**: Ephemeral plain-text extraction of McLeish's recommendations.
*   📄 **[Software Requirement Specification...pdf](file:///c:/Users/tj/repos/ASC-SecondBrain/archive/Software%20Requirement%20Specification,%20Version%201.2.pdf)**: The legacy student Capstone SRS draft proposal.
*   📄 **[Software Requirement Specification...txt](file:///c:/Users/tj/repos/ASC-SecondBrain/archive/Software%20Requirement%20Specification,%20Version%201.2.txt)**: Ephemeral plain-text extraction of the legacy student SRS.

---

## 🛠️ Automated Browser Capture System Note

To capture the high-resolution, full-page screenshots of the live website, an automated browser capture system was executed using **Python and Playwright**.

### Why Python/Playwright (and not a JS/Node.js stack)?
1.  **Workspace Cleanliness**: Running browser automation in JavaScript typically requires creating configuration files (`package.json`, `package-lock.json`) and downloading hundreds of megabytes of third-party assets into a local `node_modules` directory in the repository.
2.  **Ephemeral Execution**: By utilizing the **`uv`** tool (a Rust-based Python package manager), the screenshot capture script was executed in a sandboxed, ephemeral virtual environment. The dependencies were resolved on-the-fly and cleaned up immediately after, preventing any global package pollution in this repository.
3.  **Stability & Viewport Management**: Playwright's Python bindings seamlessly handle browser contexts, allowing us to mimic a standard desktop viewport (`1280x800`) and delay screenshots until standard network activities have completely halted (`wait_until="networkidle"`).

### How to Re-Run the Screenshot Capture
If you need to update the screenshots folder in the future as the live site evolves, you can re-run the capture script using `uv` from your terminal:

```powershell
# 1. Navigate to your workspace directory
cd c:\Users\tj\repos\ASC-SecondBrain

# 2. Re-run the automated script with ephemeral Playwright dependencies
uv run --with playwright python C:\Users\tj\.gemini\antigravity\brain\f5384461-18c5-455c-96e6-bc40fb9e6393\scratch\take_screenshots.py
```
*(Note: The capture script is safely archived in the system app data directory to keep your main workspace directory clean and strictly focused on project documentation).*
