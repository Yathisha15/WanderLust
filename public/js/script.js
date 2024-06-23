// Example starter JavaScript for disabling form submissions if there are invalid fields
// to avoid the browser default error message i.e when we not enter anything in the required field it shows this is required field but it show different in different browser to avoid this we use novalidate it use defalut bootstrap( in new.ejs file)
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()