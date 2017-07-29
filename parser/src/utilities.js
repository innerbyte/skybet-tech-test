"use strict"

class Utilities {
    static slugify(text) {
        if (typeof text === "undefined" || text === null)
            return "";

        const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
        const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
        const p = new RegExp(a.split('').join('|'), 'g');

        return text.toString().trim().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(p, c =>
                b.charAt(a.indexOf(c)))     // Replace special chars
            .replace(/&/g, '-and-')         // Replace & with 'and'
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');             // Trim - from end of text
    }
}

module.exports = Utilities;