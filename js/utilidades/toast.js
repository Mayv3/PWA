function mostrarToast(mensaje = "Default", color = "green") {
  const toastHTML = `
      <div class="toast vw-100 rounded-bottom border-0 p-4 position-fixed w-100 text-center" role="alert" aria-live="assertive" aria-atomic="true" style="background-color: ${color}; color: white; top: 0; left: 0;">
        <div class="toast-body d-flex justify-content-center align-items-center" style="font-size: larger;">
          ${mensaje}
          <img class="check mx-2" src="../img/tilde.png" alt="check">
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("afterbegin", toastHTML);
  const toastElement = $(".toast");
  const delay = 3000;

  toastElement.toast({ delay: delay });
  toastElement.toast("show");

  setTimeout(() => {
    if (document.body.contains(toastElement[0])) {
      document.body.removeChild(toastElement[0]);
    }
  }, delay + 1000);
}
