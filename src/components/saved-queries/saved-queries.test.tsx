import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { openmrsFetch } from '@openmrs/esm-framework';
import { type DefinitionDataRow } from '../../types';
import { getQueries } from './saved-queries.resources';
import SavedQueries from './saved-queries.component';

const mockQueries: DefinitionDataRow[] = [
  {
    id: '1',
    name: 'male alive',
    description: 'male Patients that are alive',
  },
  {
    id: '2',
    name: 'Female ages between 10 and 30',
    description: 'male Patients with ages between 10 and 30 years that are alive',
  },
];

const mockOpenmrsFetch = openmrsFetch as jest.Mock;

jest.mock('./saved-queries.resources', () => {
  const original = jest.requireActual('./saved-queries.resources');
  return {
    ...original,
    getQueries: jest.fn(),
  };
});

describe('Test the saved queries component', () => {
  it('should be able to search for a query', async () => {
    // @ts-ignore
    getQueries.mockImplementation(() => mockQueries);
    mockOpenmrsFetch.mockReturnValueOnce({
      data: { results: mockQueries },
    });

    render(<SavedQueries onViewQuery={jest.fn()} />);

    await waitFor(() => expect(screen.getByText(mockQueries[0].name)).toBeInTheDocument());
    expect(screen.getByText(mockQueries[1].name)).toBeInTheDocument();
  });
});
