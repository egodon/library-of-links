let flashFadeOut = window.setTimeout(function() {
    $(".alert").fadeOut("slow", () => {
        $(this).remove();
    });
}, 2000);

export default flashFadeOut;