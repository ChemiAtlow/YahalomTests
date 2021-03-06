import { useMemo, useState } from "react";

export type SearchAndSortHook<T extends { [key: string]: any }> = {
    data: T[];
    sort: (terms?: SortTerm<T>) => void;
    search: (term: string) => void;
};

type SortTerm<T> = { term: keyof T; isDescending: boolean };

export function useSearchAndSort<T extends { [key: string]: any }>(
    incomingData: T[],
    searchableKeys?: (keyof T)[]
): SearchAndSortHook<T> {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<T[]>(incomingData);
    const [sortTerm, setSortTerms] = useState<SortTerm<T>>();

    const search = (term: string) => {
        setSearchTerm(term);
    };

    const sort = (terms?: SortTerm<T>) => {
        setSortTerms(terms);
    };

    useMemo(() => {
        let arrayCopy = incomingData;
        if (sortTerm) {
            arrayCopy = [...incomingData];
            const compareBy = (self: T, other: T, { term, isDescending }: SortTerm<T>) => {
                const selfTerm = `${self[term]}`.toLowerCase();
                const otherTerm = `${other[term]}`.toLowerCase();
                if (selfTerm < otherTerm) return isDescending ? 1 : -1;
                if (selfTerm > otherTerm) return isDescending ? -1 : 1;
                return 0;
            };
            arrayCopy.sort((a, b) => compareBy(a, b, sortTerm));
        }
        const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const results = arrayCopy.filter(entry => {
            if (searchableKeys && searchableKeys.length > 0) {
                return Object.entries(entry).some(
                    ([key, val]) => searchableKeys.includes(key) && `${val}`.match(regex)
                );
            } else {
                return Object.values(entry).some(val => `${val}`.match(regex));
            }
        });
        setData(results);
    }, [incomingData, searchableKeys, sortTerm, searchTerm, setData]);

    return {
        data,
        sort,
        search,
    };
}
