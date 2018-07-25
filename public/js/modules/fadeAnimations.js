let flashFadeOut = window.setTimeout(function() {
  $(".alert").fadeOut("slow", () => {
    $(this).remove();
  });
}, 2000);

let panelFadeIn = $(".panel").each(function(index) {
  $(this)
    .delay(index * 400)
    .fadeIn(300);
});

module.exports = {
  flashFadeOut,
  panelFadeIn
};
