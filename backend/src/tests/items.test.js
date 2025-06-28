
const path = require('path');
process.env.DATA_PATH = path.join(__dirname, 'mock-items.json');

jest.mock('../utils/getCookie', () => {
    return jest.fn().mockResolvedValue({ token: 'mocked-token-123' });
});

const request = require('supertest');
const fs = require('fs').promises;
const app = require('../index');

const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, '../../../data/items.json');

const mockData = [
    { id: 1, name: 'Item A', price: 10 },
    { id: 2, name: 'Item B', price: 20 },
    { id: 3, name: 'Item C', price: 30 }
];

beforeEach(async () => {
    await fs.writeFile(DATA_PATH, JSON.stringify(mockData, null, 2));
});

describe('GET /api/items', () => {
    it('Must return all items ', async () => {
        const res = await request(app).get('/api/items');
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(mockData.length);
    });

    it('Must apply search filter with ?q=', async () => {
        const res = await request(app).get('/api/items?q=item');
        expect(res.status).toBe(200);
        expect(res.body.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'Item A' }),
                expect.objectContaining({ name: 'Item B' })
            ])
        );
    });

    it('Must apply limit with ?limit=', async () => {
        const res = await request(app).get('/api/items?limit=2');
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(2);
    });
});

describe('GET /api/items/:id', () => {
    it('Should return one item by id', async () => {
        const res = await request(app).get('/api/items/1');
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Item A');
    });

    it('Should return 404 error for non-existent ID', async () => {
        const res = await request(app).get('/api/items/999');
        expect(res.status).toBe(404);
        expect(res.body.message || res.text).toMatch(/not found/i);
    });
});

describe('POST /api/items', () => {
    it('Must add a new item', async () => {
        const newItem = { name: 'Novo', price: 99 };
        const res = await request(app).post('/api/items').send(newItem);

        expect(res.status).toBe(201);
        expect(res.body.name).toBe(newItem.name);
        expect(res.body).toHaveProperty('id');

        const fileData = JSON.parse(await fs.readFile(DATA_PATH, 'utf-8'));
        expect(fileData).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'Novo', price: 99 })
            ])
        );
    });
});

afterAll(async () => {
    await fs.unlink(process.env.DATA_PATH).catch(() => { });
});

