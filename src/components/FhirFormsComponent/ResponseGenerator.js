function parseItem(item, resp) {
    if (item.type === "group") {
        for (let i = 0; i < item.item.length; i++) {
            parseItem(item.item[i], resp);
        }
    } else {
        parseOneItem(item, resp);
    }
}

function parseOneItem(item, resp) {
    const ItemType = item.type.toLowerCase();
    const itemLinkId = item.linkId.replace(/\./g, '___');

    if (ItemType === 'string') {
        item.answer = {};
        item.answer.valueString = resp[itemLinkId];
    }

    if (ItemType === 'text') {
        item.answer = {};
        item.answer.valueString = resp[itemLinkId];
    }

    if (ItemType === 'integer') {
        item.answer = {};
        item.answer.valueInteger = resp[itemLinkId];
    }

    if (ItemType === 'date') {
        item.answer = {};
        item.answer.valueDate = resp[itemLinkId];
    }
    if (ItemType === 'boolean') {
        item.answer = {};
        item.answer.valueBoolean = resp[itemLinkId];
    }
    if (ItemType === 'choice') {
        item.answer = {};
        item.answer.valueChoice = resp[itemLinkId];
    }
    console.log(item)
}

const responseGenerator = (fhirjson, resp) => {

    const items = fhirjson.item;

    for (let i = 0; i < items.length; i++) {
        parseItem(items[i], resp);
    }

    fhirjson.item = items;

    console.log(items)
    return fhirjson;

};
module.exports = responseGenerator;
