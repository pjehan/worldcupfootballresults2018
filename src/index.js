import React, { Component, Fragment } from 'react';

class WorldCupFootballResults extends Component {

	constructor(props) {
		super(props);
		this.state = { matches: [], numMatch: 0 };
		this.config = {
			refreshInterval: this.props.refreshInterval || 3000,
			backgroundColor: this.props.backgroundColor || 'lightblue'
		};
	}

	componentDidMount() {
		fetch('https://worldcup.sfg.io/matches')
			.then(response => response.json())
			.then(matches => {
				this.setState({ matches: matches });
			});

		this.timer = setInterval(() => {
			this.props.animate().then(() => {
				const numMatch = this.state.numMatch >= this.state.matches.length ? 0 : this.state.numMatch + 1;
				this.setState({ numMatch: numMatch });
      })
		}, this.config.refreshInterval)
	}
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {

		const style = {

			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			backgroundColor: this.config.backgroundColor
		};
		if (this.state.matches.length === 0) {
			return <div></div>
		} else {
			var displayedMatch = this.state.matches[this.state.numMatch];
			var score = <h4 style={{ 'textAlign': 'center' }}>{displayedMatch.home_team_country} {displayedMatch.home_team.goals} - {displayedMatch.away_team.goals} {displayedMatch.away_team_country}</h4>;

			var homeGoalsFromUs = displayedMatch.home_team_events.filter(event => (event.type_of_event == 'goal' || event.type_of_event == 'goal-penalty'));
			var homeGoalsFromThem = displayedMatch.away_team_events.filter(event => (event.type_of_event === 'goal-own'));
			var homeGoals = [...homeGoalsFromUs, ...homeGoalsFromThem];

			homeGoals = homeGoals.map(goal => (<div key={goal.id}>{goal.player} {goal.time}</div>));

			var awayGoalsFromUs = displayedMatch.away_team_events.filter(event => (event.type_of_event === 'goal' || event.type_of_event === 'goal-penalty'));
			var awayGoalsFromThem = displayedMatch.home_team_events.filter(event => (event.type_of_event === 'goal-own'));
			var awayGoals = [...awayGoalsFromUs, ...awayGoalsFromThem];

			awayGoals = awayGoals.map(goal => (<div key={goal.id}>{goal.player} {goal.time}</div>));

			var display =
					<div style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
						<div style={{ 'textAlign': 'left'}}>
							{homeGoals}
						</div>
						<div style={{ 'textAlign': 'right'}}>
							{awayGoals}
						</div>
					</div>;
			return (
				<div style={style}>
					{score}
					{display}
				</div>
			);
		}
	}

}

export default WorldCupFootballResults;