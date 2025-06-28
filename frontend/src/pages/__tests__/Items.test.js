import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Items from '../Items';
import { DataContext } from '../../state/DataContext';
import { BrowserRouter } from 'react-router-dom';

const mockItems = [
    { id: 1, name: 'Item A', category: 'Category A', price: 10 },
    { id: 2, name: 'Item B', category: 'Category B', price: 20 }
];

const mockFetchItems = jest.fn().mockResolvedValue(undefined);

function renderWithContext(items = mockItems, isLoading = false, total = 2) {
    return render(
        <BrowserRouter>
            <DataContext.Provider value={{ items, fetchItems: mockFetchItems, total, isLoading }}>
                <Items />
            </DataContext.Provider>
        </BrowserRouter>
    );
}

test('renders items after loading', async () => {
    renderWithContext();

    // Wait for skeleton to disappear
    await waitFor(() => {
        expect(screen.queryByText(/no items found/i)).not.toBeInTheDocument();
    });

    // Check item rendering
    expect(screen.getByText(/Item A/)).toBeInTheDocument();
    expect(screen.getByText(/Item B/)).toBeInTheDocument();
});

test('shows "No items found" if list is empty', async () => {
    renderWithContext([], false, 0);

    expect(await screen.findByText(/No items found/i)).toBeInTheDocument();
});

test('shows loading skeletons', () => {
    renderWithContext(mockItems, true);

    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
});

test('typing in search updates input', async () => {
    renderWithContext();

    const input = screen.getByPlaceholderText(/search items/i);
    fireEvent.change(input, { target: { value: 'Laptop' } });

    expect(input.value).toBe('Laptop');
});
