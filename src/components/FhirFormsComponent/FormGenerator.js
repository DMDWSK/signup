const toReturn = {};
const buffSchema = {};
const buffUi = {};
const buffData = {};
let buffUiElement = {};

buffSchema.type = 'object';
buffSchema.properties = {};

buffUi.type = 'VerticalLayout';
buffUi.elements = [];


function parseItem(schemaUi, item) {
    if (item.type === "group") {
        const schema2 = {};
        const groupUi = {};

        schema2.type = 'object';
        schema2.properties = {};

        groupUi.type = 'Group';
        groupUi.label = item.text
        groupUi.elements = [];

        schemaUi.elements.push(groupUi);

        for (let i = 0; i < item.item.length; i++) {

            parseItem(groupUi, item.item[i]);
        }
    } else {
        parseOneItem(schemaUi, item);
    }

}

function parseOneItem(buffUi, item) {

    const ItemType = item.type.toLowerCase();
    const itemLinkId = item.linkId.replace(/\./g, '___');

    buffSchema.properties[itemLinkId] = {};

    buffUiElement = {};
    buffUiElement.type = 'Control';
    buffUiElement.scope = `#/properties/${itemLinkId}`;

    if (item.text !== undefined)
        buffUiElement.label = item.text;
    else if (item.code.display !== undefined)
        buffUiElement.label = item.code.display;
    else if (item.code.code !== undefined)
        buffUiElement.label = item.code.code;


    if (ItemType === 'text') {
        buffSchema.properties[itemLinkId].type = 'string';
        buffSchema.properties[itemLinkId].default = '';
        buffSchema.properties[itemLinkId].minLength = 0;
        buffSchema.properties[itemLinkId].maxLength = 50;
    }

    if (ItemType === 'string') {
        buffSchema.properties[itemLinkId].type = 'string';
        buffSchema.properties[itemLinkId].default = '';
        buffSchema.properties[itemLinkId].minLength = 0;
        buffSchema.properties[itemLinkId].maxLength = 50;
    }

    if (ItemType === 'decimal') {
        buffSchema.properties[itemLinkId].type = 'number';
        buffSchema.properties[itemLinkId].default = 0;
        buffSchema.properties[itemLinkId].minimum = 0;
        buffSchema.properties[itemLinkId].maximum = 9999;
    }

    if (ItemType === 'integer') {
        buffSchema.properties[itemLinkId].type = 'integer';
        buffSchema.properties[itemLinkId].default = 0;
        buffSchema.properties[itemLinkId].minimum = 0;
        buffSchema.properties[itemLinkId].maximum = 9999;
    }

    if (ItemType === 'choice') {
        buffSchema.properties[itemLinkId].type = 'string';
        const ffEnum = [];
        if (item.answerOption !== undefined) {
            item.answerOption.forEach(element => {
                if (element.valueCoding !== undefined && element.valueCoding.code !== undefined)
                    ffEnum.push(element.valueCoding.code);
            });
        }
        buffSchema.properties[itemLinkId].enum = ffEnum;
    }

    if (ItemType === 'open-choice') {
        buffSchema.properties[itemLinkId].type = 'checkboxes';
        buffSchema.properties[itemLinkId].titleMap = {};
        buffSchema.properties[itemLinkId].titleMap.one = "one";
        buffSchema.properties[itemLinkId].titleMap.two = "two";
        buffSchema.properties[itemLinkId].titleMap.otherField = {};
        buffSchema.properties[itemLinkId].titleMap.otherField.key = "menu2Other";
        buffSchema.properties[itemLinkId].titleMap.otherField.title = "Custom other field title";
        buffSchema.properties[itemLinkId].titleMap.otherField.otherValue = "CUSTOME_OTHER_VALUE";
    }

    if (ItemType === 'boolean') {
        buffSchema.properties[itemLinkId].type = 'boolean';
        buffSchema.default = false;
    }

    if (ItemType === 'date') {
        buffSchema.properties[itemLinkId].type = 'string';
        buffSchema.properties[itemLinkId].format = 'date';
    }

    if (ItemType === 'dateTime') {
        buffSchema.properties[itemLinkId].type = 'string';
        buffSchema.properties[itemLinkId].format = 'date-time';
    }

    if (ItemType === 'dateTime') {
        buffSchema.properties[itemLinkId].type = 'string';
        buffSchema.properties[itemLinkId].format = 'date-time';
    }

    if (ItemType === 'time') {
        buffSchema.properties[itemLinkId].type = 'string';
        buffSchema.properties[itemLinkId].format = 'date-time';
    }

    if (ItemType === 'url') {
        buffSchema.properties[itemLinkId].type = 'string';

    }

    if (ItemType === 'object') {

    }

    if (ItemType === 'display') {

    }
    if (ItemType === 'attachment') {

    }
    if (ItemType === 'reference') {

    }

    if (ItemType === 'quantity') {
        buffSchema.properties[itemLinkId].type = 'decimal';
        buffSchema.properties[itemLinkId].default = 0;
        buffSchema.properties[itemLinkId].minimum = 0;
        buffSchema.properties[itemLinkId].maximum = 9999;
    }

    if (item.answer !== undefined) {
        if (item.answer.valueString !== undefined)
            buffData[itemLinkId] = item.answer.valueString;
        if (item.answer.valueDate !== undefined)
            buffData[itemLinkId] = item.answer.valueDate;
        if (item.answer.valueBoolean !== undefined)
            buffData[itemLinkId] = item.answer.valueBoolean;
        if (item.answer.valueInteger !== undefined)
            buffData[itemLinkId] = item.answer.valueInteger;
        if (item.answer.valueChoice !== undefined)
            buffData[itemLinkId] = item.answer.valueChoice;
    }

    buffUi.elements.push(buffUiElement);
}

function formGenerator(fhirjson) {

    const items = fhirjson.item

    for (let i = 0; i < items.length; i++) {
        parseItem(buffUi, items[i]);
    }

    toReturn.schema = buffSchema;
    toReturn.ui = buffUi;
    toReturn.data = buffData;

    return toReturn;
}

module.exports = formGenerator;