const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your Github username: ", async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/events`
    );
    const events = response.data;

    console.log("\nYour Recent Activities: ");

    events.forEach((event) => {
      let action;
      switch (event.type) {
        case "WatchEvent":
          action = `Starred ${event.repo.name}`;
          break;
        case "CreateEvent":
          action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
          break;
        case "ForkEvent":
          action = `Forked ${event.repo.name}`;
          break;
        case "IssuesEvent":
          action = `${
            event.payload.action.charAt(0).toUpperCase() +
            event.payload.action.slice(1)
          } an issue in ${event.repo.name}`;
          break;
        case "PushEvent":
          const commitCount = event.payload.commits.length;
          action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
          break;
        default:
          action = `${event.type.replace("Event", "")} in ${event.repo.name}`;
          break;
      }
      console.log(`- ${action}`);
    });
  } catch (error) {
    console.error(
      "Error fetching user:",
      error.response?.status === 404 ? "User not found" : error.message
    );
  } finally {
    rl.close();
  }
});
