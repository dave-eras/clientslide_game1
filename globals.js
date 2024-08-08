
const API_BASEURL = "https://api.olscloudserver.site"

player = new Player(global)

player.targetLanguageUrl = "https://academy.europa.eu/pluginfile.php/1230926/mod_resource/content/1/game_1.xml"
player.helpLanguageUrl = "https://academy.europa.eu/pluginfile.php/1230879/mod_resource/content/1/game_1_help_language.xml"

function Player(player) {
    this.player = player.GetPlayer()
    this.username = ""
    this.password = ""
    this.avatar = ""
    this.targetLanguage = ""
    this.helpLanguage = ""

    this.targetLanguageUrl = ""
    this.helpLanguageUrl = ""

    this.levelsOpen = 0

    this.yetiScoresLevel1 = []
    this.yetiScoresLevel2 = []

    this.words = []
    this.phrases = []

    this.ReadDataSignUp = function(){
        if (!this.player) {
            console.error("GetPlayer returned null or undefined");
            return
        }

        this.username = this.player.GetVar("data_userName");
        this.password = this.player.GetVar("data_userPassword");
        this.avatar = this.player.GetVar("data_userAvatar");
        this.targetLanguage = this.player.GetVar("targetLanguage");
        this.helpLanguage = this.player.GetVar("helpLanguage");
        this.levelsOpen = this.player.GetVar("levelsOpen");

        for (let i = 1; i <= 50; i++) {
            this.words["Word_" + i] = '';
        }

        for (let i = 1; i <= 50; i++) {
            this.phrases["TF_Phrase_" + i] = false;
        }
    }
    this.ReadDataSignIn = function(){
        if (!this.player) {
            console.error("GetPlayer returned null or undefined");
            return
        }

        this.username = this.player.GetVar("data_userName");
        this.password = this.player.GetVar("data_userPassword");
        this.targetLanguage = this.player.GetVar("targetLanguage");
    }
    this.ReadDataUsername = function(){
        this.username = this.player.GetVar("data_userName");
    }

    this.ValidUsername = function(){
        this.ReadDataSignUp()

        if (this.username.length < 4 || this.username.length > 12) {
            this.player.SetVar("error_5", 'True');
            return
        } else {
            this.player.SetVar("error_5", 'False');
        }

        let req = new Request(API_BASEURL + "/checkUserName?userName=" + encodeURIComponent(this.username), "GET", {}, {})
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.error_3 === false) {
                        this.player.SetVar("error_3", 'False');
                    } else {
                        this.player.SetVar("error_3", 'True');
                    }
                })
            } else {
                console.log("request failed, http code: " + resp.status)
            }
        })
    }

    this.SignUp = function(){
        this.ReadDataSignUp()

        let headers = {
            'Content-Type': 'application/json'
        }

        let data = {
            userName: this.username,
            userPassword: this.password,
            userAvatar: this.avatar,
            targetLanguage: this.targetLanguage,
            helpLanguage: this.helpLanguage,
            levelsOpen: this.levelsOpen,
            yetiScoresLevel1: [0],
            yetiScoresLevel2: [0],
            ...this.words,
            ...this.phrases
        }

        let req = new Request(API_BASEURL + "/createUser", "POST", headers, data)
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        this.player.SetVar("userCreationStatus", 'Success');
                    } else {
                        this.player.SetVar("userCreationStatus", 'Failed');
                    }
                })
            } else {
                this.player.SetVar("userCreationStatus", 'Error');
            }
        })
    }
    this.SignIn = function(){
        this.ReadDataSignIn()

        let req = new Request(API_BASEURL + "/checkUser?userName=" + encodeURIComponent(this.username) + "&userPassword=" + encodeURIComponent(this.password) + "&targetLanguage=" + encodeURIComponent(this.targetLanguage), "GET", {}, {})
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    console.log(response)

                    this.player.SetVar("error_1", response.error_1 ? 'True' : 'False');
                    this.player.SetVar("error_2", response.error_2 ? 'True' : 'False');
                    this.player.SetVar("error_4", response.error_4 ? 'True' : 'False');
                })
            } else {
                console.log("request failed, http code: " + result.status)
            }
        })
    }
    this.Load = function(){
        this.ReadDataUsername()

        if (!this.player) {
            return
        }

        let req = new Request(API_BASEURL + "/getUserData?userName=" + encodeURIComponent(this.username), "GET", {}, {})
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        this.player.SetVar("data_userAvatar", response.userAvatar);

                        const fetchedYetiScoresLevel1 = response.yetiScoresLevel1 || [];
                        const yetiScoresLevel1String = fetchedYetiScoresLevel1.join(',');
                        this.player.SetVar("yetiScoresLevel1", yetiScoresLevel1String); // Convert array to comma-separated string

                        // Update the scoreLevel1 variable with the last score in the array
                        if (fetchedYetiScoresLevel1.length > 0) {
                            const lastScoreLevel1 = fetchedYetiScoresLevel1[fetchedYetiScoresLevel1.length - 1];
                            this.player.SetVar("scoreLevel1", lastScoreLevel1);

                            const currentScore = fetchedYetiScoresLevel1[fetchedYetiScoresLevel1.length - 1];
                            const highScore = Math.max(...fetchedYetiScoresLevel1);

                            // Exclude the latest score and the high score from the array
                            const scoresExcludingLastAndHigh = fetchedYetiScoresLevel1.slice(0, -1).filter(score => score !== highScore);

                            // Sort the remaining scores in descending order
                            const sortedScores = scoresExcludingLastAndHigh.sort((a, b) => b - a);
                            const topScores = sortedScores.slice(0, 4);

                            this.player.SetVar("data_currentScoreLevel1", currentScore);
                            this.player.SetVar("data_highScoreLevel1", highScore);
                            this.player.SetVar("data_scoreLevel1_1", topScores[0] || '');
                            this.player.SetVar("data_scoreLevel1_2", topScores[1] || '');
                            this.player.SetVar("data_scoreLevel1_3", topScores[2] || '');
                            this.player.SetVar("data_scoreLevel1_4", topScores[3] || '');
                        } else {
                            console.warn("No scores found in yetiScoresLevel1");
                        }

                        // Process yetiScoresLevel2
                        const fetchedYetiScoresLevel2 = response.yetiScoresLevel2 || [];
                        const yetiScoresLevel2String = fetchedYetiScoresLevel2.join(',');
                        this.player.SetVar("yetiScoresLevel2", yetiScoresLevel2String); // Convert array to comma-separated string

                        // Update the scoreLevel2 variable with the last score in the array
                        if (fetchedYetiScoresLevel2.length > 0) {
                            const lastScoreLevel2 = fetchedYetiScoresLevel2[fetchedYetiScoresLevel2.length - 1];
                            this.player.SetVar("scoreLevel2", lastScoreLevel2);

                            const currentScore = fetchedYetiScoresLevel2[fetchedYetiScoresLevel2.length - 1];
                            const highScore = Math.max(...fetchedYetiScoresLevel2);

                            // Exclude the latest score and the high score from the array
                            const scoresExcludingLastAndHigh = fetchedYetiScoresLevel2.slice(0, -1).filter(score => score !== highScore);

                            // Sort the remaining scores in descending order
                            const sortedScores = scoresExcludingLastAndHigh.sort((a, b) => b - a);
                            const topScores = sortedScores.slice(0, 4);

                            this.player.SetVar("data_currentScoreLevel2", currentScore);
                            this.player.SetVar("data_highScoreLevel2", highScore);
                            this.player.SetVar("data_scoreLevel2_1", topScores[0] || '');
                            this.player.SetVar("data_scoreLevel2_2", topScores[1] || '');
                            this.player.SetVar("data_scoreLevel2_3", topScores[2] || '');
                            this.player.SetVar("data_scoreLevel2_4", topScores[3] || '');

                        } else {
                            console.warn("No scores found in yetiScoresLevel2");
                        }

                        this.player.SetVar("targetLanguage", response.targetLanguage);
                        this.player.SetVar("helpLanguage", response.helpLanguage);
                        this.player.SetVar("levelsOpen", response.levelsOpen);
                    } else {
                        console.error("Failed to retrieve user data:", response.message);
                    }
                })
            }
        })
    }
    this.Words = function(){
        let req = new Request(API_BASEURL + "/getWords?userName=" + encodeURIComponent(this.username), "GET", {}, {})
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        const words = response.words;
                        for (let i = 1; i <= 50; i++) {
                            const tfWord = words[`Word_${i}`] || false;
                            this.player.SetVar(`TF_Word_${i}`, tfWord);
                        }
                    } else {
                        console.error("failed to retrieve words:", response.message);
                    }
                })
            }
        })
    }
    this.Phrases = function(){
        let req = new Request(API_BASEURL + "/getPhrases?userName=" + encodeURIComponent(this.username), "GET", {}, {})
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        const phrases = response.phrases;
                        for (let i = 1; i <= 50; i++) {
                            const tfPhrase = phrases[`TF_Phrase_${i}`] || false;
                            this.player.SetVar(`TF_Phrase_${i}`, tfPhrase);
                        }
                    } else {
                        console.error("Failed to retrieve phrases:", response.message);
                    }
                })
            }
        })
    }

    this.UpdatePhrases = function(){
        this.ReadDataUsername()

        if (!this.player) {
            return
        }


        let phrasesToUpdate = {}

        for (let i = 1; i <= 50; i++) {
            const tfPhrase = this.player.GetVar(`TF_Phrase_${i}`);
            phrasesToUpdate[`TF_Phrase_${i}`] = tfPhrase;
        }

        let headers = {
            'Content-Type': 'application/json'
        }

        let data = {
            userName: this.username,
            phrasesToUpdate: phrasesToUpdate,
        }

        let req = new Request(API_BASEURL + "/updatePhrases", "POST", headers, data)
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        this.player.SetVar("phraseUpdateStatus", 'Success');
                    } else {
                        this.player.SetVar("phraseUpdateStatus", 'Failed');
                    }
                })
            } else {
                this.player.SetVar("phraseUpdateStatus", 'Error');
            }
        })
    }
    this.UpdateWords = function(){
        this.ReadDataUsername()

        if (!this.player) {
            return
        }

        let wordsToUpdate = {};

        for (let i = 1; i <= 50; i++) {
            const tfWord = this.player.GetVar(`TF_Word_${i}`);
            wordsToUpdate[`Word_${i}`] = tfWord;
        }

        let headers = {
            'Content-Type': 'application/json'
        }

        let data = {
            userName: this.username,
            wordsToUpdate: wordsToUpdate
        };

        let req = new Request(API_BASEURL + "/updateWords", "POST", headers, data)
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        this.player.SetVar("wordUpdateStatus", 'Success');
                    } else {
                        this.player.SetVar("wordUpdateStatus", 'Failed');
                    }
                })
            } else {
                this.player.SetVar("wordUpdateStatus", 'Error');
            }
        })
    }
    this.UpdateScoresLevel1 = function(){
        this.ReadDataUsername()

        if (!this.player) {
            return
        }

        let yetiScoresLevel1 = this.player.GetVar("yetiScoresLevel1") || '';

        var newScore = this.player.GetVar("scoreLevel1");

        newScore = Number(newScore);

        if (isNaN(newScore)) {
            return;
        }

        const scoresArray = yetiScoresLevel1.split(',').map(Number);
        const lastScore = scoresArray[scoresArray.length - 1];

        if (newScore === lastScore) {
            console.log("New score is the same as the last score. No update needed.");
            return;
        }

        if (yetiScoresLevel1.length > 0) {
            yetiScoresLevel1 += ',';
        }

        yetiScoresLevel1 += newScore;

        let headers = {
            'Content-Type': 'application/json'
        }

        let data = {
            userName: this.username,
            yetiScoresLevel1: yetiScoresLevel1.split(',').map(Number)
        };

        let req = new Request(API_BASEURL + "/yetiScoresLevel1", "POST", headers, data)
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        this.player.SetVar("scoreUpdateStatus", 'Success');
                    } else {
                        this.player.SetVar("scoreUpdateStatus", 'Failed');
                    }
                })
            } else {
                this.player.SetVar("scoreUpdateStatus", 'Error');
            }
        })
    }
    this.UpdateScoresLevel2 = function(){
        this.ReadDataUsername()

        if (!this.player) {
            return
        }

        let yetiScoresLevel2 = this.player.GetVar("yetiScoresLevel2") || '';

        var newScore = this.player.GetVar("scoreLevel2");

        newScore = Number(newScore);

        if (isNaN(newScore)) {
            return;
        }

        const scoresArray = yetiScoresLevel2.split(',').map(Number);
        const lastScore = scoresArray[scoresArray.length - 1];

        if (newScore === lastScore) {
            console.log("New score is the same as the last score. No update needed.");
            return;
        }

        if (yetiScoresLevel2.length > 0) {
            yetiScoresLevel2 += ',';
        }

        yetiScoresLevel2 += newScore;

        let headers = {
            'Content-Type': 'application/json'
        }

        let data = {
            userName: this.username,
            yetiScoresLevel2: yetiScoresLevel2.split(',').map(Number)
        };

        let req = new Request(API_BASEURL + "/yetiScoresLevel2", "POST", headers, data)
        let resp = req.Send()

        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    if (response.success) {
                        this.player.SetVar("scoreUpdateStatus", 'Success');
                    } else {
                        this.player.SetVar("scoreUpdateStatus", 'Failed');
                    }
                })
            } else {
                this.player.SetVar("scoreUpdateStatus", 'Error');
            }
        })
    }

    this.UpdateLanguageVariables = function(){
        if (!this.player) {
            return
        }
        this.targetLanguage = this.player.GetVar("targetLanguage");
        this.helpLanguage = this.player.GetVar("helpLanguage");
        const languages = new Map();

        languages.set(this.targetLanguage, this.targetLanguageUrl);
        languages.set(this.helpLanguage, this.helpLanguageUrl);

        for (const [language, url] of languages) {
            let selectedLanguage = language

            let req = new Request(url, "GET", {}, {})
            let resp = req.Send()

            resp.then((result) => {
                if (result.status === 200) {
                    result.text().then((response) => {
                        var parser = new DOMParser();
                        var xmlDoc = parser.parseFromString(response, "application/xml");

                        var keyElements = xmlDoc.getElementsByTagName("Key");
                        for (var i = 0; i < keyElements.length; i++) {
                            var keyElement = keyElements[i];
                            var variableName = keyElement.textContent.trim(); // Get the variable name from the <Key> element

                            // Find the corresponding language data for the selected language
                            var languageData = keyElement.parentElement.querySelector(selectedLanguage);

                            // Check if language data exists
                            if (languageData) {
                                var variableValue = languageData.textContent.trim(); // Get the variable value from the language data

                                // Update the Storyline variable with the retrieved text data
                                this.player.SetVar(variableName, variableValue);
                            } else {
                                console.error("Language data not found for language: " + selectedLanguage);
                            }
                        }
                    })
                }
            })
        }
    }

    this.GenerateShuffledNumbers = function(len){
        let numbers = GenerateArray(len);
        let shuffled = ShuffleArray(numbers)

        switch(len) {
            case 10:
                this.player.SetVar("ShuffledNumbers10", shuffled);
                break
            case 5:
                this.player.SetVar("ShuffledNumbers5", shuffled);
                break
        }
    }
    this.GetNextRandomNumber = function(len){
        let nextNumber = 0

        switch(len) {
            case 10:
                let shuffledNumbers10 = this.player.GetVar("ShuffledNumbers10");

                if (shuffledNumbers10 && shuffledNumbers10.length > 0) {
                    nextNumber = shuffledNumbers10.shift();

                    this.player.SetVar("ImageState", nextNumber);
                    this.player.SetVar("ShuffledNumbers10", shuffledNumbers10);
                }
                break
            case 5:
                let shuffledNumbers5 = this.player.GetVar("ShuffledNumbers5");

                if (shuffledNumbers5 && shuffledNumbers5.length > 0) {
                    nextNumber = shuffledNumbers5.shift();

                    this.player.SetVar("GoToSlide", nextNumber);
                    this.player.SetVar("ShuffledNumbers5", shuffledNumbers5);
                }
                break
        }
    }
}

/*
    Handle onSlideLoad events for specific slides
    Description:
        On each slide load fetch user data from the mongodb
        and update storyline variables with fetched data
 */

function OnSlideLoadHomepage(){
    player.Load()
}
function OnSlideLoadHomepageGoButton(){
    player.Load()
}
function OnSlideLoadLeaderBoardLevel1(){
    player.Load()
}
function OnSlideLoadLeaderBoardLevel2(){
    player.Load()
}

/*
    Leaderboard tables
 */

    function loadLeaderboardLevel1(player) {
        let req = new Request(API_BASEURL + "/leaderboardLevel1", "GET", {}, {})
        let resp = req.Send()
     
        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    displayLeaderboardLevel1(player, response.leaderboardLevel1);
                })
            } else {
                console.error("Failed to retrieve leaderboard data:", result.message);
            }
        })
    }
     
    function displayLeaderboardLevel1(player, leaderboardLevel1) {
        leaderboardLevel1.slice(0, 10).forEach((entry, index) => {
            player.player.SetVar(`leaderboardLevel1_userName_${index + 1}`, entry.userName);
            player.player.SetVar(`leaderboard_highestScoreLevel1_${index + 1}`, entry.score);
            player.player.SetVar(`leaderboardLevel1_userAvatar_${index + 1}`, entry.userAvatar);
        });
    }
     
    function loadLeaderboardLevel2(player) {
        let req = new Request(API_BASEURL + "/leaderboardLevel2", "GET", {}, {})
        let resp = req.Send()
     
        resp.then((result) => {
            if (result.status === 200) {
                result.json().then((response) => {
                    displayLeaderboardLevel2(player, response.leaderboardLevel2);
                })
            } else {
                console.error("Failed to retrieve leaderboard data:", result.message);
            }
        })
    }
     
    function displayLeaderboardLevel2(player, leaderboardLevel2) {
        leaderboardLevel2.slice(0, 10).forEach((entry, index) => {
            player.player.SetVar(`leaderboardLevel2_userName_${index + 1}`, entry.userName);
            player.player.SetVar(`leaderboard_highestScoreLevel2_${index + 1}`, entry.score);
            player.player.SetVar(`leaderboardLevel2_userAvatar_${index + 1}`, entry.userAvatar);
        });
    }

/*
    Helper functions
 */

function ShuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];

        array[i] = array[j];
        array[j] = temp;
    }

    return array
}

function GenerateArray(len) {
    let newArr = [];
    for (let i = 1; i <= len; i++) {
        newArr.push(i);
    }

    let clone = []

    if (len == 5) {
        clone = newArr
    }

    return newArr.concat(clone);
}

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function filterWords(input, wordsArray) {
    var normalizedInput = normalizeString(input).toLowerCase();

    return wordsArray.filter(function(word) {
        return normalizeString(word).toLowerCase().includes(normalizedInput);
    });
}

/*
 Request function
 */

function Request(URL, method, headers, data){
    this.URL = URL
    this.method = method
    this.headers = headers
    this.data = data

    if (this.method == "POST") {
        this.Send = async function()   {
            return await fetch(this.URL, {
                method: this.method,
                headers: this.headers,
                body: JSON.stringify(this.data)
            })
        }
    } else {
        this.Send = async function()   {
            return await fetch(this.URL, {
                method: this.method,
                headers: this.headers
            })
        }
    }
}

/*
 Below is not refactored
 */

//ALL SLIDES IN SCENE 4 - on load//

function storeCharactersInStoryline() {
    let player = GetPlayer();

    function processAndStore(variableNamePrefix, inputText) {
        console.log(`${variableNamePrefix} text retrieved from Storyline:`, inputText);
        let words = inputText.split(' ');
        let characters = [];
        let currentLineLength = 0;

        for (let word of words) {
            if (currentLineLength + word.length > 10) {
                // Add spaces to fill the rest of the current line
                while (currentLineLength < 10) {
                    characters.push(' ');
                    currentLineLength++;
                }
                currentLineLength = 0;
            }

            for (let char of word) {
                characters.push(char);
                currentLineLength++;
            }

            // Add a space after each word, except the last one
            if (currentLineLength < 10) {
                characters.push(' ');
                currentLineLength++;
            }
        }

        // Fill the remaining spaces with blanks if less than 30 characters
        while (characters.length < 30) {
            characters.push(' ');
        }

        // Ensure the characters array has exactly 30 elements
        characters = characters.slice(0, 30);

        // Store characters in Storyline variables explicitly
        for (let i = 0; i < 30; i++) {
            let variableName = `${variableNamePrefix}_${i + 1}`;
            player.SetVar(variableName, characters[i] || ' ');
            console.log(`Set ${variableName} to ${characters[i] || ' '}`); // Debugging log
        }

        console.log(`Characters stored in Storyline variables for ${variableNamePrefix}:`, characters);
    }

    // Process and store 'answer' variable
    let answer = player.GetVar("answer");
    processAndStore("character", answer);

    // Process and store 'display' variable
    let display = player.GetVar("display");
    processAndStore("display", display);

    // Sum the number of '_' in 'display' and set 'lettersToGuess' in Storyline
    let lettersToGuess = (display.match(/_/g) || []).length;
    player.SetVar("lettersToGuess", lettersToGuess);

    // Function to set block variables with timeout
    function setBlockVariablesWithTimeout(index, interval) {
        setTimeout(() => {
            let indices = [index, index + 10, index + 20];
            indices.forEach(i => {
                let characterVariable = `character_${i}`;
                let blockVariable = `block_${i}`;
                if (!player.GetVar(characterVariable) || player.GetVar(characterVariable).trim() === '') {
                    player.SetVar(blockVariable, false);
                } else {
                    player.SetVar(blockVariable, true);
                }
            });
        }, interval);
    }

    // Set block variables at intervals
    let intervals = [0, 180, 340, 480, 600, 700, 790, 870, 940, 1000];
    for (let i = 1; i <= 10; i++) {
        setBlockVariablesWithTimeout(i, intervals[i - 1]);
    }
}

// ALL SLIDES IN SCENE 4 - submit answer//

function checkCharacterInAnswer() {
    let player = GetPlayer();
    let textEntry = player.GetVar("TextEntry").toLowerCase();
    let whichCharacter = player.GetVar("whichCharacter");
    let answer = player.GetVar("answer");
    let display = player.GetVar("display");
    let lettersGuessed = player.GetVar("lettersGuessedArray") || "";

    // Append the textEntry to the lettersGuessed string
    if (lettersGuessed.length > 0) {
        lettersGuessed += `,${textEntry}`;
    } else {
        lettersGuessed = textEntry;
    }
    player.SetVar("lettersGuessedArray", lettersGuessed);

    console.log(`TextEntry: ${textEntry}, whichCharacter: ${whichCharacter}`);
    console.log(`Answer: ${answer}`);
    console.log(`Display: ${display}`);
    console.log(`Letters Guessed Array: ${lettersGuessed}`);

    // Process the 'answer' variable
    let answerWords = answer.split(' ');
    let answerCharacters = [];
    let currentLineLength = 0;

    for (let word of answerWords) {
        if (currentLineLength + word.length > 10) {
            while (currentLineLength < 10) {
                answerCharacters.push(' ');
                currentLineLength++;
            }
            currentLineLength = 0;
        }

        for (let char of word) {
            answerCharacters.push(char);
            currentLineLength++;
        }

        if (currentLineLength < 10) {
            answerCharacters.push(' ');
            currentLineLength++;
        }
    }

    while (answerCharacters.length < 30) {
        answerCharacters.push(' ');
    }

    answerCharacters = answerCharacters.slice(0, 30);
    console.log(`Processed Answer Characters: ${answerCharacters}`);

    // Process the 'display' variable
    let displayWords = display.split(' ');
    let displayCharacters = [];
    currentLineLength = 0;

    for (let word of displayWords) {
        if (currentLineLength + word.length > 10) {
            while (currentLineLength < 10) {
                displayCharacters.push(' ');
                currentLineLength++;
            }
            currentLineLength = 0;
        }

        for (let char of word) {
            displayCharacters.push(char);
            currentLineLength++;
        }

        if (currentLineLength < 10) {
            displayCharacters.push(' ');
            currentLineLength++;
        }
    }

    while (displayCharacters.length < 30) {
        displayCharacters.push(' ');
    }

    displayCharacters = displayCharacters.slice(0, 30);
    console.log(`Processed Display Characters: ${displayCharacters}`);

    function normalizeCharacter(char) {
        return char.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    let foundMatch = false;

    for (let i = 0; i < 30; i++) {
        let variableName = `${i + 1}`;
        let character = answerCharacters[i].toLowerCase();
        let normalizedCharacter = normalizeCharacter(character);

        console.log(`Checking character ${character} at position ${i + 1}`);

        if ((character === textEntry || normalizedCharacter === textEntry) && displayCharacters[i] === '_') {
            console.log(`Match found at position ${i + 1}`);
            player.SetVar(variableName, "true");
            foundMatch = true;
        } else if (i + 1 === whichCharacter) {
            console.log(`No match at position ${i + 1}, setting false`);
            player.SetVar(variableName, "false");
        }
    }

    if (!foundMatch) {
        let numberOfWrongAttempts = player.GetVar("numberOfWrongAttempts") || 0;
        numberOfWrongAttempts += 1;
        player.SetVar("numberOfWrongAttempts", numberOfWrongAttempts);

        if (numberOfWrongAttempts >= 1 && numberOfWrongAttempts <= 7) {
            let incorrectAttemptVar = `incorrectAttempt_${numberOfWrongAttempts}`;
            player.SetVar(incorrectAttemptVar, textEntry);
        }
    }
}

function getFirst10Words() {
    var player = GetPlayer();
    var wordsArray = [];

    // Retrieve the first 10 words from Storyline variables
    for (var i = 1; i <= 10; i++) {
        var word = player.GetVar("Word_" + i);
        console.log(`Retrieved word ${i}: ${word}`); // Debugging line
        if (word) {
            wordsArray.push(word);
        }
    }
    console.log("Words Array:", wordsArray); // Debugging line
    return wordsArray;
}

// Function to highlight the matching letters
function highlightMatch(word, input, isHighlighted) {
    var normalizedInput = normalizeString(input).toLowerCase();
    var normalizedWord = normalizeString(word).toLowerCase();
    var startIndex = normalizedWord.indexOf(normalizedInput);
    if (startIndex === -1) {
        return word; // No match found, return original word
    }
    var endIndex = startIndex + normalizedInput.length;
    var underlineColor = isHighlighted ? "black" : "white";
    return (
        word.substring(0, startIndex) +
        `<span style="text-decoration: underline; text-decoration-color: ${underlineColor}; color: inherit;">` +
        word.substring(startIndex, endIndex) +
        '</span>' +
        word.substring(endIndex)
    );
}

// Function to update the dropdown menu
function updateDropdown(filteredWords, inputElement) {
    console.log("Updating Dropdown..."); // Debugging line
    var dropdown = document.getElementById("dropdownMenu");
    if (!dropdown) {
        console.log("Creating new dropdown..."); // Debugging line
        dropdown = document.createElement("div");
        dropdown.id = "dropdownMenu";
        dropdown.style.position = "absolute";
        dropdown.style.border = "1px solid #ccc";
        dropdown.style.backgroundColor = "#000"; // Set dropdown background to black
        dropdown.style.color = "#fff"; // Set dropdown text to white
        dropdown.style.zIndex = 1000;
        dropdown.style.maxHeight = "150px";
        dropdown.style.overflowY = "auto";
        dropdown.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        dropdown.style.fontFamily = "Cascadia Code"; // Set font to Cascadia Code
        document.body.appendChild(dropdown);
    } else {
        // Clear existing options
        console.log("Clearing existing dropdown options..."); // Debugging line
        dropdown.innerHTML = "";
    }

    // Only show the dropdown if there are filtered words and input is not empty
    if (filteredWords.length > 0 && inputElement.value.trim() !== "") {
        console.log("Populating dropdown with filtered words..."); // Debugging line
        // Populate the dropdown with filtered words
        filteredWords.forEach(function(word, index) {
            var option = document.createElement("div");
            option.style.padding = "8px";
            option.style.cursor = "pointer";
            option.style.backgroundColor = "#000"; // Set entry background to black
            option.style.border = "1px solid #fff"; // Set border to white
            option.style.color = "#fff"; // Set text to white
            option.innerHTML = highlightMatch(word, inputElement.value, false);
            option.setAttribute("data-index", index); // Set data attribute for index
            option.onclick = function() {
                console.log("Option clicked:", word); // Debugging line
                var player = GetPlayer();
                var selectedWord = word.trim(); // Trim any extra spaces
                inputElement.value = selectedWord; // Set the trimmed word to input field
                dropdown.style.display = "none";

                // Manually trigger an 'input' event to update the Storyline variable
                var event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                inputElement.dispatchEvent(event);

                // Set TextEntry to the selected word
                player.SetVar("TextEntry", selectedWord);

                // Check the answer after a selection is made
                checkAnswer(selectedWord, player);

                // Set dropdown background and text color after selection
                dropdown.style.backgroundColor = "#F4E3D7";
                dropdown.style.color = "#000";
            };
            option.onmouseover = function() {
                option.style.backgroundColor = "#F4E3D7"; // Set rollover background color
                option.style.color = "#000"; // Set rollover text color to black
                option.innerHTML = highlightMatch(word, inputElement.value, true);
            };
            option.onmouseout = function() {
                option.style.backgroundColor = "#000"; // Reset entry background to black
                option.style.color = "#fff"; // Reset text to white
                option.innerHTML = highlightMatch(word, inputElement.value, false);
            };
            dropdown.appendChild(option);
        });

        // Position the dropdown menu relative to the input element
        var rect = inputElement.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + window.scrollY) + "px";
        dropdown.style.left = (rect.left + window.scrollX) + "px";
        dropdown.style.width = rect.width + "px";

        // Show the dropdown
        dropdown.style.display = "block";
        console.log("Dropdown displayed."); // Debugging line

        // Add keyboard navigation for the dropdown
        var focusedIndex = -1;
        inputElement.onkeydown = function(event) {
            var options = dropdown.querySelectorAll("div[data-index]");
            if (event.key === "ArrowDown") {
                focusedIndex = (focusedIndex + 1) % options.length;
                updateFocusedOption(options, focusedIndex, inputElement.value);
                event.preventDefault(); // Prevent default behavior of scrolling
            } else if (event.key === "ArrowUp") {
                focusedIndex = (focusedIndex - 1 + options.length) % options.length;
                updateFocusedOption(options, focusedIndex, inputElement.value);
                event.preventDefault(); // Prevent default behavior of scrolling
            } else if (event.key === "Enter" && focusedIndex >= 0) {
                options[focusedIndex].click();
                event.preventDefault(); // Prevent form submission if inside a form
            }
        };
    } else {
        console.log("No filtered words or input is empty. Hiding dropdown."); // Debugging line
        dropdown.style.display = "none";
        inputElement.onkeydown = null; // Remove keyboard navigation if dropdown is hidden
    }
}

// Function to update the focused option in the dropdown
function updateFocusedOption(options, index, inputValue) {
    console.log("Updating focused option:", index); // Debugging line
    options.forEach((option, i) => {
        if (i === index) {
            option.style.backgroundColor = "#F4E3D7";
            option.style.color = "#000";
            option.innerHTML = highlightMatch(option.textContent, inputValue, true);
            option.scrollIntoView({ block: "nearest" }); // Ensure the focused option is visible
        } else {
            option.style.backgroundColor = "#000";
            option.style.color = "#fff";
            option.innerHTML = highlightMatch(option.textContent, inputValue, false);
        }
    });
}

// Function to check the answer after a selection is made
function checkAnswer(selectedWord, player) {
    // Get the correct answer from Storyline variable
    var correctAnswer = player.GetVar("CorrectAnswer");
    console.log(`Selected Word: ${selectedWord}, Correct Answer: ${correctAnswer}`); // Debugging line
    var matchFound = (normalizeString(selectedWord).toLowerCase() === normalizeString(correctAnswer).toLowerCase());
    console.log(`Match Found: ${matchFound}`); // Debugging line

    // Update Storyline variables
    player.SetVar("CorrectAnswerGiven", matchFound);
    player.SetVar("WrongAnswerGiven", !matchFound);
}

// Add event listeners to the text boxes for the dropdown functionality
function addEventListenerToTextBox() {
    var inputElements = document.querySelectorAll('input[type="text"]'); // Adjust the selector as needed
    console.log("Adding event listeners to text boxes:", inputElements.length); // Debugging line
    inputElements.forEach(function(inputElement) {
        // Set autocomplete attribute to off to prevent browser autofill
        inputElement.setAttribute('autocomplete', 'off');

        // Add a fake hidden input to trick the browser
        var fakeInput = document.createElement('input');
        fakeInput.setAttribute('type', 'text');
        fakeInput.setAttribute('style', 'display: none;');
        inputElement.parentNode.insertBefore(fakeInput, inputElement);

        inputElement.addEventListener("input", function() {
            console.log("Input event triggered."); // Debugging line
            var wordsArray = getFirst10Words(); // Only get the first 10 words
            var filteredWords = filterWords(inputElement.value, wordsArray);
            updateDropdown(filteredWords, inputElement);
        });

        // Add blur event listener to set the TextEntry variable when the input loses focus
        inputElement.addEventListener("blur", function() {
            var player = GetPlayer();
            player.SetVar("TextEntry", inputElement.value);
        });
    });
}

// Hide dropdown when clicking outside
document.addEventListener('click', function(event) {
    var dropdown = document.getElementById("dropdownMenu");
    if (dropdown && !event.target.matches('input[type="text"]')) {
        console.log("Click outside detected. Hiding dropdown."); // Debugging line
        dropdown.style.display = "none";
    }
});
