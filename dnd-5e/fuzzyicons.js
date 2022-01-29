updateActor();
async function updateActor() {
    let choices = await walk("icons/skills");
    choices = choices.concat(...(await walk("icons/magic")));
    for (let actor of game.actors.contents) {

        if (actor.data.folder !== "lkg0y8uoLxSM7rRV") {
            continue;
        }
        console.log(actor.name);
        for (let item of actor.data.items.contents) {
            console.log(item);
            await compareAndUpdate(item, choices);
            await item.update({ img: 'icons/magic/death/projectile-skull-fire-purple.webp' });

        }
    }
}

async function updateMacroImages() {
    let choices = await walk("icons/skills");
    choices = choices.concat(...(await walk("icons/magic")));
    for (let item of game.macros.contents) {
        await compareAndUpdate(item, choices);
    }
}
async function updateGameItems() {
    let choices = await walk("icons/skills");
    choices = choices.concat(...(await walk("icons/magic")));
    for (let item of game.items.contents) {
        await compareAndUpdate(item, choices);
    }
}

async function walk(dir) {
    let filesFound = [];
    data = await FilePicker.browse("public", dir, { extensions: [".webp"] });
    filesFound.push(...data.files);
    for (let subDir of data.dirs) {
        filesFound.push(...(await walk(subDir)));
    }
    return filesFound;
}

async function compareAndUpdate(item, choices) {
    let best = {
        path: "",
        value: 0,
        item: item.data.name,
    };


    for (let i = 0; i < choices.length; i++) {
        let filename = choices[i].match(/[ \w-]+?(?=\.)/g);
        console.log(filename)
        let ratio = longestCommonSubstring(item.data.name, filename[0]);

        if (ratio.length > best.value) {
            best.path = choices[i]
            best.value = ratio;
        }
    }
    console.log(best);
    await item.update({ img: best.path });
}

function longestCommonSubstring(string1, string2) {
    const s1 = [...string1];
    const s2 = [...string2];
    const substringMatrix = Array(s2.length + 1)
        .fill(null)
        .map(() => {
            return Array(s1.length + 1).fill(null);
        });
    for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
        substringMatrix[0][columnIndex] = 0;
    }
    for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
        substringMatrix[rowIndex][0] = 0;
    }
    let longestSubstringLength = 0;
    let longestSubstringColumn = 0;
    let longestSubstringRow = 0;

    for (let rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
        for (let columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
            if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
                substringMatrix[rowIndex][columnIndex] =
                    substringMatrix[rowIndex - 1][columnIndex - 1] + 1;
            } else {
                substringMatrix[rowIndex][columnIndex] = 0;
            }
            if (
                substringMatrix[rowIndex][columnIndex] > longestSubstringLength
            ) {
                longestSubstringLength = substringMatrix[rowIndex][columnIndex];
                longestSubstringColumn = columnIndex;
                longestSubstringRow = rowIndex;
            }
        }
    }

    if (longestSubstringLength === 0) {
        return "";
    }
    let longestSubstring = "";

    while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
        longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring;
        longestSubstringRow -= 1;
        longestSubstringColumn -= 1;
    }
    console.log(longestSubstring)
    return longestSubstring;
}