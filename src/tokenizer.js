import xregexp from 'xregexp';

const tokenizer = {
    pattern: null,
    regeXp: null,
    toRegex: function (delimiters) {
        this.pattern = '(';
        this.pattern += "'#.*?#'|'.*?'|";
        if (delimiters && delimiters.length) {
            const that = this;
            delimiters.forEach(function (delim) {
                that.pattern += "\\";
                let tmpDelim = '';
                if (delim.length > 1) {
                    for (let i = 0; i < delim.length; i++) {
                        const c = delim[i];
                        tmpDelim += c;
                        if (i < delim.length - 1) {
                            tmpDelim += '\\';
                        }
                    }
                } else {
                    tmpDelim = delim;
                }
                if (tmpDelim && tmpDelim.trim()) {
                  that.pattern += tmpDelim.trim();
                  that.pattern += "|";
                }
            });
            this.pattern = this.pattern.substring(0, this.pattern.length - 1);
        }
        this.pattern += ")";
        this.regeXp = xregexp(this.pattern, 'gs');
    },
    tokenizer: function (ops) {
        if (ops && ops.length) {
            const delimiters = [];
            ops.forEach(function (op) {
                if (delimiters.indexOf(op) === -1) {
                    delimiters.push(op);
                }
            });

            this.toRegex(delimiters);
        }

        return this;
    },
    tokenize: function (str) {
        if (this.regeXp) {
            let pos = 0, result = [], match;
            const that = this;

            while (match = xregexp.exec(str, this.regeXp, pos)) {
                if (pos !== match.index){// that.regeXp.lastIndex) {
                    //let res = str.substring(pos, str.length === that.regeXp.lastIndex ? that.regeXp.lastIndex : that.regeXp.lastIndex - 1);
                    let res = str.substring(pos, match.index);
                    if (res && res.trim())
                        result.push(res.trim());
                }

                let m = match[0];
                if (m && m.trim())
                    result.push(m.trim());
                pos = match.index + match[0].length;
            }
            if (pos !== str.length) {
                let s = str.substring(pos);
                if (s && s.trim())
                    result.push(s.trim());
            }
            return result;
        }
    }
}

export default tokenizer
