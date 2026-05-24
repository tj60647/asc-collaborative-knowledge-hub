# American Society for Cybernetics (ASC) Digital Evolution Report
## Transitioning from a Legacy Web Portal to the Collaborative Knowledge Hub (CKH)

---

## 1. Executive Summary & Critique Framework

This report defines the capabilities, features, user experience (UX), and administrative experience (AX) goals required to transition the legacy **American Society for Cybernetics (ASC)** website into the proposed **Collaborative Knowledge Hub (CKH)**.

> [!WARNING]
> **Critique of the Student Capstone Proposal (SRS v1.2)**:
> In evaluating the technical files in the workspace, we explicitly treat the student Capstone group's *Software Requirement Specification (SRS v1.2)* as an **initial draft proposal requiring refinement**. The student work suffers from severe design deficiencies:
> *   **Asserted, Not Designed**: Technical stack choices (such as a separate FastAPI/Python backend) are asserted without architectural justification, trade-off comparisons, or consideration of the operational burden on a volunteer-run non-profit.
> *   **Premature Overengineering**: The proposal includes complex, half-baked features in the MVP (such as full network graph visualizations, adaptive member matching, and automated paper scrapers) while ignoring fundamental system realities.
> *   **Administrative Gaps**: The student proposal fails to design standard administrative workflows for volunteer operators, rendering the system unsustainable in production.
> *   **Ungrounded "Agentic" Claims**: Vague, high-level AI-powered features are tossed in as feature labels without defining agent architectures, safety limits, logging, prompts, or human-review guardrails.
> *   **Conceptual Confusion**: The proposal conflates structural "User Journeys" (basic navigational paths) with complex "Learning Journeys" (curated progress trackers), overcomplicating the MVP boundaries.
> 
> Consequently, this transition report **re-evaluates the student proposal's scope** and uses **Thomas J. McLeish's assessments and structural recommendations** as the primary source of truth. We realign the project to establish a secure, volunteer-operable, and "graph-ready" (rather than graph-complete) MVP foundation.

---

## 2. What We Intend to KEEP from the Existing Site

The new Collaborative Knowledge Hub will preserve and elevate only the actual core academic, historical, and brand assets of the ASC. We reject any legacy software configurations and keep strictly the following informational layers:

### 2.1. Foundational Scholarly Material
*   **The Definitions of Cybernetics**: The comprehensive historical compendium curated by Stuart Umpleby (1982/2000) and Larry Richards (1987), including direct philosophical and mathematical quotes from cyberneticians:
    *   *Norbert Wiener*: "control and communication theory, whether in the machine or in the animal".
    *   *W. Ross Ashby*: "the study of systems that are open to energy but closed to information".
    *   *Gregory Bateson*: "the study of form and pattern".
    *   *Stafford Beer*, *Heinz von Foerster*, *Ernst von Glasersfeld*, *Ludwig von Bertalanffy*, and *Andrée-Marie Ampère*.
*   **Narrative Profile & History**: Long-form histories of the ASC's founding in 1964, its second-order cybernetic principles (circularity, construction, reflexivity), and its interdisciplinary academic positioning.

### 2.2. Core Organizational Mappings
*   **Executive Board & Trustees Roster**: Roster mappings of the active Executive Board Officers (President, VP, Treasurer, Electronic Publications Lead) and Trustees.
*   **Past Presidents Registry**: The chronological list of past ASC leadership, preserving the society's structural lineage.
*   **audited Journal Mappings**: Metadata schemas, target URLs, submission rules, Scopus/Web of Science credentials, open-access policies, and ISSN directories for six core systems and cybernetics journals:
    1.  *Cybernetics and Human Knowing (CHK)*
    2.  *Constructivist Foundations*
    3.  *Kybernetes*
    4.  *Systems Research and Behavioral Science*
    5.  *World Futures*
    6.  *Technoetic Arts*

### 2.3. Operational Initiatives & Categories
*   **Active Initiatives Index**: Descriptive content detailing working groups: Speakers Series ("Emergent Territories"), #NewMacyMeetings (trans-generational revival), Archives Working Group, Art, Media, and Cybernetics (AMC) Working Group, and the Bateson study group.
*   **Established Membership Tiers**: The foundational pricing matrix and tiers (Regular $100, Student/Affiliate $40, Lifetime $750, Fellow, and Emeritus).
*   **Taylor & Francis Journal Discounts**: Metadata details offering the *Cybernetics and Systems* journal discount ($150/year instead of $396/year) for active ASC members.

---

## 3. What We Intend to DISCARD

We separate our rejections into two categories: discarding the **outdated legacy website mechanics** and explicitly **rejecting the initial student Capstone proposal specifications**.

```
                           ┌────────────────────────────────────────┐
                           │    Outdated Legacy Website Debt        │
                           │  - WordPress Core v6.9.4 & XHTML 1.0   │
                           │  - Superfish hover-only navigation     │
                           │  - Float CSS columns & layout blowouts │
                           │  - External PayPal redirects           │
                           │  - Google Forms iframe double-scrolls  │
                           └───────────────────┬────────────────────┘
                                               │
                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DISCARDED TECHNICAL & STRUCTURAL DEBT                           │
└──────────────────────────────────────────────┬─────────────────────────────────────────┘
                                               │
                                               ▼
                           ┌────────────────────────────────────────┐
                           │    Rejected Flawed Student Specs       │
                           │  - Separate FastAPI/Python Backend     │
                           │  - Premature Whole-Network Visuals     │
                           │  - Ungrounded "Agentic" Scrapers       │
                           │  - Complex "Learning Journey" Tracking │
                           │  - Reusable SSO Auth Server Bloat      │
                           └────────────────────────────────────────┘
```

### 3.1. Discarding Legacy Website Debt (Visual & Technical Friction)
*   **WordPress CMS Core & Plugins**: The legacy WordPress environment and custom themes (ApplicationPro) which introduce vulnerabilities and high maintenance overhead.
*   **XHTML 1.0 Doctype Standard**: Outdated XHTML standard that lacks semantic landmark elements (`<main>`, `<nav>`, `<header>`), creating severe accessibility barriers for screen readers.
*   **Superfish Pointer-Hover Menus**: Visual navigation menus activated strictly by mouseover, rendering the site completely unusable for keyboard-only or mobile-touch users.
*   **Rigid Float-Based Layouts**: Hardcoded layouts (#left-col 640px, #right-col 300px sidebar) that crop homepage slideshow images and break table boundaries on small screen resolutions.
*   **External PayPal Checkouts**: Off-site payment redirects to standard PayPal forms, introducing checkout friction and disrupting the user journey.
*   **Google Forms IFrame Embeds**: Embedded contact sheets that suffer from double scrollbars, poor styling cohesion, and mobile layout breaking.

### 3.2. Rejecting Flawed Student Proposal Specifications (Overengineered Bloat)
*   **Separate FastAPI/Python Backend**: We reject the Capstone group's assertion that the system requires a multi-tier separate Python backend. For a small non-profit with ~500 users run by volunteers, a separate backend adds massive server maintenance, container synchronization (Next.js, FastAPI, OJS, PostgreSQL, Nginx), and deployment friction.
*   **Premature Whole-Network Graph Visualizations**: We reject the student proposal to include complex 2D/3D network canvas renderers in the MVP. The graph structure must exist in the database, but visual representations are deferred to prevent MVP resource waste.
*   **Ungrounded "Agentic" Scrapers**: We reject the daily automated AI-crawlers (arXiv and JSTOR harvester) in the MVP. These introduce high API token costs, rate-limiting failures, database pollution, and massive regulatory risks without clear data filtering.
*   **Complex "Learning Journey" Tracking**: We reject the multi-part linear progress-tracking module in the MVP. It overcomplicates the database layer and introduces session-persistence bloat before the core Repository is even operational.
*   **Reusable Single Sign-On (SSO) Auth Server**: We reject the creation of a separate authorization server exposed to other ASC apps. This is a severe scope creep that introduces immense security liabilities for a volunteer-managed team.
*   **Visual Schema Editor**: We reject drag-and-drop schema editors for admins. Admins can manage repositories via static schema configurations (e.g., config files or simple forms) without needing a custom-built GUI.

---

## 4. What We Intend to ADD in the MVP

The MVP of the Collaborative Knowledge Hub is reframed as a **focused, highly secure, and volunteer-operable foundation**. We implement a single, unified application stack (e.g., Next.js/React + PostgreSQL) designed to run affordably on a low-cost virtual private server (VPS).

> [!IMPORTANT]
> **Priority Re-alignment**: 
> The student proposal prioritized member-facing "bells and whistles" (visual graphs, AI scrapers). We reverse this. The **Volunteer Admin Portal** and **Robust Security & Data Governance** are the primary core features of the MVP.

### 4.1. Volunteer Administration & Operations Portal (First-Class AX)
*   **Task-Based Admin Workflows**: Simplified, non-technical interfaces built specifically for non-expert volunteers to perform daily operations:
    *   *Member Audits*: Reviewing, denying, or requesting revisions on membership applications.
    *   *Stripe Log Audits*: Easy viewing of payment statuses, subscriptions, and transaction histories.
    *   *Role Management*: Assigning, modifying, or revoking Moderator and Manager statuses.
    *   *Content Moderation*: A central dashboard to review flagged comments, resolve reports, and enforce safety guidelines.
*   **Import/Export with Validation**: Administrative utilities to import/export member records and payments via standard formats (e.g., CSV). The tool **must include a validation preview** that displays schema mismatches, duplicates, or missing fields to prevent database corruption.

### 4.2. Graph-Ready (Not Graph-Complete) Data Model
*   **Explicit Relational Schema**: Designing a unified, robust SQL relational schema mapping Members, Resources, Glossary entries, Publications, Groups, and Tags.
*   **Provenanced Relationships**: Storing connections with metadata indicating *how* the relationship was formed:
    *   *Declared*: Set directly by a member (e.g., research interests).
    *   *Curated*: Set by a moderator or publisher.
    *   *Behavioral*: Derived from direct user interactions (e.g., bookmarked, completed, authored, commented, followed).
*   **Ego-Network Discovery**: Rather than drawing complex network visuals, the MVP renders simple, explainable related lists (e.g., "Members with Shared Interests" or "Related Publications") based on the database's graph-ready schema.

### 4.3. Secure Payments & Dynamic Repositories
*   **Native Stripe Checkout**: In-app, PCI-compliant membership billing, subscription renewals, donations, and event ticket purchases without external URL redirection.
*   **Dynamic Repositories**: Administrators can define and launch repository modules (e.g., "Curated Glossary" or "Systems Publications") with custom fields (text, images, authors) using a static configuration engine.
*   **Curated Collections**: Ordered or unordered lists of approved resources compiled by moderators (e.g., a "Cybernetics 101" list) without complex progress-tracking databases.
*   **Unified Profile Management**: Member profiles capturing affiliations, publications, bios, and tags, with granular privacy settings (visibility toggle, search index exclusion, and matching opt-out).

### 4.4. Security, Stability, and Privacy
*   **OWASP Standard Authentication**: Standard login backed by the **Argon2** password hashing algorithm (rejecting weak MD5 or SHA hashes).
*   **Multi-Factor Authentication (MFA)**: Support for authenticator-based OTP security for all member and admin accounts.
*   **Secure Session Architecture**: JWT tokens stored strictly in HttpOnly, secure, SameSite cookies to eliminate cross-site scripting (XSS) and cross-site request forgery (CSRF) vectors.
*   **GDPR / CCPA / LGPD Compliance**: Built-in mechanisms for user consent, standard right-to-be-forgotten deletion workflows, and secure exports of personal profile data.
*   **Community Safety Flagging**: Simple user flagging for harmful comments, collapsing low-rated comments automatically, and queuing reported content for moderator review.

---

## 5. What We Save for FUTURE WORK (The Prioritized Roadmap)

All complex, ungrounded features asserted in the student Capstone proposal are deferred to a phased roadmap. This ensures that the volunteer organization does not inherit a brittle, overbuilt system.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CORE MVP                                  │
│  - Unified Next.js + PostgreSQL App (No separate FastAPI stack)         │
│  - First-Class Volunteer Admin Portal & Preview-Validated CSV Imports   │
│  - Graph-Ready Database Schema & Explainable Ego-Network Lists         │
│  - Native Stripe Checkout, Profile Privacy & GDPR/CCPA Compliance      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ROADMAP LEVEL 1 (MVP-Plus)                      │
│  - Metadata Suggestion Agent (LLM tag generator)                       │
│  - Memberships Analytics Dashboard (Visual trends)                     │
│  - Human-Reviewed AI Newsletter Drafting Agent                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      ROADMAP LEVEL 2 (Post-MVP Extensions)             │
│  - Native Events & RSVP System (RSVPs, reminders, ticketing)           │
│  - Adaptive Member Matching (Feedback loops logging viewed/dismissed)   │
│  - Daily arXiv/JSTOR Research Harvester & Personal Research Feed       │
│  - Interactive 2D/3D Canvas Network Graph Visualization UI             │
│  - Progressive Web App (PWA) Offline Engine & OJS Integration          │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.1. Roadmap Level 1: MVP-Plus (High Priority AI & Data Extensions)
*   **Metadata Suggestion Agent (Extension Priority 10)**: An interactive LLM utility that scans member text submissions or profile updates and suggests conceptual tags/keywords (strictly editable by the user before saving).
*   **Memberships Analytics Dashboard (Extension Priority 10)**: Visual dashboard components showing retention rates, renewal trends, and membership types over time.
*   **Human-Reviewed Newsletter Drafting (Extension Priority 7)**: An LLM utility that drafts monthly newsletters based on recent submissions and upcoming events. Drafts are placed in a moderation queue for volunteer review, editing, and publishing (strictly keeping the human-in-the-loop).

### 5.2. Roadmap Level 2: Post-MVP Extensions
*   **Native Event & RSVP Management (Extension Priority 7/6/5)**:
    *   *Event Creation*: Managers can launch events natively with custom branding.
    *   *Event Engagement*: RSVPs, participant rosters, and automated event notifications.
    *   *Event Content Submission*: Pipelines for guests and members to submit papers/abstracts directly to an event (reusing the main repository workflow).
*   **Adaptive Member Matching (Extension Priority 8)**: Logging user feedback (suggestions dismissed or viewed) to train and improve future matching recommendations.
*   **arXiv/JSTOR Research Harvester (Extension Priority 8)**: An automated daily background crawler that fetches cybernetics publications from academic databases and logs them into a "Scraped Papers" repository.
*   **Personalized Research Feed (Extension Priority 4)**: Tailored research suggestion feeds based on member-resource interactions.
*   **Canvas-Based Network Graph UI (Extension Priority 9)**: Dynamic, interactive 2D/3D graph visualization canvas showing the entire ASC system network.
*   **Progressive Web Application (PWA) Offline Engine (Extension Priority 2)**: Caching RSVPed events, bookmarked resources, and allowing bulk downloads of entire repositories (like the glossary) for offline browsing.
*   **Open Journal Systems (OJS) Sync**: Automated synchronization of peer-review statuses, metadata, and reviewer assignments with the ASC's publishing workflows.

---

## 6. Verification and Acceptance Criteria

The MVP's success must be verified through clear, testable acceptance criteria:

### 6.1. Administrative Experience (AX) Verification
*   **CSV Import Safety**: Importing a CSV file with an incorrect schema must trigger a descriptive error message displaying the invalid columns, and **zero records** should be inserted into the database.
*   **Import Preview**: The CSV import dashboard must display a preview table of the first five records to be imported, highlighting any parsed data-type warnings before the admin clicks "Confirm Upload."
*   **Audit Trail Persistence**: Every manual change to user roles, membership approvals, or content deletions must create an immutable record in the audit log containing the operator's ID, action type, target ID, and timestamp.

### 6.2. Security and Compliance Verification
*   **Cookie Security**: Authentication session cookies must be verified in the browser to possess the `HttpOnly`, `Secure`, and `SameSite=Strict` flags.
*   **Account Lockout Enforcement**: Attempting to log in with an incorrect password four consecutive times must trigger a lockout event. The account must reject all login attempts (including correct passwords) for exactly 10 minutes, generating a security log.
*   **MFA Toggle**: A member toggling Multi-Factor Authentication "On" must be forced to successfully submit a scanned QR code and valid six-digit OTP before the database persists the configuration.

### 6.3. Relational Graph-Readiness Verification
*   **Interaction Logging**: Performing an action (e.g., bookmarking an article) must generate a relationship edge in the SQL database mapping the member, the resource, the relationship type (`bookmarked`), the creator source (`behavioral`), and the exact timestamp.
*   **Opt-Out Enforcement**: Toggling "Discoverability Off" on a member profile must immediately purge their ID from all standard search indexes and related-member matching queries.

---
*Report compiled on May 24, 2026, by the ASC Digital Transition Team.*
