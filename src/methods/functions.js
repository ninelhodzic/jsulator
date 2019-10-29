
const functions = {
    IS_NULL:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0]===null || operands[0]===undefined;
        }
    },
    SET_NULL:{
        minArgumentCount: 0, maxArgumentCount:0,
        fn: function(operands, argumentList, evaluationContext){
            return null;
        }
    },
    SIZE_OF:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].length;
        }
    },
    TYPE_OF:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return typeof(operands[0]);
        }
    },
    IS_OF_TYPE:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            return typeof(operands[0])===operands[1];
        }
    },
    IF: {
        minArgumentCount: 3, maxArgumentCount:3,
        fn: function(operands, argumentList, evaluationContext){
            if (operands[0]){
                return operands[1];
            }else{
                return operands[2];
            }
        }
    },
    NOW: {
        minArgumentCount: 0, maxArgumentCount:0,
        fn: function(operands, argumentList, evaluationContext){
            return new Date();
        }
    },
    MINUTE:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].getMinutes();
        }
    },
    HOUR:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].getHours();
        }
    },
    DAY:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].getDay();
        }
    },
    MONTH:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].getMonth();
        }
    },
    YEAR:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].getFullYear();
        }
    },
    DATE_DIFF:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0]-operands[1];
        }
    },
    TO_DATE:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return new Date(operands[0]);
        }
    },
    TO_INT:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return parseInt(operands[0])
        }
    },
    TO_DOUBLE:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return parseFloat(operands[0])
        }
    },
    TO_STRING:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].toString();
        }
    },
    TO_BOOLEAN:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            let val = operands[0];
            //console.log('typeof val=>'+ typeof(val));
            if (typeof(val)==='string'){
                return JSON.parse(val);
            }else if (typeof(val)==='number'){
                return val===0?false:true;
            }else if (typeof(val)==='boolean'){
                return val;
            }else {
                val = val.toString();
                return val==='true';
            }
        }
    },
    TO_LOWERCASE:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].toLowerCase();
        }
    },
    TO_UPPERCASE:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].toUpperCase();
        }
    },
    ABS:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            return Math.abs(operands[0]);
        }
    },
    REGEX_MATCH:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            const string = operands[0], regex = operands[1];
            return string.match(regex);
        }
    },
    REGEX_EXTRACT:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            const string = operands[0], regex = operands[1];
            return string.exec(regex);
        }
    },
    REGEX_REPLACE:{
        minArgumentCount: 3, maxArgumentCount:3,
        fn: function(operands, argumentList, evaluationContext){
            const string = operands[0], regex = operands[1], replacement=operands[2];
            return string.replace(regex, replacement);
        }
    },
    STRING_FORMAT:{},
    REPLACE_ALL:{
        minArgumentCount: 3, maxArgumentCount:3,
        fn: function(operands, argumentList, evaluationContext){
            const string = operands[0], regex = operands[1],replacement=operands[2];
            return string.split(regex).join(replacement);
        }

    },
    CONTAINS:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            return  operands[0].indexOf(operands[1]>-1)?true:false;
        }
    },
    SPLITTER:{
        minArgumentCount: 1, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            const target = operands[0];let splitter = ',';
            if (operands.length>1){
                splitter = operands[1];
            }
            return target.splice(splitter);
        }
    },
    SUBSTRING:{
        minArgumentCount: 2, maxArgumentCount:3,
        fn: function(operands, argumentList, evaluationContext){
            const target = operands[0];
            let start = 0;
            let end = target.length-1;
            if (operands.length===3){
                start = operands[1];
                end = operands[2];
            }
            return target.substring(start, end);
        }
    },
    INDEX_OF:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            const target = operands[0];const indexOf = operands[1];
            return target.indexOf(indexOf);
        }
    },

    SELECT:{
        minArgumentCount: 1, maxArgumentCount:Number.MAX_SAFE_INTEGER,
        fn: function(operands, argumentList, evaluationContext){
            const res = {};
            operands.forEach(function(item){
                const token = argumentList.splice(-1,1);
                const key = token.content;
                res[key]=item;
            });
            return res;
        }
    },
    LIST:{
        minArgumentCount: 1, maxArgumentCount:Number.MAX_SAFE_INTEGER,
        fn: function(operands, argumentList, evaluationContext){
            let res = [];
            operands.forEach(function(item){
                res = res.concat(item);
            });
            return res;
        }
    },
    MAP:{
        minArgumentCount: 0, maxArgumentCount:Number.MAX_SAFE_INTEGER,
        fn: function(operands, argumentList, evaluationContext){
            const tmpObj = {};
            console.log('MAP operands', operands, argumentList, evaluationContext);
            operands.forEach(function(item){
                console.log('typeof'+typeof(item));

                if (typeof(item)==='object'){
                    for(let prop in item){
                        tmpObj[prop] = item[prop];
                    }
                }
            });
            return tmpObj;
        }
    },
    FIELD:{
        minArgumentCount: 2, maxArgumentCount:3,
        fn: function(operands, argumentList, evaluationContext){
            console.log('called field', operands, argumentList, evaluationContext);
            const tmpObj = {};
            /*operands.forEach(function(item){
                if (typeof(item)==='object'){
                    for(let prop in item){
                        tmpObj[prop] = item[prop];
                    }
                }
            });*/
            tmpObj[operands[0]]=operands[1];
            console.log('res field', tmpObj);
            return tmpObj;
        }
    },
    REMOVE:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            if (Array.isArray(operands[0])){
                const index = operands[0].indexOf(operands[1]);
                if (index>-1)
                    operands[0].splice(index);
                return operands[0];
            }else if (typeof(operands[0])==='object'){
                delete operands[0][operands[1]];
                return operands[0];
            }
        }
    },
    THIS:{
        minArgumentCount: 0, maxArgumentCount:0,
        fn: function(operands, argumentList, evaluationContext){
            return evaluationContext;
        }
    },
    COPY:{},
    UNION:{
        minArgumentCount: 1, maxArgumentCount:Number.MAX_SAFE_INTEGER,
        fn: function(operands, argumentList, evaluationContext){
            const res = [];
            operands.forEach(function(item){
                res.push(item);
            });
            return res;
        }
    },
    EXTEND:{
        minArgumentCount: 1, maxArgumentCount:Number.MAX_SAFE_INTEGER,
        fn: function(operands, argumentList, evaluationContext){
            const target = {};
            operands.forEach(function(item){
                for (const prop in item){
                    target[prop] = item[prop];
                }
            });
            return target;

        }
    },
    KEYS:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            const target = operands[0];
            const res = [];
            for(const prop in target){
                res.push(prop)
            }
            return res;
        }
    },
    VALUES:{
        minArgumentCount: 1, maxArgumentCount:1,
        fn: function(operands, argumentList, evaluationContext){
            const target = operands[0];
            const res = [];
            for(const prop in target){
                res.push(target[prop])
            }
            return res;
        }
    },
    EXCLUDE_FIELDS:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            const target = operands[0];
            const listOfPros = operands[1];
            listOfPros.forEach(function(prop){
                delete target[prop];
            });
        }
    },
    GET:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0][operands[1]];
        }
    },
    ADD:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].push(operands[1]);
        }
    },
    PUT:{
        minArgumentCount: 3, maxArgumentCount:3,
        fn: function(operands, argumentList, evaluationContext){
            operands[0][operands[1]]=operands[2];
        }
    },
    LIMIT:{
        minArgumentCount: 2, maxArgumentCount:2,
        fn: function(operands, argumentList, evaluationContext){
            return operands[0].slice(0, operands[1]);
        }
    }
}

export default functions