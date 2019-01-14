import { resetSimulation, setSimulationConfig } from 'Actions/actions'
import React from 'react'
import { connect } from 'react-redux'

export default config => SimulationComponent =>
	connect(
		state => ({ config: state.simulation?.config }),
		{
			setSimulationConfig,
			resetSimulation
		}
	)(
		class DecoratedSimulation extends React.Component {
			componentDidMount() {
				if (config !== this.props.config) {
					this.props.resetSimulation()
					this.props.setSimulationConfig(config)
				}
			}
			render() {
				if (!this.props.config) return null
				return <SimulationComponent />
			}
		}
	)