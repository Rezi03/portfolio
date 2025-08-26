import os, json, time, math, re, datetime, requests
from bs4 import BeautifulSoup

FMP_API_KEY = os.getenv("FMP_API_KEY", "")
SEC_USER_AGENT = os.getenv("SEC_USER_AGENT", "youremail@example.com")
OUT_PATH = os.getenv("OUT_PATH", "data/ma_enriched.json")
FMP_URL = "https://financialmodelingprep.com/stable/mergers-acquisitions-latest?page=0&size=100&apikey="
SEC_SEARCH_URL = "https://efts.sec.gov/LATEST/search-index"
HEADERS_SEC = {"User-Agent": SEC_USER_AGENT, "Accept": "application/json"}
ADVISOR_PATTERNS = {
    "Goldman Sachs": [r"Goldman\s+Sachs(?:\s*&\s*Co\.\s*LLC)?"],
    "Morgan Stanley": [r"Morgan\s+Stanley"],
    "J.P. Morgan": [r"J\.?\s*P\.?\s*Morgan(?:\s*Securities\s*LLC)?", r"JP\s*Morgan"],
    "Bank of America": [r"(?:BofA|Bank\s*of\s*America)(?:\s*Securities,?\s*Inc\.)?"],
    "Barclays": [r"Barclays(?:\s*Capital\s*Inc\.)?"],
    "Citi": [r"Citigroup(?:\s*Global\s*Markets\s*Inc\.)?|Citi(?:group)?"]
}

def get_fmp_deals():
    r = requests.get(FMP_URL + FMP_API_KEY, timeout=30)
    try:
        data = r.json()
        if isinstance(data, list):
            return data
    except:
        pass
    return []

def parse_text_from_url(url):
    try:
        r = requests.get(url, headers=HEADERS_SEC, timeout=30)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "lxml")
        for tag in soup(["script","style","noscript"]):
            tag.extract()
        text = " ".join(soup.get_text(separator=" ").split())
        return text[:200000]
    except:
        return ""

def find_advisors_in_text(txt):
    found = []
    for name, pats in ADVISOR_PATTERNS.items():
        for p in pats:
            if re.search(p, txt, flags=re.I):
                found.append(name)
                break
    return sorted(set(found))

def dt_from_str(s):
    if not s:
        return None
    try:
        if " " in s:
            s = s.replace(" ", "T")
        return datetime.datetime.fromisoformat(s)
    except:
        try:
            return datetime.datetime.strptime(s[:10], "%Y-%m-%d")
        except:
            return None

def iso_date(d):
    try:
        return d.strftime("%Y-%m-%d")
    except:
        return None

def sec_search(company, start_dt, end_dt):
    try:
        payload = {
            "q": company,
            "forms": ["8-K","425","S-4","DEFM14A","PRER14A","PREM14A"],
            "startdt": iso_date(start_dt),
            "enddt": iso_date(end_dt),
            "from": 0,
            "size": 5,
            "sort": "date",
            "order": "desc"
        }
        r = requests.post(SEC_SEARCH_URL, headers=HEADERS_SEC, json=payload, timeout=30)
        r.raise_for_status()
        j = r.json()
        hits = j.get("hits", {}).get("hits", [])
        urls = []
        for h in hits:
            u = h.get("_source", {}).get("linkToHtml")
            if not u:
                u = h.get("_source", {}).get("linkToFilingDetails")
            if u:
                urls.append(u)
        return urls[:5]
    except:
        return []

def enrich_item(it):
    date = it.get("transactionDate") or it.get("acceptedDate")
    acq = it.get("companyName") or ""
    tgt = it.get("targetedCompanyName") or ""
    acq_ticker = it.get("symbol") or ""
    tgt_ticker = it.get("targetedSymbol") or ""
    sec_link = it.get("link") or ""
    advisors = []
    sources = []
    window_center = dt_from_str(date) or datetime.datetime.utcnow()
    start_dt = window_center - datetime.timedelta(days=21)
    end_dt = window_center + datetime.timedelta(days=21)
    urls = []
    if sec_link:
        urls.append(sec_link)
    for q in [acq, tgt]:
        if q and len(urls) < 6:
            urls.extend(sec_search(q, start_dt, end_dt))
            time.sleep(0.7)
    uniq = []
    for u in urls:
        if u and u not in uniq:
            uniq.append(u)
    for u in uniq[:6]:
        txt = parse_text_from_url(u)
        if not txt:
            continue
        found = find_advisors_in_text(txt)
        if found:
            for f in found:
                if f not in advisors:
                    advisors.append(f)
            sources.append(u)
        time.sleep(0.4)
    return {
        "date": date or "",
        "acquirer": acq,
        "acquirerTicker": acq_ticker,
        "target": tgt,
        "targetTicker": tgt_ticker,
        "secLink": sec_link,
        "advisors": advisors,
        "advisor_sources": sources
    }

def main():
    deals = get_fmp_deals()
    out = []
    for it in deals:
        try:
            out.append(enrich_item(it))
        except:
            pass
        time.sleep(0.3)
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
