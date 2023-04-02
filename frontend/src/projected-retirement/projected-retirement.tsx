import { useState } from "react"
import styled from "styled-components";

const ResizableInput = styled.input`
	width: ${props => props.maxLength}ch;
	background-color: #808080;
	text-align: center;
	color: white;
	border: none;
	border-radius: 25px;
	-moz-appearance: textfield;
`;

const LargeResizableInput = styled(ResizableInput)`
	font-size: 20px;
	font-weight: bold;
`;

const Container = styled.div`
	background-color: #1B1C22;
	border-radius: 10px;
	margin-left: 10px;
	margin-right: 10px;
	padding: 5px;
`;

export default function ProjectedRetirement() {
	let [retirementAge, setRetirementAge] = useState("64");
	let [monthlyAmount, setMonthlyAmount] = useState("334");

	function handleRetirementAgeChange(e: React.ChangeEvent<HTMLInputElement>) {
		let input = parseInt(e.target.value);
		if (input < 0 || input > 150) return;
		let isInteger = Number.isInteger(input);
		if (e.target.value === "" || isInteger) {
			setRetirementAge(e.target.value);
		}
	}

	function handleMonthlyAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
		let input = parseInt(e.target.value);
		if (input < 0 || input > 99999) return;
		let isInteger = Number.isInteger(input);
		if (e.target.value === "" || isInteger) {
			setMonthlyAmount(e.target.value);
		}
	}

	return <Container>
		<p>
			At &nbsp;
			<ResizableInput
				value={retirementAge}
				maxLength={3}
				onChange={handleRetirementAgeChange}
				type='number'
				inputMode='numeric'
				pattern="[0-9]*"
			/> &nbsp;
			years old your retirement will be &nbsp;
		</p>
		<h2>
			<LargeResizableInput
				value={monthlyAmount}
				maxLength={5}
				onChange={handleMonthlyAmountChange}
				type='number'
				inputMode='numeric'
				pattern="[0-9]*"
			/> &nbsp;
			€/month.
		</h2>
	</Container>
}
