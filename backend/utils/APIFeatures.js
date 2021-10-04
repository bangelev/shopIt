class APIFeatures {
    constructor(query, queryStr) {
            this.query = query
            this.queryStr = queryStr
                // console.log('IN CONSTRUCTOR', query, queryStr)
        }
        //So ovaj method vsushnost vnesuvame keyword - queryStr vo query
    search() {
        const keyword = this.queryStr.keyword ?
            {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: 'i',
                },
            } :
            {}
            // console.log(this.query)
        this.query = this.query.find({...keyword })
            // console.log(this.query)
            // Vraca promeneta inztanca od clasata
        return this
    }
    filter() {
            const queryCopy = {...this.queryStr }

            // remove filds from the query string
            const removedFields = ['keyword', 'limit', 'page']
            removedFields.forEach((el) => delete queryCopy[el])

            // Advance filter for price, ratting, etc.
            // Stringify query for replacement
            let queryStr = JSON.stringify(queryCopy)
                //Regex zamena
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

            this.query = this.query.find(JSON.parse(queryStr))
            return this
        }
        // Pagination => so ovaj method ne go menuvame query Product.find() tuku dodavame limit i skip
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)
        this.query = this.query.limit(resPerPage).skip(skip)
        return this
    }
}

module.exports = APIFeatures