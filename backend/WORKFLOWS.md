# CSC Center Service Workflow Architecture (Phase 13)

## Overview
Service workflow rules, document requirement ordering, and state machine transition guarantees.

---

## 1. Controlled Status Transitions
- Valid status values: `pending`, `under_review`, `document_required`, `approved`, `completed`, `rejected`.
- Allowed State Machine Transitions:
  - `pending` -> `under_review`, `rejected`
  - `under_review` -> `document_required`, `approved`, `rejected`
  - `document_required` -> `under_review`
  - `approved` -> `completed`

---

## 2. Requirement Snapshots
- When an application is created, the system snapshots the required document list, service fee, and workflow rules.
- Updating service settings does NOT retroactively alter historic application requirements.
