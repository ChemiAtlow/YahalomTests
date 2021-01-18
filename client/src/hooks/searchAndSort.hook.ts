import { useEffect, useState } from "react";

export function useSearchAndSort<T extends {}>(incomingData: T[]) {
	console.log("started sas hook:", incomingData);
	const [baseData, setBaseData] = useState(incomingData);
	const [searchTerm, setSearchTerm] = useState("");
	const [data, setData] = useState<T[]>(baseData);

	const search = (term: string) => {
		setSearchTerm(term);
	};

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

	const sort = (key: keyof T, isDescending: boolean = false) => {
		let arrayCopy = [...baseData];
		arrayCopy.sort((a, b) => compareBy(a, b, key, isDescending));
		setBaseData(arrayCopy);
	};

	useEffect(() => {
		const results = baseData.filter(entry =>
			Object.values(entry).some(val =>
				`${val}`.match(new RegExp(searchTerm, "i"))
			)
		);
		setData(results);
	}, [baseData, searchTerm, setData]);

	return {
		data,
		sort,
		search,
		searchTerm,
	};
}
