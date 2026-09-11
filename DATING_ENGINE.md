# Banana Dating & Compatibility Engine

## Overview
The National Banana Registry's Compatibility Division operates a deterministic culinary matchmaking engine. It pairs registered bananas with potential food partners based on structured compatibility data. 

> [!IMPORTANT]
> Compatibility scores are project-defined computational estimates for demonstration and are not scientific measurements. No generative AI is used to produce numerical scores; all evaluations are 100% deterministic to guarantee reproducibility.

## Matchmaking Algorithm

The `calculateCompatibility()` engine evaluates candidate partners using a weighted factor formula. All base inputs are derived from the structured `FoodPartner` profiles seeded in the database.

### Weighted Factors
The system applies the following weights to the partner's compatibility attributes to generate an overall percentage `[0-100]`:
- **Traditional Pairing (30%)**: The cultural/historical precedence of the pairing (e.g. Banana + Puttu).
- **Taste Chemistry (25%)**: Flavor profile complementarity.
- **Texture Alignment (15%)**: Contrast and harmony in mouthfeel.
- **Pairing Frequency (10%)**: The empirical popularity of the pairing.
- **Partner Stability (10%)**: Baseline stability of the food partner.
- **History Score (10%)**: Extracted from the partner's previous dating history success rate.

### Risk Assessment Engine
Independent of compatibility, the system determines Relationship Risk based on the partner's `redFlags` and `datingHistory` records:
- **LOW**: No previous relationships recorded, no major red flags.
- **MODERATE**: Previous relationships present or at least one red flag.
- **HIGH**: Complicated relationship status (e.g. `COMPLICATED`), multiple red flags, or history involving disputes.

## Audit & Verification Integration
When a match is successfully accepted:
1. The Banana's `relationshipStatus` shifts to `IN_RELATIONSHIP`.
2. A formal `Relationship` record is appended to the database.
3. Two `AuditEvent` logs are fired:
   - `MATCH_ACCEPTED` (Dating Engine tracking)
   - `RELATIONSHIP_STARTED` (Life Record tracking)
4. The system updates the Registry Dashboard to visually link the new partner.

## Known Limitations
- The system currently treats all bananas as having identical taste profiles for the baseline calculation. Future integration with the Step 3 CV Analysis Engine could dynamically adjust weights (e.g., heavily curved bananas pairing better with Chapathi wraps).
- The partner pool is currently limited to the 15 verified South Indian culinary candidates seeded into the SQLite database.
