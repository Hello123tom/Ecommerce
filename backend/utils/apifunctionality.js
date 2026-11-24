 class APIFunctionality{
    constructor(query, queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        }:{};

        console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        const queryCopy = {...this.queryStr}
        const removeFields = ["keyword", "limit", "page",]
        removeFields.forEach((key) => delete queryCopy[key]);
        console.log(`queryCopy2: ${JSON.stringify(queryCopy)}`);
        console.log(`queryCopy3: ${this.query}`);

        const query = this.query.find(queryCopy)
        console.log(`queryCopy4: ${query}`);
        this.query = this.query.find(queryCopy);
        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        console.log(`resultPerPage: ${resultPerPage}`);
        return this
    }
}


export default APIFunctionality;