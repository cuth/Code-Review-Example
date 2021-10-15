export const { REACT_APP_BLUEPRINTS_URL, REACT_APP_RESULTS_URL, REACT_APP_API_KEY } = process.env;

export const AIRTABLE_TYPE_MAP = {
  String: 'text',
  Number: 'number',
  Date: 'date',
};

export const URL_HEADERS = {
  Authorization: `Bearer ${REACT_APP_API_KEY}`,
  'Content-Type': 'application/json',
};
