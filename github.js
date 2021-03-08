const fetch = require("node-fetch");
require('dotenv').config();

async function fetchUserRepoNames(username) {
    // fetch all user repositories
    try {
        const res = await fetch("https://api.github.com/users/" + username + "/repos", {
            headers: {
                authorization: "token" + process.env.GITHUB_TOKEN
            }
        });  
        const data = await res.json() 
        
        const result = await Promise.all(
            data.map(repoData => repoData.name)
        );

        return new Promise((resolve, reject) => {
            resolve(result);
        });
    } catch (error) {
        console.log(error.message);
    }
}

async function getRepoLanguages(username, repoName) {
    // return languages obj for a single repo  
    try {
        const res = await fetch("https://api.github.com/repos/" + username + "/" + repoName + "/languages", {
            headers: {
                authorization: "token" + process.env.GITHUB_TOKEN
            }
        });
        const data = await res.json()
        return new Promise((resolve, reject) => {
            resolve(data);
        });
    } catch (error) {
        console.log(error.message);
    }
}


const mergeRepoLangs = data => {
  const result = {};

  data.forEach(repo => { 
    for (let [key, value] of Object.entries(repo)) { 
      if (result[key]) { 
        result[key] += value;
      } else {
        result[key] = value;
      }
    }
  });
  return result;
};



async function buildOutput(username) {
  let output = {};
  const userRepos = await fetchUserRepoNames(username);

  let userLangs = []  
  for (repo of userRepos) {
    const repoLangs = await getRepoLanguages(username, repo);
    userLangs.push(repoLangs)
  }

  return mergeRepoLangs(userLangs);
   
  }


buildOutput('charunupara').then((langBytes) => {
  const userLangData = {langBytes, totalBytes: Object.values(langBytes).reduce((a, b) => a + b, 0)}
  console.log(userLangData)
})
