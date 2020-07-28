'use strict';

const fieldsToChoices = (_, { fields }) => fields.map(f => ({ title: f, value: f }));

module.exports = {
	name: 'availableFilters',
	type: 'multiselect',
	message: 'Which fields will be filtrable?',
	choices: fieldsToChoices,
	format: fields => fields.filter(Boolean)
};
