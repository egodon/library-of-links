const search =  $(document).ready(() =>{

    const $searchBar = $('.search-bar');
    let $panelTitles;

    $searchBar.focus(() => {
        $panelTitles = $('.panel-title');
    })

    $searchBar.keyup(() => {
        for (let i = 0; i < $panelTitles.length; i++){
            const searchInput = $searchBar.val().toUpperCase();
            const panelTitle = $panelTitles[i].textContent.toUpperCase();

            if (panelTitle.indexOf(searchInput) > -1){
                $panelTitles[i].parentNode.parentNode.style.display = '';

            }else {
                $panelTitles[i].parentNode.parentNode.style.display = 'none';
            }
        }
    });
});



export default search;