/**
 * Function to compare to strings.
 * Returns a number between 0 and 1 that indicates
 * how similar two strings are. 0 not very similar; closer to 1
 * is very similar / identical
 * @param shortStr
 * @param longStr
 */
export function compareTwoStrings(str1, str2, print) {
    if (print) {
        console.log(`\n\n********** compareTwoStrings called **********`);
    }
    //arbitrary assignment at first
    var shortStr = str1, longStr = str2;
    //assign based on length - i.e. smaller string to shortStr - longer to longStr
    if (shortStr.length > longStr.length) {
        var { shortStr, longStr } = swap(shortStr, longStr);
    }
    //get the editDistance
    var editDistanceScore = editDistance(shortStr, longStr);
    if (print) {
        console.log('editDistanceScore:', editDistanceScore);
    }
    return editDistanceScore;
}
function swap(shortStr, longStr) {
    return { shortStr: longStr, longStr: shortStr };
}
/**
 *
 * @param shortStr shorter of the two strings
 * @param longStr longer to the two strings
 */
function editDistance(shortStr, longStr, print) {
    if (shortStr.length == 0) {
        return shortStr.length;
    }
    if (longStr.length == 0) {
        return longStr.length;
    }
    var longArr = longStr.split('');
    var shortArr = shortStr.split('');
    const shortArrLength = shortArr.length;
    //print lengths
    if (print) {
        console.log('longArr.length:', longArr.length, ' shortArr.length:', shortArr.length);
    }
    var scoreList = [];
    //set variables
    var searchIndex = 0;
    shortArr.forEach((char) => {
        searchIndex = 0;
        if (print) {
            console.log(`** new char: ${char} **`);
            console.log('longArr.length:', longArr.length, 'i:', searchIndex);
        }
        while (searchIndex < longArr.length) {
            //set/reset variables
            var found = 0;
            var distance = 0;
            if (print) {
                console.log('char:', char, ' longArr[i]:', longArr[searchIndex]);
            }
            //if char is found within longArr[searchIndex]
            if (searchIndex < longArr.length && char === longArr[searchIndex]) {
                //mark char as found
                found = 1;
                //set distance found at
                distance = (searchIndex + 1); //so that the first position is 1 - not dividing by zero
                //give char a score
                var charScore = charFoundDistanceScore(found, distance);
                if (print)
                    console.log('char score:', charScore);
                //store the score
                scoreList.push(charScore);
                //remove the index the char was found at
                longArr.splice(searchIndex, 1);
                if (print)
                    console.log('longArr.length:', longArr.length);
                //set the index to the beginning of the array
                searchIndex = 0;
                //then break out of the loop to get next character
                break;
            }
            else //if not found - increment search index
             {
                searchIndex++;
            }
        }
    });
    var totalScore = 0;
    scoreList.forEach(score => totalScore += score);
    if (print) {
        console.log('TotalScore:', totalScore);
        console.log('shortArrLength:', shortArrLength);
    }
    var editDistanceScore = totalScore / (shortArrLength);
    return editDistanceScore;
}
/**
*
* @param found whether the char has been found - either 0 or 1
* @param distance how far the char was found from it's array position
*/
function charFoundDistanceScore(found, distance) {
    var score = 0;
    if (found) {
        score = found / distance;
    }
    return score;
}
