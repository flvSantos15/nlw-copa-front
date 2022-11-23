interface IHome {
	count: number;
}

export default function Home({ count }: IHome) {
	return (
		<div>
			<h1>Contagem: {count}</h1>
		</div>
	);
}

export const getServerSideProps = async () => {
	const response = await fetch("http://localhost:3333/pools/count");
	const data = await response.json();

	return {
		props: {
			count: data.count,
		},
	};
};
