const request = require('supertest');
const app = require('../server');

describe('Orders API', () => {
  let createdOrderId;

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [
          { productId: 1, quantity: 2, price: 8.99 }
        ],
        totalAmount: 17.98,
        deliveryDetails: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '555-1234'
        }
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.status).toBe('Order Received');
    
    createdOrderId = res.body.data.id;
  });

  it('should not create an order without items', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [],
        totalAmount: 0,
        deliveryDetails: {
          name: 'John Doe',
          address: '123 Main St',
          phone: '555-1234'
        }
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should fetch all orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should fetch an order by ID', async () => {
    const res = await request(app).get(`/api/orders/${createdOrderId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdOrderId);
  });

  it('should update order status', async () => {
    const res = await request(app)
      .put(`/api/orders/${createdOrderId}/status`)
      .send({ status: 'Preparing' });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Preparing');
  });
});
