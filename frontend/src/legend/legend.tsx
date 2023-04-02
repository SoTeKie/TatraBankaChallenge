import DonutChart from 'react-donut-chart';
import styled from 'styled-components';
import { Person } from '../person/person';

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

interface PropsType {
	person: Person;
}

export default function Legend(props: PropsType) {
	const summedAmount = props.person.profile.accounts.reduce((sum, current) => sum + current.amount, 0);
	const values = props.person.profile.accounts.map(a => {
		return {
			label: a.name,
			value: (a.amount / summedAmount) * 100,
			color: a.color
		};
	})

	return <Container>
		{values.length !== 0 &&
			<DonutChart
				selectedOffset={0}
				width={275}
				height={275}
				legend={false}
				interactive={false}
				outerRadius={0.95}
				colors={values.map(v => v.color)}
				data={values}
			/>}
		{values.map(v => {
			return <Legends>
				<LegendsText>{v.label}</LegendsText>
				<LegendItem color={v.color}></LegendItem>
			</Legends>
		})}
	</Container>

}
