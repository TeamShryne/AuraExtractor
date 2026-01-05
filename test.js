const aura = require("./dist/index").default;

(async () => {
  try {
    console.log("Searching...");
    const results = await aura.search.query("Linkin Park"); 
    
    console.log(`Found ${results.items.length} items.`);
    
    if (results.items.length > 0) {
        console.log("First Item:", results.items[0]);
    }

    if (results.continuation) {
        console.log("Continuation Token found:", results.continuation.substring(0, 20) + "...");
    }

  } catch (e) {
    console.log(e);
  }
})();