let form = document.getElementById("lobby__form");

const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const room = params.get("room");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  sessionStorage.setItem("display_name", name);

  let inviteCode = room;
  if (!inviteCode) {
    inviteCode = String(Math.floor(Math.random() * 10000));
  }
  window.location = `room.html?room=${inviteCode}`;
});
