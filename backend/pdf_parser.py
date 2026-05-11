# backend/pdf_parser.py
import os
import json

def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    elif ext == ".json":
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return json.dumps(data, indent=2)

    elif ext == ".pdf":
        try:
            import fitz  # PyMuPDF
            text = ""
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text() + "\n"
            doc.close()
            print(f"PyMuPDF extracted {len(text)} chars")
            return text
        except Exception as e:
            print(f"PyMuPDF error: {e}")
            return ""
    else:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except:
            return ""

def chunk_text(text: str, chunk_size: int = 80, overlap: int = 15) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks

def parse_policy_pdf(file_path: str, policy_name: str, insurer: str) -> list[dict]:
    raw_text = extract_text(file_path)

    if not raw_text.strip():
        print(f"ERROR: No text extracted from {file_path}")
        return []

    print(f"Extracted {len(raw_text)} characters, creating chunks...")
    chunks = chunk_text(raw_text)
    print(f"Created {len(chunks)} chunks")

    return [
        {
            "text": chunk,
            "metadata": {
                "policy_name": policy_name,
                "insurer": insurer,
                "source_file": os.path.basename(file_path),
                "chunk_index": idx,
            }
        }
        for idx, chunk in enumerate(chunks)
    ]