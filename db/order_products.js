const client = require('./client');

const createOrderProduct = async ({ orderId, productId, quantity }) => {
  try {
    const {
      rows: [orderProduct],
    } = await client.query(
      `
    INSERT INTO orderproducts ("orderId", "productId", quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
`,
      [orderId, productId, quantity]
    );
    console.log(orderProduct);
    return orderProduct;
  } catch (error) {
    console.log('Error creating order product');
    throw error;
  }
};

module.exports = { createOrderProduct };