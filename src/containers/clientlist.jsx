import React from 'react';
import { watchClientAddedEvent, setClientSelected } from '../actions/client';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

class ClientListContainer extends React.Component {

	constructor(props) {
		super(props);
	}

	// CREATE CLIENT OBJECT WITH THE KEY AS PROPERTY
	mapClientWithKey(clients) {
		const mclients = [];
		Object.keys(clients).forEach((key) => {
			mclients.push(
				{
					key,
					...clients[key]
				}
			)
		});
		return mclients;
	}

	//SORT CLIENTS BY LAST ACITIVITY TIMESTAMP
	sortClientsByLasActivity(clients) {
		return clients.sort(function (a, b) {
			return b.lastActivity - a.lastActivity;
		});
	}

	prepareEmail(email) {
		const tokens = email.split('@');
		return `@${tokens[0]}`;
	}

	getTooltipText(client) {
		return `${client.email} - ${client.name}`;
	}

	generateList(clients) {
		const arr = [];
		const { loadingClients, selectedClient } = this.props;
		if (loadingClients) {
			return (
				// TODO: MAKE A BETTER LOADING STATE
				<div>
					Loading clients...
				</div>
			)
		} else {
			if (clients && Object.keys(clients).length) {
				const mclients = this.mapClientWithKey(clients);
				const sortclients = this.sortClientsByLasActivity(mclients);
				sortclients.forEach((client) => {
					if (client.email){
						arr.push(
							<li key={client.key} className={selectedClient != null && selectedClient.key == client.key? "client selected-client":"client"} title={this.getTooltipText(client)}>
								<a id={client.key} href="#" onClick={() => this.props.setClientSelected(client)}>
									{this.prepareEmail(client.email)}
									{client.unread_messages > 0 &&
										<span className="message-counter">({client.unread_messages})</span>
      								}
								</a>
							</li>
						);
					}
				});
			}
			return arr;
		}
	}

	render() {
		const { sidebarCssClass, clients } = this.props;
		const list = this.generateList(clients);
		return (
			<nav id="sidebar" className={sidebarCssClass}>
				<div id="sidebar-wrapper">
					<div className="sidebar-header">
						<h3>Company Name</h3>
					</div>
					<ul className="list-unstyled components">
						{list}
					</ul>
				</div>
			</nav>
		);
	}
};

const mapStateToProps = state => ({
	sidebarCssClass: state.ui.sidebarCssClass,
	clients: state.client.list,
	loadingClients: state.client.loading,
	selectedClient: state.client.selected
});

const mapDispatchToProps = dispatch => {
	watchClientAddedEvent(dispatch);
	return bindActionCreators(
		{
			setClientSelected,
		}, dispatch
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(ClientListContainer);
