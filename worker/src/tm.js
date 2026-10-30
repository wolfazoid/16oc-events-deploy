const PAGE_SIZE = 200;
const DEEP_PAGING_LIMIT = 1000; // Discovery rejects size * (page + 1) > 1000

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchAllEvents(
  params,
  { apiKey, baseUrl, fetchImpl = globalThis.fetch, delayMs = 250 },
) {
  async function getPage(page) {
    const qs = new URLSearchParams(params);
    qs.set("apikey", apiKey);
    qs.set("size", String(PAGE_SIZE));
    qs.set("sort", "date,asc");
    if (page > 0) qs.set("page", String(page));
    const res = await fetchImpl(`${baseUrl}/events.json?${qs}`);
    if (!res.ok) throw new Error(`TM ${res.status}`);
    return res.json();
  }

  const first = await getPage(0);
  const events = [...(first._embedded?.events ?? [])];
  const totalPages = first.page?.totalPages ?? 0;
  const totalElements = first.page?.totalElements ?? events.length;
  let pagesRead = 1;

  for (let p = 1; p < totalPages && PAGE_SIZE * p < DEEP_PAGING_LIMIT; p++) {
    if (delayMs > 0) await sleep(delayMs);
    const data = await getPage(p);
    events.push(...(data._embedded?.events ?? []));
    pagesRead++;
  }

  return { events, totalElements, pagesRead, capped: pagesRead < totalPages };
}
