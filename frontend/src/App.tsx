import Legend from "./legend/legend";
import ProjectedRetirement from "./projected-retirement/projected-retirement";
import styled from "styled-components";
import Statistics from "./stats/statistics";


const Container = styled.div`
	text-align: center;
	color: white;
`;

const Hr = styled.hr`
	width: 70%;
	opacity: 60%;
`;

function App() {
	return <Container>
		<h1>Tatra bank</h1>
		<ProjectedRetirement></ProjectedRetirement>
		<Legend></Legend>
		<Hr/>
		<Statistics></Statistics>
	</Container>
}

export default App;
