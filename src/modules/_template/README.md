# Module template — copy this folder when adding a new feature domain.
#
# Each module is a self-contained vertical slice:
#
#   <module>.routes.ts      → Express router (HTTP layer)
#   <module>.controller.ts  → Request/response handling
#   <module>.service.ts     → Business logic
#   <module>.repository.ts  → Raw SQL via pool.query()
#   <module>.types.ts       → TypeScript interfaces & DTOs
#   <module>.validators.ts  → Input validation schemas
#   index.ts                → Public exports for the module
#
# Data flow:
#   routes → controller → service → repository → PostgreSQL
