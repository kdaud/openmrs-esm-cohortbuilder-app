import { addColumnsToDisplay } from '../../cohort-builder.utils';
import type { Query } from '../../types';

export const isCompositionValid = (search: string) => {
  const matches = search.match(/and|or|not|\d+|\)|\(|union|intersection|!|\+/gi);
  return matches !== null && matches.length === search.split(/\s+/g).length;
};

const formatFilterCombination = (filterText: string, numberOfSearches: number) => {
  return filterText.replace(/\d/, (theDigit) => (parseInt(theDigit) + numberOfSearches).toString());
};

export const createCompositionQuery = (compositionQuery: string) => {
  const search = compositionQuery.replace(/(\(|\))+/g, (char) => (char === '(' ? '( ' : ' )'));
  const query: Query = {
    type: 'org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition',
    columns: addColumnsToDisplay(),
    rowFilters: [],
    customRowFilterCombination: '',
  };

  const searchTokens = search.split(/\s+/);

  searchTokens.forEach((eachToken) => {
    if (eachToken.match(/\d/)) {
      const history = JSON.parse(window.sessionStorage.getItem('openmrsHistory'));
      const operandQuery = history[parseInt(eachToken) - 1];

      const jsonRequestObject = operandQuery.parameters;
      jsonRequestObject.customRowFilterCombination = formatFilterCombination(
        jsonRequestObject.customRowFilterCombination,
        query.rowFilters.length,
      );
      query.customRowFilterCombination += `(${jsonRequestObject.customRowFilterCombination})`;
      query.rowFilters = query.rowFilters.concat(jsonRequestObject.rowFilters);
    } else {
      query.customRowFilterCombination += ` ${eachToken} `;
    }
  });

  return { query };
};
