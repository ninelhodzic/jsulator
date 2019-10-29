const pathExtractor = {
    resolve(expression, dataContext) {
        return dataContext[expression];
    }
}

export default pathExtractor