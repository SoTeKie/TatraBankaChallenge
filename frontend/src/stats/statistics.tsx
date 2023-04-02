import styled from "styled-components"

const Container = styled.div`
	margin-top: 10px;
	display: grid;
	grid-template-columns: 170px 170px;
	grid-row: auto auto;
	grid-column-gap: 16px;
	grid-row-gap: 20px;
	margin-left: 10px;
`;

const StatContainer = styled.div`
	border-radius: 10px;
	background: #1B1C22;
`;

interface StatProps {
	readonly static: string;
	readonly val: string;
}

function Stat(props: StatProps) {
	return <StatContainer>
		<p>{props.static}</p>
		<h3>{props.val}</h3>
	</StatContainer>
}

export default function Statistics() {
	const stats = [
		{
			static: "total saved amount",
			val: "1000"
		},
		{
			static: "years left to retirement",
			val: "23 years"
		},
		{
			static: "total saved amount",
			val: "1000"
		},
		{
			static: "Lorem ipsum",
			val: "It's 5AM"
		},
	];
	return <Container>
		{stats.map(s => <Stat static={s.static} val={s.val}></Stat>)}
	</Container>
}
