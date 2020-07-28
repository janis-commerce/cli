'use strict';

const fieldsToChoices = (_, { fields }) => fields.map(f => ({ title: f, value: f }));

module.exports = {
	name: 'sortableFields',
	type: 'multiselect',
	message: 'Which fields will be sortable?',
	choices: fieldsToChoices,
	format: fields => fields.filter(Boolean)
};
