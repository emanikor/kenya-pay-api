// wraps async routes-hander and auto catch error
//insted of try catching error in every routes , just wrap this 
const asyncHandler =fn =>(req, res, next)=>
    promise.resolve(fn(req,res, next)).catch(next);

module.exports = asyncHandler;