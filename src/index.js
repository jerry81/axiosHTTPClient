import * as axios from 'axios';
import * as fs from 'fs';

const API_HOSTNAME = "http://127.0.0.1:8080"
const DS_HOSTNAME = "http://127.0.0.1:5000"
const PROD_USER_IDS = "./resources/prod/users0.json"
const STAGING_USER_IDS = "./resources/staging-users.json"
const rawdata = fs.readFileSync(PROD_USER_IDS)
const RESPONSES_LOG = 'responses.log'
const USERS_FILE_PREFIX = './resources/prod/users'
const { users } = JSON.parse(rawdata)


function onFileWriteFinished (error) {
    if (error) console.error('error occured while writing to file', error);
}
function uploadFaceScan(payload) {
    axios.post(`${DS_HOSTNAME}/face-attributes`, payload)
      .then(function (response) {
          const { userid } = payload
          const { data, status } = response
          const parsedResponse = { data, status, userid } 
        fs.appendFile(RESPONSES_LOG, JSON.stringify(parsedResponse), onFileWriteFinished)
      })
      .catch(function (error) {
        console.error("error while uploading", error);
      });
}
function downloadFaceScan(userid) {
    axios.get(`${API_HOSTNAME}/internal/users/${userid}/information`).then(
        function (response) {
            const data = response.data;
            const { measurements, picture } = data;
            const payload = {
                userid,
                measurements,
                picture
            }
            uploadFaceScan(payload)
        }
    ).catch(
        function (error) {
            console.error('error while downloading', error)
        }
    )
}


 users.forEach(downloadFaceScan)

/* let counter = 0;
users.forEach((user) => {
    fs.appendFile(`${USERS_FILE_PREFIX}${Math.floor(counter/50)}.json`, `"${user}",\n`, onFileWriteFinished)
    counter++;
}) */


