import * as MESSAGES_ACTIONS from '../constants/actions/messages';

const defaultState = {
	list: {},
	loading: true,
};

export default function ClientReducer(state = defaultState, action) {

	switch (action.type) {
		case MESSAGES_ACTIONS.MESSAGES_CHILD_ADDED:
			return {
				...state,
				loading: false,
				list: {
					...state['list'],
					[action.payload.key]: action.payload.message
				}
			}
		default:
			return state;
	}
}
