// const signinModale = document.querySelector('#signin-modale');

const toggleForm = () => {
  const container = document.querySelector('#signin-container');
  container.classList.toggle('active');
};


function selectText() {
  const pass = document.querySelector('#password')
  pass.focus();
  pass.select();
  console.log(pass);
}
// const pass = document.querySelector('#password')
// const confirmPass = document.querySelector('#confirm-password')

// confirmPass.addEventListener('keyup',()=>{
//   if (confirmPass.textContent!==pass){
//     confirmPass.style.borderColor="red"
//   }else{
//     confirmPass.style.borderColor="green"
//   }
// } )





