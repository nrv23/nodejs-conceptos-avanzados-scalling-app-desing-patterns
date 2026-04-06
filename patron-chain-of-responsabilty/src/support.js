const Handle = require("./handle");

class BasicSupport extends Handle {
  handle(request) {
    switch (request.type) {
      case "unknown":
        console.log(
          "Basic Support: Request cannot be handled cause it's of an unknown type."
        );
        break;
      case "basic":
        console.log("Basic Support: Handling request.");
        break;
      default: {
        console.log("Basic Support: Passing request to the next handler...");
        super.handle(request);
      }
    }
  }
}

class TechnicalSupport extends Handle {
  handle(request) {
    if (request.type === "technical") {
      console.log("Technical Support: Handling request.");
    } else {
      console.log("Technical Support: Passing request to the next handler...");
      super.handle(request);
    }
  }
}

class ManagerSupport extends Handle {
  handle(request) {
    if (request.type === "manager") {
      console.log("Manager Support: Handling request.");
    } else {
      console.log(
        "Manager Support: Support: Passing request to the next handler..."
      );
      super.handle(request);
    }
  }
}

class DirectorSupport extends Handle {
  handle(request) {
    if (request.type === "director") {
      console.log("Director Support: Handling request.");
    } else {
      console.log(
        "Director Support: Request cannot be handled. No further handlers available."
      );
      //super.handle(request);
    }
  }
}

module.exports = {
  BasicSupport,
  TechnicalSupport,
  ManagerSupport,
  DirectorSupport
};
