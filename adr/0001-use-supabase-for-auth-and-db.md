# ADR 0001: Use Supabase (PostgreSQL & GoTrue) over Custom FastAPI Backend

## Status
Accepted

## Context
The legacy student Capstone project (SRS v1.2) proposed a separate FastAPI (Python) backend to serve a Next.js frontend, citing future graph queries and AI scrapers. However, operating a multi-tier microservice architecture places severe maintenance burdens on a volunteer-run non-profit (ASC). Thomas J. McLeish’s architectural critique highlighted that such a stack was over-engineered for the MVP and introduced operational friction.

## Decision
We will use **Supabase** (managed PostgreSQL, GoTrue Auth, and Edge Functions) as the unified backend for the Collaborative Knowledge Hub (CKH) MVP, directly queried by the Next.js frontend. 

We explicitly reject the creation of a separate FastAPI/Python backend for the MVP.

## Rationale
1. **Operational Simplicity**: A single managed database platform drastically reduces the infrastructure surface area. Volunteers do not need to manage Docker containers or sync backend deployments.
2. **Graph-Readiness**: PostgreSQL is fully capable of modeling graph-ready relationships (Members <-> Resources) using standard SQL constraints and joins. A dedicated graph database or separate backend is unnecessary for the MVP.
3. **Security out-of-the-box**: Supabase GoTrue handles secure JWT sessions and password hashing, while PostgreSQL Row Level Security (RLS) safely enforces privacy boundaries at the database layer.

## Consequences
- **Positive**: Drastically reduced hosting costs and maintenance overhead. Faster MVP iteration speed.
- **Negative/Risk**: If highly specialized graph traversal queries (e.g., deeply nested network pathfinding) become necessary in the future (Level 2 Roadmap), PostgreSQL queries may become complex. If this occurs, we can offload those specific queries to a Python worker later, rather than burdening the MVP now.
