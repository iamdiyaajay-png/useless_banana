# Document Vault & Certification System

## Architecture Overview
The Document Vault centralizes the generation of all official certificates for the National Banana Registry. It utilizes a unified server-side generation service (`src/app/actions/documents.ts`) ensuring deterministic numbering, versioning, and database persistence.

Instead of relying on fragile headless browsers or heavy external PDF dependencies, the Vault renders documents natively in React using highly structured Print CSS (`@media print`). This ensures flawless visual consistency, responsive rendering, and zero-dependency PDF downloads via the browser's native print engine.

## Supported Document Types

1. **Banadhaar (Banana Identity Card)**: `BNR/ID/`
2. **Certificate of Registration**: `BNR/REG/`
3. **Certificate of Birth**: `BNR/BC/`
4. **Physical Analysis Report**: `BNR/BIA/`
5. **Variety Assessment Report**: `BNR/VAR/`
6. **Certificate of Compatibility**: `BNR/DAT/`

## Deterministic Numbering & Versioning
Each document number is generated deterministically based on the year and the specimen's unique registration suffix.

**Example**:
If a banana's registration is `BNR-KL-2026-004821`:
- A new Birth Certificate is generated as: `BNR/BC/2026/004821`
- If underlying data is updated and the document is regenerated, the old document's status transitions to `EXPIRED`, and the new one is issued as `BNR/BC/2026/004821-V11`.

## Security & Verification
Every generated document automatically receives an encrypted Verification Code appended as a QR link (e.g. `http://localhost:3000/verify/document/[code]`). This ensures the digital/paper copy can always be traced back to the immutable SQLite Registry.

## Generating the Complete Banana File
The system supports compiling all active (`VALID`) certificates for a given specimen into a single master document (`NBR/COMPLETE/`). The templates utilize CSS `page-break-after: always;` to stitch the components sequentially, allowing the entire official record to be saved as a single multi-page PDF document.

> [!CAUTION]
> The Registry documents intentionally feature the wording: "This is a fictional digital registry system and is not an official government service" to prevent accidental misrepresentation of the hackathon project as legitimate state bureaucracy.
