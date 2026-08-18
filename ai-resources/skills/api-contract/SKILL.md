---
name: api-contract
description: Use when implementing or consuming SPMI API endpoints, including pelaksanaan audit, filters, units, response types, loading states, and API-backed UI.
---

# API Contract

Before implementing an API integration, read `docs/api-contract.md` and the matching response example in `ai-resources/knowledge/api-responses/`.

## Required Workflow

1. Identify the endpoint, request query parameters, and response example before writing UI or types.
2. Define frontend types from the documented response. Preserve field names, nesting, and value types exactly.
3. For audit implementation data, use `period_id` and `unit_id` as optional query parameters for `GET /api/implementations`.
4. Load filter options from `GET /api/periods` and `GET /api/units`; do not hardcode program study options in the UI.
5. Format `filling_date.start` and `filling_date.end` as ISO 8601 datetimes, and treat `filling_progress` as a number from `0` through `100`.
6. Implement loading, error, empty, and filtered-result states.

## Rules

- Do not invent, rename, flatten, or omit response fields.
- Do not infer API values from Figma or static UI text.
- Use the JSON examples as the canonical shape for mock data and frontend integration.
- If the required data is absent from the documented contract, stop and ask for clarification.
