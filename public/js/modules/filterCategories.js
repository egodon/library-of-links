let filterCategories = $(document).ready(() => {
  let $categories = $(".categories");
  let $category = $(".category");
  let $categoryWord = $($categories.children()[0]);

  $category.hover(
    e => {
      $category.removeClass("greyed-out");
      $category.each((index, value) => {
        let $cat = $(value);
        if (e.target !== value && !$cat.hasClass("category-selected")) {
          $cat.addClass("greyed-out");
        }
      });
    },
    () => {
      $categoryWord.text("Categories:");
      // State where no category is selected
      if (!$categoryWord.hasClass("category-selected")) {
        $category.each((index, value) => {
          let $cat = $(value);
          $cat.removeClass("greyed-out");
        });
      } else {
        // State where a category is selected
        $category.each((index, value) => {
          let $cat = $(value);
          if (!$cat.hasClass("category-selected")) {
            $cat.addClass("greyed-out");
          }
        });
      }
    }
  );

  $categories.click(e => {
    let $target = $(e.target);
    $categoryWord.addClass("category-selected");
    $category.each((index, value) => {
      let $cat = $(value);
      if (e.target !== value && $cat.hasClass("category-selected")) {
        $cat.removeClass("category-selected");
        $cat.addClass("greyed-out");
      }
    });
    $target.addClass("category-selected");

    const category = $target.text().trim();
    $.ajax({
      type: "GET",
      url: `https://api.mlab.com/api/1/databases/linklib/collections/links/?q={'category': '${category}' }&s={"_id": -1}&apiKey=L9_WEqfVS1SaIdZ5mfToatlnrUtbM2pV`,
      success: data => {
        handleData(data);
      },
      error: () => {
        console.log("Could not load categories");
      }
    });

    const handleData = data => {
      let $listGroup = $(".list-group");
      $listGroup.empty();
      data.forEach(link => {
        $("<div>", {
          class: `panel panel-default panel-category-${link.category.toLowerCase()}`
        })
          .append(
            $("<div>", { class: "panel-heading" }).append(
              $("<h3>", { class: "panel-title" }).text(link.title),
              $("<div>", { class: "panel-under-title" }).append(
                $("<p>").text(
                  `Submitted by ${link.submitter} on ${link.submissionDate}`
                )
              )
            ),
            $("<div>", { class: "panel-body" }).append(
              $("<a>", {
                class: "panel-link-url",
                href: link.url,
                target: "_blank"
              }).text(link.url)
            )
          )
          .appendTo($listGroup);
      });
    };
  });
});

export default filterCategories;
