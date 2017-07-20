let search =  $(document).ready(() =>{

    let $searchBar = $('.search-bar');
    let $panelTitles = $('.panel-title');

    $searchBar.keyup(() =>{
        for (let i = 0; i < $panelTitles.length; i++){
            let searchInput = $searchBar.val().toUpperCase();
            let panelTitle = $panelTitles[i].textContent.toUpperCase();

            if (panelTitle.indexOf(searchInput) > -1){
                $panelTitles[i].parentNode.parentNode.style.display = '';

            }else {
                $panelTitles[i].parentNode.parentNode.style.display = 'none';
            }
        }
    });
});



export default search;