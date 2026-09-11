# Banana Verification & Authentication Portal

## Architecture Overview
The Verification System is built upon a single, unified backend authority: `verifyRecord()` (located in `src/app/actions/verify.ts`). This ensures that no matter how a specimen or document is verified, the underlying status checks and database integrity queries follow exactly the same logic.

## Supported Verification Methods

1. **Banana ID** (e.g., `BNR-KL-2026-004821`)
2. **Registration Number** (e.g., `REG-2026-004821`)
3. **Document Number** (e.g., `BNR/REG/2026/004821`)
4. **QR Reference Scanning** (e.g., the URL on a printed Banadhaar)
5. **Specimen Image Visual Matching** (Utilizing the experimental BananaPrint visual identity signatures)

## QR Security & Navigation
Documents generated in the Document Vault embed an encrypted `verificationCode` tied to a specific URL (e.g., `/verify/document/A8B9C1`). 

When scanned by a Judge, this URL resolves to a highly structured `DIGITAL DOCUMENT VERIFICATION` endpoint that executes `verifyRecord('QR_REFERENCE', code)`. The page explicitly separates the **Integrity of the Document** from the **Status of the Record**, highlighting if a previously authentic certificate has now `EXPIRED` or been `REVOKED` by the registry.

## Database & Life Record Integration
Every verification check acts as a first-class citizen inside the Banana's historical Life Record. Whether an official types in the Registration Number, or a scanner reads a Banadhaar, an `AuditEvent` (`BANANA_ID_VERIFIED`, `QR_VERIFIED`, etc.) is appended to the specimen's timeline. This allows total tracking of how often a specimen is identified in the wild.

## Public Security Measures
The Verification Portal only returns the safe subset of data necessary to confirm identity (Name, Registry Status, Dates, ID strings). It does not expose:
- Raw OpenCV heuristic analysis objects
- Internal relation mapping IDs
- Cryptographic keys or database credentials
- The complete list of unselected matchmaking partners

## Visual Specimen Pipeline
The Visual Matching tab seamlessly wraps the `MatchEngine` built during Step 4. When a user uploads a new banana photo into the Verification Portal, the system runs the OpenCV morphological transformations, extracts the BananaPrint feature matrix, and checks for candidates matching above the required confidence threshold.
