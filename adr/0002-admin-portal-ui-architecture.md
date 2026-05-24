# ADR 0002: Admin Portal UI Architecture and Reporting Design

## Status
Accepted

## Context
Phase 2 of the Collaborative Knowledge Hub (CKH) implementation requires a robust Administrative Core for the organization's volunteers (e.g., Adler, Laura). The legacy systems relied on disjointed CSV exports and manual database queries. The new requirement dictates native, in-app UI for Treasury and Membership reporting without manual file handling.

## Decision
We will build the Admin Portal interfaces using Next.js App Router server components coupled with `shadcn/ui` for accessible client-side interactivity. The decision logic for the specific data points displayed follows established best practices for non-profit and membership portal administration.

### 1. Membership Report UI Data Points
To minimize cognitive load while providing comprehensive oversight, the primary Membership table will expose:
- **Member Name & Email**: Primary identifiers.
- **Role**: (Member, Moderator, Manager, Admin) for governance oversight.
- **Join Date**: Crucial for tracking organizational growth and anniversary campaigns.
- **Status (Discoverability)**: Indicates whether the member has opted into the public directory, respecting GDPR/CCPA compliance visually.
- **Subscription/Dues Status**: Immediate visual indicator of active vs. lapsed Stripe subscriptions.

### 2. Treasury Report UI Data Points
The Treasury dashboard focuses on aggregate health and recent transactional activity to support financial officers (Laura):
- **Aggregate Metrics**: Total Active Members, Monthly Recurring Revenue (MRR), and Recent Cancellations.
- **Recent Transactions Ledger**: A chronological table showing Date, Member, Amount, and Status (Succeeded/Failed).
- **Export Independence**: While the data is natively viewed in-app, filtering capabilities will be built into the UI to prevent the need for manual CSV manipulation whenever possible.

### 3. Component Architecture
- We will leverage `shadcn/ui` tables, cards, and badges.
- Data fetching will occur securely on the server side (via Next.js Server Components connecting directly to Supabase), ensuring administrative data never leaks to unauthorized client sessions.

## Consequences
- **Positive**: Volunteers can manage the organization entirely from a web browser. The UI is highly accessible and maintains a strict server/client boundary for security.
- **Negative**: Requires building robust filtering and pagination logic within the application layer rather than relying on spreadsheet software sorting.
