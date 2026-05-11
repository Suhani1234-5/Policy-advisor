# PRD — AI-Powered Insurance Recommendation Platform
**Author:** Suhani

---

## 1. User Profile

**Primary user:** Ramesh, 43 years old, Tier-2 city (Nagpur), 
annual income 3–8L, diagnosed with Type 2 Diabetes 2 years ago. 
He has never purchased health insurance. He avoids the process 
because he fears rejection due to his pre-existing condition, 
does not understand terms like "waiting period" or "co-pay", 
and feels overwhelmed by comparison websites that show 50 plans 
with no guidance.

**What he fears most:** "Will they cover me at all? Will I be 
cheated with fine print I didn't understand?"

**Health literacy:** Low to moderate. Comfortable with 
smartphones, uncomfortable with insurance jargon.

---

## 2. Problem Statement

Indians choosing health insurance face three compounding problems:

1. **Jargon overload** — terms like sub-limit, co-pay, and 
   waiting period are never explained at point of decision.

2. **Pre-existing condition anxiety** — users with diabetes, 
   hypertension, or cardiac conditions fear disclosing their 
   status, leading to wrong policy selection and future 
   claim rejections.

3. **Generic comparisons** — existing platforms (PolicyBazaar, 
   Coverfox) show all plans equally with no personalised 
   filtering by health profile or city-tier network quality.

A recommendation engine solves this by treating the user's 
health situation as the *starting point*, not an afterthought.

---

## 3. Feature Priority

| Priority | Feature | Rationale |
|----------|---------|-----------|
| P0 | 6-field profile form | No recommendation without profile |
| P0 | RAG-grounded AI agent | Core differentiator — no hallucination |
| P0 | 3-section recommendation output | Directly evaluated |
| P1 | Chat explainer with session memory | High score impact |
| P1 | PRD + README reasoning | 35% of evaluation score |
| P2 | Admin panel (upload/delete) | Required but lower complexity |
| P3 | Unit tests | Signal of professionalism |

---

## 4. Recommendation Logic (plain English)

Given a user profile with 6 fields, the agent:

**Step 1 — Filter by pre-existing conditions**
Policies with waiting periods > 24 months for the user's 
specific condition are flagged, not hidden. User is told 
explicitly: "This plan covers diabetes but only after 2 years."

**Step 2 — Filter by affordability**
Premium affordability threshold = annual income × 3–5%. 
A user in the 3–8L band should not be recommended a plan 
above ₹18,000/yr premium without explicit justification.

**Step 3 — Adjust for city tier**
Tier-2 and Tier-3 users get plans ranked by network hospital 
availability in their region, not national averages. A plan 
with 10,000 hospitals but none in Nagpur is ranked lower.

**Step 4 — Lifestyle adjustment**
Active/Athlete users get plans with strong OPD cover. 
Sedentary users get plans with stronger hospitalisation cover.

**Step 5 — Rank and explain**
Top 3 policies are ranked by composite suitability score. 
Best fit gets a personalised 150–250 word explanation 
referencing at least 3 of the 6 profile fields by name.

**Dead-end rule:** If no policy perfectly matches, agent 
shows the closest option and explicitly states the gap: 
"This plan has a 36-month waiting period for diabetes — 
here is what you can do in the meantime."

---

## 5. Assumptions

- Policy PDFs contain structured data (inclusions, exclusions, 
  premium tables) parseable by pdfplumber.
- Users will truthfully disclose pre-existing conditions when 
  the UI communicates safety and purpose.
- City-tier affects network hospital density — not modelled 
  with live data, approximated from policy documents.
- Premium estimates are indicative, not real-time quoted.
- Session = one browser session; no login required for users.

---

## 6. Out of Scope

- Real-time premium API integration (requires insurer tie-ups)
- KYC or actual policy purchase flow
- Multi-language support (Hindi, Telugu) — Phase 2
- Mobile app — web only for this prototype