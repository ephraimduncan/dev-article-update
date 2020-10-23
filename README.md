I've been wanting to do this and guess what, I did it. Motivated by various twitter posts, I decided to programatically change the title of this post based on the number of reactions.

In this post, while the title is still changing, I will try to explain in every detail how I came about it.

DEV has a very beta but stable api we can leverage for that. To use the DEV API, you need an API Key. Go to your [account settings](https://dev.to/settings/account) and scroll down to DEV API Keys and generate a new key to use for authentication with the DEV API.

With our keys in place, we can now take advantage of the DEV API. I'm using JavaScript but you can use any langauge of your choice.

We start with a new empty directory and a new file `index.js`. Run the command `npm init -y` in the directory to create a `package.json` file for the project.

Since we are dealing with an API, we will be making request to servers and we will need an http client. I prefer `axios` for JavaScript but you can use any client of your choice.

We have to install `axios` in our current project using npm

```bash
npm install axios
```

With `axios` installed, we must use it in our `index.js`.

```js
const axios = require('axios');
```

Axios supports many http methods but the major ones we will be using are `GET` method, to get the current reactions count and article id, and the `PUT` method, to update the current post title with the current reaction count.

We will create 2 main asynchronous functions. `getData` and `updateTitle`.

`getData` will makes a get request to the DEV API and get the current reaction count and id of the article and return it as an object.

```js
// getData
async function getData() {
  // Article Url
  const url = 'https://dev.to/dephraiim/title-loading-fdg-temp-slug-9870259';

  // Get article data
  const article = await axios.get(url);

  // Set the reaction and the id to a data object
  const data = {
    reactionCount: article.data.public_reactions_count,
    id: article.data.id,
  };

  // Return the data object
  return data;
}
```

`updatePost` will get the data from `getData` and make a put request to modify the title with the current post reactions.

```js
// updateTitle
async function updatePost() {
  // Destructure the properties from getData
  const { reactionCount, id } = await getData();

  // New Title for the article
  const body = {
    article: { title: `${reactionCount} Reactions On This Article!` },
  };

  // API Key
  const apiKey = {
    'api-key': process.env.dev_api, // Replace with the API Key when running locally.
  };

  // Article url
  const url = `https://dev.to/api/articles/${id}`;

  // PUT Request to update the title
  const update = await axios.put(url, body, {
    headers: apiKey,
  });

  // Log the response to the console.
  console.log(update);
}

updatePost();
```

That's it. But we need to run it in the terminal using Node.js.

```bash
node index.js
```

We can't run `node index.js` everytime we want to run the program. That won't make it automatic. Fortunately, we have Github Actions Workflows to automate it for us. This is the workflow I am using with the secrets to store my keys.

```yaml
name: Update Title

on:
  workflow_dispatch:
  schedule:
    - cron: '*/1 * * * *' # Runs every minute
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '12.x'
      - name: Install with npm
        run: npm install
      - name: Run bot
        run: node index.js
        env:
          dev_api: ${{ secrets.DEV_API_KEY }}
          # Use the Github Secrets to Store your DEV API Key
```

And that's it, we have our mini-self-updating-bot for our DEV articles. Let me see what else you can do with the api below.

For more info on the DEV API, visit the [DEV API Docs](https://docs.forem.com/api/)
