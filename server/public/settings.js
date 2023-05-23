const btn = document.getElementById('copy-button');

btn.addEventListener('click', function () {
  var link = document.getElementById('link').value;
  navigator.clipboard
    .writeText(link)
    .then(function () {
      btn.textContent = 'Link copiado';
    })
    .catch(function () {
      console.log('');
    });
});
