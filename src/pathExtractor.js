const pathExtractor = {

    fetchDot(notation, obj) {
        console.log('Splitted', notation.split(/[\.\[\]]/g).filter(x=>x));
        const that = this;
        return notation.split(/[\.\[\]]/g).filter(x=>x).reduce(function (lastObj, currentProp) {
            try {
                console.log('Fetch dot =>', lastObj, currentProp);
                // Arrays! Tricky tricky. Though not really.
                if (currentProp.indexOf(']') !== -1) {
                    currentProp = parseInt(currentProp.match(/([0-9]+)\]/)[1]);
                }

                console.log('Fetch dot 1 =>', lastObj, currentProp);

                if (Array.isArray(lastObj)){
                    if (!Number.isNaN(Number(currentProp))){
                        return lastObj[currentProp];
                    }else {
                        let res = [];
                        lastObj.forEach(function (item) {
                            let tmp = that.fetchDot(currentProp, item);
                            res.push(tmp);
                        });
                        return res;
                    }
                }

                if (lastObj.hasOwnProperty(currentProp) || (Array.isArray(lastObj) && lastObj[currentProp])) {
                    return lastObj[currentProp];
                }

                if (currentProp === '') {
                    return lastObj;
                }
            } catch (ex) {
                return undefined;
            }
        }, obj);
    },
    resolve(expression, dataContext) {
        let res = this.fetchDot(expression, dataContext);
        return res;
    }
}

export default pathExtractor
