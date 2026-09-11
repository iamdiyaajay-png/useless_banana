# Database Data Model

The application uses SQLite managed via Prisma ORM. 
The central entity is `Banana`, and all modules revolve around it.

## Entities

### `Banana`
The core entity representing a registered subject.
- **Identifiers**: `id` (UUID), `registrationNumber` (BNR-KL-...).
- **Attributes**: `officialName`, `nickname`, `photo`, `origin`, `scientificClassification`.
- **Extensibility**: Has optional fields (`bananaPrintId`, `currentPartnerId`) to support future modules.

### `Analysis`
Tracks measured vs. AI-estimated values.
- **Relations**: Belongs to `Banana` (`bananaId`).
- **Measurements**: `length`, `width`, `curvature`, `ripeness`.
- **Metadata**: `analysisMethod` distinguishes between human physical measurement and AI estimation.

### `FoodPartner`
Seed data structure for dating partners.
- **Attributes**: `name`, `personalityType`, `greenFlags`, `redFlags`.

### `Relationship`
Tracks compatibility and dating status between a Banana and a FoodPartner.
- **Relations**: Belongs to `Banana` and `FoodPartner`.
- **Metrics**: `compatibilityScore`, `status`, `riskLevel`.

### `Document`
Tracks official certificates and IDs.
- **Relations**: Belongs to `Banana`.
- **Attributes**: `documentNumber` (generated), `documentType`, `status`.

### `AuditEvent`
Centralized logging for all major events.
- **Relations**: Belongs to `Banana`.
- **Attributes**: `eventType`, `description`, `source`.
