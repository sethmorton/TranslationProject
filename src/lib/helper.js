// IMPORTS

import xml2js from 'xml2js';
import fs from 'fs';
import objectScan from 'object-scan';

export default class Convert {
    /**
     * Created conversion object based on sheet
     */
    conversionObject = {
        "Zone": "ResZn",
        "ExtWall": "ResExtWall",
        "Win": "ResWin",
        "Door": "ResDr",
        "SlabFloor": "ResSlabFlr",
        "CathedralCeiling": "ResCathedralCeiling",
        "CeilingBelowAttic": "ResCeilingBelowAttic",
        "InteriorCeiling": "ResIntCeiling",
        "ExteriorFloor": "ResExtFlr",
        "FloorOverCrawl": "ResFlrOverCrawlSpc",
        "InteriorFloor": "ResIntFlr",
        "UndWall": "ResUndgrWall",
        "UndFloor": "ResUndgrFlr",
        "Skylt": "ResSkylt",
        "HVACSys": "ResHVACSys",
        "HVACHeat": "ResHtgSys",
        "HVACCool": "ResClgSys",
        "HVACHtPump": "ResHtPumpSys",
        "HVACDist": "ResDistSys",
        "HVACFan": "ResFanSys",
        "IAQFan": "ResIAQFan",
        "DHWSys": "ResDHWSys",
        "DHWHeater": "ResWtrHtr",
    };
    /**
     * Path to XML File
     */
    XML = "";

    constructor(XML) {
        this.XML = XML;
    }
    /**
     * Convert file
     */
    file() {
        // console.log("HELLOO");
        var xmlToBeReturned = "";
        const conversionObj = this.conversionObject;
        /**
         * XML TO JS Parser
         */
        const parser = new xml2js.Parser();
        /**
         * Let's read the XML File
         */
        // console.log(this.fileString);
        // const data = fs.readFileSync()
        // console.log(data)
        parser.parseString(this.XML, function (err, result) {
            /**
             * Xml parsed to JSON
             */
            let resultData = result;
            console.log(resultData)
            /**
             * Targeting Proj nested tag
             */
            var object = resultData['SDDXML']['Proj'];
            /**
             * Looping through the conversion object and searching for where every key is
             */
            for (const [key, value] of Object.entries(conversionObj)) {
                let keyModified = value;
                /**
                 * This is the one we want to change
                 */
                let keyToBeModified = key;
                /**
                 * This function uses an npm package called object scan to recursively iterate through the nested object + array
                 * Changes key to be modified to keyModified
                 */
                const modify = objectScan([`**.${keyToBeModified}`], {
                    filterFn: ({ parent, property, value }) => {
                        delete parent[property];
                        parent[`${keyModified}`] = value;
                    },
                    rtn: 'count'
                });
                modify(object);
            }
            /**
             * Replace the current project tag with our newly modified object
             */
            resultData['SDDXML']['Proj'] = object;
            /**
             * Create JSON to XML builder
             */
            var builder = new xml2js.Builder();
            let xml = builder.buildObject(resultData);
            xmlToBeReturned = xml;
        });
        console.log(xmlToBeReturned);
        return xmlToBeReturned;
    }
};