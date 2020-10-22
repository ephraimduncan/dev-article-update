const axios = require('axios');

// getData
async function getData() {
  // Article Url
  const url = 'https://dev.to/dephraiim/title-loading-fdg-temp-slug-9870259';

  // Get article data
  const article = await axios.get(url).data;

  // Set the reaction and the id to a data object
  const data = {
    reactionCount: article.public_reactions_count,
    id: article.id,
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
    article: { title: `${reactionCount} Reactions` },
  };

  // API Key
  const apiKey = {
    'api-key': 'DEV_API_KEY',
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
