const adminCheck = (req, res, next) => {
    // console.log(req.user)
    if (req.user && req.user.role === 'admin')
        next();
      else
        res.status(401).send('Unauthorized');
}

module.exports = adminCheck