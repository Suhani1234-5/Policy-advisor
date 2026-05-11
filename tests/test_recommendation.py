# tests/test_recommendation.py
import pytest
from backend.pdf_parser import chunk_text, parse_policy_pdf

def test_chunk_text_basic():
    """Chunks should split text correctly."""
    sample = " ".join(["word"] * 1000)
    chunks = chunk_text(sample, chunk_size=100, overlap=10)
    assert len(chunks) > 1
    assert all(isinstance(c, str) for c in chunks)

def test_chunk_overlap():
    """Overlapping chunks should share some words."""
    sample = " ".join([str(i) for i in range(200)])
    chunks = chunk_text(sample, chunk_size=50, overlap=10)
    # Last words of chunk 0 should appear in chunk 1
    last_words = chunks[0].split()[-10:]
    first_words = chunks[1].split()[:15]
    overlap_found = any(w in first_words for w in last_words)
    assert overlap_found

def test_empty_text():
    """Empty text should return empty chunks."""
    chunks = chunk_text("")
    assert chunks == [] or chunks == [""]