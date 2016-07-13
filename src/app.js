(function() {

    function template(source) {
        var regExp = /\{\{(.*?)\}\}/g;
        return function(data) {
            var input  = source,
                output = [],
                match;

            data = data || {};

            while ((match = regExp.exec(input)) != null) {
                console.log(match)

                // if the match starts after the beginning of the input
                // prepend the string before the match index
                if (match.index > 0) {
                    output.push(input.substr(0, match.index));
                }

                // do the variable interpolation
                if (data.hasOwnProperty(match[1])) {
                    output.push(escape(data[match[1]]));
                }

                input = input.substr(match.index + match[0].lenght);
            }

            // If any othe part remains
            if (input) {
                output.push(input);
            }

            return output.join("");
        };
    }

    window.template = template;

    // Class Selection ---------------------------------------------------------
    function Selection() {
        this.__selectedElements = [];
    }

    /**
     * Toggles the selected state of the given image identified by ID...
     * @param  {String} imageId The id of the image
     * @return {void}
     */
    Selection.prototype.toggleImage = function(imageId) {
        var isSelected = this.__selectedElements[imageId];
        this.__selectedElements[imageId] = !isSelected;
    };


    function MainView() {}

    // consumes a list of public content matching some criteria (images).
    MainView.prototype.render = function(data, container) {
        data.forEach(this.renderImage, this);
    };

    MainView.prototype.renderImage = function(imageData, index) {
        var img = document.createElement('img');
        img.src = imageData.src;
        img.id  = index;
        return img;
    };

})();
