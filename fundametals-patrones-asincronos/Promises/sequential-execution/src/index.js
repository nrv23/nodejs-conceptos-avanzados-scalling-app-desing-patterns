const fs = require("fs");

const executeTasksInSequence = () => {
  console.log("🚀 Starting the process...");
  setTimeout(() => {
    console.log("⏳ Waiting for the first timeout...");
    setTimeout(() => {
      console.log("⏳ Waiting a bit more...");
      fs.writeFile("test.txt", "Test File...", (error) => {
        if (error) {
          console.error("❌ Error writing file:", error);
        } else {
          console.log("✅ test.txt has been created");
          setTimeout(() => {
            fs.unlink("test.txt", (error) => {
              if (error) {
                console.error("❌ Error removing file:", error);
              } else {
                console.log("🗑️ test.txt has been removed");
                console.log("🏁 Sequential execution complete");
              }
            });
          }, 3000);
        }
      });
    }, 2000);
  }, 1000);
};

executeTasksInSequence();
