const axios = require('axios');

// getData
async function getData() {
  // Article Url
  const url = 'https://dev.to/api/articles/dephraiim/title-loading-hao';

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
    'api-key': process.env.dev_api,
  };

  // Article url
  const url = `https://dev.to/api/articles/${id}`;

  // PUT Request to update the title
  const update = await axios.put(url, body, {
    headers: apiKey,
  });

  console.log(update);
}

updatePost();
