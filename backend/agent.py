# backend/agent.py
import os
from groq import Groq
from dotenv import load_dotenv
from rag import retrieve_policy_chunks

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
sessions: dict = {}

SYSTEM_PROMPT = """You are an empathetic insurance advisor for AarogyaID.
Help patients find the right health insurance policy in a warm, jargon-free way.

STRICT RULES:
1. Only use policy information provided in [POLICY DOCUMENTS]. Never invent policy details.
2. If a premium or cover amount is not in the documents, write the exact value from documents.
3. If asked for medical advice, decline warmly and redirect to insurance questions.
4. Always acknowledge the user's health situation with empathy before presenting data.
5. Define every insurance term the first time you use it.
6. Never leave the user at a dead end — always offer an alternative path.

RECOMMENDATION FORMAT — produce ALL 3 sections EXACTLY:

**Peer Comparison Table**
| Policy Name | Insurer | Premium Rs/yr | Cover Amount | Waiting Period | Key Benefit | Suitability Score |
|---|---|---|---|---|---|---|
| [name from documents] | [insurer] | [exact Rs amount from documents] | [exact amount] | [period] | [benefit] | [score]/100 |
| [name] | [insurer] | [exact Rs amount] | [exact amount] | [period] | [benefit] | [score]/100 |
| [name] | [insurer] | [exact Rs amount] | [exact amount] | [period] | [benefit] | [score]/100 |

**Coverage Detail**
| Inclusions | Exclusions | Sub-limits | Co-pay % | Claim Type |
|---|---|---|---|---|
| [list inclusions from documents] | [list exclusions] | [exact sub-limits] | [exact co-pay] | [cashless/reimbursement details] |

IMPORTANT: Coverage Detail must have exactly 1 data row with ALL 5 columns filled from documents.

**Why This Policy**
Write 150-250 words connecting the policy to the user's profile.
Reference at least 3 fields: age, city tier, lifestyle, pre-existing conditions, income band.
Write warmly. End with encouragement.

Never re-ask for information already provided.
"""

def get_or_create_session(session_id: str, profile: dict = None) -> dict:
    if session_id not in sessions:
        sessions[session_id] = {"profile": profile or {}, "history": []}
    elif profile:
        sessions[session_id]["profile"] = profile
    return sessions[session_id]

def build_profile_context(profile: dict) -> str:
    if not profile:
        return ""
    return f"""
[User Profile]
Name: {profile.get('name')}
Age: {profile.get('age')}
City Tier: {profile.get('city_tier')}
Lifestyle: {profile.get('lifestyle')}
Pre-existing Conditions: {', '.join(profile.get('conditions', ['None']))}
Annual Income Band: {profile.get('income_band')}
"""

def run_agent(session_id: str, user_message: str, profile: dict = None) -> str:
    session = get_or_create_session(session_id, profile)

    p = session["profile"]
    conditions = ', '.join(p.get('conditions', ['general'])) if p else 'general'
    age = p.get('age', '')
    income = p.get('income_band', '')
    city = p.get('city_tier', '')

    # Multiple targeted queries for better retrieval
    queries = [
        f"premium schedule age {age} {income} cover amount",
        f"{conditions} waiting period coverage exclusions",
        f"{city} co-pay claim type cashless network hospitals",
        f"inclusions hospitalisation room rent ICU sub-limits",
    ]

    all_chunks = []
    seen_texts = set()
    for query in queries:
        chunks = retrieve_policy_chunks(query.strip(), n_results=4)
        for chunk in chunks:
            if chunk['text'] not in seen_texts:
                seen_texts.add(chunk['text'])
                all_chunks.append(chunk)

    if all_chunks:
        policy_docs = "\n\n".join([
            f"[Source: {c['metadata']['policy_name']} by {c['metadata']['insurer']}]\n{c['text']}"
            for c in all_chunks
        ])
        policy_context = f"\n[POLICY DOCUMENTS]\n{policy_docs}\n[END POLICY DOCUMENTS]\n"
    else:
        policy_context = "\n[POLICY DOCUMENTS]\nNo policy documents found. Please upload policy PDFs via admin panel.\n[END POLICY DOCUMENTS]\n"

    profile_context = build_profile_context(session["profile"])

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(session["history"])

    full_user_message = f"{profile_context}\n{policy_context}\n\nUser question: {user_message}"
    messages.append({"role": "user", "content": full_user_message})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.3,
        max_tokens=2048
    )

    output = response.choices[0].message.content
    session["history"].append({"role": "user", "content": user_message})
    session["history"].append({"role": "assistant", "content": output})

    if len(session["history"]) > 20:
        session["history"] = session["history"][-20:]

    return output