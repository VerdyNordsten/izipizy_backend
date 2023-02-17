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
  } catch (err) {
    return res.json({ message: err.message });
  }
};

module.exports = { validateCategory }
