import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import ItemDetail from '../ItemDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const original = jest.requireActual('react-router-dom');
    return {
        ...original,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' }),
    };
});

describe('ItemDetail', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', async () => {
        let resolveFetch;
        const fetchPromise = new Promise(resolve => {
            resolveFetch = resolve;
        });

        fetch.mockImplementationOnce(() => fetchPromise);

        render(
            <MemoryRouter>
                <ItemDetail />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading/i)).toBeInTheDocument();

        await act(async () => {
            resolveFetch({
                ok: true,
                json: async () => ({ id: 1, name: 'Test', category: 'Cat', price: 100 }),
            });
        });

        await waitFor(() => {
            expect(screen.getByText(/Test/)).toBeInTheDocument();
        });
    });

    it('renders item details when found', async () => {
        const mockItem = { id: 1, name: 'Test Item', category: 'Test', price: 123 };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockItem
        });

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/items/1']}>
                    <Routes>
                        <Route path="/items/:id" element={<ItemDetail />} />
                    </Routes>
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/Test Item/)).toBeInTheDocument();
        expect(screen.getByText(/Category:/)).toBeInTheDocument();
        expect(screen.getByText(/\$123/)).toBeInTheDocument();
    });

    it('shows "Item not found" when API returns 404', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        await act(async () => {
            render(
                <MemoryRouter>
                    <ItemDetail />
                </MemoryRouter>
            );
        });

        expect(screen.getByText(/Item not found/i)).toBeInTheDocument();
    });

    it('navigates back on button click', async () => {
        const mockItem = { id: 1, name: 'Test Item', category: 'Test', price: 123 };
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockItem
        });

        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/items/1']}>
                    <Routes>
                        <Route path="/items/:id" element={<ItemDetail />} />
                    </Routes>
                </MemoryRouter>
            );
        });

        fireEvent.click(screen.getByText(/Back/i));
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
