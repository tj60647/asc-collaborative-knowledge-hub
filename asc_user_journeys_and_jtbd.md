# Collaborative Knowledge Hub (CKH) User Journeys & Jobs to Be Done (JTBD) Catalog
## Product Design and Workspace Specification Document

---

## 1. Executive Summary

This design document establishes the human-centric foundation for the **American Society for Cybernetics (ASC) Collaborative Knowledge Hub (CKH)**. To ensure a highly maintainable, focused foundation and prevent premature technical complexity, this catalog defines the exact **Personas, Roles, Jobs to Be Done (JTBD), and Primary User Journeys** that govern the digital ecosystem.

By mapping system capabilities to actual user motivations, constraints, and operational goals, this document serves as the absolute baseline for all subsequent database modeling, interface designs, and functional APIs.

---

### 1.1. MVP Delivery Tiers

To ensure the platform is built in focused, testable phases, every Job to Be Done is assigned a delivery tier. This boundary is the governing constraint for all downstream data model, interface, and API work.

| Tier | Definition |
| :--- | :--- |
| **MVP** | Required for launch. Core member, manager, and moderator workflows the organization cannot operate without. |
| **MVP-Plus** | High-value extensions that require the MVP foundation to be stable first. |
| **Post-MVP** | Deferred until user need, governance model, and maintenance burden are clearly specified. |

| JTBD | Description | Delivery Tier |
| :--- | :--- | :--- |
| JTBD-1 | Glossary Navigation | MVP |
| JTBD-2 | Ego-Network Discovery | MVP-Plus |
| JTBD-3 | Collaborator Matching | MVP-Plus |
| JTBD-4 | Interactive Scholastic Profile | MVP |
| JTBD-5 | Privacy Autonomy | MVP |
| JTBD-6 | Frictionless Editing | MVP |
| JTBD-7 | Safe Content Reversal | MVP |
| JTBD-8 | Frictionless Onboarding | MVP |
| JTBD-9 | Manual Member Record Creation | MVP |
| JTBD-10 | Treasury & Membership Reporting | MVP |
| JTBD-11 | System Handover & Low-Cost Maintenance | MVP |
| JTBD-12 | Advisory Administrative Assistance | MVP-Plus |
| JTBD-13 | Community Safety Reporting | MVP |
| JTBD-14 | Graduated Enforcement | MVP |
| JTBD-15 | Unintentional Content Correction | MVP |
| JTBD-16 | Guided Legacy Data Migration | MVP-Plus |

*Post-MVP features (deferred):* Advanced graph visualization, external research scraper, social feed, comments, OJS integration, events, PWA/offline mode, full automated member matching, automated newsletters, reusable authentication server.

---

## 2. Personas & Roles Directory

The CKH serves a diverse, international community split between academic researchers, practitioners, general public enthusiasts, and part-time volunteer board operators. We define five distinct personas in the directory below:

| Persona & Name | Audience Class / Role | Core Motivation | Key Pain Point & Constraint |
| :--- | :--- | :--- | :--- |
| **Elena**<br>(The Curious Inquirer) | **General Public** | Wants to find authoritative cybernetic definitions, research pioneers, and discover local workshops. | Encountering academic paywalls; struggling with non-responsive layouts on her smartphone. |
| **Dr. Aris**<br>(The Active Scholastic) | **ASC Member** | Wants to share publications, connect with cyberneticians, and manage dues natively. | Frustrated by fragmented mailing lists and high-friction off-site PayPal checkouts. |
| **Jocelyn**<br>(The Content Steward) | **Moderator** | Wants to curate the Scholarly Glossary and Publications repository efficiently, and to resolve member safety reports with a clear, auditable workflow. | Has limited volunteer time; fears making permanent mistakes; uncertain how to handle edge-case conduct disputes fairly without a documented policy to reference. |
| **Laura**<br>(The Operations Manager) | **Manager** | Wants to audit dues, manage memberships, and view print-ready treasury and membership reports for board meetings. | Has zero database/terminal skills; fears corrupting databases via invalid Excel uploads. |
| **Adler**<br>(The Strategic Admin) | **Administrator** | Wants to sustain low-cost hosting and maintenance, ensure GDPR/CCPA data compliance, and simplify system handovers. | Inherited a bloated, brittle multi-service stack; spends too much time on security patches. |

### 2.1. The Curious Inquirer (General Public Role)
*   **Representative Profile**: **Elena**, a 24-year-old graduate design student living in São Paulo, Brazil.
*   **Relationship to ASC**: Non-member. Discovered the ASC through research on conversational systems and cybernetics.
*   **Core Motivations**: Wants to find authoritative, readable definitions of cybernetic concepts, research historical figures like Gregory Bateson, and check if there are local workshops or speakers in South America.
*   **Key Constraints & Pain Points**: 
    *   Finds academic papers locked behind expensive journals or complex paywalls.
    *   Navigates primarily on her smartphone; legacy mobile interfaces that crop text or require horizontal scrolling make reading long-form text extremely frustrating.
    *   Has zero interest in paying for a full academic membership until she understands the community's value.

### 2.2. The Active Scholastic Member (ASC Member Role)
*   **Representative Profile**: **Dr. Aris**, a 48-year-old Associate Professor of Systems Science in Vienna, Austria.
*   **Relationship to ASC**: Active paying member. Contributes to study circles and publishes in systems journals.
*   **Core Motivations**: Wants to share his recent publications, find other cyberneticians working on similar research questions (specifically *second-order cybernetics*), and manage his annual membership dues seamlessly.
*   **Key Constraints & Pain Points**:
    *   Struggles to keep track of discussions scattered across multiple, fragmented mailing lists.
    *   Lacks a centralized directory to find active collaborators or projects.
    *   Frustrated by rigid, off-site PayPal checkouts that often fail or require entering redundant details every year.
    *   Demands robust data privacy controls; wants the ability to toggle his profile visibility off when he is busy.

### 2.3. The Voluntary Content Moderator (Moderator Role)
*   **Representative Profile**: **Jocelyn**, a 67-year-old retired cybernetics researcher and active ASC board advisor.
*   **Relationship to ASC**: Long-standing member. Appointed as the Moderator for the Scholarly Glossary and Publications repository. Also serves as the first-line reviewer for member safety and conduct reports.
*   **Core Motivations**: Wants to preserve the academic integrity of the glossary and publication index with minimal administrative friction. When safety reports arrive, she needs a structured, evidence-preserving workflow that lets her act consistently and confidently without making ad hoc judgment calls.
*   **Key Constraints & Pain Points**:
    *   Has limited spare time; does not want to exchange dozens of feedback emails with authors for a simple edit.
    *   Wants to write concise summaries of long glossary debates without breaking layout pages.
    *   Terrified of making permanent mistakes; requires a system that preserves revision history so she can easily rollback accidental changes.
    *   Uncertain how to handle edge-case conduct disputes (e.g., repeated low-grade harassment) without a documented community policy and a clear escalation path to Adler (Admin) for cases beyond her authority.

### 2.4. The Task-Focused Operations Manager (Manager Role)
*   **Representative Profile**: **Laura**, a 39-year-old part-time university administrator who volunteers as the ASC Treasurer.
*   **Relationship to ASC**: Executive Officer. Appointed as the Manager for memberships, payments, and event lists.
*   **Core Motivations**: Wants to quickly audit annual dues, identify expired memberships, resolve billing discrepancies, and view native, print-ready treasury and membership reports for board meetings (such as the *Annual Dues & Membership Revenue Ledger*, the *Membership Cohort & Tier Distribution Census*, and the *Mailing List Sync & Google Workspace Audit*).
*   **Key Constraints & Pain Points**:
    *   Possesses general digital literacy but has **zero database or coding skills**. 
    *   Terrified of command-line interfaces, terminal prompts, or running raw container scripts.
    *   Extremely busy; needs a dashboard that prioritizes urgent tasks (like failed renewals or pending applications) so she can log in, resolve them in 5 minutes, and log out.
    *   Previously managed member records in spreadsheets and experienced data corruption from misaligned columns. The new system should eliminate this exposure entirely — Laura should never need to handle a CSV or database file again.

### 2.5. The Strategic System Administrator (Administrator Role)
*   **Representative Profile**: **Adler**, the volunteer VP of Electronic Publications for the ASC.
*   **Relationship to ASC**: System Architect. Responsible for the CKH infrastructure.
*   **Core Motivations**: Wants to sustain low-cost hosting and maintenance within the non-profit's modest budget (~$10/month), ensure strict privacy compliance (GDPR/CCPA/LGPD), and simplify system handovers for the volunteer board.
*   **Key Constraints & Pain Points**:
    *   Inherited a bloated, brittle multi-service stack that crashed frequently.
    *   Spends too much time manually updating security patches on third-party WordPress plug-ins.
    *   Worried about holding sensitive payment information locally; demands complete PCI compliance.

---

## 3. Jobs to Be Done (JTBD) Catalog

We organize our JTBD framework around the core emotional, functional, and social "jobs" the system must perform, using the standard format:  
*“When I [Situation], I want to [Action], so that I can [Expected Outcome].”*

### 3.1. Discoverability & Learning Jobs (Curious Inquirer & Member)
*   **JTBD-1 (Glossary Navigation)**:
    *   *When I* am reading an academic systems paper and run into a dense term like "circularity,"
    *   *I want to* query a fast, mobile-friendly cybernetics glossary that compiles historical definitions and philosophical quotes,
    *   *So that I can* understand the concept's conceptual evolution without getting bogged down by academic paywalls.
*   **JTBD-2 (Ego-Network Discovery)**:
    *   *When I* find an inspiring paper on the platform,
    *   *I want to* click on the author's tag and immediately see a list of related researchers, active groups, and similar publications,
    *   *So that I can* follow the thematic thread of the research without searching blindly across the web.
    *   *Graph-ready note:* Discovery surfaces relationships between Members, Resources, and Tags. The data model must distinguish **declared** interests (member-stated on their profile), **curated** associations (moderator-tagged on a resource), and **activity-based** signals (bookmarked, read, commented) to ensure relationship provenance is preserved and each relationship type can be governed independently for privacy and trust.

### 3.2. Collaboration & Profile Jobs (Active Member)
*   **JTBD-3 (Collaborator Matching)**:
    *   *When I* am launching a new research project on second-order cybernetics,
    *   *I want to* query the directory for members who share adjacent interests and view their linked publications,
    *   *So that I can* invite them to collaborate based on a clear, explainable match.
    *   *Matching boundary:* Matching must operate exclusively on **declared** and **curated** relationships. Inferred or activity-based signals must not be used for member matching without explicit opt-in consent. Matching results must never expose a member's private profile fields, and members who have toggled privacy via JTBD-5 must be excluded from all matching queries.
*   **JTBD-4 (Interactive Scholastic Profile)**:
    *   *When I* update my academic roster or publish a new article,
    *   *I want to* link that specific Knowledge Hub resource directly onto my personal profile,
    *   *So that I can* establish my scholarly contribution and identity within the ASC digital community.
*   **JTBD-5 (Privacy Autonomy)**:
    *   *When I* am on sabbatical or overwhelmed with university work,
    *   *I want to* toggle my profile visibility to "private" and opt-out of matching suggestions,
    *   *So that I can* stop receiving collaboration requests and protect my personal time without cancelling my membership.

### 3.3. Content Stewardship & Moderation Jobs (Moderator)
*   **JTBD-6 (Frictionless Editing)**:
    *   *When a member* submits a glossary entry that has minor formatting or citation errors,
    *   *I want to* flag the specific fields, type a brief review note, and send it back to the member for revision,
    *   *So that I can* maintain a high level of scholastic quality without having to rewrite their submission myself.
*   **JTBD-7 (Safe Content Reversal)**:
    *   *When a member* accidentally overwrites or corrupts a collaboratively edited resource page,
    *   *I want to* access a secure version history and restore the page to its previous state in one click,
    *   *So that I can* safeguard our curated assets from accidental loss.

### 3.4. Operational Efficiency & Financial Jobs (Manager & Admin)
*   **JTBD-8 (Frictionless Onboarding)**:
    *   *When a non-member* submits an application to join the ASC,
    *   *I want to* review their details in a clean, prioritized approval queue,
    *   *So that I can* approve their application and trigger their automated Stripe invoice without exchanging multiple manual emails.
*   **JTBD-9 (Manual Member Record Creation)**:
    *   *When* a member needs to be added to the system who did not self-register — for example, a Lifetime member who paid by cheque at a conference, a Fellow appointed by the executive board, or an Emeritus member granted non-paying honorary status,
    *   *I want to* create their record directly via a validated admin form that captures all required profile fields and assigns the appropriate membership tier and status,
    *   *So that* the member has a complete, active account without needing to go through the self-registration or Stripe payment flow.
    *   *Access levels:* Adler (Admin) can create any membership tier including Fellow and Emeritus. Laura (Manager) can create Regular, Student, and Affiliate records only; Fellow and Emeritus creation is reserved for admin-level access.
*   **JTBD-10 (Treasury & Membership Reporting)**:
    *   *When I* prepare for an ASC board meeting or audit annual activity,
    *   *I want to* view native, professionally formatted, and print-ready reports within the admin dashboard—such as the *Annual Dues & Membership Revenue Ledger*, the *Membership Cohort & Tier Distribution Census*, and the *Mailing List Sync & Google Workspace Audit*,
    *   *So that I can* present accurate financial and membership audits to the board and verify system synchronization without exporting, formatting, or touching a CSV or spreadsheet file.
    *   *Billing troubleshooting:* This includes searching a member's ID to view their live Stripe invoice history and transaction log natively inside the dashboard to diagnose billing discrepancies or failed payments.
*   **JTBD-11 (System Handover & Low-Cost Maintenance)**:
    *   *When a new volunteer board* takes office every three years,
    *   *I want to* hand over a lightweight, unified application codebase backed by a secure design decision log and clear API documentation,
    *   *So that the new team* can sustain low-cost hosting and maintenance affordably without requiring advanced systems engineering expertise.
*   **JTBD-12 (Advisory Administrative Assistance)**:
    *   *When I* am logged into the admin portal and faced with pending reviews, expired memberships, or operational questions,
    *   *I want to* consult an advisory, draft-oriented Administration Support Agent to summarize pending tasks, explain system alerts, and draft renewal reminders,
    *   *So that I can* run the system safely and quickly without requiring manual database queries or coding skills.
*   **JTBD-16 (Guided Legacy Data Migration)**:
    *   *When I* need to migrate historical member records into the new CKH from a legacy data export that may be incomplete, inconsistently formatted, or missing required fields,
    *   *I want to* work interactively with a schema-aware Migration Support Agent that reads the export, maps columns to the new data model, flags gaps, and asks me targeted questions to resolve ambiguous or missing values,
    *   *So that* the migration produces complete, validated member records that I can review and confirm before any database write occurs — without requiring me to manually reformat every record.
    *   *Scope:* This is a one-time operation performed by Adler (Admin) only, under a dedicated Migration Tools interface not accessible in normal platform operations. The migration plan assumes ground-zero: the CKH begins empty and all historical records are ingested through this agent-assisted process. What data exists in legacy systems is unknown at this stage and will be assessed during the migration phase.

### 3.5. Community Safety & Enforcement Jobs (Moderator & Member)

*   **JTBD-13 (Community Safety Reporting)**:
    *   *When I* encounter content or behavior on the platform that feels harmful, abusive, harassing, or misrepresentative,
    *   *I want to* submit a brief, confidential report identifying the specific content or behavior and my reason for concern,
    *   *So that I can* escalate the issue to a moderator for review without needing to manage the situation directly or make the report publicly visible.
    *   *Scope:* Applies to all user-generated content areas including profile text, glossary submissions, publication entries, and collaboration requests. Reports are visible only to Jocelyn (Moderator) and Adler (Admin).
*   **JTBD-14 (Graduated Enforcement)**:
    *   *When I* have reviewed a substantiated member report and determined that a policy violation occurred,
    *   *I want to* select and apply a proportionate enforcement action from a structured set of options — warning, content removal, temporary access restriction, or account suspension — and log the evidence, my decision rationale, and the applicable policy clause,
    *   *So that I can* apply consistent, auditable community standards without acting arbitrarily, and so that a clear evidence trail exists if the action is later appealed or reviewed by the Administrator.
    *   *Escalation path:* Suspension-level actions and all appeals are escalated to Adler (Admin) for final decision. AI-assisted flagging may assist with prioritizing the review queue, but all final enforcement actions require Jocelyn's or Adler's explicit confirmation.
*   **JTBD-15 (Unintentional Content Correction)**:
    *   *When I* identify published content that appears to violate community norms but shows no apparent malicious intent — for example, a member from a different cultural context who was unaware that certain language or framing is considered inappropriate within this community,
    *   *I want to* temporarily hide the content from public view and send the member a private, non-accusatory educational message that explains the community norm and offers them the opportunity to revise or remove the content themselves,
    *   *So that I can* uphold community standards while preserving the member relationship, avoiding public shaming, and only escalating to JTBD-14 (Graduated Enforcement) if the member is unresponsive, dismissive, or the behaviour recurs.
    *   *Operational note:* This JTBD is grounded in documented incidents on the existing ASC portal where genuine community members — particularly those from non-English-speaking cultural contexts — posted content that was flagged as inappropriate without any apparent intent to harm. The correction pathway must feel supportive and educational, not punitive. Jocelyn initiates this proactively; it does not require a JTBD-13 report to trigger it.

---

## 4. Primary User Journeys (Step-by-Step Workflows)

We map the step-by-step UX/AX progression for eight critical, high-impact workflows within the CKH.

### Journey A: Membership Lifecycle & Secure Onboarding
*   **Actors**: Non-Member (Elena), Operations Manager (Laura)
*   **Pre-conditions**: Elena discovers the ASC definitions page and decides to apply for a Student Membership.

```
[Elena: Submits Application Form]
               │
               ▼
[Laura: Receives Notification & Reviews Queue]
               │
               ▼ (Approved)
[Stripe: Generates Secure Invoice & Emails Elena]
               │
               ▼
[Elena: Pays via Stripe Native Portal]
               │
               ▼
[System: Activates Member Account & Logs Dues]
```

1.  **Elena** navigates to the `/join` page on her mobile device. She selects "Student Membership" ($40) and fills out the application form (uploading her university credentials, and declaring her research tags: *design, conversational systems, cybernetics*).
2.  The system validates the inputs, creates a pending profile, and adds the application to Laura’s dashboard queue.
3.  **Laura** logs into the Admin Portal, opens the "Pending Applications" queue, views Elena's credentials, and clicks "Approve."
4.  The system calls the Stripe API to generate a secure customer invoice. An automated, well-branded email is sent to Elena containing the secure checkout link.
5.  **Elena** clicks the link on her phone, completing the PCI-compliant Stripe checkout natively without any off-site browser redirects.
6.  Stripe triggers a webhook confirming payment. The system immediately sets Elena's account status to `Active`, logs the dues in Laura's payments ledger, and sends Elena an automated welcome email with login credentials.

---

### Journey B: Scholarly Glossary Submission & Collaborative Moderation
*   **Actors**: Active Member (Dr. Aris), Glossary Moderator (Jocelyn)
*   **Pre-conditions**: Dr. Aris wants to submit a new entry for "Second-Order Cybernetics" to the Scholarly Glossary.

```
[Dr. Aris: Drafts Entry & Submits]
               │
               ▼
[Jocelyn: Receives Alert & Reviews Entry]
               │
               ▼ (Revisions Requested)
[Dr. Aris: Revises Highlighted Fields]
               │
               ▼
[Jocelyn: Reviews & Approves Published Entry]
```

1.  **Dr. Aris** logs into the CKH, navigates to the Glossary module, and clicks "Submit Entry." 
2.  He drafts the definition, inputs historical quotes, and attaches standard scholastic tags (*second-order cybernetics, circularity, reflexivity*). The draft is saved to the database with a status of `Draft_Pending_Review`.
3.  **Jocelyn** receives an administrative alert. She opens her "Glossary Review" queue, views Dr. Aris's submission, and notes that a key citation is missing.
4.  Jocelyn highlights the citation field, inputs a review note (*"Please add Glasersfeld 1995 reference here"*), and clicks "Request Revisions." The status changes to `Revision_Requested`.
5.  **Dr. Aris** receives an automated email. He clicks the link, opens his draft (where only the highlighted citation field is editable, showing Jocelyn's note), inserts the missing citation, and clicks "Resubmit."
6.  **Jocelyn** reviews the updated draft, confirms the citation is correct, and clicks "Approve & Publish." The status changes to `Published`. The entry is instantly visible on the public glossary, and the connection (*Dr. Aris -> Authored -> Glossary Entry*) is committed to the relational graph database.

---

### Journey C: Admin-Initiated Member Creation
*   **Actors**: Administrator (Adler) or Operations Manager (Laura)
*   **Pre-conditions**: A member needs to be added to the CKH who did not self-register via the `/join` flow. This covers appointed roles (Fellow, Emeritus), members who paid offline (cheque, cash at conference), and any case where the admin is creating the record on the member's behalf.
*   **Distinction from Journey A**: Journey A is member-initiated (the applicant submits their own form and pays via Stripe). Journey C is admin-initiated (an authorised operator creates the record directly).

```
[Adler or Laura: Opens Add Member Form]
               │
               ▼
[System: Validates Fields & Tier Permissions]
               │
               ▼
[System: Creates Record & Emails Welcome]
               │
               ▼
[Member: Receives Credentials & Completes Profile]
```

1.  **Adler or Laura** logs into the Admin Portal, navigates to "Member Operations," and clicks "Add Member."
2.  A validated form appears. Required fields: full name, email address, membership tier, membership status, and an optional internal admin note (e.g., *"Lifetime member — paid by cheque at ASC 2026 conference"*).
3.  **Tier permissions are role-enforced**:
    *   **Adler** can assign any tier, including Fellow (board-appointed) and Emeritus (age 70+ honorary). He can set payment status to *Offline Paid*, *Complimentary*, or *Pending*.
    *   **Laura** can create Regular, Student, and Affiliate records only. She must record a payment reference or mark the record *Pending Payment*. Fellow and Emeritus creation requires Adler.
4.  On submission, the system validates all fields. If the email address already exists in the database, the system blocks the duplicate and prompts the operator to search for and update the existing record instead.
5.  The system creates the member record, assigns the correct tier and status, and sends the new member an automated welcome email with a secure link to set their password and complete their profile.
6.  The action is logged in the immutable audit trail (*"Adler: Created Lifetime member record for [name] — offline payment noted, [date]"*).

---

### Journey D: Advisory Administrative Assistance (AI-Assisted Operations AX)
*   **Actors**: Operations Manager (Laura), Administration Support Agent (AI)
*   **Pre-conditions**: Laura logs in and needs to review expired member records and resolve skipped CSV rows.

```
[Laura: Views Dashboard & Failed Import Alert]
                       │
                       ▼
[Admin Agent: Analyzes Log & Explains Warnings]
                       │
                       ▼
[Admin Agent: Drafts Customized Renewal Mails]
                       │
                       ▼ (Approved by Laura)
[Laura: Clicks Send (Strict Human-in-the-Loop)]
```

1.  **Laura** logs into the Admin Portal and sees an alert: *"CSV Chapter Import: 12 rows were skipped due to formatting warnings."*
2.  She opens the **Administration Support Agent** panel. The Agent has already analyzed the skipped rows and presents a bulleted, friendly visual explanation (*"12 records were skipped because their country codes did not match standard ISO formats. Row 4 lists 'USA' instead of 'US', Row 8 lists 'Austria' instead of 'AT'"*).
3.  Laura asks the Agent: *"Identify which active members have memberships expiring within 30 days."*
4.  The Agent queries the relational database, summarizes the pending renewals, and presents a table of three members.
5.  Laura clicks *"Draft Renewal Notification."* The Agent generates three personalized, polite drafts citing the specific membership type and fee.
6.  **Strict Limits Verification**: The Agent is **strictly prohibited** from sending these emails autonomously, modifying member statuses directly, or deleting skipped records.
7.  Laura reviews the drafts in her mail client, modifies one, and clicks "Send." She manually flags the skipped CSV rows for follow-up. The transaction is logged in the system audit trail.

---

### Journey E: Member Profile Update & Related-Resource Discovery
*   **Actors**: Active Member (Dr. Aris)
*   **Pre-conditions**: Dr. Aris wants to update his declared research interests and explore the related content the platform surfaces.

```
[Dr. Aris: Edits Profile Tags]
               │
               ▼
[System: Re-indexes Discoverability Profile]
               │
               ▼
[System: Refreshes Related Resources Panel]
               │
               ▼
[Dr. Aris: Discovers Author → Views Profile]
               │
               ▼
[Dr. Aris: Drafts Collaboration Request (manual send)]
```

1.  **Dr. Aris** logs into the CKH and navigates to his member profile. He clicks "Edit Interests."
2.  He adds two new declared interest tags: *enactivism* and *second-order observation*. The system validates that these exist in the approved concept taxonomy and saves them, updating his discoverability index.
3.  The system refreshes a "Related Resources" panel on his profile dashboard, surfacing four glossary entries and two publications tagged with his new interests.
4.  Dr. Aris selects a publication, views its full entry, and notices it was authored by another ASC member who also lists *second-order observation* as a declared interest.
5.  He clicks the author's name and is directed to their public profile, which displays their declared interests, linked publications, and active groups — limited to fields the author has not set to private.
6.  A "Suggest Collaboration" action is available on the profile (visible only because the author has not opted out of matching via JTBD-5). Dr. Aris clicks it.
7.  The system generates a draft outreach message pre-populated with shared interest tags as context. The draft is **not sent automatically** — it is held in Dr. Aris's outbox for his review and explicit send confirmation.
8.  The outreach is logged by the system as a declared collaboration intent, creating a provenance record visible to moderators but not to the general public.

---

### Journey F: Failed Renewal Resolution (Billing Operations AX)
*   **Actors**: Operations Manager (Laura), Active Member (Dr. Aris)
*   **Pre-conditions**: Dr. Aris's annual membership has lapsed because his Stripe payment was declined. His account has been automatically downgraded to read-only access.

```
[Laura: Opens Renewal Issues Queue]
               │
               ▼
[Laura: Reviews Aris's Stripe Status]
               │
               ▼ (chooses grace period or resend)
[System: Extends Access or Resends Invoice]
               │
               ▼
[Dr. Aris: Pays via Stripe]
               │
               ▼
[Stripe Webhook: Restores Active Status & Logs Resolution]
```

1.  **Laura** logs into the Admin Portal. The dashboard's "Renewal Issues" module displays 3 accounts flagged for lapsed or failed memberships, sorted by expiry date.
2.  She clicks Dr. Aris's record. The detail view shows his membership tier, expiry date, and live Stripe invoice status: *"Payment Failed — card declined on May 15, 2026."*
3.  Laura reviews his account state (currently restricted to read-only) and chooses one of two available actions:
    *   **Option A — Extend Grace Period**: She clicks "Extend Grace Period (30 days)," enters a brief internal reason note, and confirms. The system sets a soft-expiry extension, logs the action in the immutable audit trail (*"Laura: 30-day grace period granted to Dr. Aris — payment failure pending resolution, May 24, 2026"*), and sends Dr. Aris an automated courtesy email explaining his grace window and next steps.
    *   **Option B — Resend Invoice**: She clicks "Resend Invoice." The system calls the Stripe API to regenerate and email a new secure payment link to Dr. Aris's registered address.
4.  **Dr. Aris** receives the email on his phone, clicks the Stripe link, and completes payment via the native Stripe checkout.
5.  Stripe fires a confirmation webhook. The system immediately updates Dr. Aris's account status to `Active`, removes any grace period or restriction flags, and logs the resolution in the audit trail. Laura's dashboard queue removes the item automatically.

---

### Journey G: Unintentional Content Correction (Proactive Moderation AX)
*   **Actors**: Glossary Moderator (Jocelyn), Active Member (any)
*   **Pre-conditions**: A member has self-published profile text or a repository contribution that Jocelyn identifies as violating community norms. The content is live. There is no indication of malicious intent — the member likely did not know the content was problematic.
*   **Distinction from Journey B**: Journey B is a pre-publication gate for new submissions. Journey G is a post-publication correction for content already visible to the community.

```
[Jocelyn: Identifies Problematic Live Content]
               │
               ▼
[System: Hides Content Pending Review]
               │
               ▼
[Jocelyn: Sends Private Educational Message]
               │
               ▼ (Member Responds)
[Member: Revises or Removes Content]
               │
               ▼
[Jocelyn: Reviews Revision & Restores or Approves]
               │
               ▼ (If No Response or Recurrence)
[Escalates to JTBD-14 Graduated Enforcement]
```

1.  **Jocelyn** is reviewing the moderation queue and notices a published member profile bio containing language that, while not malicious, is culturally inappropriate for the ASC community context (e.g., framing that is dismissive of certain research traditions, or informal language that a member from another academic culture did not realize reads as disparaging).
2.  She clicks "Hide Content" on the specific field. The content is immediately hidden from public and member view and set to a `Pending_Correction` status. The member's account remains fully active — only the flagged content is affected.
3.  Jocelyn clicks "Send Educational Note." She selects from a set of pre-drafted, community-standards-aligned message templates (e.g., *"Cultural Context"*, *"Tone and Framing"*, *"Community Norms"*) and customizes the message to:
    *   Name the specific content that was hidden (with a quoted excerpt).
    *   Explain the community norm it conflicts with, without accusation.
    *   Offer concrete guidance on how to revise it.
    *   Provide a link directly to the editable field.
    *   State the timeline: *"If you'd like to revise this within 14 days, I'll restore it immediately upon review."*
4.  The message is sent privately. The member receives it as an in-platform notification and email. The system logs the outreach in the audit trail (*"Jocelyn: Educational correction sent to [member] — content hidden pending revision, [date]"*).
5.  **The member** reads the note, understands the concern, navigates to their profile, and revises the flagged text.
6.  **Jocelyn** receives a notification that the member has submitted a revision. She reviews the updated content, confirms it meets community standards, and clicks "Restore & Approve." The content is immediately restored to `Published` status. The audit log records the resolution.
7.  **If the member does not respond within the stated window**, or disputes the correction in bad faith, or the same issue recurs, Jocelyn transitions the case to JTBD-14 (Graduated Enforcement) — beginning with a formal warning and a full evidence record already in place from the correction attempt.

---

### Journey H: Guided Legacy Data Migration (Agent-Assisted, One-Time)
*   **Actors**: Administrator (Adler), Migration Support Agent (AI)
*   **Pre-conditions**: The CKH has launched with an empty database. Adler has obtained whatever data export is available from the legacy system — which may be a partial CSV export from WordPress, a PayPal transaction history, a manually compiled spreadsheet, or a combination. The completeness and format of this data is unknown until the migration phase begins. The new CKH member schema is the authoritative target.
*   **Migration assumption**: The platform starts from ground zero. Members self-register via Journey A going forward. This journey is solely for ingesting historical records that predate the new system.

```
[Adler: Uploads Legacy Export to Migration Tool]
               │
               ▼
[Agent: Maps Columns to CKH Schema]
               │
               ▼
[Adler + Agent: Resolve Gaps Conversationally]
               │
               ▼
[Agent: Compiles Validated JSON Batch]
               │
               ▼
[Adler: Reviews Summary & Confirms Import]
               │
               ▼
[System: Writes Records & Generates Migration Log]
```

1.  **Adler** navigates to the "Migration Tools" section of the Admin Portal. This section is only accessible to Admin-level users and is not visible in normal day-to-day operations.
2.  He uploads the legacy data file (CSV, XLSX, or similar). The **Migration Support Agent** reads the file and performs an initial schema mapping — attempting to match legacy column headers to required CKH schema fields (name, email, membership tier, status, join date, payment reference, research interests).
3.  The Agent presents a mapping summary in a clear two-column table: *"I confidently matched 6 of 9 required fields. Here are the 3 fields I could not map automatically:"* [table showing unmatched legacy columns alongside candidate CKH fields]. Adler corrects any mismatches and confirms the mapping.
4.  The Agent processes each row against the confirmed mapping and identifies records with missing required values. Rather than generating a raw error list, it asks Adler targeted, record-specific questions in plain language:
    *   *"Row 23: Art Collings has no membership tier recorded. His PayPal history shows a $100 payment in 2023. Should I classify him as Regular? [Yes / Choose a different tier / Skip this record]"*
    *   *"Row 47: This email address already appears in row 12 under a slightly different name spelling. Are these the same person? [Yes, merge / No, keep both / Skip row 47]"*
5.  Adler works through the Agent's questions. Records where information cannot be determined — for example, members present in the legacy list with no payment history and no contact information — are marked `Migration_Pending` and flagged for manual follow-up after launch.
6.  Once all resolvable records are addressed, the Agent compiles the complete JSON import batch and presents a final summary before any data is written:
    *   *Confirmed for import: 312 records*
    *   *Migration Pending (require follow-up): 18 records*
    *   *Duplicates merged: 4 records*
    *   *Records skipped at Adler's request: 2 records*
7.  Adler reviews the summary, inspects any flagged duplicates, and clicks "Confirm Migration." The records are written to the database in a single transaction. Any failure rolls back the entire batch — no partial imports.
8.  The system generates a detailed, immutable migration log accessible only to Adler in the Admin Portal, recording every mapping decision, agent question, and Adler's response. This log serves as the provenance record for all migrated data.
9.  **After the migration is complete**, Adler marks the Migration Tools section as locked to prevent accidental re-use. Members imported via this route receive an email inviting them to log in, verify their profile, and set a new password.

---

## 5. Non-Functional Requirements Mapped to UX/AX

To ensure that user and admin experiences remain high-quality, we map critical non-functional parameters directly to interface goals:

*   **Responsive Skeleton Screens**: To maintain perceived performance during data loading (per Nielsen Norman guidelines), all search queries, repository listings, and admin dashboards must render **Skeleton Screens** within **0.5 seconds**, even if database fetching takes up to 2 seconds.
*   **Form Auto-Save**: When a member is drafting a long repository entry or biography, the editor must automatically save the text to local storage every **30 seconds** to prevent data loss due to session timeouts or network drops.
*   **Granular Visual Feedback**: Every administrative action (role changes, CSV uploads, payment resolutions) must trigger a clear, temporary status toast at the top of the screen displaying the action's success or failure, avoiding confusing page reloads.

---
*Specification Catalog completed on May 24, 2026, by the ASC Digital Transition Team.*

---

## 6. Traceability Matrix: Mapping JTBD to New System Capabilities

To ensure that the Collaborative Knowledge Hub remains focused and free of technical bloat, every human-centric **Job to Be Done (JTBD)** directly maps to the **New Capabilities** defined in our Strategic Transition Report:

| Job to Be Done (JTBD) | Mapped Persona | New Platform Capability | Operational & UX Mechanism |
| :--- | :--- | :--- | :--- |
| **JTBD-1 (Glossary Navigation)** | Elena (Public) | **Dynamic Repositories & Responsive Layouts** | Glossary entries are stored in a schema-defined SQL repository and rendered using modern fluid layouts, ensuring fast, mobile-accessible viewing. |
| **JTBD-2 (Ego-Network Discovery)** | Elena (Public) | **Graph-Ready Database Schema** | Relational mappings trace authors and resources, enabling the system to render simple, explainable relative lists ("Related Publications") without canvas bloat. |
| **JTBD-3 (Collaborator Matching)** | Dr. Aris (Member) | **Explainable AI Matching** | Matching algorithms compute adjacent interests using profile tags, outputting clear, natural language reasons (e.g., *"You both list second-order cybernetics"*). |
| **JTBD-4 (Interactive Profile)** | Dr. Aris (Member) | **Connected Resource Mappings** | Members can link glossary entries, publications, and initiatives directly onto their profiles by establishing a provenanced SQL connection. |
| **JTBD-5 (Privacy Autonomy)** | Dr. Aris (Member) | **Granular Visibility & Opt-out Controls** | Members can toggle discoverability off, instantly purging their ID from search indexes and matching queues without cancelling memberships. |
| **JTBD-6 (Frictionless Editing)** | Jocelyn (Moderator) | **Draft-Moderation Submission Pipeline** | A robust draft-revision-publish queue allows Jocelyn to flag specific fields, add review notes, and request corrections natively inside the portal. |
| **JTBD-7 (Safe Reversal)** | Jocelyn (Moderator) | **Audit Trail & Revision History** | Jocelyn can access comprehensive version histories of collaboratively edited resources and rollback accidental overrides in a single click. |
| **JTBD-8 (Frictionless Onboarding)** | Laura (Manager) | **Stripe API Native Payment Webhooks** | Approving a membership application automatically calls Stripe to email a secure invoice. Paying active status is triggered via Stripe webhooks natively. |
| **JTBD-9 (Manual Member Creation)** | Adler (Admin) or Laura (Manager) | **Admin-Initiated Member Form** | Adler or Laura can create a member record directly via a validated admin form. Tier permissions are role-enforced: Adler can assign any tier including Fellow and Emeritus; Laura is limited to Regular, Student, and Affiliate. Duplicate email detection prevents double-entry. |
| **JTBD-10 (Treasury & Membership Reporting)** | Laura (Manager) | **Native Administrative Dashboards & Ledgers** | Native billing logs, member status counters, sync state audits, and Stripe transaction ledgers are compiled into clear, print-ready dashboards natively, removing the need to touch CSVs or external portals. |
| **JTBD-11 (System Handover & Low-Cost Maintenance)** | Adler (Admin) | **Unified Next.js + PostgreSQL Stack** | Postponing separate Python backend stacks ensures the system runs affordably (~$10/mo) on a single VPS and remains easy to maintain by volunteer boards, directly fulfilling the need to sustain low-cost hosting and maintenance. |
| **JTBD-12 (Advisory Assistance)** | Laura (Manager) | **Administration Support Agent** | An advisory, draft-oriented AI utility summarizes pending tasks, explains system alerts, and drafts notifications with a strict human-in-the-loop lock. |
| **JTBD-13 (Safety Reporting)** | Any Member | **Community Safety Reporting Interface** | Any authenticated member can submit a confidential report flagging harmful content or behavior; reports are routed to Jocelyn's moderation queue, hidden from the public and from the reported member. |
| **JTBD-14 (Graduated Enforcement)** | Jocelyn (Moderator) | **Enforcement Workflow & Audit Trail** | Jocelyn selects from a structured set of proportionate actions (warning → removal → restriction → suspension), logs her rationale and policy basis, and escalates suspension-level decisions to Adler. All actions are immutably logged. |
| **JTBD-15 (Unintentional Correction)** | Jocelyn (Moderator) | **Content Hiding & Educational Outreach Workflow** | Jocelyn can hide specific published content fields without suspending the member's account, send a private educational message from a pre-drafted template, and restore content upon satisfactory revision. |
| **JTBD-16 (Guided Migration)** | Adler (Admin) | **Migration Support Agent** | A one-time, schema-aware agent reads a legacy data export, maps columns to the CKH schema, asks Adler targeted questions to fill gaps, and compiles a validated JSON batch for Adler's review before any database write. |
