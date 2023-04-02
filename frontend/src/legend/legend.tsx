import DonutChart from 'react-donut-chart';
import styled from 'styled-components';

const Container = styled.div`
	text-align: center;
	color: white;
	display: relative;

	.donutchart {
		display: block;
		margin: auto;
	}
	.donutchart-legend {
		fill: white;
		width: 100%;
	};
	g.donutchart-arcs{
		aria-valuetext: "supertest";
		fill: white;
	}
`

const LegendItem = styled.div`
	height: 10px;
	width: 10px;
	margin-right: 5px;
	margin-left: 5px;
	display: inline-block;
	background-color: ${props => props.color}
`

const LegendsText = styled.div`
	display: inline-block;
	font-size: 8px;
`
const Legends = styled.div`
	margin: auto;
	display: flex;
	flex-direction: row;
	justify-content: right;
	align-items: center;
`
export default function Legend() {
	const values = [
		{
			label: 'II. and III. pillar',
			value: 35,
			color: '#3C96F7',
		},
		{
			label: 'Investment portfolio #1',
			value: 15,
			color: '#A37080',
		},
		{
			label: 'Investment portfolia #3',
			value: 50,
			color: '#147A48',
		},
	];

	return <Container>
		<DonutChart
			selectedOffset={0}
			width={275}
			height={275}
			legend={false}
			interactive={false}
			outerRadius={0.95}
			colors={values.map(v => v.color)}
			data={values}
		/>
		{values.map(v => {
			return <Legends>
				<LegendsText>{v.label}</LegendsText>
				<LegendItem color={v.color}></LegendItem>
			</Legends>
		})}
	</Container>

}
