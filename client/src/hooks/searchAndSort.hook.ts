import { useMemo, useState } from "react";

export function useSearchAndSort<T extends { [key: string]: any }>(
	incomingData: T[]
) {
	const [searchTerm, setSearchTerm] = useState("");
	const [data, setData] = useState<T[]>(incomingData);
	const [sortTerms, setSortTerms] = useState({
		term: "",
		isDescending: false,
	});

	const search = (term: string) => {
		setSearchTerm(term);
	};

	const sort = (key: string, isDescending: boolean = false) => {
		setSortTerms({ term: key, isDescending });
	};

	useMemo(() => {
		let arrayCopy = [...incomingData];
		if (sortTerms.term) {
			const compareBy = (
				self: T,
				other: T,
				key: keyof T,
				isDescending: boolean
			) => {
				const result = () => {
					if (self[key] < other[key]) return -1;
					if (self[key] > other[key]) return 1;
					return 0;
				};
				return isDescending ? result() * -1 : result();
			};
			arrayCopy.sort((a, b) =>
				compareBy(a, b, sortTerms.term, sortTerms.isDescending)
			);
		}
		const results = arrayCopy.filter(entry =>
			Object.values(entry).some(val =>
				`${val}`.match(new RegExp(searchTerm, "i"))
			)
		);
		setData(results);
	}, [incomingData, sortTerms, searchTerm, setData]);

	return {
		data,
		sort,
		search,
		sortTerms,
		searchTerm,
	};
}
