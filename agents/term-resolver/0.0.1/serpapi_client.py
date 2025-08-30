# serpapi_client.py
from typing import Any, Dict, Optional
import requests

class SerpApiError(Exception):
    pass

def serpapi_search(query: str, api_key: str, **kwargs: Any) -> Dict[str, Any]:
    """
    Search Google via SerpAPI and return the JSON response.
    Raises SerpApiError on non-200 responses.
    """
    base_url = "https://serpapi.com/search"
    params: Dict[str, Any] = {"engine": "google", "q": query, "api_key": api_key}
    params.update(kwargs)

    try:
        resp = requests.get(base_url, params=params, timeout=20)
    except requests.RequestException as e:
        raise SerpApiError(f"Request failed: {e}") from e

    if resp.status_code != 200:
        raise SerpApiError(
            f"SerpAPI returned {resp.status_code}: {resp.text[:200]}"
        )
    return resp.json()

__all__ = ["serpapi_search", "SerpApiError"]
