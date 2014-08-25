var TemplateManager = {
    templates: {},

    get: function (path) {
        /// <summary>
        /// Load or get loaded template resource
        /// </summary>
        /// <param name="path" type="String">Full template path</param>
        var template = this.templates[path];
        if (template) {
            return template;

        } else {
            var that = this;
            $.ajax({
                url: path,
                method: 'GET',
                async: false,
                success: function (template) {
                    that.templates[path] = _.template(template);
                }
            });
            return this.templates[path];
        }
    }

};