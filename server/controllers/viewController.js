

exports.home = (req, res) => {
 if(!res.locals.user) {

   res.status(200).render('login');
 }  else {
   res.status(200).render('chat');
 }
  
};

exports.register = (req, res) => {
  res.status(200).render('register');
};

exports.chat = (req, res) => {
  res.status(200).render('chat');
};
