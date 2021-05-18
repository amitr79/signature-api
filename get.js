import { v4 as uuidv4 } from 'uuid';

export async function main(event, context) {
    // Return the retrieved item
    return uuidv4();
}