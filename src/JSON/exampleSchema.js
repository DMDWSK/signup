import {formGenerator} from "../components/FhirFormsComponent";

export const coreSchema = formGenerator({

    "item": [
        {
            "linkId": "2",
            "text": "Do you have any congenital malformations?",
            "type": "string"
        },
        {
            "linkId": "1",
            "code": [ {
                "system": "http://loinc.org",
                "code": "45414-0",
                "display": "History of stay in other residential facility"
            } ],
            "text": "History of stay in other residential facility",
            "type": "choice",
            "required": false,
            "answerOption": [ {
                "extension": [ {
                    "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-optionPrefix",
                    "valueString": "0"
                } ],
                "valueCoding": {
                    "code": "LA32-8",
                    "display": "No"
                }
            }, {
                "extension": [ {
                    "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-optionPrefix",
                    "valueString": "1"
                } ],
                "valueCoding": {
                    "code": "LA33-6",
                    "display": "Yes"
                }
            }, {
                "valueCoding": {
                    "code": "LA1-0",
                    "display": "UTD"
                }
            } ]
        },

        {
            "linkId": "3",
            "text": "Intoxications",
            "type": "group",
            "item": [
                {
                    "linkId": "3.1",
                    "text": "Do you smoke?",
                    "type": "boolean"
                },
                {
                    "linkId": "3.2",
                    "text": "Do you drink alchohol?",
                    "type": "string"
                },
                {
                    "linkId": "3.3",
                    "text": "Allergies",
                    "type": "group",
                    "item": [
                        {
                            "linkId": "3.3.1",
                            "text": "Do you have any allergies?",
                            "type": "boolean"
                        },
                        {
                            "linkId": "3.3.2",
                            "text": "Do you have any other problems",
                            "type": "boolean"
                        },
                    ]
                },
            ]
        },
    ]
    },
)