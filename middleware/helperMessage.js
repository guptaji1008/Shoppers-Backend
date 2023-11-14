export const helperMessage = (res, message, statusCode = 401) => {
    return res.status(statusCode).send(message)
}

export const handleError = (err, req, res, next) => {
    res.status(500).send(err.message || err)
}

export const handleNotFound = (req, res) => {
    this.helperMessage(res, "Page not found", 404)
}