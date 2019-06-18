const SELECTED_AN_EVENT = 'SELECTED_AN_EVENT';

export const selectedAnEvent = rhythmEvent => {
  return {
    type: SELECTED_AN_EVENT,
    rhythmEvent,
  }
}

export const highlightedEvent = (state = {}, action) => {
  switch (action.type) {
    case SELECTED_AN_EVENT:
      return action.rhythmEvent;
    default:
      return state;
  }
}
