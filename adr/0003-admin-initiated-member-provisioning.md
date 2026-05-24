# ADR 0003: Admin-Initiated Member Provisioning

## Status
Accepted

## Context
While the primary onboarding path for the Collaborative Knowledge Hub will be self-serve via the `/join` page (Phase 3) integrating Stripe payments, the administration team requires a manual bypass. This is necessary for migrating legacy lifetime members, granting complimentary access, or assisting users who cannot navigate the self-serve flow.

## Decision
We will build a manual member provisioning form at `/admin/members/new`. The decision logic for the provisioning workflow is as follows:

1. **Authentication Strategy**: 
   - We utilize Supabase's `admin.createUser` method server-side to bypass email verification requirements during manual entry. 
   - A secure, randomized temporary password will be generated automatically, or the admin can send a magic link for the user's first login.
2. **Stripe Bypass**: 
   - The manual form allows the admin to set the `stripe_customer_id` to `comped_lifetime` or leave it null, effectively decoupling the account from billing suspensions.
3. **Data Integrity**: 
   - The form requires strict enforcement of the `user_role` (Member, Moderator, Manager, Admin) to prevent accidental escalation of privileges during bulk migrations.
4. **GDPR Defaults**: 
   - Admin-created profiles default to `discoverability_opt_in = false`. The member must explicitly toggle this to true upon their first login.

## Consequences
- **Positive**: Administrators have complete autonomy over the membership roster without relying on automated webhook constraints. Legacy transitions can be handled seamlessly.
- **Negative**: Adds backend complexity to reconcile "comped" members against actively paying members in financial reports.
