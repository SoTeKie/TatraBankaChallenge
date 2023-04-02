import { profile } from "console";
import styled from "styled-components"
import { Profile } from "../person/person";

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

interface StatisticProps {
	profile: Profile;
}

export default function Statistics(props: StatisticProps) {
	const summedAmount = props.profile.accounts.reduce((sum, current) => sum + current.amount, 0);
	const untilRetirement = props.profile.retirementAge - props.profile.age;


	const formatUntilRetirement = (years: number) => {
		if (years <= 0) return "Retired!"
		if (years < 1) return "Less than a year";
		if (years == 1) return "1 year";
		return `${years} years`;
	}

	const formatPensionLength = (months: number) => {
		const years = months / 12;
		if (years < 1) return "Less than a year";
		if (years == 1) return "1 year";
		return `${years}years`;
	}

	const stats = [
		{
			static: "total saved amount",
			val: `${summedAmount}€`
		},
		{
			static: "years left to retirement",
			val: formatUntilRetirement(untilRetirement)
		},
		{
			static: "your pension will last",
			val: formatPensionLength(props.profile.monthsOfPension)
		},
		{
			static: "Lorem ipsum",
			val: "It's 6AM"
		},
	];
	return <Container>
		{}
		{stats.map(s => <Stat static={s.static} val={s.val}></Stat>)}
	</Container>
}
