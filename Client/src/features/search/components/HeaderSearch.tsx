import { useEffect, useState, type FocusEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { searchApi, searchKeys } from '../api';
import { Icon } from '@ui';
import type { GlobalSearchResponse, GlobalSearchResult } from '@types';

const groups = [
  { key: 'tasks', label: 'Справи', icon: 'tasks', path: '/my_tasks' },
  { key: 'goals', label: 'Цілі', icon: 'target', path: '/goals' },
  { key: 'events', label: 'Події', icon: 'calendar', path: '/calendar' },
] as const satisfies ReadonlyArray<{
  key: keyof GlobalSearchResponse;
  label: string;
  icon: 'tasks' | 'target' | 'calendar';
  path: string;
}>;

export function HeaderSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const normalizedQuery = query.trim();
  const isDebouncing =
    normalizedQuery.length > 0 && normalizedQuery !== debouncedQuery;
  const isSearchReady =
    normalizedQuery.length > 0 && normalizedQuery === debouncedQuery;

  useEffect(() => {
    if (!normalizedQuery) return;

    const timeoutId = window.setTimeout(
      () => setDebouncedQuery(normalizedQuery),
      2000
    );

    return () => window.clearTimeout(timeoutId);
  }, [normalizedQuery]);

  const search = useQuery({
    queryKey: searchKeys.query(debouncedQuery),
    queryFn: ({ signal }) =>
      searchApi.search({ query: debouncedQuery }, signal),
    enabled: isSearchReady,
    retry: false,
    staleTime: 30_000,
  });

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;
    if (
      !(nextTarget instanceof Node) ||
      !event.currentTarget.contains(nextTarget)
    ) {
      setIsFocused(false);
    }
  }

  const results = isSearchReady ? search.data : undefined;
  const hasResults = groups.some(group => (results?.[group.key].length ?? 0) > 0);
  const isOpen = isFocused && normalizedQuery.length > 0;

  return (
    <div
      className="relative hidden md:block"
      onBlur={handleBlur}
    >
      <span className="absolute left-3 top-3 z-10 text-textMuted">
        <Icon name="search" size={18} />
      </span>
      <input
        aria-label="Пошук справ, цілей і подій"
        aria-controls="header-search-results"
        aria-expanded={isOpen}
        autoComplete="off"
        className="h-10 w-52 rounded-xl border border-border bg-white py-0 pr-3.5 pl-10 text-base font-bold outline-none transition-all duration-150 focus:w-60 focus:border-primaryLight"
        maxLength={100}
        placeholder="Шукати..."
        role="combobox"
        value={query}
        onChange={event => {
          const value = event.target.value;
          setQuery(value);
          if (!value.trim() || value.trim() !== debouncedQuery) {
            setDebouncedQuery('');
          }
        }}
        onFocus={() => setIsFocused(true)}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            setIsFocused(false);
            event.currentTarget.blur();
          }
        }}
      />
      {isOpen && (
        <div
          aria-live="polite"
          className="absolute right-0 top-full z-50 mt-2 max-h-96 w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-border bg-white p-2 shadow-xl"
          id="header-search-results"
        >
          {isDebouncing || search.isLoading ? (
            <p className="px-3 py-4 text-sm text-textMuted">Пошук...</p>
          ) : search.isError ? (
            <div className="px-3 py-4 text-sm">
              <p className="text-danger">
                Не вдалося виконати пошук. Спробуйте ще раз.
              </p>
              <button
                className="mt-2 font-bold text-primaryLight"
                type="button"
                onClick={() => search.refetch()}
              >
                Повторити
              </button>
            </div>
          ) : hasResults ? (
            groups.map(group => {
              const items = results?.[group.key] ?? [];
              if (!items.length) return null;

              return (
                <section aria-label={group.label} key={group.key}>
                  <h2 className="flex items-center gap-2 px-3 pb-1 pt-2 text-xs font-extrabold uppercase tracking-wider text-textMuted">
                    <Icon name={group.icon} size={14} />
                    {group.label}
                  </h2>
                  {items.map(item => (
                    <SearchResultButton
                      item={item}
                      key={item.id}
                      onSelect={() => {
                        setIsFocused(false);
                        navigate(group.path);
                      }}
                    />
                  ))}
                </section>
              );
            })
          ) : (
            <p className="px-3 py-4 text-sm text-textMuted">
              За цим запитом нічого не знайдено.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultButton({
  item,
  onSelect,
}: {
  item: GlobalSearchResult;
  onSelect: () => void;
}) {
  return (
    <button
      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-background focus-visible:bg-background"
      type="button"
      onClick={onSelect}
    >
      <span className="truncate text-sm font-bold">{item.title}</span>
      {item.date && (
        <span className="shrink-0 text-xs text-textMuted">
          {new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium' }).format(
            new Date(item.date)
          )}
        </span>
      )}
    </button>
  );
}
