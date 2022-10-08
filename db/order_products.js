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

const getOrderProductById = async id => {
  try {
    const {
      rows: [orderProduct],
    } = await client.query(`
      SELECT *
      FROM orderproducts
      WHERE id=${id};
    `);

    return orderProduct;
  } catch (error) {
    console.log('Error getting order product by ID');
    throw error;
  }
};

const checkForOrderProductPair = async (orderId, productId) => {
  try {
    const {
      rows: [orderProduct],
    } = await client.query(`
      SELECT *
      FROM orderproducts
      WHERE "orderId"=${orderId} AND "productId"=${productId};
    `);

    return orderProduct;
  } catch (error) {
    console.log('Error checking for order product pair');
    throw error;
  }
};

const addProductToOrder = async ({ orderId, productId, quantity }) => {
  try {
    const check = await checkForOrderProductPair(orderId, productId);
    if (!check) {
      const {
        rows: [orderProduct],
      } = await client.query(`
        INSERT INTO orderproducts ("orderId", "productId", quantity)
        VALUES (${orderId}, ${productId}, ${quantity})
        RETURNING *;
      `);

      return orderProduct;
    }
  } catch (error) {
    console.log('Error adding product to order');
    throw error;
  }
};

const updateOrderProduct = async (id, fields = {}) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');

  try {
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE orderproducts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
    }

    return await getOrderProductById(id);
  } catch (error) {
    console.log('Error updating order product');
    throw error;
  }
};

module.exports = {
  createOrderProduct,
  getOrderProductById,
  checkForOrderProductPair,
  addProductToOrder,
  updateOrderProduct,
};
