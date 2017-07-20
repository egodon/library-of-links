let filterCategories = $(document).ready( () => {

    let $categories = $('.categories');
    let $category = $('.category');
    let $categoryWord = $($categories.children()[0]);

    // On hover, the category list items will grey out except
    // the one that is being targeted
    $category.hover( (e) =>{
        $categoryWord.text('Filter By:').append("&nbsp;&nbsp;&nbsp;&nbsp;");
        $category.removeClass('greyed-out');
        $category.each((index, value) => {
            let $cat = $(value);
            if (e.target !== value && !($cat.hasClass('category-selected'))) {
                $cat.addClass('greyed-out');
            }
        });
    }, () => {
            $categoryWord.text('Categories:');
            // State where no category is selected
            if(!$categoryWord.hasClass('category-selected')){
                $category.each((index, value) => {
                    let $cat = $(value);
                    $cat.removeClass('greyed-out');
                });
            } else { // State where a category is selected
                $category.each((index, value) => {
                    let $cat = $(value);
                    if (!$cat.hasClass('category-selected')){
                        $cat.addClass('greyed-out');
                    }
                });
            }
    });


    $categories.click( (e) => {
        let $target = $(e.target);
        $categoryWord.addClass('category-selected');
        $category.each((index, value) => {
            let $cat = $(value);
            if (e.target !== value && $cat.hasClass('category-selected')) {
                $cat.removeClass('category-selected');
                $cat.addClass('greyed-out')
            }
        });
        $target.addClass('category-selected');

        const category = $target.text();
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

        // When a category is clicked the list group of the links will
        // be re-rendered filtered by the selected category
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
                        $("<a>", {class: 'panel-link-url', href: cat.url, target: '_blank'}).text(cat.url)
                    )
                ).appendTo($listGroup);
            });
        }
    });

});


export default filterCategories;
