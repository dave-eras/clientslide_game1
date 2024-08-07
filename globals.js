//SIGN IN PAGE - on submit username BTN//
function checkUserName() {
    console.log("checkUserName called - Verifying GET method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    console.log("userName:", userName);

    // Check the length of userName
    var error_5 = checkUserNameLength(userName);

    if (error_5) {
        console.log("Error_5 is true. userName length is not within the allowed range. Aborting checkUserName process.");
        player.SetVar("error_5", 'True');
        return;
    } else {
        player.SetVar("error_5", 'False');
    }

    const url = `https://api.olscloudserver.Site/checkUserName?userName=${encodeURIComponent(userName)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        // Add logging to see the exact value of error_3 in the result
        console.log("error_3 from server:", result.error_3);

        // Update Storyline variable based on the response
        if (result.error_3 === false) { // If there is no user, error_3 should be false
            console.log("User does not exist, setting error_3 to 'False'");
            player.SetVar("error_3", 'False');
        } else {
            console.log("User exists, setting error_3 to 'True'");
            player.SetVar("error_3", 'True');
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

// Function to check the length of userName
function checkUserNameLength(userName) {
    const length = userName.length;
    console.log("userName length:", length);
    if (length < 4 || length > 8) {
        return true; // Error: length is not within 4 to 8 characters
    }
    return false; // No error: length is within 4 to 8 characters
}

checkUserName();


//SIGN IN PAGE - on create account BTN//

function createUser() {
    console.log("createUser called - Verifying POST method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");
    var userPassword = player.GetVar("data_userPassword");
    var userAvatar = player.GetVar("data_userAvatar");
    var targetLanguage = player.GetVar("targetLanguage");
    var helpLanguage = player.GetVar("helpLanguage");
    var levelsOpen = player.GetVar("levelsOpen");

    console.log("userName:", userName);
    console.log("userPassword:", userPassword);
    console.log("userAvatar:", userAvatar);
    console.log("targetLanguage:", targetLanguage);
    console.log("helpLanguage:", helpLanguage);
    console.log("levelsOpen:", levelsOpen);

    // Initialize words and phrases fields without values
    const words = {};
    for (let i = 1; i <= 50; i++) {
        words[`Word_${i}`] = '';
    }

    const phrases = {};
    for (let i = 1; i <= 50; i++) {
        phrases[`TF_Phrase_${i}`] = false; // Initialize phrases fields with false
    }

    const url = `https://api.olscloudserver.site/createUser`;

    const data = {
        userName: userName,
        userPassword: userPassword,
        userAvatar: userAvatar,
        targetLanguage: targetLanguage,
        helpLanguage: helpLanguage,
        levelsOpen: levelsOpen,
        yetiScoresLevel1: [0],
        yetiScoresLevel2: [0],
        ...words,
        ...phrases
    };

    console.log("Data to be sent:", data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        // Handle the result accordingly
        if (result.success) {
            console.log("User created successfully");
            player.SetVar("userCreationStatus", 'Success');
        } else {
            console.log("User creation failed");
            player.SetVar("userCreationStatus", 'Failed');
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
        player.SetVar("userCreationStatus", 'Error');
    });
}

// Call createUser function when needed
createUser();

//LOGIN PAGE on Let's Play BTN//

function sendDataToServer() {
    console.log("sendDataToServer called - Verifying GET method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");
    var userPassword = player.GetVar("data_userPassword");
    var targetLanguage = player.GetVar("targetLanguage");

    console.log("userName:", userName);
    console.log("userPassword:", userPassword);
    console.log("targetLanguage:", targetLanguage);

    const url = `https://api.olscloudserver.site/checkUser?userName=${encodeURIComponent(userName)}&userPassword=${encodeURIComponent(userPassword)}&targetLanguage=${encodeURIComponent(targetLanguage)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        // Update Storyline variables based on the response
        if (result.error_1) {
            player.SetVar("error_1", 'True');
        } else {
            player.SetVar("error_1", 'False');
        }

        if (result.error_2) {
            player.SetVar("error_2", 'True');
        } else {
            player.SetVar("error_2", 'False');
        }

        if (result.error_4) {
            player.SetVar("error_4", 'True');
        } else {
            player.SetVar("error_4", 'False');
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

sendDataToServer();

// HOMEPAGE - on load//
// for LEVEL 1 //

function onSlideLoad() {
    console.log("Slide loaded - retrieving user data");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    if (!userName) {
        console.error("userName is not set");
        return;
    }

    console.log("userName:", userName);

    const url = `https://api.olscloudserver.site/getUserData?userName=${encodeURIComponent(userName)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {
            // Update userAvatar
            player.SetVar("data_userAvatar", result.userAvatar);
            console.log("HOME PAGE SET AVATAR:", result.userAvatar);

            // Process yetiScoresLevel1
            const fetchedYetiScoresLevel1 = result.yetiScoresLevel1 || [];
            const yetiScoresLevel1String = fetchedYetiScoresLevel1.join(',');
            player.SetVar("yetiScoresLevel1", yetiScoresLevel1String); // Convert array to comma-separated string
            console.log("HOME PAGE RETRIEVE LEVEL 1 SCORES:", yetiScoresLevel1String);

            // Update the scoreLevel1 variable with the last score in the array
            if (fetchedYetiScoresLevel1.length > 0) {
                const lastScoreLevel1 = fetchedYetiScoresLevel1[fetchedYetiScoresLevel1.length - 1];
                player.SetVar("scoreLevel1", lastScoreLevel1);
                console.log("HOME PAGE RETRIEVE LATEST LEVEL 1 SCORE:", lastScoreLevel1);
            } else {
                console.warn("No scores found in yetiScoresLevel1");
            }

            // Update other Storyline variables
            player.SetVar("targetLanguage", result.targetLanguage);
            player.SetVar("helpLanguage", result.helpLanguage);
            player.SetVar("levelsOpen", result.levelsOpen);
            console.log("HOME PAGE RETRIEVE LANGUAGES AND LEVELS OPEN:", result.targetLanguage, result.helpLanguage, result.levelsOpen);

        } else {
            console.error("Failed to retrieve user data:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

// Call onSlideLoad when the slide loads
onSlideLoad();

// HOMEPAGE - on load //
// for LEVEL 2 //

function onSlideLoad() {

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    if (!userName) {
        console.error("userName is not set");
        return;
    }

    console.log("userName:", userName);

    const url = `https://api.olscloudserver.site/getUserData?userName=${encodeURIComponent(userName)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {

            // Process yetiScoresLevel2
            const fetchedYetiScoresLevel2 = result.yetiScoresLevel2 || [];
            const yetiScoresLevel2String = fetchedYetiScoresLevel2.join(',');
            player.SetVar("yetiScoresLevel2", yetiScoresLevel2String); // Convert array to comma-separated string
            console.log("HOMEPAGE RETRIEVE LEVEL2 SCORES:", yetiScoresLevel2String);

            // Update the scoreLevel2 variable with the last score in the array
            if (fetchedYetiScoresLevel2.length > 0) {
                const lastScoreLevel2 = fetchedYetiScoresLevel2[fetchedYetiScoresLevel2.length - 1];
                player.SetVar("scoreLevel2", lastScoreLevel2);
                console.log("HOMEPAGE RETRIEVE LATEST LEVEL2 SCORE:", lastScoreLevel2);
            } else {
                console.warn("No scores found in yetiScoresLevel2");
            }
        } else {
            console.error("Failed to retrieve user data:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

// Call onSlideLoad when the slide loads
onSlideLoad();


//HOME PAGE - GO BUTTON//

// Function to shuffle an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Function to create an array of numbers from 1 to 10 and shuffle it
function createShuffledArray10() {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    shuffleArray(numbers);
    return numbers;
}


// Store the shuffled array of 1 to 10 numbers in a Storyline variable
function initializeShuffledNumbers10() {
    var player = GetPlayer();
    var shuffledNumbers10 = createShuffledArray10();
    console.log("Initialized shuffled numbers 10:", shuffledNumbers10); // Debugging log
    player.SetVar("ShuffledNumbers10", shuffledNumbers10);
}


// Function to get the next unique random number from 1 to 10 array
function getNextUniqueRandomNumber10() {
    var player = GetPlayer();
    var shuffledNumbers10 = player.GetVar("ShuffledNumbers10");

    console.log("Current shuffled numbers 10:", shuffledNumbers10); // Debugging log

    if (shuffledNumbers10 && shuffledNumbers10.length > 0) {
        var nextNumber = shuffledNumbers10.shift(); // Remove the first element
        console.log("Next number:", nextNumber); // Debugging log
        player.SetVar("ImageState", nextNumber);
        player.SetVar("ShuffledNumbers10", shuffledNumbers10); // Update the array in Storyline
        console.log("Updated shuffled numbers 10:", shuffledNumbers10); // Debugging log
    } else {
        console.log("All numbers have been used.");
    }
}


// Initialize the shuffled arrays when the timeline starts
initializeShuffledNumbers10();


// Simulate the function call to get the next unique random number from both lists
// These should be called based on your specific use case in Storyline
getNextUniqueRandomNumber10();


//HOME PAGE - GO BUTTON, RANDOM TOPIC SELECTION//

// Function to shuffle an array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Function to create an array of numbers from 1 to 10 and shuffle it
function createShuffledArray10() {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    shuffleArray(numbers);
    return numbers;
}

// Function to create an array of 10 digits from the numbers 1 to 5 (each appearing twice) and shuffle it
function createShuffledArray5() {
    var numbers = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    shuffleArray(numbers);
    return numbers;
}

// Store the shuffled array of 1 to 10 numbers in a Storyline variable
function initializeShuffledNumbers10() {
    var player = GetPlayer();
    var shuffledNumbers10 = createShuffledArray10();
    console.log("Initialized shuffled numbers 10:", shuffledNumbers10); // Debugging log
    player.SetVar("ShuffledNumbers10", shuffledNumbers10);
}

// Store the shuffled array of 1 to 5 numbers in a Storyline variable
function initializeShuffledNumbers5() {
    var player = GetPlayer();
    var shuffledNumbers5 = createShuffledArray5();
    console.log("Initialized shuffled numbers 5:", shuffledNumbers5); // Debugging log
    player.SetVar("ShuffledNumbers5", shuffledNumbers5);
}

// Function to get the next unique random number from 1 to 10 array
function getNextUniqueRandomNumber10() {
    var player = GetPlayer();
    var shuffledNumbers10 = player.GetVar("ShuffledNumbers10");

    console.log("Current shuffled numbers 10:", shuffledNumbers10); // Debugging log

    if (shuffledNumbers10 && shuffledNumbers10.length > 0) {
        var nextNumber = shuffledNumbers10.shift(); // Remove the first element
        console.log("Next number:", nextNumber); // Debugging log
        player.SetVar("ImageState", nextNumber);
        player.SetVar("ShuffledNumbers10", shuffledNumbers10); // Update the array in Storyline
        console.log("Updated shuffled numbers 10:", shuffledNumbers10); // Debugging log
    } else {
        console.log("All numbers have been used.");
    }
}

// Function to get the next unique random number from 1 to 5 array and store in GoToSlide
function getNextUniqueRandomNumber5() {
    var player = GetPlayer();
    var shuffledNumbers5 = player.GetVar("ShuffledNumbers5");

    console.log("Current shuffled numbers 5:", shuffledNumbers5); // Debugging log

    if (shuffledNumbers5.length > 0) {
        var nextNumber = shuffledNumbers5.shift(); // Remove the first element
        console.log("Next number:", nextNumber); // Debugging log
        player.SetVar("GoToSlide", nextNumber);
        player.SetVar("ShuffledNumbers5", shuffledNumbers5); // Update the array in Storyline
        console.log("Updated shuffled numbers 5:", shuffledNumbers5); // Debugging log
    } else {
        console.log("All numbers have been used.");
    }
}

// Initialize the shuffled arrays when the timeline starts
initializeShuffledNumbers10();
initializeShuffledNumbers5();

// Simulate the function call to get the next unique random number from both lists
// These should be called based on your specific use case in Storyline
getNextUniqueRandomNumber10();
getNextUniqueRandomNumber5();


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

// Call this function to store the characters from the 'answer' and 'display' variables in Storyline
storeCharactersInStoryline();

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
   

// Call the function to check the character in the answer
checkCharacterInAnswer();



// ALL SLIDES SCENE 5 //

// Function to get the first 10 words from Storyline text variables
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

// Function to normalize a string by removing diacritical marks and trimming whitespace
function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

// Function to filter words based on input
function filterWords(input, wordsArray) {
    var normalizedInput = normalizeString(input).toLowerCase();
    console.log("Normalized Input:", normalizedInput); // Debugging line
    return wordsArray.filter(function(word) {
        return normalizeString(word).toLowerCase().includes(normalizedInput);
    });
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

// Run the function to add event listeners to text boxes
addEventListenerToTextBox();


// SCENE 4 & 5 LAYERS//

// Function to get the next unique random number from an array of 5 elements
function getNextUniqueRandomNumber5() {
    var player = GetPlayer();
    var shuffledNumbers5 = player.GetVar("ShuffledNumbers5");

    console.log("Current shuffled numbers (5):", shuffledNumbers5); // Debugging log

    if (shuffledNumbers5.length > 0) {
        var nextNumber = shuffledNumbers5.shift(); // Remove the first element
        console.log("Next number (5):", nextNumber); // Debugging log
        player.SetVar("GoToSlide", nextNumber);
        player.SetVar("ShuffledNumbers5", shuffledNumbers5); // Update the array in Storyline
        console.log("Updated shuffled numbers (5):", shuffledNumbers5); // Debugging log
    } else {
        console.log("All numbers have been used (5).");
    }
}

// Function to get the next unique random number from an array of 10 elements
function getNextUniqueRandomNumber10() {
    var player = GetPlayer();
    var shuffledNumbers10 = player.GetVar("ShuffledNumbers10");

    console.log("Current shuffled numbers (10):", shuffledNumbers10); // Debugging log

    if (shuffledNumbers10.length > 0) {
        var nextNumber = shuffledNumbers10.shift(); // Remove the first element
        console.log("Next number (10):", nextNumber); // Debugging log
        player.SetVar("ImageState", nextNumber);
        console.log("ImageState:", nextNumber);
        player.SetVar("ShuffledNumbers10", shuffledNumbers10); // Update the array in Storyline
        console.log("Updated shuffled numbers (10):", shuffledNumbers10); // Debugging log
    } else {
        console.log("All numbers have been used (10).");
    }
}

// Call the appropriate function based on your requirement
// Uncomment the function you need to call

getNextUniqueRandomNumber5();
getNextUniqueRandomNumber10();


// MENU SLIDE MASTER - review click //

function getWords() {
    console.log("getWords called - Verifying GET method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    if (!userName) {
        console.error("userName is not set");
        return;
    }

    console.log("userName:", userName);

    const url = `https://api.olscloudserver.site/getWords?userName=${encodeURIComponent(userName)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {
            const words = result.words;
            for (let i = 1; i <= 50; i++) {
                const tfWord = words[`Word_${i}`] || false;
                player.SetVar(`TF_Word_${i}`, tfWord);
                console.log(`TF_Word_${i} retrieved as:`, tfWord);
            }
        } else {
            console.error("Failed to retrieve words:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

// Call getWords function when needed
getWords();

// MENU SLIDE MASTER - review click //

function getPhrases() {
    console.log("getPhrases called - Verifying GET method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    if (!userName) {
        console.error("userName is not set");
        return;
    }

    console.log("userName:", userName);

    const url = `https://api.olscloudserver.site/getPhrases?userName=${encodeURIComponent(userName)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {
            const phrases = result.phrases;
            for (let i = 1; i <= 50; i++) {
                const tfPhrase = phrases[`TF_Phrase_${i}`] || false;
                player.SetVar(`TF_Phrase_${i}`, tfPhrase);
                console.log(`TF_Phrase_${i} retrieved as:`, tfPhrase);
            }
        } else {
            console.error("Failed to retrieve phrases:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

// Call getPhrases function when needed
getPhrases();



// Slide 3.1 SCORES - on load //

// LEVEL 1 //

function onSlideLoad() {

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    if (!userName) {
        console.error("userName is not set");
        return;
    }

    const url = `https://api.olscloudserver.site/getUserData?userName=${encodeURIComponent(userName)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {

            // Process yetiScoresLevel1
            const fetchedYetiScoresLevel1 = result.yetiScoresLevel1 || [];
            const yetiScoresLevel1String = fetchedYetiScoresLevel1.join(',');
            player.SetVar("yetiScoresLevel1", yetiScoresLevel1String); // Convert array to comma-separated string
            console.log("SCORE PAGE TIMELINE: LEVEL1", yetiScoresLevel1String);

            // Example: Update current score, high score, and top scores
            if (fetchedYetiScoresLevel1.length > 0) {
                const currentScore = fetchedYetiScoresLevel1[fetchedYetiScoresLevel1.length - 1];
                const highScore = Math.max(...fetchedYetiScoresLevel1);

                // Exclude the latest score and the high score from the array
                const scoresExcludingLastAndHigh = fetchedYetiScoresLevel1.slice(0, -1).filter(score => score !== highScore);

                // Sort the remaining scores in descending order
                const sortedScores = scoresExcludingLastAndHigh.sort((a, b) => b - a);
                const topScores = sortedScores.slice(0, 4);

                player.SetVar("data_currentScoreLevel1", currentScore);
                player.SetVar("data_highScoreLevel1", highScore);
                player.SetVar("data_scoreLevel1_1", topScores[0] || '');
                player.SetVar("data_scoreLevel1_2", topScores[1] || '');
                player.SetVar("data_scoreLevel1_3", topScores[2] || '');
                player.SetVar("data_scoreLevel1_4", topScores[3] || '');

                console.log("Updated data_currentScoreLevel1 to:", currentScore);
                console.log("Updated data_highScoreLevel1 to:", highScore);
                console.log("Updated data_scoreLevel1_1 to:", topScores[0] || '');
                console.log("Updated data_scoreLevel1_2 to:", topScores[1] || '');
                console.log("Updated data_scoreLevel1_3 to:", topScores[2] || '');
                console.log("Updated data_scoreLevel1_4 to:", topScores[3] || '');
            }
        } else {
            console.error("Failed to retrieve user data:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

// Call onSlideLoad when the slide loads
onSlideLoad();


// Slide 3.1 SCORES - on load //

// LEVEL 2 //

function onSlideLoad() {


    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    if (!userName) {
        console.error("userName is not set");
        return;
    }

    const url = `https://api.olscloudserver.site/getUserData?userName=${encodeURIComponent(userName)}`;

    console.log("Data to be sent:", url);

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {

            // Process yetiScoresLevel1
            const fetchedYetiScoresLevel2 = result.yetiScoresLevel2 || [];
            const yetiScoresLevel2String = fetchedYetiScoresLevel2.join(',');
            player.SetVar("yetiScoresLevel2", yetiScoresLevel2String); // Convert array to comma-separated string
            console.log("SCOREPAGE TIMELINE LEVEL 2", yetiScoresLevel2String);

            // Example: Update current score, high score, and top scores
            if (fetchedYetiScoresLevel2.length > 0) {
                const currentScore = fetchedYetiScoresLevel2[fetchedYetiScoresLevel2.length - 1];
                const highScore = Math.max(...fetchedYetiScoresLevel2);

                // Exclude the latest score and the high score from the array
                const scoresExcludingLastAndHigh = fetchedYetiScoresLevel2.slice(0, -1).filter(score => score !== highScore);

                // Sort the remaining scores in descending order
                const sortedScores = scoresExcludingLastAndHigh.sort((a, b) => b - a);
                const topScores = sortedScores.slice(0, 4);

                player.SetVar("data_currentScoreLevel2", currentScore);
                player.SetVar("data_highScoreLevel2", highScore);
                player.SetVar("data_scoreLevel2_1", topScores[0] || '');
                player.SetVar("data_scoreLevel2_2", topScores[1] || '');
                player.SetVar("data_scoreLevel2_3", topScores[2] || '');
                player.SetVar("data_scoreLevel2_4", topScores[3] || '');

                console.log("Updated data_currentScoreLevel2 to:", currentScore);
                console.log("Updated data_highScoreLevel2 to:", highScore);
                console.log("Updated data_scoreLevel2_1 to:", topScores[0] || '');
                console.log("Updated data_scoreLevel2_2 to:", topScores[1] || '');
                console.log("Updated data_scoreLevel2_3 to:", topScores[2] || '');
                console.log("Updated data_scoreLevel2_4 to:", topScores[3] || '');
            }
        } else {
            console.error("Failed to retrieve user data:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

// Call onSlideLoad when the slide loads
onSlideLoad();


// SLIDE 3.7 LEADERBOARD - on load //

//LEVEL 1//

function loadLeaderboardLevel1() {
    console.log("Loading leaderboard");

    const url = `https://api.olscloudserver.site/leaderboardLevel1`;

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {
            const leaderboardLevel1 = result.leaderboardLevel1;
            displayLeaderboardLevel1(leaderboardLevel1);
        } else {
            console.error("Failed to retrieve leaderboard data:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

function displayLeaderboardLevel1(leaderboardLevel1) {
    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    // Assuming you have Storyline variables for each leaderboard entry
    leaderboardLevel1.slice(0, 10).forEach((entry, index) => {
        player.SetVar(`leaderboardLevel1_userName_${index + 1}`, entry.userName);
        player.SetVar(`leaderboard_highestScoreLevel1_${index + 1}`, entry.score);
        player.SetVar(`leaderboardLevel1_userAvatar_${index + 1}`, entry.userAvatar);
    });

    // Log the leaderboard to the console for verification
    console.log("LeaderboardLevel1:", leaderboardLevel1.slice(0, 10));
}

// Call loadLeaderboard when needed
loadLeaderboardLevel1();

// SLIDE 3.7 LEADERBOARD - on load //

//LEVEL 2//

function loadLeaderboardLevel2() {
    console.log("Loading leaderboard");

    const url = `https://api.olscloudserver.site/leaderboardLevel2`;

    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {
            const leaderboardLevel2 = result.leaderboardLevel2;
            displayLeaderboardLevel2(leaderboardLevel2);
        } else {
            console.error("Failed to retrieve leaderboard data:", result.message);
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
    });
}

function displayLeaderboardLevel2(leaderboardLevel2) {
    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    // Assuming you have Storyline variables for each leaderboard entry
    leaderboardLevel2.slice(0, 10).forEach((entry, index) => {
        player.SetVar(`leaderboardLevel2_userName_${index + 1}`, entry.userName);
        player.SetVar(`leaderboard_highestScoreLevel2_${index + 1}`, entry.score);
        player.SetVar(`leaderboardLevel2_userAvatar_${index + 1}`, entry.userAvatar);
    });

    // Log the leaderboard to the console for verification
    console.log("LeaderboardLevel2:", leaderboardLevel2.slice(0, 10));
}

// Call loadLeaderboard when needed
loadLeaderboardLevel2();

//INTRO SCREEN - on load (target language)//

// Function to update Storyline variables based on the selected language
function updateVariablesBasedOnLanguage(xmlDoc) {
    var player = GetPlayer();
    var selectedLanguage = player.GetVar("targetLanguage");

    // Iterate over each <Key> element in the XML
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
            player.SetVar(variableName, variableValue);
        } else {
            console.error("Language data not found for language: " + selectedLanguage);
        }
    }
}

// Load XML file and update Storyline variables based on the selected language
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
        updateVariablesBasedOnLanguage(xmlDoc);
    }
};
xhr.open("GET", "https://academy.europa.eu/pluginfile.php/1230926/mod_resource/content/1/game_1.xml", true); // Replace 'https://example.com/your-xml-file.xml' with the actual URL of your XML file
xhr.send();

//INTRO SCREEN - on load (help language)//

// Function to update Storyline variables based on the selected language
function updateVariablesBasedOnLanguage(xmlDoc) {
    var player = GetPlayer();
    var selectedLanguage = player.GetVar("helpLanguage");

    // Iterate over each <Key> element in the XML
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
            player.SetVar(variableName, variableValue);
        } else {
            console.error("Language data not found for language: " + selectedLanguage);
        }
    }
}

// Load XML file and update Storyline variables based on the selected language
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(xhr.responseText, "application/xml");
        updateVariablesBasedOnLanguage(xmlDoc);
    }
};
xhr.open("GET", "https://academy.europa.eu/pluginfile.php/1230879/mod_resource/content/1/game_1_help_language.xml", true); // Replace 'https://example.com/your-xml-file.xml' with the actual URL of your XML file
xhr.send();


// FORGOT TO ADD THESE IMPORTANT FUNCTIONS TO GLOBALS //
// LEVEL 1 //

function updateScores() {
    console.log("updateScores called - Verifying POST method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");
    let yetiScoresLevel1 = player.GetVar("yetiScoresLevel1") || '';

    console.log("MY SCORES: EXISTING LEVEL 1:", yetiScoresLevel1);

    var newScore = player.GetVar("scoreLevel1");

    // Convert newScore to a number explicitly
    newScore = Number(newScore);

    if (isNaN(newScore)) {
        console.error("New score must be a number:", newScore);
        return;
    }

    // Check if the new score is different from the last score in the array
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

    console.log("MY SCORES: UPDATED LEVEL 1:", yetiScoresLevel1); // Log the updated yetiScores string

    const url = `https://api.olscloudserver.site/yetiScoresLevel1`;

    const data = {
        userName: userName,
        yetiScoresLevel1: yetiScoresLevel1.split(',').map(Number) // Convert string to array of numbers
    };

    console.log("Data to be sent:", data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        // Handle the result accordingly
        if (result.success) {
            console.log("Scores updated successfully");
            player.SetVar("scoreUpdateStatus", 'Success');
        } else {
            console.log("Score update failed");
            player.SetVar("scoreUpdateStatus", 'Failed');
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
        player.SetVar("scoreUpdateStatus", 'Error');
    });
}

updateScores();


// LEVEL 2 //

function updateScores() {


    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");
    let yetiScoresLevel2 = player.GetVar("yetiScoresLevel2") || '';

    console.log("userName:", userName);
    console.log("MY SCORES: EXISTING LEVEL2", yetiScoresLevel2);

    var newScore = player.GetVar("scoreLevel2");

    // Convert newScore to a number explicitly
    newScore = Number(newScore);

    if (isNaN(newScore)) {
        console.error("New score must be a number:", newScore);
        return;
    }

    // Check if the new score is different from the last score in the array
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

    console.log("MY SCORES: UPDTAED LEVEL 2:", yetiScoresLevel2); // Log the updated yetiScores string

    const url = `https://api.olscloudserver.site/yetiScoresLevel2`;

    const data = {
        userName: userName,
        yetiScoresLevel2: yetiScoresLevel2.split(',').map(Number) // Convert string to array of numbers
    };

    console.log("Data to be sent:", data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        // Handle the result accordingly
        if (result.success) {

            player.SetVar("scoreUpdateStatus", 'Success');
        } else {

            player.SetVar("scoreUpdateStatus", 'Failed');
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
        player.SetVar("scoreUpdateStatus", 'Error');
    });
}

updateScores();


function updateWords() {
    console.log("updateWords called - Verifying POST method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    console.log("userName:", userName);

    const wordsToUpdate = {};

    for (let i = 1; i <= 50; i++) {
        const tfWord = player.GetVar(`TF_Word_${i}`);
        wordsToUpdate[`Word_${i}`] = tfWord;
        console.log(`TF_Word_${i} to be updated to:`, tfWord);
    }

    const url = `https://api.olscloudserver.site/updateWords`;

    const data = {
        userName: userName,
        wordsToUpdate: wordsToUpdate
    };

    console.log("Data to be sent:", data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {
            console.log("Words updated successfully");
            player.SetVar("wordUpdateStatus", 'Success');
        } else {
            console.log("Word update failed");
            player.SetVar("wordUpdateStatus", 'Failed');
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
        player.SetVar("wordUpdateStatus", 'Error');
    });
}

// Call updateWords function when needed
updateWords();

function updatePhrases() {
    console.log("updatePhrases called - Verifying POST method");

    const player = GetPlayer();
    if (!player) {
        console.error("GetPlayer returned null or undefined");
        return;
    }

    var userName = player.GetVar("data_userName");

    console.log("userName:", userName);

    const phrasesToUpdate = {};

    for (let i = 1; i <= 50; i++) {
        const tfPhrase = player.GetVar(`TF_Phrase_${i}`);
        phrasesToUpdate[`TF_Phrase_${i}`] = tfPhrase;
        console.log(`TF_Phrase_${i} to be updated to:`, tfPhrase);
    }

    const url = `https://api.olscloudserver.site/updatePhrases`;

    const data = {
        userName: userName,
        phrasesToUpdate: phrasesToUpdate
    };

    console.log("Data to be sent:", data);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log("Fetch response received:", response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log("Result:", result);
        if (result.success) {
            console.log("Phrases updated successfully");
            player.SetVar("phraseUpdateStatus", 'Success');
        } else {
            console.log("Phrase update failed");
            player.SetVar("phraseUpdateStatus", 'Failed');
        }
    })
    .catch(error => {
        console.error('Error in fetch:', error);
        player.SetVar("phraseUpdateStatus", 'Error');
    });
}

// Call updatePhrases function when needed
updatePhrases();
