import { expect } from 'chai';
import { detectBrowser } from './';

const testData = {
    "mozilla":[{
        "window":{
            "navigator":{
               "userAgent":"Mozilla/5.0 (Android 4.4; Tablet; rv:41.0) Gecko/41.0 Firefox/41.0",
               "mozGetUserMedia":true 
           }
        }, 
        "version":41,
        "name":"Firefox"
    }],
    "chrome":[],
    "edge":[],
    "opera":[],
    "safari":[]
};



enum Browsers {
    Firefox = "Firefox", 
    Chrome = "Chrome", 
    Edge = "Edge",
    Opera = "Opera", 
    Safari = "Safari", 
    Other = "Other"
};
describe('Detector Code Spec', () => {
    for(let key in testData){
        for(let i = 0, ii = testData[key].length; i<ii; i++){
            it("should correctly detect " + key + " " + testData[key][i].version, ()=>{
                const browser = detectBrowser(testData[key][i].window);
                expect(browser.name).to.equal(testData[key][i].name);
                expect(browser.version).to.equal(testData[key][i].version);
            });
        }
    }
});