import Legend from "./legend/legend";
import ProjectedRetirement from "./projected-retirement/projected-retirement";
import styled from "styled-components";
import Statistics from "./stats/statistics";
import { useState } from "react";
import { Person } from "./person/person";
import edit from "./edit.svg";

const TatraHeader = styled.div`
	margin: auto;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const Container = styled.div`
	text-align: center;
	color: white;
`;

const Hr = styled.hr`
	width: 70%;
	opacity: 60%;
`;

const EditIcon = styled.img`
`;


const EditButton = styled.button`
	width: 50px;
	height: 50px;
	margin-left: auto;
	margin-right: 12px;
	background-color: #08080A;
	border: none;
	cursor: pointer;

	&:hover {
		background-color: #1B1C22;
		border-radius: 10px;
	}
`;

const HeaderTitle = styled.h1`
	margin-left: 12px;
`;

const defaultPerson: Person = {
	first_name: "Joe",
	last_name: "Smith",
	profile: {
		age: 30,
		accounts: [
			{
				name: "II. and III. pillar",
				amount: 35,
				color: "#3C96F7",
				monthlyInstallment: 5,
			},
			{
				name: "Investment fund",
				amount: 50,
				color: "#147A48",
				monthlyInstallment: 15,
			},
			{
				name: "Savings",
				amount: 15,
				color: "#A37080",
				monthlyInstallment: 1,
			},
		],
		retirementAge: 64,
		monthsOfPension: 10,
		monthlyPension: 500,
	},
};

function App() {
	const [person] = useState<Person>(defaultPerson);

	return <Container>
		<TatraHeader>
			<HeaderTitle>Tatra bank</HeaderTitle>
			<EditButton>
				<EditIcon src={edit} className="Edit-icon" alt="edit" />
			</EditButton>
		</TatraHeader>
		<ProjectedRetirement></ProjectedRetirement>
		<Legend person={person}></Legend>
		<Hr />
		<Statistics profile={person.profile}></Statistics>
	</Container>
}

export default App;
