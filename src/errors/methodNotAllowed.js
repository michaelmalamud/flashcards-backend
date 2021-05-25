function methodNotAllowed (request, response, next) {
    next({
        message: 405,
        status: `Method not allowed: ${request.method}`
    })
}

module.exports = methodNotAllowed;