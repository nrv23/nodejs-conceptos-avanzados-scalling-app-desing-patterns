

class AbstractState {

    sendMessage(url, message) {
        throw new Error("Implement sendMessage with this " + message + " argument and this url " + url);
    }

    connect() {
        throw new Error("Implement connect method with the socket + " + this.socket);
    }


}

module.exports = AbstractState;