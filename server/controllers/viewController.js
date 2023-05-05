exports.home = (req, res) => {
  res.status(200).render('login');
}

exports.register = (req, res) => {
  res.status(200).render('register');
}

exports.chat = (req, res) => {
  res.status(200).render('chat');
}