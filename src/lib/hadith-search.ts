/**
 * PostgREST `or`-clauses split on commas, and parentheses / quotes / wildcards
 * change how a filter is parsed, so a typed term is reduced to plain words
 * before it reaches the database.
 */
export function cleanSearch(q: string): string {
  return q.replace(/[,()%*"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
}
