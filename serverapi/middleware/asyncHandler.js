// wraps async routes-hander and auto catch error
//insted of try catching error in every routes , just wrap this 
const asyncHandler =fn =>(req, res, next)=>
   Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;