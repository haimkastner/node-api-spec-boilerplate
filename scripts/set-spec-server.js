import fs from 'fs';

const SPEC_PATH = process.argv[2];
const API_SERVER_URL = process.argv[3];

console.info(`Setting URL "${API_SERVER_URL}" to spec file "${SPEC_PATH}"`);
const scpecContent = fs.readFileSync(SPEC_PATH);
const scpecJSON = JSON.parse(scpecContent)
scpecJSON.servers = [
    {
        "url": API_SERVER_URL
    }
];
fs.writeFileSync(SPEC_PATH, JSON.stringify(scpecJSON, null, 4));
console.info(`File "${SPEC_PATH}" updated successsfuly`);
