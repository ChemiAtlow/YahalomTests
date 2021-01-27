import { useMemo, useState } from "react";

type SortTerms<T> = { term: keyof T; isDescending: boolean };

export function useSearchAndSort<T extends { [key: string]: any }>(
    incomingData: T[],
    searchableKeys?: (keyof T)[]
) {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<T[]>(incomingData);
    const [sortTerms, setSortTerms] = useState<SortTerms<T>>();

    const search = (term: string) => {
        setSearchTerm(term);
    };

    const sort = (terms?: SortTerms<T>) => {
        setSortTerms(terms);
    };

    useMemo(() => {
        let arrayCopy = incomingData;
        if (sortTerms) {
            arrayCopy = [...incomingData];
            const compareBy = (self: T, other: T, { term, isDescending }: SortTerms<T>) => {
                const selfTerm = `${self[term]}`.toLowerCase();
                const otherTerm = `${other[term]}`.toLowerCase();
                if (selfTerm < otherTerm) return isDescending ? 1 : -1;
                if (selfTerm > otherTerm) return isDescending ? -1 : 1;
                return 0;
            };
            arrayCopy.sort((a, b) => compareBy(a, b, sortTerms));
        }
        const regex = new RegExp(searchTerm, "i");
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
    }, [incomingData, searchableKeys, sortTerms, searchTerm, setData]);

    return {
        data,
        sort,
        search,
        sortTerms,
        searchTerm,
    };
}
