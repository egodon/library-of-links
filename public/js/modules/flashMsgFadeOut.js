let flashFadeOut = window.setTimeout(function() {
    $(".alert").fadeOut("slow", () => {
        $(this).remove();
        console.log("Message gone")
    });
}, 2000);

export default flashFadeOut;