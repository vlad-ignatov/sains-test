/* global $*/
$(function () {
    var SELECTION;

    function cb(data) {
        data.items.forEach(function(item) {
            var img       = document.createElement("div");
            img.className = "img";
            img.title     = item.title;
            img.setAttribute("data-url", item.media.m);
            img.style.backgroundImage = "url('" + item.media.m + "')";
            document.body.appendChild(img);
        });
        renderSelection();

        // Cleanup the global scope after this one-time operation is complete
        delete window.cb;
    }

    function loadSelection() {
        return JSON.parse(localStorage.getItem("Sainsburys.selection") || "{}");
    }

    function saveSelection() {
        localStorage.setItem("Sainsburys.selection", JSON.stringify(SELECTION));
    }

    function renderSelection() {
        var url, hasGarbage;

        $(".img").each(function(i, img) {
            $(img).toggleClass("selected", SELECTION[img.getAttribute("data-url")] === true);
        });

        // The script loads 20 latest images which means that they change
        // frequently. Afer reload the some of the selected images might not
        // exist any more. In that case the entry will remain in the localStorage
        // "forever" and the usable space (about 5MB) will decrease over time!
        // That is why we need to do one extra step and remove such dead records.
        for ( url in SELECTION ) {
            if (!$('.img[data-url="' + url + '"]').length) {
                SELECTION[url] = undefined;
                hasGarbage = true;
            }
        }

        if (hasGarbage) {
            saveSelection();
        }
    }


    // Use event delegation to handle clicks (selection changes)
    $("body").click(".img", function(event) {
        event.preventDefault();
        var url = event.target.getAttribute("data-url");
        if (!event.metaKey) {
            var isSelected = SELECTION[url];
            SELECTION = {};
            SELECTION[url] = !isSelected;
        }
        else {
            SELECTION[url] = !SELECTION[url];
        }
        saveSelection();
        renderSelection();
    });

    // INIT --------------------------------------------------------------------

    // Make the JSONP callback global
    window.cb = cb;

    // Load the previous selection (if any)
    SELECTION = loadSelection();

    var tags   = 'london';
    var script = document.createElement('script');
    script.src = 'https://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=cb&tags=' + tags;
    document.head.appendChild(script);
});
