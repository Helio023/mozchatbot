(()=>{var e=document.querySelector("#form"),t=document.querySelector("#btn");function n(){var e=document.querySelector(".alert");e&&e.parentElement.removeChild(e)}function o(e,t){n();var o='<div style="text-align: center" class=\'alert alert--'.concat(e,"'>").concat(t,"</div>");document.querySelector("body").insertAdjacentHTML("afterbegin",o),setTimeout((function(){return n()}),5e3)}e.addEventListener("submit",(function(e){e.preventDefault();var n=document.querySelector("#email"),r=document.querySelector("#password");!function(e,n){t.textContent="Entrando...",axios({method:"POST",url:"".concat("https://www.mozbotchat.com","/login"),data:{email:e,password:n}}).then((function(){t.textContent="Enviar",o("success","Usuário logado com sucesso!"),setTimeout((function(){window.location.assign("/chat")}),3e3)})).catch((function(e){var n;t.textContent="Enviar",o("error",null===(n=e.response)||void 0===n||null===(n=n.data)||void 0===n||null===(n=n.message)||void 0===n?void 0:n.split(". ")[0])}))}(n.value,r.value)}))})();