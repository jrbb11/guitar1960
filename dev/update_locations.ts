
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_URL = 'https://raw.githubusercontent.com/flores-jacob/philippine-regions-provinces-cities-municipalities-barangays/master/philippine_provinces_cities_municipalities_and_barangays_2019v2.json';
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/ph-locations.json');

const fetchJson = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
};

async function main() {
    console.log('Fetching PH location data...');
    try {
        const rawData = await fetchJson(DATA_URL);

        // Transform data: remove barangay_list to save space, keep structure
        // Expected structure from source:
        // Key: Region Name -> { province_list: { "Province Name": { municipality_list: { "City": { barangay_list: [...] } } } } }
        // Actually, looking at the repo, it might be an object where keys are region names.
        // Let's inspect format. Use 'any' type for flexibility.

        // The source is likely an Object where keys are regions for 2019v2.
        // Or it might be an array. The search result said "nested JSON list".
        // Let's assume it matches the structure we want or we adapt.
        // My previous manual file was an Array of objects: { region_name: "...", province_list: ... }
        // The source `flores-jacob` v2 is distinct. 
        // Let's check: It's usually { "REGION": { "province_list": ... } }

        // We will transform it to match my AddressSelector's expected format:
        // Array of { region_name, province_list: { ... } }

        const regions: any[] = [];

        // Handle if rawData is object or array
        const entries = Array.isArray(rawData) ? rawData : Object.entries(rawData);

        for (const [key, value] of entries) {
            // If it's an object entry: key=RegionName, value=RegionData
            // If array: item might have region_name

            let regionName = key;
            let regionData = value as any;

            if (regionData.region_name) regionName = regionData.region_name;

            const provinces: any = {};

            if (regionData.province_list) {
                for (const [provName, provData] of Object.entries(regionData.province_list) as any) {
                    const municipalities: any = {};

                    if (provData.municipality_list) {
                        for (const [muniName, muniData] of Object.entries(provData.municipality_list) as any) {
                            // We ignore barangay_list here!
                            municipalities[muniName] = {};
                        }
                    }

                    provinces[provName] = { municipality_list: municipalities };
                }
            }

            regions.push({
                region_name: regionName,
                province_list: provinces
            });
        }

        // Sort regions?
        // regions.sort((a,b) => a.region_name.localeCompare(b.region_name));

        console.log(`Processed ${regions.length} regions.`);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(regions, null, 2));
        console.log(`Saved to ${OUTPUT_PATH}`);

    } catch (err) {
        console.error('Error:', err);
    }
}

main();
