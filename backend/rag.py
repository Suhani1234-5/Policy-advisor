# backend/rag.py
import os
import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
client = chromadb.PersistentClient(path=CHROMA_PATH)

embedding_fn = SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

def get_collection():
    """Always get or CREATE collection — never crash if missing."""
    return client.get_or_create_collection(
        name="insurance_policies",
        embedding_function=embedding_fn
    )

def add_policy_chunks(chunks: list[dict], doc_id_prefix: str):
    collection = get_collection()
    documents = [c["text"] for c in chunks]
    metadatas = [c["metadata"] for c in chunks]
    ids = [f"{doc_id_prefix}_chunk_{i}" for i in range(len(chunks))]
    collection.add(documents=documents, metadatas=metadatas, ids=ids)
    print(f"✅ Added {len(chunks)} chunks for {doc_id_prefix}")

def retrieve_policy_chunks(query: str, n_results: int = 6) -> list[dict]:
    collection = get_collection()
    try:
        count = collection.count()
        if count == 0:
            return []
        actual_n = min(n_results, count)
        results = collection.query(query_texts=[query], n_results=actual_n)
        chunks = []
        for i, doc in enumerate(results["documents"][0]):
            chunks.append({
                "text": doc,
                "metadata": results["metadatas"][0][i]
            })
        return chunks
    except Exception as e:
        print(f"Retrieval error: {e}")
        return []

def delete_policy_by_name(policy_name: str):
    collection = get_collection()
    results = collection.get(where={"policy_name": policy_name})
    if results["ids"]:
        collection.delete(ids=results["ids"])
        print(f"🗑️ Deleted {len(results['ids'])} chunks for {policy_name}")

def list_all_policies() -> list[str]:
    collection = get_collection()
    try:
        results = collection.get()
        names = set()
        for meta in results["metadatas"]:
            names.add(meta.get("policy_name", "Unknown"))
        return list(names)
    except Exception:
        return []