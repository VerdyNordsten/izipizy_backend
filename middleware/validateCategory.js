/* eslint-disable camelcase */
/* eslint-disable no-undef */

const validateCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const checkName = async name => {
      if (!name) return;
      if (!/^[a-zA-Z ]+$/.test(name)) throw new Error('Name must be alphabetic');
    };
    await Promise.all([
      checkName(name)
    ]);
    next();
  } catch (error) {
    return res.json({ message: error.message });
  }
};

module.exports = { validateCategory }
