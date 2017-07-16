let filterCategories = $(document).ready( () => {

    let $categories = $('.categories');
    let $category = $('.category');
    let $word = $($categories.children()[0]);

    // On hover, the categories list items will grey out except
    // the one that is being targeted
    $category.hover( (e) =>{
        $word.text('Filter By:').append("&nbsp;&nbsp;&nbsp;&nbsp;");
        $category.each((index, value) => {
            if (e.target !== value) {
                let $cat = $(value);
                $cat.toggleClass('greyed-out');
            }
        });
    }, () => {
            $word.text('Categories:');
            $category.each((index, value) => {
                let $cat = $(value);
                $cat.removeClass('greyed-out');
            });
    });

    // When a category is clicked the list group of the links will
    // be re-rendered filtered by the selected category
    $categories.on('click', (e) => {
        let $target = e.target;
        const category =  $target.innerHTML;

        $.ajax({
            type: 'GET',
            url: `https://api.mlab.com/api/1/databases/linklib/collections/links/?q={'category': '${category}' }&s={"_id": -1}&apiKey=L9_WEqfVS1SaIdZ5mfToatlnrUtbM2pV`,
            success: (data) => {
                handleData(data);
            },
            error: () => {
                console.log('Could not load categories')
            }
        });

        let handleData = (data) =>{
            let $listGroup = $('.list-group');
            $listGroup.empty();
            data.forEach( (cat) => {
                $("<div>", {class: `panel panel-default panel-category-${cat.category.toLowerCase()}`}).append(
                    $("<div>", {class: 'panel-heading'}).append(
                        $("<h3>", {class: 'panel-title'}).text(cat.title),
                        $("<div>", {class: 'panel-under-title'}).append(
                            $("<p>").text(`Submitted by ${cat.submitter} on ${cat.submissionDate}`)
                        )
                    ),
                    $("<div>", {class: 'panel-body'}).append(
                        $("<a>", {class: 'panel-link-url'}).text(cat.url)
                    )
                ).appendTo($listGroup);
            });
        }
    });

});


export default filterCategories;
