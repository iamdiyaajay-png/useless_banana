# BananaPrint & Identity Verification

## Overview
The National Banana Registry employs an experimental, deterministic visual identity signature called **BananaPrint**. This system calculates a feature signature from computer vision outputs to facilitate similarity-based identity matching of unknown specimens against the registry.

> [!IMPORTANT]
> BananaPrint is a **visual identity signature**, not a biological biometric identifier. It operates strictly on observable physical characteristics extracted from a single 2D photograph.

## Methodology

### 1. Feature Extraction & Normalization
The Identity Matching service relies on the same client-side OpenCV.js pipeline used in the primary Analysis Engine.

The extracted features are normalized to a stable representation:
- **Curvature Angle**: Extracted as a 2D geometric deviation and normalized to a two-digit percentage `[00-99]`.
- **Straightness Index**: Extracted from tip-deviation constraints and normalized `[00-99]`.
- **Ripeness Percentage**: Estimated via HSV thresholding and normalized `[00-99]`.

### 2. Signature Generation
The features are concatenated into a deterministic comma-separated string (e.g., `42,76,35`). 
An MD5 hash of this `featureSignature` is generated to serve as the reference ID (e.g., `BP-A82F-91BC-774D`). This ID is permanently stored in the `Banana` registry profile, alongside the plaintext signature.

### 3. Similarity Algorithm
When an unknown specimen is submitted for Verification:
1. The OpenCV.js pipeline extracts the new specimen's visual features in real-time.
2. The normalized features are submitted to the `/actions/match` service.
3. The server computes a Weighted Difference against all registered BananaPrints:
   - **Shape Weight (70%)**: Curvature and Straightness are considered relatively stable morphological traits of a given banana.
   - **Color Weight (30%)**: Ripeness is a highly temporal trait and thus weighted lower for long-term identity matching.
4. The difference is subtracted from `100` to yield a **Similarity Score**.

### 4. Classification Thresholds
Candidate matches are categorized deterministically using the following system-defined thresholds:
- `> 95%`: **VERY HIGH SIMILARITY**
- `> 85%`: **HIGH SIMILARITY**
- `> 70%`: **MODERATE SIMILARITY**
- `< 70%`: **NO SUFFICIENT MATCH**

If no candidate scores above 70%, the system will explicitly reject the identification attempt to prevent forced matching.

## Known Limitations
- **Temporal Degradation**: Because bananas change rapidly, a BananaPrint taken on Day 1 will slowly lose similarity over time due to the 30% Ripeness weight.
- **2D Projection Dependency**: The shape signature is entirely dependent on the camera angle. Rotating the same banana 90 degrees toward the camera will drastically alter its extracted curvature, resulting in a false-negative match.
- **Lighting Sensitivity**: Variances in ambient lighting will shift the perceived HSV ripeness signature.
