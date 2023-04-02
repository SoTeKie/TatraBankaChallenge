import { useState } from "react";
import Select, { SingleValue } from "react-select";
import styled from "styled-components";

const FormContainer = styled.div`
	margin-top: 150px;
	display: flex;
	overflow-x: scroll; 
	scrollbar-width: none;
`;

const FormStepContainer = styled.div`
	background-color: ${props => props.color};
	border-radius: 10px;
	min-width: 300px;
	height: 300px;
	margin: 20px;
`;

const FormStepPrompt = styled.h1`
	color: white;
	text-align: center;
	margin: 10px;
`;

const FormStepInput = styled.input`
	width: 200px;
	margin-left: 50px;
	background-color: #808080;
	text-align: center;
	color: white;
	border: none;
	border-radius: 25px;
	-moz-appearance: textfield;
	text-align: center;
	font-size: 30px;
	font-weight: bold;
`;

function AgeStep() {
	const [age, setAge] = useState("");

	function handleAgeChange(e: React.ChangeEvent<HTMLInputElement>) {
		let input = parseInt(e.target.value);
		if (input < 0 || input > 150) return;
		let isInteger = Number.isInteger(input);
		if (e.target.value === "" || isInteger) {
			setAge(e.target.value);
		}
	}

	return <FormStepContainer color={"#3C96F7"}>
		<FormStepPrompt>How old are you?</FormStepPrompt>
		<FormStepInput
			value={age}
			onChange={handleAgeChange}
			type='number'
			inputMode='numeric'
			pattern="[0-9]*"
		/>
	</FormStepContainer>
}

interface EduOptions {
	label: string;
	value: string;
}

const educationOptions = [
	{
		label: "University diploma",
		value: "uni",
	},
	{
		label: "High school degree",
		value: "hsd",
	},
	{
		label: "Tzv. Skola Zivota",
		value: "tsz",
	},
];

function EducationStep() {
	const [education, setEducation] = useState<string | null>(null);

	function handleEducationChange(newValue: SingleValue<EduOptions>) {
		if (newValue === null) return;
		setEducation(newValue.value);
	}

	return <FormStepContainer color={"#B3B3B3"}>
		<FormStepPrompt>What is your highest education?</FormStepPrompt>
		<Select options={educationOptions} value={educationOptions.find(opt => opt.value === education)} onChange={handleEducationChange} />
	</FormStepContainer>
}

export default function RetirementWizzard() {
	return <FormContainer>
		<AgeStep></AgeStep>
		<EducationStep></EducationStep>
	</FormContainer>
}
