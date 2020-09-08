export function createMongoUri(options) {
    let uri = "mongodb+srv://";
    if (options.username && options.username != "" && options.password && options.password != "") {

        uri += options.username + ":" + options.password + "@";
    }
    uri += options.host + "/" + options.database + "retryWrites=true&w=majority";
    return uri;
}
